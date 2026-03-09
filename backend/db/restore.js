require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const pgFormat = require('pg-format');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function runRestore() {
  // If a specific filename is passed as an argument, use that. Otherwise use the newest.
  const targetFileArg = process.argv[2];
  let backupFilePath;
  const backupDir = path.join(__dirname, 'backups');

  if (targetFileArg) {
    backupFilePath = path.join(backupDir, targetFileArg);
    if (!fs.existsSync(backupFilePath)) {
      console.error(`❌ File not found at ${backupFilePath}`);
      process.exit(1);
    }
  } else {
    // Find latest file in backups dir
    if (!fs.existsSync(backupDir)) {
      console.error(`❌ Backups directory does not exist yet.`);
      process.exit(1);
    }
    
    const files = fs.readdirSync(backupDir)
      .filter(f => f.endsWith('.json'))
      .sort((a, b) => {
        return fs.statSync(path.join(backupDir, b)).mtime.getTime() - fs.statSync(path.join(backupDir, a)).mtime.getTime();
      });

    if (files.length === 0) {
      console.error(`❌ No backup JSON files found in ${backupDir}`);
      process.exit(1);
    }
    backupFilePath = path.join(backupDir, files[0]);
  }

  console.log(`Loading backup from: ${backupFilePath} ...`);
  
  const rawData = fs.readFileSync(backupFilePath, 'utf8');
  let backupData;
  try {
    backupData = JSON.parse(rawData);
  } catch (e) {
    console.error('❌ Failed to parse JSON file:', e);
    process.exit(1);
  }

  const { projects = [], media = [] } = backupData;
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    console.log('Clearing current projects and media tables...');
    // Drop all data from the tables securely
    await client.query('TRUNCATE projects, project_media RESTART IDENTITY CASCADE');
    
    // 1. Restore Projects
    if (projects.length > 0) {
      console.log(`Restoring ${projects.length} projects...`);
      const projectVals = projects.map(p => [
        p.id, p.slug, p.title, p.summary, p.industry, p.role, p.problem,
        p.constraints, p.approach, p.result, 
        p.tools ? `{${p.tools.map(t => `"${t}"`).join(',')}}` : '{}',
        p.tags ? `{${p.tags.map(t => `"${t}"`).join(',')}}` : '{}',
        p.featured, p.is_3d, p.model_url, p.background_image_url, p.published_at
      ]);

      const projectInsertQuery = pgFormat(`
        INSERT INTO projects (
          id, slug, title, summary, industry, role, problem, 
          constraints, approach, result, tools, tags, 
          featured, is_3d, model_url, background_image_url, published_at
        ) VALUES %L
      `, projectVals);
      
      await client.query(projectInsertQuery);
      
      // Sync PostgreSQL sequence for projects table so new inserts get the correct native "SERIAL/ID"
      await client.query(`SELECT setval('projects_id_seq', (SELECT MAX(id) FROM projects))`);
    }

    // 2. Restore Media
    if (media.length > 0) {
      console.log(`Restoring ${media.length} media items...`);
      const mediaVals = media.map(m => [
         m.id, m.project_id, m.type, m.url, m.thumbnail_url || null, m.caption || null, m.sort_order || 0
      ]);
      
      const mediaInsertQuery = pgFormat(`
        INSERT INTO project_media (
          id, project_id, type, url, thumbnail_url, caption, sort_order
        ) VALUES %L
      `, mediaVals);
      
      await client.query(mediaInsertQuery);
      
      // Sync PostgreSQL sequence for media table
      await client.query(`SELECT setval('project_media_id_seq', (SELECT MAX(id) FROM project_media))`);
    }
    
    await client.query('COMMIT');
    console.log(`\n✅ Database restored successfully!`);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Restore failed. Everything has been rolled back.', error);
  } finally {
    client.release();
    await pool.end();
  }
}

runRestore();
