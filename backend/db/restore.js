require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const pool = mysql.createPool(process.env.DATABASE_URL || 'mysql://user:password@localhost:3306/portfolio');

async function runRestore() {
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
  
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    console.log('Clearing current projects and media tables...');
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
    await connection.execute('TRUNCATE TABLE project_media');
    await connection.execute('TRUNCATE TABLE projects');
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
    
    if (projects.length > 0) {
      console.log(`Restoring ${projects.length} projects...`);
      const projectVals = projects.map(p => {
        let pubAt = p.published_at;
        if (pubAt) {
           pubAt = new Date(pubAt).toISOString().slice(0, 19).replace('T', ' ');
        }
        
        let tools = Array.isArray(p.tools) ? p.tools : [];
        if (typeof p.tools === 'string') {
           if (p.tools.startsWith('{') && p.tools.endsWith('}')) {
              tools = p.tools.slice(1, -1).split(',').map(s => s.replace(/"/g, ''));
           }
        }
        let tags = Array.isArray(p.tags) ? p.tags : [];
        if (typeof p.tags === 'string') {
           if (p.tags.startsWith('{') && p.tags.endsWith('}')) {
              tags = p.tags.slice(1, -1).split(',').map(s => s.replace(/"/g, ''));
           }
        }

        return [
          p.id, p.slug, p.title, p.summary || null, p.industry || null, p.role || null, p.problem || null,
          p.constraints || null, p.approach || null, p.result || null, 
          JSON.stringify(tools),
          JSON.stringify(tags),
          p.featured ? 1 : 0, p.is_3d ? 1 : 0, p.model_url || null, p.background_image_url || null, p.video_url || null, pubAt || null
        ];
      });

      const queryStr = `
        INSERT INTO projects (
          id, slug, title, summary, industry, role, problem, 
          constraints, approach, result, tools, tags, 
          featured, is_3d, model_url, background_image_url, video_url, published_at
        ) VALUES ?
      `;
      await connection.query(queryStr, [projectVals]);
    }

    if (media.length > 0) {
      console.log(`Restoring ${media.length} media items...`);
      const mediaVals = media.map(m => [
         m.id, m.project_id, m.type, m.url, m.thumbnail_url || null, m.caption || null, m.sort_order || 0
      ]);
      
      const mediaInsertQuery = `
        INSERT INTO project_media (
          id, project_id, type, url, thumbnail_url, caption, sort_order
        ) VALUES ?
      `;
      await connection.query(mediaInsertQuery, [mediaVals]);
    }
    
    await connection.commit();
    console.log(`\n✅ Database restored successfully!`);
    
  } catch (error) {
    await connection.rollback();
    console.error('❌ Restore failed.', error);
  } finally {
    connection.release();
    await pool.end();
  }
}

runRestore();
