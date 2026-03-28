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
    params.push(`%${q}%`, `%${q}%`);
    sql += ` AND (p.title LIKE ? OR p.summary LIKE ?)`;
  }

  if (category) {
    params.push(`"${category}"`); 
    // category is a single string matching any tag
    sql += ` AND JSON_CONTAINS(p.tags, ?)`;
  }

  sql += ' ORDER BY p.featured DESC, p.published_at DESC';

  const { rows } = await query(sql, params);
  return rows;
}

async function getProjectBySlug(slug) {
  const projectResult = await query('SELECT * FROM projects WHERE slug = ?', [slug]);
  if (projectResult.rows.length === 0) {
    return null;
  }
  const project = projectResult.rows[0];

  const mediaResult = await query('SELECT * FROM project_media WHERE project_id = ? ORDER BY sort_order ASC', [project.id]);
  project.media = mediaResult.rows;

  return project;
}

async function insertContact({ name, email, message }) {
  const result = await query(
    'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)',
    [name, email, message]
  );
  return { id: result.rows.insertId };
}

async function getContacts() {
  const result = await query('SELECT * FROM contacts ORDER BY created_at DESC');
  return result.rows;
}

// Basic transaction insert for a new Project and a potential singular image
async function insertProject({ slug, title, summary, industry, role, problem, constraints, approach, result: resultStr, tools, tags, featured, imageUrl, is3d, modelUrl, backgroundImageUrl, videoUrl }) {
  const connection = await require('./index').pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const toJsonArray = (arr) => arr ? JSON.stringify(arr) : '[]';

    const insertProjQuery = `
      INSERT INTO projects (slug, title, summary, industry, role, problem, constraints, approach, result, tools, tags, featured, is_3d, model_url, background_image_url, video_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [projResult] = await connection.execute(insertProjQuery, [
      slug, title, summary || null, industry || null, role || null, problem || null, 
      constraints || null, approach || null, resultStr || null, 
      toJsonArray(tools), toJsonArray(tags), featured === true, is3d === true, modelUrl || null, backgroundImageUrl || null, videoUrl || null
    ]);
    
    const projectId = projResult.insertId;

    if (imageUrl) {
      const insertMediaQuery = `
        INSERT INTO project_media (project_id, type, url, caption, sort_order)
        VALUES (?, 'image', ?, ?, 1)
      `;
      await connection.execute(insertMediaQuery, [projectId, imageUrl, title]);
    }

    await connection.commit();
    return { id: projectId, slug };
  } catch (e) {
    await connection.rollback();
    throw e;
  } finally {
    connection.release();
  }
}

async function updateProject(oldSlug, { slug, title, summary, industry, role, problem, constraints, approach, result: resultStr, tools, tags, featured, imageUrl, is3d, modelUrl, backgroundImageUrl, videoUrl }) {
  const connection = await require('./index').pool.getConnection();
  try {
    await connection.beginTransaction();
    
    // Check if exists first to return project ID
    const [existingProj] = await connection.execute(`SELECT id FROM projects WHERE slug=?`, [oldSlug]);
    if (existingProj.length === 0) {
       throw new Error("Project not found");
    }
    const projectId = existingProj[0].id;

    const toJsonArray = (arr) => arr ? JSON.stringify(arr) : '[]';

    const updateProjQuery = `
      UPDATE projects 
      SET slug=?, title=?, summary=?, industry=?, role=?, problem=?, constraints=?, approach=?, result=?, tools=?, tags=?, featured=?, is_3d=?, model_url=?, background_image_url=?, video_url=?
      WHERE slug=?
    `;
    await connection.execute(updateProjQuery, [
      slug, title, summary || null, industry || null, role || null, problem || null, 
      constraints || null, approach || null, resultStr || null, 
      toJsonArray(tools), toJsonArray(tags), featured === true, is3d === true, modelUrl || null, backgroundImageUrl || null, videoUrl || null, oldSlug
    ]);

    if (imageUrl) {
      // Upsert pattern for the primary image
      const [existingMedia] = await connection.execute(`SELECT id FROM project_media WHERE project_id=? AND type='image' AND sort_order=1`, [projectId]);
      if (existingMedia.length > 0) {
        await connection.execute(`UPDATE project_media SET url=?, caption=? WHERE id=?`, [imageUrl, title, existingMedia[0].id]);
      } else {
        await connection.execute(
          `INSERT INTO project_media (project_id, type, url, caption, sort_order) VALUES (?, 'image', ?, ?, 1)`,
          [projectId, imageUrl, title]
        );
      }
    }

    await connection.commit();
    return { id: projectId, slug };
  } catch (e) {
    await connection.rollback();
    throw e;
  } finally {
    connection.release();
  }
}

async function deleteProject(slug) {
  const connection = await require('./index').pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const [projResult] = await connection.execute(`SELECT id FROM projects WHERE slug=?`, [slug]);
    if (projResult.length === 0) {
       throw new Error("Project not found");
    }
    const projectId = projResult[0].id;

    // Manual cascade
    await connection.execute(`DELETE FROM project_media WHERE project_id=?`, [projectId]);
    await connection.execute(`DELETE FROM projects WHERE id=?`, [projectId]);

    await connection.commit();
    return true;
  } catch (e) {
    await connection.rollback();
    throw e;
  } finally {
    connection.release();
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
