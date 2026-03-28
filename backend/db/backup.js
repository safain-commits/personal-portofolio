require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const pool = mysql.createPool(process.env.DATABASE_URL || 'mysql://user:password@localhost:3306/portfolio');

async function runBackup() {
  const connection = await pool.getConnection();
  try {
    console.log('Starting database backup...');
    
    const [projects] = await connection.execute('SELECT * FROM projects ORDER BY id ASC');
    const [media] = await connection.execute('SELECT * FROM project_media ORDER BY id ASC');
    
    // Parse JSON string back to object for clean backup
    projects.forEach(p => {
      if (typeof p.tools === 'string') {
        try { p.tools = JSON.parse(p.tools); } catch(e){}
      }
      if (typeof p.tags === 'string') {
        try { p.tags = JSON.parse(p.tags); } catch(e){}
      }
    });

    const backupData = {
      timestamp: new Date().toISOString(),
      projects: projects,
      media: media
    };
    
    const backupDir = path.join(__dirname, 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
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
    connection.release();
    await pool.end();
  }
}

runBackup();
