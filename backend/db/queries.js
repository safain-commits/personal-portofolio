const { query } = require('./index');

async function getProjects({ q, category }) {
  let sql = `
    SELECT 
      p.*, 
      m.url as "imageUrl" 
    FROM projects p
    LEFT JOIN project_media m ON p.id = m.project_id AND m.type = 'image' AND m.sort_order = 1
    WHERE 1=1
  `;
  const params = [];

  if (q) {
    params.push(`%${q}%`);
    sql += ` AND (p.title ILIKE $${params.length} OR p.summary ILIKE $${params.length})`;
  }

  if (category) {
    params.push(category);
    // category is a single string matching any tag
    sql += ` AND $${params.length} = ANY(p.tags)`;
  }

  sql += ' ORDER BY p.featured DESC, p.published_at DESC';

  const { rows } = await query(sql, params);
  return rows;
}

async function getProjectBySlug(slug) {
  const projectResult = await query('SELECT * FROM projects WHERE slug = $1', [slug]);
  if (projectResult.rows.length === 0) {
    return null;
  }
  const project = projectResult.rows[0];

  const mediaResult = await query('SELECT * FROM project_media WHERE project_id = $1 ORDER BY sort_order ASC', [project.id]);
  project.media = mediaResult.rows;

  return project;
}

async function insertContact({ name, email, message }) {
  const result = await query(
    'INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3) RETURNING id',
    [name, email, message]
  );
  return result.rows[0];
}

async function getContacts() {
  const result = await query('SELECT * FROM contacts ORDER BY created_at DESC');
  return result.rows;
}

// Basic transaction insert for a new Project and a potential singular image
async function insertProject({ slug, title, summary, industry, role, problem, constraints, approach, result, tools, tags, featured, imageUrl, is3d, modelUrl, backgroundImageUrl, videoUrl }) {
  const client = await require('./index').pool.connect();
  try {
    await client.query('BEGIN');
    
    const toPgArray = (arr) => arr ? `{${arr.map(a => `"${a}"`).join(',')}}` : '{}';

    const insertProjQuery = `
      INSERT INTO projects (slug, title, summary, industry, role, problem, constraints, approach, result, tools, tags, featured, is_3d, model_url, background_image_url, video_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING id, slug
    `;
    const projResult = await client.query(insertProjQuery, [
      slug, title, summary || null, industry || null, role || null, problem || null, 
      constraints || null, approach || null, result || null, 
      toPgArray(tools), toPgArray(tags), featured === true, is3d === true, modelUrl || null, backgroundImageUrl || null, videoUrl || null
    ]);
    
    const projectId = projResult.rows[0].id;

    if (imageUrl) {
      const insertMediaQuery = `
        INSERT INTO project_media (project_id, type, url, caption, sort_order)
        VALUES ($1, 'image', $2, $3, 1)
      `;
      await client.query(insertMediaQuery, [projectId, imageUrl, title]);
    }

    await client.query('COMMIT');
    return projResult.rows[0];
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

async function updateProject(oldSlug, { slug, title, summary, industry, role, problem, constraints, approach, result, tools, tags, featured, imageUrl, is3d, modelUrl, backgroundImageUrl, videoUrl }) {
  const client = await require('./index').pool.connect();
  try {
    await client.query('BEGIN');
    
    const toPgArray = (arr) => arr ? `{${arr.map(a => `"${a}"`).join(',')}}` : '{}';

    const updateProjQuery = `
      UPDATE projects 
      SET slug=$1, title=$2, summary=$3, industry=$4, role=$5, problem=$6, constraints=$7, approach=$8, result=$9, tools=$10, tags=$11, featured=$12, is_3d=$13, model_url=$14, background_image_url=$15, video_url=$16
      WHERE slug=$17
      RETURNING id, slug
    `;
    const projResult = await client.query(updateProjQuery, [
      slug, title, summary || null, industry || null, role || null, problem || null, 
      constraints || null, approach || null, result || null, 
      toPgArray(tools), toPgArray(tags), featured === true, is3d === true, modelUrl || null, backgroundImageUrl || null, videoUrl || null, oldSlug
    ]);
    
    if (projResult.rows.length === 0) {
       throw new Error("Project not found");
    }

    const projectId = projResult.rows[0].id;

    if (imageUrl) {
      // Upsert pattern for the primary image
      const existingMedia = await client.query(`SELECT id FROM project_media WHERE project_id=$1 AND type='image' AND sort_order=1`, [projectId]);
      if (existingMedia.rows.length > 0) {
        await client.query(`UPDATE project_media SET url=$1, caption=$2 WHERE id=$3`, [imageUrl, title, existingMedia.rows[0].id]);
      } else {
        await client.query(
          `INSERT INTO project_media (project_id, type, url, caption, sort_order) VALUES ($1, 'image', $2, $3, 1)`,
          [projectId, imageUrl, title]
        );
      }
    }

    await client.query('COMMIT');
    return projResult.rows[0];
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

async function deleteProject(slug) {
  const client = await require('./index').pool.connect();
  try {
    await client.query('BEGIN');
    
    const projResult = await client.query(`SELECT id FROM projects WHERE slug=$1`, [slug]);
    if (projResult.rows.length === 0) {
       throw new Error("Project not found");
    }
    const projectId = projResult.rows[0].id;

    // Manual cascade (in case ON DELETE CASCADE isn't on the foreign key)
    await client.query(`DELETE FROM project_media WHERE project_id=$1`, [projectId]);
    await client.query(`DELETE FROM projects WHERE id=$1`, [projectId]);

    await client.query('COMMIT');
    return true;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

module.exports = {
  getProjects,
  getProjectBySlug,
  insertContact,
  getContacts,
  insertProject,
  updateProject,
  deleteProject,
};
