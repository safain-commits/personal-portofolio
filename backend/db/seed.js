const { pool } = require('./index');
const fs = require('fs');
const path = require('path');
const pgFormat = require('pg-format');

// Very basic MVP mock dataset
const mockProjects = [
  {
    slug: 'moro-vase',
    title: 'Moro',
    summary: 'Indoor traditional sicilian vase reimagined.',
    industry: 'Ceramics',
    role: 'Industrial Designer',
    problem: 'Traditional Sicilian Moro vases are heavy and fragile. The goal was to modernise the form while retaining cultural identity.',
    constraints: 'Must retain recognizable facial features of the traditional Moro.',
    approach: 'Using Rhinoceros, I drafted a low-poly geometric version that can be easily 3D printed or slip-cast in modern materials.',
    result: 'A striking, lightweight vase that fits seamlessly into contemporary minimalist interiors.',
    tools: ['Rhinoceros', 'Keyshot'],
    tags: ['3D Modeling', 'Industrial Design', 'Ceramics'],
    featured: true,
    background_image_url: 'https://images.unsplash.com/photo-1620601550979-373daaaadfcc?q=80&w=1200'
  },
  {
    slug: 'c-09-smart-lamp',
    title: 'C-09 Smart Lamp',
    summary: 'Smart lamp designed for content creators.',
    industry: 'Consumer Electronics',
    role: 'Product Designer',
    problem: 'Content creators need versatile lighting that doesn\'t take up excessive desk space.',
    constraints: 'Budget constraints on custom LED matrices.',
    approach: 'Designed a modular, clamp-based lighting system with adjustable color temperature sliders.',
    result: 'A compact, highly adjustable lighting solution that improves workspace ergonomics.',
    tools: ['Solidworks', 'Blender'],
    tags: ['Product Design', 'Lighting', 'Electronics'],
    featured: true,
  },
  {
    slug: 'easy-dine-pasta',
    title: 'Easy Dine',
    summary: 'Multicultural pasta maker.',
    industry: 'Kitchen Appliances',
    role: 'Appliance Designer',
    problem: 'Making fresh pasta at home is often messy and time-consuming for beginners.',
    constraints: 'Food-safe material requirements and low-cost extrusion die replacements.',
    approach: 'Engineered an all-in-one mixing and extrusion system with intuitive controls.',
    result: 'Reduced preparation and cleanup time by 40%.',
    tools: ['Fusion360', 'Illustrator'],
    tags: ['Appliance Design', 'Kitchen'],
    featured: false,
  },
  {
    slug: 'flexicore-rack',
    title: 'Flexicore',
    summary: 'Intense washing zone third rack for dishwashers.',
    industry: 'Home Appliances',
    role: 'Mechanical Engineer',
    problem: 'Standard dishwashers struggle with heavily soiled cutlery and small utensils.',
    constraints: 'Must fit within standard 24-inch tub dimensions without impacting the middle rack.',
    approach: 'Developed a dynamic third rack with targeted high-pressure spray jets.',
    result: 'Improved cleaning efficiency for small items by 60%.',
    tools: ['Solidworks', 'Ansys'],
    tags: ['Engineering', 'Mechanical', 'Appliance'],
    featured: false,
  }
];

const mockMedia = [
  // Media for Moro
  {
    project_slug: 'moro-vase',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=1200',
    caption: 'Vase front view',
    sort_order: 1
  },
  {
    project_slug: 'moro-vase',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1578301978018-3005759f48f7?q=80&w=800',
    caption: 'Vase side view',
    sort_order: 2
  },
  {
    project_slug: 'moro-vase',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1615800098779-1d227e7d66ce?q=80&w=800',
    caption: 'Vase details',
    sort_order: 3
  },
  // Media for C-09
  {
    project_slug: 'c-09-smart-lamp',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?q=80&w=800&auto=format&fit=crop',
    caption: 'Lamp in action',
    sort_order: 1
  },
  // Media for Easy Dine
  {
    project_slug: 'easy-dine-pasta',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?q=80&w=800&auto=format&fit=crop',
    caption: 'Pasta extrusion demo',
    sort_order: 1
  },
  // Media for Flexicore
  {
    project_slug: 'flexicore-rack',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop',
    caption: 'CAD validation of spray arm',
    sort_order: 1
  }
];

async function seed() {
  const client = await pool.connect();
  try {
    console.log('Starting deployment & seeding process...');
    await client.query('BEGIN');

    // 1. Run migrations
    const initSqlPath = path.join(__dirname, 'init.sql');
    const initSql = fs.readFileSync(initSqlPath, 'utf8');
    console.log('Running init.sql (dropping and recreating tables)...');
    await client.query(initSql);

    // 2. Insert Projects
    console.log('Inserting projects...');
    const projectVals = mockProjects.map(p => [
      p.slug, p.title, p.summary, p.industry, p.role, p.problem,
      p.constraints, p.approach, p.result, 
      `{${p.tools.map(t => `"${t}"`).join(',')}}`, // Format as postgres text array literal
      `{${p.tags.map(t => `"${t}"`).join(',')}}`,
      p.featured, p.background_image_url || null
    ]);

    const projectInsertQuery = pgFormat(`
      INSERT INTO projects (
        slug, title, summary, industry, role, problem, 
        constraints, approach, result, tools, tags, featured, background_image_url
      ) VALUES %L RETURNING id, slug
    `, projectVals);

    const { rows: insertedProjects } = await client.query(projectInsertQuery);
    
    // Create map of slug -> internal DB id
    const slugToIdMap = insertedProjects.reduce((acc, current) => {
      acc[current.slug] = current.id;
      return acc;
    }, {});

    // 3. Insert Media using mapped IDs
    console.log('Inserting media...');
    const mediaVals = mockMedia.map(m => [
      slugToIdMap[m.project_slug], m.type, m.url, null, m.caption, m.sort_order
    ]);

    const mediaInsertQuery = pgFormat(`
      INSERT INTO project_media (
        project_id, type, url, thumbnail_url, caption, sort_order
      ) VALUES %L
    `, mediaVals);

    await client.query(mediaInsertQuery);

    await client.query('COMMIT');
    console.log('Seeding completed successfully!');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Seeding failed:', e);
  } finally {
    client.release();
    pool.end();
  }
}

seed();
