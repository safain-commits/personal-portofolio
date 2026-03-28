import { useEffect, useMemo, useState } from "react"
import { useTitle } from "../hooks/useTitle"
import { createProject, deleteProject, getAdminSession, getContacts, getProjectBySlug, getProjects, loginAdmin, logoutAdmin, type Project, updateProject, upload3dModel, uploadImage, uploadVideo } from "../lib/api"
import MarkdownEditor from "../components/MarkdownEditor"

type MediaFormItem = {
  url: string
  caption: string
}

type ProjectFormState = {
  slug: string
  title: string
  subtitle: string
  summary: string
  industry: string
  role: string
  problem: string
  constraints: string
  approach: string
  result: string
  tools: string
  tags: string
  featured: boolean
  heroImageUrl: string
  galleryImages: MediaFormItem[]
  drawingImages: MediaFormItem[]
  is3d: boolean
  modelUrl: string
  viewerPreset: string
  viewerRotationPreset: string
  viewerAutoRotate: boolean
  viewerCameraDistance: string
  viewerCameraHeight: string
  viewerOffsetX: string
  viewerOffsetY: string
  backgroundImageUrl: string
  videoUrl: string
}

type ImageCollectionKey = 'galleryImages' | 'drawingImages'
type UploadStateKey = 'hero' | 'gallery' | 'drawing' | 'background' | 'video' | 'model'

const EMPTY_FORM: ProjectFormState = {
  slug: '',
  title: '',
  subtitle: '',
  summary: '',
  industry: '',
  role: '',
  problem: '',
  constraints: '',
  approach: '',
  result: '',
  tools: '',
  tags: '',
  featured: false,
  heroImageUrl: '',
  galleryImages: [],
  drawingImages: [],
  is3d: false,
  modelUrl: '',
  viewerPreset: 'theme-adaptive',
  viewerRotationPreset: 'none',
  viewerAutoRotate: true,
  viewerCameraDistance: '',
  viewerCameraHeight: '',
  viewerOffsetX: '',
  viewerOffsetY: '',
  backgroundImageUrl: '',
  videoUrl: '',
}

const PROJECT_DRAFT_STORAGE_KEY_PREFIX = 'portfolio_admin_project_draft'

const slugify = (value: string) => value
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9\s-]/g, '')
  .replace(/\s+/g, '-')
  .replace(/-+/g, '-')

const getDraftStorageKey = (editingSlug: string | null) => `${PROJECT_DRAFT_STORAGE_KEY_PREFIX}:${editingSlug ? `edit:${editingSlug}` : 'create'}`

const mediaItemsEqual = (a: MediaFormItem[], b: MediaFormItem[]) => JSON.stringify(a) === JSON.stringify(b)

const formsEqual = (a: ProjectFormState, b: ProjectFormState) => (
  a.slug === b.slug &&
  a.title === b.title &&
  a.subtitle === b.subtitle &&
  a.summary === b.summary &&
  a.industry === b.industry &&
  a.role === b.role &&
  a.problem === b.problem &&
  a.constraints === b.constraints &&
  a.approach === b.approach &&
  a.result === b.result &&
  a.tools === b.tools &&
  a.tags === b.tags &&
  a.featured === b.featured &&
  a.heroImageUrl === b.heroImageUrl &&
  mediaItemsEqual(a.galleryImages, b.galleryImages) &&
  mediaItemsEqual(a.drawingImages, b.drawingImages) &&
  a.is3d === b.is3d &&
  a.modelUrl === b.modelUrl &&
  a.viewerPreset === b.viewerPreset &&
  a.viewerRotationPreset === b.viewerRotationPreset &&
  a.viewerAutoRotate === b.viewerAutoRotate &&
  a.viewerCameraDistance === b.viewerCameraDistance &&
  a.viewerCameraHeight === b.viewerCameraHeight &&
  a.viewerOffsetX === b.viewerOffsetX &&
  a.viewerOffsetY === b.viewerOffsetY &&
  a.backgroundImageUrl === b.backgroundImageUrl &&
  a.videoUrl === b.videoUrl
)

