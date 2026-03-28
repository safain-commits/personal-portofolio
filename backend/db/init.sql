-- Drop tables if they exist (for easy resetting during MVP dev)
DROP TABLE IF EXISTS project_media;
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS projects;

-- Create projects table
CREATE TABLE projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
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
  viewer_preset VARCHAR(100) DEFAULT 'theme-adaptive',
  viewer_rotation_preset VARCHAR(100) DEFAULT 'none',
  viewer_auto_rotate BOOLEAN DEFAULT true,
  viewer_camera_distance DECIMAL(8,2) NULL,
  viewer_camera_height DECIMAL(8,2) NULL,
  viewer_offset_x DECIMAL(8,2) DEFAULT 0,
  viewer_offset_y DECIMAL(8,2) DEFAULT 0,
  background_image_url TEXT,
  video_url TEXT,
  published_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create project_media table
CREATE TABLE project_media (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  type VARCHAR(50) NOT NULL,
  media_role VARCHAR(50),
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
