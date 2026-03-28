export interface ProjectMedia {
  id: string
  type: 'image' | 'video' | 'pdf' | 'model'
  url: string
  alt?: string
  caption?: string
  role?: string
}

export interface Project {
  id: string
  slug: string
  title: string
  subtitle?: string
  category: string
  tags: string[]
  summary: string
  industry?: string
  role?: string
  imageUrl?: string
  heroImageUrl?: string
  problem?: string
  approach?: string
  result?: string
  tools: string[]
  constraints?: string
  featured?: boolean
  is3d?: boolean
  modelUrl?: string
  viewerPreset?: string
  viewerRotationPreset?: string
  viewerAutoRotate?: boolean
  viewerCameraDistance?: number | null
  viewerCameraHeight?: number | null
  viewerOffsetX?: number | null
  viewerOffsetY?: number | null
  backgroundImageUrl?: string
  videoUrl?: string
  media?: ProjectMedia[]
  galleryImages?: ProjectMedia[]
  drawingImages?: ProjectMedia[]
}

const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? `http://${window.location.hostname}:5000`
  : `${window.location.origin}/api`

const parseArray = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map(String)
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed.map(String) : []
    } catch {
      return []
    }
  }
  return []
}

const parseOptionalNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

const inferMediaRole = (media: any, index: number) => {
  if (media.media_role) return media.media_role
  if (media.role) return media.role
  if (media.type === 'image') return index === 0 ? 'hero' : 'gallery'
  return undefined
}

const mapMediaItem = (media: any, index: number, title: string): ProjectMedia => ({
  id: String(media.id ?? `${media.type}-${index}`),
  type: media.type,
  url: media.url,
  alt: media.caption || media.thumbnail_url || title,
  caption: media.caption || undefined,
  role: inferMediaRole(media, index)
})

const mapProjectPayload = (payload: any): Project => {
  const media = Array.isArray(payload.media)
    ? payload.media.map((item: any, index: number) => mapMediaItem(item, index, payload.title))
    : []

  const galleryFromPayload = Array.isArray(payload.gallery_images)
    ? payload.gallery_images.map((item: any, index: number) => mapMediaItem(item, index, payload.title))
    : media.filter((item: ProjectMedia) => item.type === 'image' && item.role === 'gallery')

  const drawingsFromPayload = Array.isArray(payload.drawing_images)
    ? payload.drawing_images.map((item: any, index: number) => mapMediaItem(item, index, payload.title))
    : media.filter((item: ProjectMedia) => item.type === 'image' && item.role === 'drawing')

  const heroMedia = media.find((item: ProjectMedia) => item.role === 'hero') || media.find((item: ProjectMedia) => item.type === 'image')
  const heroImageUrl = payload.hero_image_url || payload.heroImageUrl || heroMedia?.url || payload.imageUrl || undefined

  return {
    id: String(payload.id),
    slug: payload.slug,
    title: payload.title,
    subtitle: payload.subtitle || '',
    category: parseArray(payload.tags)[0] || 'Project',
    tags: parseArray(payload.tags),
    summary: payload.summary || '',
    industry: payload.industry || '',
    role: payload.role || '',
    imageUrl: heroImageUrl,
    heroImageUrl,
    problem: payload.problem || '',
    approach: payload.approach || '',
    result: payload.result || '',
    tools: parseArray(payload.tools),
    constraints: payload.constraints || '',
    featured: Boolean(payload.featured),
    is3d: Boolean(payload.is_3d ?? payload.is3d),
    modelUrl: payload.model_url || payload.modelUrl || null,
    viewerPreset: payload.viewer_preset || payload.viewerPreset || 'theme-adaptive',
    viewerRotationPreset: payload.viewer_rotation_preset || payload.viewerRotationPreset || 'none',
    viewerAutoRotate: payload.viewer_auto_rotate === undefined && payload.viewerAutoRotate === undefined
      ? true
      : Boolean(payload.viewer_auto_rotate ?? payload.viewerAutoRotate),
    viewerCameraDistance: parseOptionalNumber(payload.viewer_camera_distance ?? payload.viewerCameraDistance),
    viewerCameraHeight: parseOptionalNumber(payload.viewer_camera_height ?? payload.viewerCameraHeight),
    viewerOffsetX: parseOptionalNumber(payload.viewer_offset_x ?? payload.viewerOffsetX),
    viewerOffsetY: parseOptionalNumber(payload.viewer_offset_y ?? payload.viewerOffsetY),
    backgroundImageUrl: payload.background_image_url || payload.backgroundImageUrl || null,
    videoUrl: payload.video_url || payload.videoUrl || null,
    media,
    galleryImages: galleryFromPayload,
    drawingImages: drawingsFromPayload,
  }
}