export default function Admin() {
  useTitle("Admin Dashboard")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authChecking, setAuthChecking] = useState(true)
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginForm, setLoginForm] = useState({ user: '', pass: '', remember: true })

  const [contacts, setContacts] = useState<any[]>([])
  const [projectsList, setProjectsList] = useState<Project[]>([])
  const [activeTab, setActiveTab] = useState<'messages' | 'projects' | 'form'>('projects')
  const [editingSlug, setEditingSlug] = useState<string | null>(null)

  const [projForm, setProjForm] = useState<ProjectFormState>(EMPTY_FORM)
  const [savedProjForm, setSavedProjForm] = useState<ProjectFormState>(EMPTY_FORM)
  const [draftLoaded, setDraftLoaded] = useState(false)
  const [draftStatus, setDraftStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [slugTouched, setSlugTouched] = useState(false)
  const [projLoading, setProjLoading] = useState(false)
  const [submitNotice, setSubmitNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [draggingMedia, setDraggingMedia] = useState<{ target: ImageCollectionKey; index: number } | null>(null)
  const [dragOverMedia, setDragOverMedia] = useState<{ target: ImageCollectionKey; index: number } | null>(null)
  const [uploadState, setUploadState] = useState<Record<UploadStateKey, boolean>>({
    hero: false,
    gallery: false,
    drawing: false,
    background: false,
    video: false,
    model: false,
  })

  const hasUnsavedChanges = useMemo(
    () => activeTab === 'form' && !formsEqual(projForm, savedProjForm),
    [activeTab, projForm, savedProjForm]
  )

  const setUploading = (key: UploadStateKey, value: boolean) => {
    setUploadState(prev => ({ ...prev, [key]: value }))
  }

  const confirmDiscardChanges = () => {
    if (!hasUnsavedChanges) return true
    return window.confirm('Perubahan pada form project belum disimpan. Yakin ingin meninggalkan halaman ini?')
  }

  const clearProjectDraft = (targetSlug: string | null = editingSlug) => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(getDraftStorageKey(targetSlug))
    }
    setDraftLoaded(false)
    setDraftStatus('idle')
  }

  const restoreDraftToBase = () => {
    clearProjectDraft(editingSlug)
    setProjForm(savedProjForm)
    setSlugTouched(Boolean(editingSlug))
    setDraftLoaded(true)
  }

  const loadProjects = async () => {
    try {
      const data = await getProjects()
      setProjectsList(data)
    } catch (error) {
      console.error(error)
    }
  }

  const openCreateForm = () => {
    if (!confirmDiscardChanges()) return
    setEditingSlug(null)
    setProjForm(EMPTY_FORM)
    setSavedProjForm(EMPTY_FORM)
    setSlugTouched(false)
    setDraftLoaded(false)
    setDraftStatus('idle')
    setSubmitNotice(null)
    setActiveTab('form')
  }

  const buildFormFromProject = (project: Project): ProjectFormState => ({
    slug: project.slug,
    title: project.title,
    subtitle: project.subtitle || '',
    summary: project.summary || '',
    industry: project.industry || '',
    role: project.role || '',
    problem: project.problem || '',
    constraints: project.constraints || '',
    approach: project.approach || '',
    result: project.result || '',
    tools: project.tools?.join(', ') || '',
    tags: project.tags?.join(', ') || '',
    featured: project.featured || false,
    heroImageUrl: project.heroImageUrl || project.imageUrl || '',
    galleryImages: project.galleryImages?.map(item => ({ url: item.url, caption: item.caption || '' })) || [],
    drawingImages: project.drawingImages?.map(item => ({ url: item.url, caption: item.caption || '' })) || [],
    is3d: project.is3d || false,
    modelUrl: project.modelUrl || '',
    viewerPreset: project.viewerPreset || 'theme-adaptive',
    viewerRotationPreset: project.viewerRotationPreset || 'none',
    viewerAutoRotate: project.viewerAutoRotate ?? true,
    viewerCameraDistance: project.viewerCameraDistance != null ? String(project.viewerCameraDistance) : '',
    viewerCameraHeight: project.viewerCameraHeight != null ? String(project.viewerCameraHeight) : '',
    viewerOffsetX: project.viewerOffsetX != null ? String(project.viewerOffsetX) : '',
    viewerOffsetY: project.viewerOffsetY != null ? String(project.viewerOffsetY) : '',
    backgroundImageUrl: project.backgroundImageUrl || '',
    videoUrl: project.videoUrl || '',
  })

  const handleEdit = async (slug: string) => {
    if (!confirmDiscardChanges()) return

    try {
      const project = await getProjectBySlug(slug)
      if (!project) return

      const nextForm = buildFormFromProject(project)
      setEditingSlug(slug)
      setProjForm(nextForm)
      setSavedProjForm(nextForm)
      setSlugTouched(true)
      setDraftLoaded(false)
      setDraftStatus('idle')
      setSubmitNotice(null)
      setActiveTab('form')
    } catch {
      alert('Failed to load project details.')
    }
  }

  const handleDelete = async (slug: string) => {
    if (!isAuthenticated) return
    if (!window.confirm('Are you sure you want to delete this project?')) return

    const res = await deleteProject(slug)
    if (res.success) {
      await loadProjects()
    } else {
      alert(`Error deleting: ${res.error}`)
    }
  }

  const handleSingleImageUpload = async (file: File, target: 'heroImageUrl' | 'backgroundImageUrl', loadingKey: UploadStateKey) => {
    if (!isAuthenticated) return

    setUploading(loadingKey, true)
    const res = await uploadImage(file)
    if (res.success && res.url) {
      setProjForm(prev => ({ ...prev, [target]: res.url! }))
    } else {
      alert(`Upload failed: ${res.error}`)
    }
    setUploading(loadingKey, false)
  }

  const handleImageFileInput = async (e: React.ChangeEvent<HTMLInputElement>, target: 'heroImageUrl' | 'backgroundImageUrl', loadingKey: UploadStateKey) => {
    const file = e.target.files?.[0]
    if (!file) return
    await handleSingleImageUpload(file, target, loadingKey)
    e.target.value = ''
  }

  const handleMultiImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: ImageCollectionKey, loadingKey: UploadStateKey) => {
    const files = Array.from(e.target.files || [])
    if (!isAuthenticated || files.length === 0) return

    setUploading(loadingKey, true)
    const uploadedItems: MediaFormItem[] = []

    for (const file of files) {
      const res = await uploadImage(file)
      if (res.success && res.url) {
        uploadedItems.push({ url: res.url, caption: '' })
      } else {
        alert(`Upload failed for ${file.name}: ${res.error}`)
      }
    }

    if (uploadedItems.length > 0) {
      setProjForm(prev => ({
        ...prev,
        [target]: [...prev[target], ...uploadedItems],
      }))
    }

    setUploading(loadingKey, false)
    e.target.value = ''
  }

  const removeImageAt = (target: ImageCollectionKey, index: number) => {
    setProjForm(prev => ({
      ...prev,
      [target]: prev[target].filter((_, currentIndex) => currentIndex !== index)
    }))
  }

  const moveImage = (target: ImageCollectionKey, fromIndex: number, toIndex: number) => {
    setProjForm(prev => {
      const items = [...prev[target]]
      if (fromIndex < 0 || toIndex < 0 || fromIndex >= items.length || toIndex >= items.length || fromIndex === toIndex) return prev
      const [moved] = items.splice(fromIndex, 1)
      items.splice(toIndex, 0, moved)
      return { ...prev, [target]: items }
    })
  }

  const handleMediaDragStart = (target: ImageCollectionKey, index: number) => {
    setDraggingMedia({ target, index })
    setDragOverMedia({ target, index })
  }

  const handleMediaDrop = (target: ImageCollectionKey, index: number) => {
    if (!draggingMedia || draggingMedia.target !== target) {
      setDraggingMedia(null)
      setDragOverMedia(null)
      return
    }

    moveImage(target, draggingMedia.index, index)
    setDraggingMedia(null)
    setDragOverMedia(null)
  }

  const handleMediaDragEnd = () => {
    setDraggingMedia(null)
    setDragOverMedia(null)
  }

  const updateImageCaption = (target: ImageCollectionKey, index: number, caption: string) => {
    setProjForm(prev => ({
      ...prev,
      [target]: prev[target].map((item, currentIndex) => currentIndex === index ? { ...item, caption } : item)
    }))
  }

  const handle3dUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!isAuthenticated || !file) return
    setUploading('model', true)
    const res = await upload3dModel(file)
    if (res.success && res.url) {
      setProjForm(prev => ({ ...prev, modelUrl: res.url! }))
    } else {
      alert(`3D Upload failed: ${res.error}`)
    }
    setUploading('model', false)
    e.target.value = ''
  }

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!isAuthenticated || !file) return
    setUploading('video', true)
    const res = await uploadVideo(file)
    if (res.success && res.url) {
      setProjForm(prev => ({ ...prev, videoUrl: res.url! }))
    } else {
      alert(`Video upload failed: ${res.error}`)
    }
    setUploading('video', false)
    e.target.value = ''
  }

  const resetViewerOverrides = () => {
    setProjForm(prev => ({
      ...prev,
      viewerPreset: 'theme-adaptive',
      viewerRotationPreset: 'none',
      viewerAutoRotate: true,
      viewerCameraDistance: '',
      viewerCameraHeight: '',
      viewerOffsetX: '',
      viewerOffsetY: '',
    }))
  }

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) return

    const parseOptionalNumber = (value: string) => {
      const trimmed = value.trim()
      if (!trimmed) return null
      const parsed = Number(trimmed)
      return Number.isFinite(parsed) ? parsed : null
    }

    setProjLoading(true)
    const payload = {
      ...projForm,
      tools: projForm.tools.split(',').map(tool => tool.trim()).filter(Boolean),
      tags: projForm.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      galleryImages: projForm.galleryImages,
      drawingImages: projForm.drawingImages,
      is3d: projForm.is3d,
      modelUrl: projForm.modelUrl,
      viewerPreset: projForm.viewerPreset,
      viewerRotationPreset: projForm.viewerRotationPreset,
      viewerAutoRotate: projForm.viewerAutoRotate,
      viewerCameraDistance: parseOptionalNumber(projForm.viewerCameraDistance),
      viewerCameraHeight: parseOptionalNumber(projForm.viewerCameraHeight),
      viewerOffsetX: parseOptionalNumber(projForm.viewerOffsetX),
      viewerOffsetY: parseOptionalNumber(projForm.viewerOffsetY),
      backgroundImageUrl: projForm.backgroundImageUrl,
      videoUrl: projForm.videoUrl,
    }

    const res = editingSlug
      ? await updateProject(editingSlug, payload)
      : await createProject(payload)

    if (res.success) {
      const nextEditingSlug = payload.slug
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(getDraftStorageKey(editingSlug))
        window.localStorage.removeItem(getDraftStorageKey(nextEditingSlug))
      }

      const nextSavedForm = {
        ...projForm,
        slug: nextEditingSlug,
      }

      setProjForm(nextSavedForm)
      setSavedProjForm(nextSavedForm)
      setEditingSlug(nextEditingSlug)
      setSlugTouched(true)
      setDraftLoaded(true)
      setDraftStatus('saved')
      setSubmitNotice({
        type: 'success',
        message: editingSlug ? 'Project updated successfully. You can continue editing or close the editor manually.' : 'Project created successfully. You can continue editing or close the editor manually.'
      })
      await loadProjects()
    } else {
      setSubmitNotice({ type: 'error', message: res.error || 'Failed to save project.' })
    }

    setProjLoading(false)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    const res = await loginAdmin(loginForm.user, loginForm.pass, loginForm.remember)
    if (res.success) {
      setIsAuthenticated(true)
      setActiveTab('projects')
    } else {
      alert(`Login failed: ${res.error}`)
      setIsAuthenticated(false)
    }
    setLoginLoading(false)
  }

  const handleLogout = async () => {
    if (!confirmDiscardChanges()) return
    await logoutAdmin()
    setIsAuthenticated(false)
    setContacts([])
    setLoginForm(prev => ({ ...prev, pass: prev.remember ? prev.pass : '' }))
  }

  useEffect(() => {
    getAdminSession().then((ok) => {
      setIsAuthenticated(ok)
      setAuthChecking(false)
    })
  }, [])

  useEffect(() => {
    if (isAuthenticated && activeTab === 'messages') {
      getContacts()
        .then(data => setContacts(data))
        .catch(() => setIsAuthenticated(false))
    }
  }, [isAuthenticated, activeTab])

  useEffect(() => {
    if (isAuthenticated && activeTab === 'projects') {
      loadProjects()
    }
  }, [isAuthenticated, activeTab])

  useEffect(() => {
    if (!editingSlug && !slugTouched && activeTab === 'form') {
      const generated = slugify(projForm.title)
      setProjForm(prev => prev.slug === generated ? prev : { ...prev, slug: generated })
    }
  }, [projForm.title, editingSlug, slugTouched, activeTab])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (activeTab !== 'form') return
    if (draftLoaded) return

    const raw = window.localStorage.getItem(getDraftStorageKey(editingSlug))
    if (!raw) {
      setDraftLoaded(true)
      return
    }

    try {
      const parsed = JSON.parse(raw)
      if (parsed?.form && typeof parsed.form === 'object') {
        setProjForm(prev => ({ ...prev, ...parsed.form }))
        setSlugTouched(Boolean(parsed?.meta?.slugTouched))
        setDraftStatus('saved')
      }
    } catch (error) {
      console.error('Failed to restore draft', error)
    } finally {
      setDraftLoaded(true)
    }
  }, [activeTab, draftLoaded, editingSlug])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (activeTab !== 'form') return
    if (!draftLoaded) return

    setDraftStatus('saving')
    const timeout = window.setTimeout(() => {
      window.localStorage.setItem(getDraftStorageKey(editingSlug), JSON.stringify({
        editingSlug,
        form: projForm,
        savedAt: Date.now(),
        meta: { slugTouched }
      }))
      setDraftStatus('saved')
    }, 350)

    return () => window.clearTimeout(timeout)
  }, [projForm, editingSlug, activeTab, draftLoaded, slugTouched])

  useEffect(() => {
    if (!submitNotice || submitNotice.type !== 'success') return
    const timeout = window.setTimeout(() => setSubmitNotice(null), 3200)
    return () => window.clearTimeout(timeout)
  }, [submitNotice])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) return
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  const renderImageCollection = (title: string, target: ImageCollectionKey) => {
    const items = projForm[target]

    return (
      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-semibold">{title}</h4>
          <p className="text-xs text-muted-foreground">{items.length} file tersimpan. Kamu bisa atur caption dan urutan tampilnya.</p>
        </div>

        {items.length === 0 ? (
          <div className="border border-dashed border-border p-4 text-sm text-muted-foreground bg-background/70">
            Belum ada gambar di bagian ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {items.map((item, index) => {
              const isDragging = draggingMedia?.target === target && draggingMedia.index === index
              const isDropTarget = dragOverMedia?.target === target && dragOverMedia.index === index

              return (
                <div
                  key={`${item.url}-${index}`}
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.effectAllowed = 'move'
                    handleMediaDragStart(target, index)
                  }}
                  onDragOver={(event) => {
                    event.preventDefault()
                    event.dataTransfer.dropEffect = 'move'
                    if (!dragOverMedia || dragOverMedia.target !== target || dragOverMedia.index !== index) {
                      setDragOverMedia({ target, index })
                    }
                  }}
                  onDrop={(event) => {
                    event.preventDefault()
                    handleMediaDrop(target, index)
                  }}
                  onDragEnd={handleMediaDragEnd}
                  className={`border bg-background p-3 space-y-3 transition-all ${isDragging ? 'opacity-50 scale-[0.98]' : ''} ${isDropTarget ? 'border-foreground ring-1 ring-foreground/20' : 'border-border/60'}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Item {index + 1}</p>
                    <span className="text-[11px] text-muted-foreground cursor-grab active:cursor-grabbing">Drag to reorder</span>
                  </div>
                  <img src={item.url} alt={`${title} ${index + 1}`} className="w-full h-40 object-cover border border-border/50" />
                  <div className="space-y-2">
                    <textarea
                      rows={3}
                      className="w-full border p-2 bg-background outline-none text-sm"
                      placeholder="Caption / deskripsi singkat gambar"
                      value={item.caption}
                      onChange={(e) => updateImageCaption(target, index, e.target.value)}
                    />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[11px] text-muted-foreground truncate max-w-[75%]">{item.url}</p>
                    <button type="button" onClick={() => removeImageAt(target, index)} className="text-xs underline underline-offset-4 text-red-600">
                      Remove
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  if (authChecking) {
    return (
      <div className="pt-32 pb-24 max-w-sm mx-auto text-center text-muted-foreground">Checking admin session...</div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="pt-32 pb-24 max-w-sm mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full border p-2 bg-transparent focus:border-foreground outline-none"
            value={loginForm.user}
            onChange={e => setLoginForm({ ...loginForm, user: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 bg-transparent focus:border-foreground outline-none"
            value={loginForm.pass}
            onChange={e => setLoginForm({ ...loginForm, pass: e.target.value })}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={loginForm.remember}
              onChange={e => setLoginForm({ ...loginForm, remember: e.target.checked })}
            />
            Remember me
          </label>
          <button type="submit" disabled={loginLoading} className="w-full bg-foreground text-background py-3 font-semibold disabled:opacity-60">
            {loginLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="pt-24 lg:pt-32 pb-24 max-w-7xl mx-auto px-4 lg:px-6">
      <div className="flex justify-between items-end mb-8 border-b pb-4">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <button onClick={handleLogout} className="text-sm underline underline-offset-4">Logout</button>
      </div>

      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-4">
          <button
            onClick={() => { if (confirmDiscardChanges()) setActiveTab('projects') }}
            className={`px-4 py-2 text-sm font-semibold border ${activeTab === 'projects' ? 'bg-foreground text-background' : 'hover:border-foreground'}`}
          >
            Projects
          </button>
          <button
            onClick={() => { if (confirmDiscardChanges()) setActiveTab('messages') }}
            className={`px-4 py-2 text-sm font-semibold border ${activeTab === 'messages' ? 'bg-foreground text-background' : 'hover:border-foreground'}`}
          >
            Messages
          </button>
        </div>

        {activeTab === 'projects' && (
          <button onClick={openCreateForm} className="bg-foreground text-background px-4 py-2 text-sm font-semibold">
            + New Project
          </button>
        )}
      </div>

      {activeTab === 'messages' && (
        <div className="border bg-card/30 rounded-md">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted text-muted-foreground uppercase text-xs">
              <tr>
                <th className="p-4 w-32">Date</th>
                <th className="p-4 w-48">Sender</th>
                <th className="p-4">Message</th>
              </tr>
            </thead>
            <tbody>
              {contacts.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-12 text-center text-muted-foreground">
                    <p className="text-lg mb-2">No messages yet.</p>
                    <p className="text-sm">Submissions from the Contact page will appear here.</p>
                  </td>
                </tr>
              )}
              {contacts.map(c => (
                <tr key={c.id} className="border-t hover:bg-muted/10 transition-colors align-top">
                  <td className="p-4 whitespace-nowrap text-muted-foreground">
                    {new Date(c.created_at).toLocaleDateString('id-ID', {
                      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-foreground">{c.name}</div>
                    <a href={`mailto:${c.email}`} className="text-blue-500 hover:underline mt-1 block break-all">{c.email}</a>
                  </td>
                  <td className="p-4">
                    <div className="bg-muted/20 p-4 rounded border border-border/50 text-foreground whitespace-pre-wrap leading-relaxed max-w-3xl">
                      {c.message}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="overflow-x-auto border">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted text-muted-foreground uppercase text-xs">
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Media</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projectsList.length === 0 && (
                <tr><td colSpan={4} className="p-4 text-center">No projects found.</td></tr>
              )}
              {projectsList.map(project => (
                <tr key={project.id} className="border-t align-top">
                  <td className="p-4 min-w-[260px]">
                    <div className="font-medium">{project.title}</div>
                    {project.subtitle && <p className="text-xs text-muted-foreground mt-1 whitespace-normal max-w-sm">{project.subtitle}</p>}
                  </td>
                  <td className="p-4">{project.category}</td>
                  <td className="p-4 text-muted-foreground">hero {project.heroImageUrl ? '✓' : '—'}</td>
                  <td className="p-4 flex gap-4">
                    <button onClick={() => handleEdit(project.slug)} className="text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(project.slug)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'form' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{editingSlug ? 'Edit Project' : 'Create New Project'}</h2>
            <button
              type="button"
              onClick={() => {
                if (!confirmDiscardChanges()) return
                clearProjectDraft(editingSlug)
                setProjForm(EMPTY_FORM)
                setSavedProjForm(EMPTY_FORM)
                setEditingSlug(null)
                setSlugTouched(false)
                setDraftLoaded(false)
                setSubmitNotice(null)
                setActiveTab('projects')
              }}
              className="text-sm underline underline-offset-4"
            >
              Close editor / Back to project list
            </button>
          </div>

          <div className="mb-4 flex items-center justify-between gap-4 border bg-background/60 p-3 text-sm">
            <div>
              <p className="text-muted-foreground">Draft project disimpan otomatis di browser ini selama kamu mengedit.</p>
              <p className="text-xs mt-1 text-muted-foreground">{draftStatus === 'saving' ? 'Saving draft...' : draftStatus === 'saved' ? 'Draft saved' : 'Draft idle'}</p>
            </div>
            <button type="button" onClick={restoreDraftToBase} className="underline underline-offset-4 whitespace-nowrap">Clear draft</button>
          </div>

          {submitNotice && (
            <div className={`mb-4 flex items-start justify-between gap-4 border p-3 text-sm ${submitNotice.type === 'success' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300'}`}>
              <div>
                <p className="font-semibold">{submitNotice.type === 'success' ? 'Saved' : 'Save failed'}</p>
                <p className="mt-1">{submitNotice.message}</p>
              </div>
              <button type="button" onClick={() => setSubmitNotice(null)} className="text-xs underline underline-offset-4 whitespace-nowrap">
                Dismiss
              </button>
            </div>
          )}

          <form onSubmit={handleProjectSubmit} className="space-y-8 bg-muted/20 p-6 lg:p-8 border">
            <section className="space-y-5">
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold">Project metadata</h3>
                <p className="text-sm text-muted-foreground">Informasi inti project, positioning singkat, dan atribut klasifikasi.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                <div className="xl:col-span-2">
                  <label className="text-xs uppercase font-bold tracking-widest text-muted-foreground block mb-1">Title *</label>
                  <input required type="text" className="w-full border p-2 bg-background outline-none" value={projForm.title} onChange={e => setProjForm({ ...projForm, title: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs uppercase font-bold tracking-widest text-muted-foreground block mb-1">Subtitle</label>
                  <input type="text" className="w-full border p-2 bg-background outline-none" value={projForm.subtitle} onChange={e => setProjForm({ ...projForm, subtitle: e.target.value })} placeholder="Short positioning statement under the title" />
                </div>
                <div>
                  <label className="text-xs uppercase font-bold tracking-widest text-muted-foreground block mb-1">Slug (URL-friendly) *</label>
                  <input required type="text" className="w-full border p-2 bg-background outline-none" value={projForm.slug} onChange={e => { setSlugTouched(true); setProjForm({ ...projForm, slug: e.target.value }) }} />
                </div>
                <div>
                  <label className="text-xs uppercase font-bold tracking-widest text-muted-foreground block mb-1">Industry</label>
                  <input type="text" className="w-full border p-2 bg-background outline-none" value={projForm.industry} onChange={e => setProjForm({ ...projForm, industry: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs uppercase font-bold tracking-widest text-muted-foreground block mb-1">Role</label>
                  <input type="text" className="w-full border p-2 bg-background outline-none" value={projForm.role} onChange={e => setProjForm({ ...projForm, role: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs uppercase font-bold tracking-widest text-muted-foreground block mb-1">Tools (comma separated)</label>
                  <input type="text" placeholder="Solidworks, Blender" className="w-full border p-2 bg-background outline-none" value={projForm.tools} onChange={e => setProjForm({ ...projForm, tools: e.target.value })} />
                </div>
                <div className="xl:col-span-2">
                  <label className="text-xs uppercase font-bold tracking-widest text-muted-foreground block mb-1">Tags (comma separated)</label>
                  <input type="text" placeholder="Industrial Design, Engineering" className="w-full border p-2 bg-background outline-none" value={projForm.tags} onChange={e => setProjForm({ ...projForm, tags: e.target.value })} />
                </div>
                <div className="xl:col-span-3">
                  <MarkdownEditor
                    label="Constraints"
                    value={projForm.constraints}
                    onChange={(value) => setProjForm({ ...projForm, constraints: value })}
                    rows={8}
                    placeholder="Manufacturing limits, cost caps, material constraints, operational restrictions, installation limits, etc."
                    helpText="Supports markdown too, so you can write bullet points, numbered lists, links, and short technical notes."
                  />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" id="featured" checked={projForm.featured} onChange={e => setProjForm({ ...projForm, featured: e.target.checked })} />
                  <label htmlFor="featured" className="text-sm font-semibold">Featured Project (Hero Display)</label>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" id="is3d" checked={projForm.is3d} onChange={e => setProjForm({ ...projForm, is3d: e.target.checked })} />
                  <label htmlFor="is3d" className="text-sm font-semibold">3D Project</label>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold">Project narrative</h3>
                <p className="text-sm text-muted-foreground">Bagian studi kasus utama yang akan dirender ke public detail page.</p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <MarkdownEditor
                  label="Summary"
                  value={projForm.summary}
                  onChange={(value) => setProjForm({ ...projForm, summary: value })}
                  rows={12}
                  placeholder="Tulis ringkasan project. Mendukung heading, bold, list, link, dan line break markdown."
                  helpText="Gunakan markdown. Contoh: **bold**, - list, [link](https://...)."
                />
                <MarkdownEditor
                  label="Problem Statement"
                  value={projForm.problem}
                  onChange={(value) => setProjForm({ ...projForm, problem: value })}
                  rows={14}
                  placeholder="Jelaskan problem statement dalam markdown."
                />
                <MarkdownEditor
                  label="Approach"
                  value={projForm.approach}
                  onChange={(value) => setProjForm({ ...projForm, approach: value })}
                  rows={14}
                  placeholder="Jelaskan approach dalam markdown."
                />
                <MarkdownEditor
                  label="Result"
                  value={projForm.result}
                  onChange={(value) => setProjForm({ ...projForm, result: value })}
                  rows={14}
                  placeholder="Jelaskan result dalam markdown."
                />
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold">Media system</h3>
                <p className="text-sm text-muted-foreground">Media dibagi jelas antara hero image, gallery pendukung, dan technical drawings. Sekarang caption dan urutan gambar juga bisa diatur langsung dari CMS.</p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="border border-border/60 bg-background/70 p-4 space-y-4">
                  <div>
                    <label className="text-xs uppercase font-bold tracking-widest text-muted-foreground block mb-1">Hero Image</label>
                    <input type="file" accept="image/*" className="w-full border p-2 bg-background outline-none text-sm" onChange={(e) => handleImageFileInput(e, 'heroImageUrl', 'hero')} disabled={uploadState.hero} />
                    {uploadState.hero && <p className="text-xs text-muted-foreground mt-2">Uploading hero image...</p>}
                  </div>
                  {projForm.heroImageUrl ? (
                    <div className="space-y-3">
                      <img src={projForm.heroImageUrl} alt="Hero preview" className="w-full h-52 object-cover border border-border/50" />
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs text-muted-foreground truncate">{projForm.heroImageUrl}</p>
                        <button type="button" onClick={() => setProjForm(prev => ({ ...prev, heroImageUrl: '' }))} className="text-xs underline underline-offset-4 text-red-600">Remove</button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Gunakan 1 gambar utama sebagai visual pembuka pada list dan detail page.</p>
                  )}
                </div>

                <div className="border border-border/60 bg-background/70 p-4 space-y-4">
                  <div>
                    <label className="text-xs uppercase font-bold tracking-widest text-muted-foreground block mb-1">Background Image (Featured/Home)</label>
                    <input type="file" accept="image/*" className="w-full border p-2 bg-background outline-none text-sm" onChange={(e) => handleImageFileInput(e, 'backgroundImageUrl', 'background')} disabled={uploadState.background} />
                    {uploadState.background && <p className="text-xs text-muted-foreground mt-2">Uploading background...</p>}
                  </div>
                  {projForm.backgroundImageUrl ? (
                    <div className="space-y-3">
                      <img src={projForm.backgroundImageUrl} alt="Background preview" className="w-full h-52 object-cover border border-border/50" />
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs text-muted-foreground truncate">{projForm.backgroundImageUrl}</p>
                        <button type="button" onClick={() => setProjForm(prev => ({ ...prev, backgroundImageUrl: '' }))} className="text-xs underline underline-offset-4 text-red-600">Remove</button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Opsional. Dipakai untuk featured section di home jika kamu ingin visual berbeda dari hero utama.</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="border border-border/60 bg-background/70 p-4 space-y-4">
                  <div>
                    <label className="text-xs uppercase font-bold tracking-widest text-muted-foreground block mb-1">Gallery Images</label>
                    <input type="file" accept="image/*" multiple className="w-full border p-2 bg-background outline-none text-sm" onChange={(e) => handleMultiImageUpload(e, 'galleryImages', 'gallery')} disabled={uploadState.gallery} />
                    {uploadState.gallery && <p className="text-xs text-muted-foreground mt-2">Uploading gallery images...</p>}
                  </div>
                  {renderImageCollection('Gallery images', 'galleryImages')}
                </div>

                <div className="border border-border/60 bg-background/70 p-4 space-y-4">
                  <div>
                    <label className="text-xs uppercase font-bold tracking-widest text-muted-foreground block mb-1">Technical Drawings</label>
                    <input type="file" accept="image/*" multiple className="w-full border p-2 bg-background outline-none text-sm" onChange={(e) => handleMultiImageUpload(e, 'drawingImages', 'drawing')} disabled={uploadState.drawing} />
                    {uploadState.drawing && <p className="text-xs text-muted-foreground mt-2">Uploading technical drawings...</p>}
                  </div>
                  {renderImageCollection('Technical drawings', 'drawingImages')}
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="border border-border/60 bg-background/70 p-4 space-y-4">
                  <div>
                    <label className="text-xs uppercase font-bold tracking-widest text-muted-foreground block mb-1">Project Video (.mp4, .webm, .mov)</label>
                    <input type="file" accept=".mp4,.webm,.mov" className="w-full border p-2 bg-background outline-none text-sm" onChange={handleVideoUpload} disabled={uploadState.video} />
                    {uploadState.video && <p className="text-xs text-muted-foreground mt-2">Uploading video...</p>}
                  </div>
                  {projForm.videoUrl && (
                    <div className="space-y-3">
                      <video src={projForm.videoUrl} className="w-full h-52 object-cover border border-border/50" muted controls />
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs text-muted-foreground truncate">{projForm.videoUrl}</p>
                        <button type="button" onClick={() => setProjForm(prev => ({ ...prev, videoUrl: '' }))} className="text-xs underline underline-offset-4 text-red-600">Remove</button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border border-border/60 bg-background/70 p-4 space-y-4">
                  <div>
                    <label className="text-xs uppercase font-bold tracking-widest text-muted-foreground block mb-1">3D Model (.glb / .gltf)</label>
                    <input type="file" accept=".glb,.gltf" className="w-full border p-2 bg-background outline-none text-sm" onChange={handle3dUpload} disabled={uploadState.model || !projForm.is3d} />
                    {uploadState.model && <p className="text-xs text-muted-foreground mt-2">Uploading 3D model...</p>}
                    {!projForm.is3d && <p className="text-xs text-muted-foreground mt-2">Aktifkan checkbox “3D Project” lebih dulu untuk memakai field ini.</p>}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs uppercase font-bold tracking-widest text-muted-foreground block mb-1">3D Viewer Preset</label>
                      <select
                        className="w-full border p-2 bg-background outline-none text-sm"
                        value={projForm.viewerPreset}
                        onChange={(e) => setProjForm(prev => ({ ...prev, viewerPreset: e.target.value }))}
                        disabled={!projForm.is3d}
                      >
                        <option value="theme-adaptive">Soft Studio Grounded — Auto theme (recommended)</option>
                        <option value="soft-studio-grounded-light">Soft Studio Grounded — Force light</option>
                        <option value="soft-studio-grounded-dark">Soft Studio Grounded — Force dark</option>
                      </select>
                      <p className="text-xs text-muted-foreground mt-2">
                        Auto theme mengikuti light/dark mode portfolio. Gunakan force light/dark hanya jika kamu ingin project ini selalu tampil dengan preset tertentu.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-border/50 bg-background/60 p-4">
                      <div className="md:col-span-2 space-y-3">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-xs uppercase font-bold tracking-widest text-muted-foreground mb-2">Advanced Viewer Overrides</p>
                            <p className="text-xs text-muted-foreground">Opsional. Kosongkan numeric field untuk kembali ke framing default preset.</p>
                          </div>
                          <button
                            type="button"
                            onClick={resetViewerOverrides}
                            disabled={!projForm.is3d}
                            className="text-xs underline underline-offset-4 text-muted-foreground disabled:opacity-40 disabled:no-underline"
                          >
                            Reset to defaults
                          </button>
                        </div>
                        <div className="grid gap-3 rounded-md border border-border/50 bg-muted/20 p-3 text-xs text-muted-foreground md:grid-cols-2">
                          <div>
                            <p className="font-semibold text-foreground mb-1">Cara baca cepat</p>
                            <ul className="space-y-1 list-disc pl-4">
                              <li><span className="text-foreground">Camera Distance</span>: makin kecil = kamera makin dekat.</li>
                              <li><span className="text-foreground">Camera Height</span>: menaikkan atau menurunkan posisi kamera.</li>
                              <li><span className="text-foreground">Horizontal Offset</span>: <code>+</code> geser model ke kanan layar, <code>-</code> ke kiri.</li>
                              <li><span className="text-foreground">Vertical Offset</span>: <code>+</code> geser model ke atas layar, <code>-</code> ke bawah.</li>
                            </ul>
                          </div>
                          <div>
                            <p className="font-semibold text-foreground mb-1">Workflow aman</p>
                            <ul className="space-y-1 list-disc pl-4">
                              <li>Mulai dari preset + rotation dulu.</li>
                              <li>Atur jarak kamera tipis-tipis, mis. <code>2.8</code> → <code>3.0</code>.</li>
                              <li>Untuk framing, ubah offset kecil dulu, mis. <code>0.10</code> atau <code>0.20</code>.</li>
                              <li>Matikan auto rotate jika ingin tampilan lebih tenang / teknikal.</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs uppercase font-bold tracking-widest text-muted-foreground block mb-1">Rotation Preset</label>
                        <p className="text-[11px] text-muted-foreground mb-2">Pakai ini kalau axis export dari CAD/Inventor/Blender tidak sesuai.</p>
                        <select
                          className="w-full border p-2 bg-background outline-none text-sm"
                          value={projForm.viewerRotationPreset}
                          onChange={(e) => setProjForm(prev => ({ ...prev, viewerRotationPreset: e.target.value }))}
                          disabled={!projForm.is3d}
                        >
                          <option value="none">As uploaded / no rotation</option>
                          <option value="x-positive-90">Rotate X +90°</option>
                          <option value="x-negative-90">Rotate X -90°</option>
                          <option value="y-positive-90">Rotate Y +90°</option>
                          <option value="y-negative-90">Rotate Y -90°</option>
                          <option value="z-positive-90">Rotate Z +90°</option>
                          <option value="z-negative-90">Rotate Z -90°</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-2 pt-1 md:pt-6">
                        <p className="text-[11px] text-muted-foreground">Aktifkan untuk showroom feel. Matikan untuk presentasi yang lebih statis.</p>
                        <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="viewerAutoRotate"
                          checked={projForm.viewerAutoRotate}
                          onChange={e => setProjForm(prev => ({ ...prev, viewerAutoRotate: e.target.checked }))}
                          disabled={!projForm.is3d}
                        />
                        <label htmlFor="viewerAutoRotate" className="text-sm font-semibold">Auto rotate</label>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs uppercase font-bold tracking-widest text-muted-foreground block mb-1">Camera Distance</label>
                        <p className="text-[11px] text-muted-foreground mb-2">Angka lebih kecil membuat model tampak lebih close-up.</p>
                        <input
                          type="number"
                          step="0.1"
                          className="w-full border p-2 bg-background outline-none text-sm"
                          value={projForm.viewerCameraDistance}
                          onChange={(e) => setProjForm(prev => ({ ...prev, viewerCameraDistance: e.target.value }))}
                          placeholder="e.g. 3.2"
                          disabled={!projForm.is3d}
                        />
                      </div>

                      <div>
                        <label className="text-xs uppercase font-bold tracking-widest text-muted-foreground block mb-1">Camera Height</label>
                        <p className="text-[11px] text-muted-foreground mb-2">Naikkan jika kamera terasa terlalu rendah, turunkan jika terlalu ngelook-up.</p>
                        <input
                          type="number"
                          step="0.1"
                          className="w-full border p-2 bg-background outline-none text-sm"
                          value={projForm.viewerCameraHeight}
                          onChange={(e) => setProjForm(prev => ({ ...prev, viewerCameraHeight: e.target.value }))}
                          placeholder="e.g. 1.2"
                          disabled={!projForm.is3d}
                        />
                      </div>

                      <div>
                        <label className="text-xs uppercase font-bold tracking-widest text-muted-foreground block mb-1">Horizontal Offset</label>
                        <p className="text-[11px] text-muted-foreground mb-2">Gunakan nilai kecil: <code>+</code> kanan, <code>-</code> kiri.</p>
                        <input
                          type="number"
                          step="0.05"
                          className="w-full border p-2 bg-background outline-none text-sm"
                          value={projForm.viewerOffsetX}
                          onChange={(e) => setProjForm(prev => ({ ...prev, viewerOffsetX: e.target.value }))}
                          placeholder="+ kanan / - kiri"
                          disabled={!projForm.is3d}
                        />
                      </div>

                      <div>
                        <label className="text-xs uppercase font-bold tracking-widest text-muted-foreground block mb-1">Vertical Offset</label>
                        <p className="text-[11px] text-muted-foreground mb-2">Gunakan nilai kecil: <code>+</code> naik, <code>-</code> turun.</p>
                        <input
                          type="number"
                          step="0.05"
                          className="w-full border p-2 bg-background outline-none text-sm"
                          value={projForm.viewerOffsetY}
                          onChange={(e) => setProjForm(prev => ({ ...prev, viewerOffsetY: e.target.value }))}
                          placeholder="+ naik / - turun"
                          disabled={!projForm.is3d}
                        />
                      </div>
                    </div>
                  </div>

                  {projForm.modelUrl && (
                    <div className="flex items-center justify-between gap-3 border border-border/50 bg-background p-3">
                      <p className="text-xs text-muted-foreground truncate">{projForm.modelUrl}</p>
                      <button type="button" onClick={() => setProjForm(prev => ({ ...prev, modelUrl: '' }))} className="text-xs underline underline-offset-4 text-red-600">Remove</button>
                    </div>
                  )}
                </div>
              </div>
            </section>

            <div className="sticky bottom-4 z-10 mt-2 pt-4 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 rounded-lg p-4 shadow-sm">
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Subtitle, hero image, gallery, drawing, video, dan 3D model sekarang tersinkron ke detail page baru, termasuk preset + advanced viewer override per project.</p>
                <p className="text-xs">Hero: {projForm.heroImageUrl ? '1' : '0'} · Gallery: {projForm.galleryImages.length} · Drawings: {projForm.drawingImages.length}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    if (!confirmDiscardChanges()) return
                    clearProjectDraft(editingSlug)
                    setProjForm(EMPTY_FORM)
                    setSavedProjForm(EMPTY_FORM)
                    setEditingSlug(null)
                    setSlugTouched(false)
                    setDraftLoaded(false)
                    setSubmitNotice(null)
                    setActiveTab('projects')
                  }}
                  className="border border-border px-6 py-3 font-semibold uppercase tracking-widest text-sm w-full sm:w-auto"
                >
                  Close editor
                </button>
                <button disabled={projLoading} type="submit" className="bg-foreground text-background px-8 py-3 font-semibold uppercase tracking-widest text-sm w-full sm:w-auto disabled:opacity-50">
                  {projLoading ? 'Saving...' : (editingSlug ? 'Save Changes' : 'Create Project')}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
