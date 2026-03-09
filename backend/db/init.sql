-- Drop tables if they exist (for easy resetting during MVP dev)
DROP TABLE IF EXISTS project_media;
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS projects;

-- Create projects table
CREATE TABLE projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  summary TEXT,
  industry VARCHAR(255),
  role VARCHAR(255),
  problem TEXT,
  constraints TEXT,
  approach TEXT,
  result TEXT,
  tools JSON,
  tags JSON,
  featured BOOLEAN DEFAULT false,
  is_3d BOOLEAN DEFAULT false,
  model_url TEXT,
  background_image_url TEXT,
  video_url TEXT,
  published_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create project_media table
CREATE TABLE project_media (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  type VARCHAR(50) NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT,
  sort_order INT DEFAULT 0,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CHECK (type IN ('image', 'video', 'pdf', 'model'))
);

-- Index for faster queries
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_project_media_project_id ON project_media(project_id);

-- Create contacts table for form submissions
CREATE TABLE contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
