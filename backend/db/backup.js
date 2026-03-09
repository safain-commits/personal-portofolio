require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function runBackup() {
  const client = await pool.connect();
  try {
    console.log('Starting database backup...');
    
    // 1. Fetch all projects
    const projRes = await client.query('SELECT * FROM projects ORDER BY id ASC');
    const projects = projRes.rows;
    
    // 2. Fetch all media
    const mediaRes = await client.query('SELECT * FROM project_media ORDER BY id ASC');
    const media = mediaRes.rows;
    
    // 3. Combine them into a single JSON structure
    const backupData = {
      timestamp: new Date().toISOString(),
      projects: projects,
      media: media
    };
    
    // 4. Ensure backups directory exists
    const backupDir = path.join(__dirname, 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    // 5. Write to file
    const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `backup-${dateStr}.json`;
    const filePath = path.join(backupDir, fileName);
    
    fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2));
    
    console.log(`\n✅ Backup completed successfully!`);
    console.log(`📁 File saved to: ${filePath}`);
    console.log(`📊 Total Projects: ${projects.length}`);
    console.log(`🖼️  Total Media Items: ${media.length}`);
    
  } catch (error) {
    console.error('❌ Backup failed:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

runBackup();
