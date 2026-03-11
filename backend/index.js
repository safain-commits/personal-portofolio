require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const path = require('path');
const queries = require('./db/queries');

const app = express();
const PORT = process.env.PORT || 5000;

// Multer storage config for images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'frontend', 'public', 'img'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = file.originalname.replace(ext, '').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    cb(null, `${name}-${Date.now()}${ext}`);
  }
});
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|svg/;
    const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = allowed.test(file.mimetype.split('/')[1]);
    cb(null, extOk && mimeOk);
  }
});

// Multer storage config for 3D model files
const storage3d = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'frontend', 'public', '3d'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = file.originalname.replace(ext, '').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    cb(null, `${name}-${Date.now()}${ext}`);
  }
});
const upload3d = multer({ 
  storage: storage3d,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB for 3D models
  fileFilter: (req, file, cb) => {
    const allowed = /glb|gltf/;
    const extOk = allowed.test(path.extname(file.originalname).toLowerCase().replace('.', ''));
    cb(null, extOk);
  }
});

// Multer storage config for video files
const storageVideo = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'frontend', 'public', 'video'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = file.originalname.replace(ext, '').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    cb(null, `${name}-${Date.now()}${ext}`);
  }
});
const uploadVideo = multer({ 
  storage: storageVideo,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB for videos
  fileFilter: (req, file, cb) => {
    const allowed = /mp4|webm|mov/;
    const extOk = allowed.test(path.extname(file.originalname).toLowerCase().replace('.', ''));
    cb(null, extOk);
  }
});

// Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors());
app.use(express.json());



const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5, // Limit each IP to 5 contact requests per windowMs
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (req, res, next, options) => {
		res.status(429).json({ ok: false, error: { code: "TOO_MANY_REQUESTS", message: options.message } });
	},
  message: "Too many messages from this IP, please try again later"
});

// Main MVP Routes
app.get('/health', (req, res) => {
  res.status(200).json({ ok: true });
});

app.get('/projects', async (req, res, next) => {
  try {
    const { q, category } = req.query;
    const projects = await queries.getProjects({ q, category });
    
    // Return list ringkas untuk cards
    const listProjects = projects.map(p => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      summary: p.summary,
      tags: p.tags,
      featured: p.featured,
      published_at: p.published_at,
      imageUrl: p.imageUrl || null,
      is_3d: p.is_3d,
      model_url: p.model_url,
      background_image_url: p.background_image_url,
      video_url: p.video_url
    }));

    res.json({ ok: true, data: listProjects });
  } catch (error) {
    next(error);
  }
});

app.get('/projects/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const project = await queries.getProjectBySlug(slug);
    
    if (!project) {
      return res.status(404).json({ ok: false, error: { code: "NOT_FOUND", message: "Project not found" } });
    }
    
    res.json({ ok: true, data: project });
  } catch (error) {
    next(error);
  }
});

app.post('/contact', contactLimiter, async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
       return res.status(400).json({ ok: false, error: { code: "BAD_REQUEST", message: "Name, email, and message are required" } });
    }
    
    // basic email validation format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
       return res.status(400).json({ ok: false, error: { code: "BAD_REQUEST", message: "Invalid email format" } });
    }
    
    const contact = await queries.insertContact({ name, email, message });
    console.log(`[Contact Log] Received message from ${name} <${email}>. DB ID: ${contact.id}`);
    res.json({ ok: true, data: { success: true } });
  } catch (error) {
    next(error);
  }
});

// Admin Basic Auth Middleware
const adminAuth = (req, res, next) => {
  const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
  const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

  if (login && password && login === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
    return next();
  }

  // Menghapus 'WWW-Authenticate' header agar browser tidak memunculkan popup native.
  res.status(401).json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' }});
};

// Admin Routes

// Image upload
app.post('/admin/upload', adminAuth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ ok: false, error: { code: "BAD_REQUEST", message: "No valid image file provided" }});
  }
  const imageUrl = `/img/${req.file.filename}`;
  res.json({ ok: true, data: { url: imageUrl, filename: req.file.filename }});
});

// 3D model upload
app.post('/admin/upload-3d', adminAuth, upload3d.single('model'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ ok: false, error: { code: "BAD_REQUEST", message: "No valid 3D model file provided (.glb or .gltf)" }});
  }
  const modelUrl = `/3d/${req.file.filename}`;
  res.json({ ok: true, data: { url: modelUrl, filename: req.file.filename }});
});

// Video upload
app.post('/admin/upload-video', adminAuth, uploadVideo.single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ ok: false, error: { code: "BAD_REQUEST", message: "No valid video file provided (.mp4, .webm, .mov)" }});
  }
  const videoUrl = `/video/${req.file.filename}`;
  res.json({ ok: true, data: { url: videoUrl, filename: req.file.filename }});
});

app.get('/admin/contacts', adminAuth, async (req, res, next) => {
  try {
    const contacts = await queries.getContacts();
    res.json({ ok: true, data: contacts });
  } catch (error) {
    next(error);
  }
});

app.post('/admin/projects', adminAuth, async (req, res, next) => {
  try {
    const { slug, title, summary, industry, role, problem, constraints, approach, result, tools, tags, featured, imageUrl, is3d, modelUrl, backgroundImageUrl, videoUrl } = req.body;
    
    if (!slug || !title) {
       return res.status(400).json({ ok: false, error: { code: "BAD_REQUEST", message: "Slug and title are required" } });
    }
    
    const project = await queries.insertProject({ slug, title, summary, industry, role, problem, constraints, approach, result, tools, tags, featured, imageUrl, is3d, modelUrl, backgroundImageUrl, videoUrl });
    res.json({ ok: true, data: project });
  } catch (error) {
    // Basic catch for unique constraint failures on slug
    if (error.code === '23505') {
      return res.status(400).json({ ok: false, error: { code: "BAD_REQUEST", message: "A project with this slug already exists" } });
    }
    next(error);
  }
});

app.put('/admin/projects/:slug', adminAuth, async (req, res, next) => {
  try {
    const oldSlug = req.params.slug;
    const { slug, title, summary, industry, role, problem, constraints, approach, result, tools, tags, featured, imageUrl, is3d, modelUrl, backgroundImageUrl, videoUrl } = req.body;
    
    if (!slug || !title) {
       return res.status(400).json({ ok: false, error: { code: "BAD_REQUEST", message: "Slug and title are required" } });
    }
    
    const project = await queries.updateProject(oldSlug, { slug, title, summary, industry, role, problem, constraints, approach, result, tools, tags, featured, imageUrl, is3d, modelUrl, backgroundImageUrl, videoUrl });
    res.json({ ok: true, data: project });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ ok: false, error: { code: "BAD_REQUEST", message: "A project with this slug already exists" } });
    }
    if (error.message === "Project not found") {
      return res.status(404).json({ ok: false, error: { code: "NOT_FOUND", message: "Project not found" } });
    }
    next(error);
  }
});

app.delete('/admin/projects/:slug', adminAuth, async (req, res, next) => {
  try {
    const { slug } = req.params;
    await queries.deleteProject(slug);
    res.json({ ok: true, data: { success: true } });
  } catch (error) {
    if (error.message === "Project not found") {
      return res.status(404).json({ ok: false, error: { code: "NOT_FOUND", message: "Project not found" } });
    }
    next(error);
  }
});

// Error handling terstandar
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    ok: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: err.message,
      stack: err.stack
    }
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