export async function getProjects(query?: string, category?: string): Promise<Project[]> {
  const url = new URL(`${API_BASE_URL}/projects`)

  if (query) url.searchParams.append('q', query)
  if (category && category !== 'All') url.searchParams.append('category', category)

  const response = await fetch(url.toString())
  if (!response.ok) throw new Error('Failed to fetch projects')

  const json = await response.json()
  if (json.ok && json.data) {
    return json.data.map((project: any) => mapProjectPayload(project))
  }
  return []
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const response = await fetch(`${API_BASE_URL}/projects/${slug}`)
  if (!response.ok) {
    if (response.status === 404) return null
    throw new Error('Failed to fetch project details')
  }

  const json = await response.json()
  if (json.ok && json.data) {
    return mapProjectPayload(json.data)
  }
  return null
}

export async function submitContactForm(data: Record<string, unknown>): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    const json = await response.json()
    if (!response.ok || !json.ok) {
      return { success: false, error: json.error?.message || 'Something went wrong.' }
    }

    return { success: true }
  } catch (error) {
    console.error('Contact form submission error:', error)
    return { success: false, error: 'Network error. Please try again later.' }
  }
}

export async function loginAdmin(user: string, pass: string, remember: boolean): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ user, pass, remember })
    })

    const json = await response.json()
    if (!response.ok || !json.ok) {
      return { success: false, error: json.error?.message || 'Login failed' }
    }

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function getAdminSession(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/session`, {
      credentials: 'include'
    })

    if (!response.ok) return false
    const json = await response.json()
    return Boolean(json.ok)
  } catch {
    return false
  }
}

export async function logoutAdmin(): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/admin/logout`, {
      method: 'POST',
      credentials: 'include'
    })
  } catch {
    // noop
  }
}

export async function getContacts(): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/admin/contacts`, {
    credentials: 'include'
  })
  if (!response.ok) throw new Error('Unauthorized or network error')
  const json = await response.json()
  return json.data || []
}

export async function uploadImage(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const formData = new FormData()
    formData.append('image', file)

    const response = await fetch(`${API_BASE_URL}/admin/upload`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    })

    const json = await response.json()
    if (!response.ok || !json.ok) {
      return { success: false, error: json.error?.message || 'Upload failed' }
    }

    return { success: true, url: json.data.url }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function upload3dModel(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const formData = new FormData()
    formData.append('model', file)

    const response = await fetch(`${API_BASE_URL}/admin/upload-3d`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    })

    const json = await response.json()
    if (!response.ok || !json.ok) {
      return { success: false, error: json.error?.message || 'Upload failed' }
    }

    return { success: true, url: json.data.url }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function uploadVideo(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const formData = new FormData()
    formData.append('video', file)

    const response = await fetch(`${API_BASE_URL}/admin/upload-video`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    })

    const json = await response.json()
    if (!response.ok || !json.ok) {
      return { success: false, error: json.error?.message || 'Upload failed' }
    }

    return { success: true, url: json.data.url }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function createProject(data: any): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(data)
    })

    const json = await response.json()
    if (!response.ok || !json.ok) {
      return { success: false, error: json.error?.message || 'Failed to create project' }
    }

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateProject(oldSlug: string, data: any): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/projects/${oldSlug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(data)
    })

    const json = await response.json()
    if (!response.ok || !json.ok) {
      return { success: false, error: json.error?.message || 'Failed to update project' }
    }

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteProject(slug: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/projects/${slug}`, {
      method: 'DELETE',
      credentials: 'include'
    })

    const json = await response.json()
    if (!response.ok || !json.ok) {
      return { success: false, error: json.error?.message || 'Failed to delete project' }
    }

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
