export interface Project {
  id: string
  slug: string
  title: string
  category: string
  tags: string[]
  summary: string
  industry?: string
  role?: string
  imageUrl?: string
  problem?: string
  approach?: string
  result?: string
  tools: string[]
  constraints?: string
  featured?: boolean
  is3d?: boolean
  modelUrl?: string
  backgroundImageUrl?: string
  videoUrl?: string
  media?: { id: string; type: 'image' | 'video'; url: string; alt?: string }[]
}

// Pada mode development (npm run dev), kita arahkan ke port 5000 langsung.
// Pada mode production (di VPS), Nginx akan mengurus proxy dari rute `/api` ke port 5000, 
// agar tidak terkena Mixed Content block jika nanti memakai HTTPS.
const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? `http://${window.location.hostname}:5000`
  : `${window.location.origin}/api`;

export async function getProjects(query?: string, category?: string): Promise<Project[]> {
  const url = new URL(`${API_BASE_URL}/projects`);
  
  if (query) url.searchParams.append('q', query);
  if (category && category !== 'All') url.searchParams.append('category', category);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error('Failed to fetch projects');
  }
  
  const json = await response.json();
  if (json.ok && json.data) {
    // Backend MVP /projects returns list ringkas. If we need images, 
    // it depends if backend /projects includes imagery. PRD says 'list ringkas'.
    // We can infer imageUrl if provided or leave undefined.
    return json.data.map((p: any) => ({
      ...p,
      category: p.tags && p.tags.length > 0 ? p.tags[0] : 'Project',
      imageUrl: p.imageUrl || null,
      is3d: p.is_3d || false,
      modelUrl: p.model_url || null,
      backgroundImageUrl: p.background_image_url || null,
      videoUrl: p.video_url || null
    }));
  }
  return [];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const response = await fetch(`${API_BASE_URL}/projects/${slug}`);
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error('Failed to fetch project details');
  }

  const json = await response.json();
  if (json.ok && json.data) {
    const p = json.data;
    
    // Process media array if present
    let processedMedia = undefined;
    if (p.media && Array.isArray(p.media)) {
      processedMedia = p.media.map((m: any) => ({
        id: m.id.toString(),
        type: m.type,
        url: m.url,
        alt: m.caption || m.thumbnail_url || p.title
      }));
    }

    return {
      id: p.id.toString(),
      slug: p.slug,
      title: p.title,
      category: p.tags && p.tags.length > 0 ? p.tags[1] || p.tags[0] : 'Project',
      tags: p.tags || [],
      summary: p.summary,
      industry: p.industry || '',
      role: p.role || '',
      problem: p.problem,
      approach: p.approach,
      result: p.result,
      tools: p.tools || [],
      constraints: p.constraints,
      featured: p.featured || false,
      is3d: p.is_3d || false,
      modelUrl: p.model_url || null,
      backgroundImageUrl: p.background_image_url || null,
      videoUrl: p.video_url || null,
      // First image for hero background
      imageUrl: processedMedia && processedMedia.length > 0 ? processedMedia[0].url : undefined,
      media: processedMedia
    };
  }
  return null;
}

export async function submitContactForm(data: Record<string, unknown>): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const json = await response.json();
    if (!response.ok || !json.ok) {
        return { success: false, error: json.error?.message || 'Something went wrong.' };
    }

    return { success: true };
  } catch (error) {
    console.error('Contact form submission error:', error);
    return { success: false, error: 'Network error. Please try again later.' };
  }
}

// Admin API
export async function getContacts(authHeader: string): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/admin/contacts`, {
    headers: {
      'Authorization': authHeader
    }
  });
  if (!response.ok) throw new Error('Unauthorized or network error');
  const json = await response.json();
  return json.data || [];
}

export async function uploadImage(file: File, authHeader: string): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/admin/upload`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader
      },
      body: formData
    });

    const json = await response.json();
    if (!response.ok || !json.ok) {
      return { success: false, error: json.error?.message || 'Upload failed' };
    }

    return { success: true, url: json.data.url };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function upload3dModel(file: File, authHeader: string): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const formData = new FormData();
    formData.append('model', file);

    const response = await fetch(`${API_BASE_URL}/admin/upload-3d`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader
      },
      body: formData
    });

    const json = await response.json();
    if (!response.ok || !json.ok) {
      return { success: false, error: json.error?.message || 'Upload failed' };
    }

    return { success: true, url: json.data.url };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function uploadVideo(file: File, authHeader: string): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const formData = new FormData();
    formData.append('video', file);

    const response = await fetch(`${API_BASE_URL}/admin/upload-video`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader
      },
      body: formData
    });

    const json = await response.json();
    if (!response.ok || !json.ok) {
      return { success: false, error: json.error?.message || 'Upload failed' };
    }

    return { success: true, url: json.data.url };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createProject(data: any, authHeader: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(data)
    });

    const json = await response.json();
    if (!response.ok || !json.ok) {
        return { success: false, error: json.error?.message || 'Failed to create project' };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateProject(oldSlug: string, data: any, authHeader: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/projects/${oldSlug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(data)
    });

    const json = await response.json();
    if (!response.ok || !json.ok) {
        return { success: false, error: json.error?.message || 'Failed to update project' };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteProject(slug: string, authHeader: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/projects/${slug}`, {
      method: 'DELETE',
      headers: {
        'Authorization': authHeader
      }
    });

    const json = await response.json();
    if (!response.ok || !json.ok) {
        return { success: false, error: json.error?.message || 'Failed to delete project' };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
