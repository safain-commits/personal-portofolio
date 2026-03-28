const { query, pool } = require('./index');

const normalizeJsonArray = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];

  try {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const normalizeMediaEntries = (items = []) => {
  const seen = new Set();
  const normalized = [];

  for (const item of items) {
    const entry = typeof item === 'string'
      ? { url: item, caption: '' }
      : { url: item?.url || '', caption: item?.caption || '' };

    if (!entry.url || seen.has(entry.url)) continue;
    seen.add(entry.url);
    normalized.push(entry);
  }

  return normalized;
};

const normalizeMediaRole = (media) => {
  if (media.media_role) return media.media_role;
  if (media.type === 'image') return media.sort_order === 1 ? 'hero' : 'gallery';
  return null;
};

const shapeProject = (project, mediaRows = []) => {
  const normalizedMedia = mediaRows.map((media) => ({
    ...media,
    media_role: normalizeMediaRole(media)
  }));

  const imageMedia = normalizedMedia.filter((media) => media.type === 'image');
  const heroMedia = imageMedia.find((media) => media.media_role === 'hero') || imageMedia[0] || null;
  const drawingImages = imageMedia.filter((media) => media.media_role === 'drawing');
  const galleryImages = imageMedia.filter((media) => media.id !== heroMedia?.id && media.media_role !== 'drawing');

  return {
    ...project,
    subtitle: project.subtitle || null,
    tools: normalizeJsonArray(project.tools),
    tags: normalizeJsonArray(project.tags),
    hero_image_url: heroMedia?.url || project.hero_image_url || null,
    gallery_images: galleryImages,
    drawing_images: drawingImages,
    media: normalizedMedia,
  };
};

async function getProjects({ q, category }) {
  let sql = `
    SELECT 
      p.*,
      (
        SELECT pm.url
        FROM project_media pm
        WHERE pm.project_id = p.id
          AND pm.type = 'image'
        ORDER BY
          CASE
            WHEN COALESCE(pm.media_role, '') = 'hero' THEN 0
            WHEN pm.sort_order = 1 THEN 1
            WHEN COALESCE(pm.media_role, '') = 'gallery' THEN 2
            WHEN COALESCE(pm.media_role, '') = 'drawing' THEN 3
            ELSE 4
          END,
          pm.sort_order ASC,
          pm.id ASC
        LIMIT 1
      ) AS hero_image_url
    FROM projects p
    WHERE 1=1
  `;
  const params = [];

  if (q) {
    params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    sql += ` AND (p.title LIKE ? OR p.subtitle LIKE ? OR p.summary LIKE ?)`;
  }

  if (category) {
    params.push(`"${category}"`);
    sql += ` AND JSON_CONTAINS(p.tags, ?)`;
  }

  sql += ' ORDER BY p.featured DESC, p.published_at DESC';

  const { rows } = await query(sql, params);
  return rows.map((project) => shapeProject(project));
}

async function getProjectBySlug(slug) {
  const projectResult = await query('SELECT * FROM projects WHERE slug = ?', [slug]);
  if (projectResult.rows.length === 0) {
    return null;
  }

  const project = projectResult.rows[0];
  const mediaResult = await query('SELECT * FROM project_media WHERE project_id = ? ORDER BY sort_order ASC, id ASC', [project.id]);
  return shapeProject(project, mediaResult.rows);
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

async function replaceProjectImageMedia(connection, { projectId, title, heroImageUrl, galleryImages, drawingImages }) {
  await connection.execute(`DELETE FROM project_media WHERE project_id = ? AND type = 'image'`, [projectId]);

  const hero = heroImageUrl || null;
  const gallery = normalizeMediaEntries(galleryImages || []).filter((item) => item.url !== hero);
  const drawings = normalizeMediaEntries(drawingImages || []).filter((item) => item.url !== hero && !gallery.some((galleryItem) => galleryItem.url === item.url));

  const insertMediaQuery = `
    INSERT INTO project_media (project_id, type, media_role, url, caption, sort_order)
    VALUES (?, 'image', ?, ?, ?, ?)
  `;

  if (hero) {
    await connection.execute(insertMediaQuery, [projectId, 'hero', hero, title, 1]);
  }

  for (const [index, item] of gallery.entries()) {
    await connection.execute(insertMediaQuery, [projectId, 'gallery', item.url, item.caption || `${title} gallery ${index + 1}`, 100 + index]);
  }

  for (const [index, item] of drawings.entries()) {
    await connection.execute(insertMediaQuery, [projectId, 'drawing', item.url, item.caption || `${title} drawing ${index + 1}`, 200 + index]);
  }
}

async function insertProject({ slug, title, subtitle, summary, industry, role, problem, constraints, approach, result: resultStr, tools, tags, featured, heroImageUrl, galleryImages, drawingImages, imageUrl, is3d, modelUrl, viewerPreset, viewerRotationPreset, viewerAutoRotate, viewerCameraDistance, viewerCameraHeight, viewerOffsetX, viewerOffsetY, backgroundImageUrl, videoUrl }) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const toJsonArray = (arr) => JSON.stringify(Array.isArray(arr) ? arr : []);

    const insertProjQuery = `
      INSERT INTO projects (slug, title, subtitle, summary, industry, role, problem, constraints, approach, result, tools, tags, featured, is_3d, model_url, viewer_preset, viewer_rotation_preset, viewer_auto_rotate, viewer_camera_distance, viewer_camera_height, viewer_offset_x, viewer_offset_y, background_image_url, video_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [projResult] = await connection.execute(insertProjQuery, [
      slug,
      title,
      subtitle || null,
      summary || null,
      industry || null,
      role || null,
      problem || null,
      constraints || null,
      approach || null,
      resultStr || null,
      toJsonArray(tools),
      toJsonArray(tags),
      featured === true,
      is3d === true,
      modelUrl || null,
      viewerPreset || 'theme-adaptive',
      viewerRotationPreset || 'none',
      viewerAutoRotate !== false,
      viewerCameraDistance ?? null,
      viewerCameraHeight ?? null,
      viewerOffsetX ?? 0,
      viewerOffsetY ?? 0,
      backgroundImageUrl || null,
      videoUrl || null,
    ]);

    const projectId = projResult.insertId;

    await replaceProjectImageMedia(connection, {
      projectId,
      title,
      heroImageUrl: heroImageUrl || imageUrl || null,
      galleryImages,
      drawingImages,
    });

    await connection.commit();
    return { id: projectId, slug };
  } catch (e) {
    await connection.rollback();
    throw e;
  } finally {
    connection.release();
  }
}

async function updateProject(oldSlug, { slug, title, subtitle, summary, industry, role, problem, constraints, approach, result: resultStr, tools, tags, featured, heroImageUrl, galleryImages, drawingImages, imageUrl, is3d, modelUrl, viewerPreset, viewerRotationPreset, viewerAutoRotate, viewerCameraDistance, viewerCameraHeight, viewerOffsetX, viewerOffsetY, backgroundImageUrl, videoUrl }) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [existingProj] = await connection.execute(`SELECT id FROM projects WHERE slug = ?`, [oldSlug]);
    if (existingProj.length === 0) {
      throw new Error('Project not found');
    }

    const projectId = existingProj[0].id;
    const toJsonArray = (arr) => JSON.stringify(Array.isArray(arr) ? arr : []);

    const updateProjQuery = `
      UPDATE projects
      SET slug = ?, title = ?, subtitle = ?, summary = ?, industry = ?, role = ?, problem = ?, constraints = ?, approach = ?, result = ?, tools = ?, tags = ?, featured = ?, is_3d = ?, model_url = ?, viewer_preset = ?, viewer_rotation_preset = ?, viewer_auto_rotate = ?, viewer_camera_distance = ?, viewer_camera_height = ?, viewer_offset_x = ?, viewer_offset_y = ?, background_image_url = ?, video_url = ?
      WHERE slug = ?
    `;

    await connection.execute(updateProjQuery, [
      slug,
      title,
      subtitle || null,
      summary || null,
      industry || null,
      role || null,
      problem || null,
      constraints || null,
      approach || null,
      resultStr || null,
      toJsonArray(tools),
      toJsonArray(tags),
      featured === true,
      is3d === true,
      modelUrl || null,
      viewerPreset || 'theme-adaptive',
      viewerRotationPreset || 'none',
      viewerAutoRotate !== false,
      viewerCameraDistance ?? null,
      viewerCameraHeight ?? null,
      viewerOffsetX ?? 0,
      viewerOffsetY ?? 0,
      backgroundImageUrl || null,
      videoUrl || null,
      oldSlug,
    ]);

    await replaceProjectImageMedia(connection, {
      projectId,
      title,
      heroImageUrl: heroImageUrl || imageUrl || null,
      galleryImages,
      drawingImages,
    });

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
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [projResult] = await connection.execute(`SELECT id FROM projects WHERE slug = ?`, [slug]);
    if (projResult.length === 0) {
      throw new Error('Project not found');
    }
    const projectId = projResult[0].id;

    await connection.execute(`DELETE FROM project_media WHERE project_id = ?`, [projectId]);
    await connection.execute(`DELETE FROM projects WHERE id = ?`, [projectId]);

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
