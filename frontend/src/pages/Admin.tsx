import { useState, useEffect } from "react"
import { useTitle } from "../hooks/useTitle"
import { getContacts, createProject, getProjects, getProjectBySlug, updateProject, deleteProject, uploadImage, upload3dModel, uploadVideo } from "../lib/api"

type Project = any;

const EMPTY_FORM = {
  slug: '', title: '', summary: '', industry: '', role: '', 
  problem: '', constraints: '', approach: '', result: '',
  tools: '', tags: '', featured: false, imageUrl: '',
  is3d: false, modelUrl: '', backgroundImageUrl: '', videoUrl: ''
};

export default function Admin() {
  useTitle("Admin Dashboard")
  const [authHeader, setAuthHeader] = useState<string | null>(null)
  const [loginForm, setLoginForm] = useState({ user: '', pass: '' })
  
  const [contacts, setContacts] = useState<any[]>([])
  const [projectsList, setProjectsList] = useState<Project[]>([])
  const [activeTab, setActiveTab] = useState<'messages' | 'projects' | 'form'>('projects')
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  
  const [projForm, setProjForm] = useState(EMPTY_FORM)
  const [projLoading, setProjLoading] = useState(false)
  const [uploadLoading, setUploadLoading] = useState(false)

  const [uploadBgLoading, setUploadBgLoading] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isBackground: boolean = false) => {
    if (!authHeader || !e.target.files?.[0]) return
    const setLoading = isBackground ? setUploadBgLoading : setUploadLoading
    setLoading(true)
    const res = await uploadImage(e.target.files[0], authHeader)
    if (res.success && res.url) {
      if (isBackground) {
        setProjForm(prev => ({ ...prev, backgroundImageUrl: res.url! }))
      } else {
        setProjForm(prev => ({ ...prev, imageUrl: res.url! }))
      }
    } else {
      alert(`Upload failed: ${res.error}`)
    }
    setLoading(false)
  }

  const [upload3dLoading, setUpload3dLoading] = useState(false)

  const handle3dUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!authHeader || !e.target.files?.[0]) return
    setUpload3dLoading(true)
    const res = await upload3dModel(e.target.files[0], authHeader)
    if (res.success && res.url) {
      setProjForm(prev => ({ ...prev, modelUrl: res.url! }))
    } else {
      alert(`3D Upload failed: ${res.error}`)
    }
    setUpload3dLoading(false)
  }

  const [uploadVideoLoading, setUploadVideoLoading] = useState(false)

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!authHeader || !e.target.files?.[0]) return
    setUploadVideoLoading(true)
    const res = await uploadVideo(e.target.files[0], authHeader)
    if (res.success && res.url) {
      setProjForm(prev => ({ ...prev, videoUrl: res.url! }))
    } else {
      alert(`Video upload failed: ${res.error}`)
    }
    setUploadVideoLoading(false)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const token = btoa(`${loginForm.user}:${loginForm.pass}`)
    setAuthHeader(`Basic ${token}`)
  }

  // Load Contacts
  useEffect(() => {
    if (authHeader && activeTab === 'messages') {
      getContacts(authHeader)
        .then(data => setContacts(data))
        .catch(() => setAuthHeader(null)) // Reset on 401
    }
  }, [authHeader, activeTab])

  // Load Projects List
  const loadProjects = async () => {
    try {
      const data = await getProjects()
      setProjectsList(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (authHeader && activeTab === 'projects') {
      loadProjects()
    }
  }, [authHeader, activeTab])

  const openCreateForm = () => {
    setEditingSlug(null)
    setProjForm(EMPTY_FORM)
    setActiveTab('form')
  }

  const handleEdit = async (slug: string) => {
    try {
      const p = await getProjectBySlug(slug)
      if (p) {
        setEditingSlug(slug)
        setProjForm({
          slug: p.slug,
          title: p.title,
          summary: p.summary || '',
          industry: (p as any).industry || '',
          role: (p as any).role || '',
          problem: p.problem || '',
          constraints: p.constraints || '',
          approach: p.approach || '',
          result: p.result || '',
          tools: p.tools?.join(', ') || '',
          tags: p.tags?.join(', ') || '',
          featured: p.featured || false,
          imageUrl: p.imageUrl || '',
          is3d: p.is3d || false,
          modelUrl: p.modelUrl || '',
          backgroundImageUrl: p.backgroundImageUrl || '',
          videoUrl: p.videoUrl || ''
        })
        setActiveTab('form')
      }
    } catch (e) {
      alert("Failed to load project details.")
    }
  }

  const handleDelete = async (slug: string) => {
    if (!authHeader) return
    if (!window.confirm("Are you sure you want to delete this project?")) return
    
    const res = await deleteProject(slug, authHeader)
    if (res.success) {
      await loadProjects()
    } else {
      alert(`Error deleting: ${res.error}`)
    }
  }

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!authHeader) return
    setProjLoading(true)

    const payload = {
      ...projForm,
      tools: projForm.tools.split(',').map(t => t.trim()).filter(Boolean),
      tags: projForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      is3d: projForm.is3d,
      modelUrl: projForm.modelUrl,
      backgroundImageUrl: projForm.backgroundImageUrl,
      videoUrl: projForm.videoUrl
    }

    const res = editingSlug 
      ? await updateProject(editingSlug, payload, authHeader)
      : await createProject(payload, authHeader)

    if (res.success) {
      alert(editingSlug ? 'Project updated!' : 'Project created!')
      setActiveTab('projects') // Go back to list
      setProjForm(EMPTY_FORM)
      setEditingSlug(null)
    } else {
      alert(`Error: ${res.error}`)
    }
    setProjLoading(false)
  }

  if (!authHeader) {
    return (
      <div className="pt-32 pb-24 max-w-sm mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="text" 
            placeholder="Username" 
            className="w-full border p-2 bg-transparent focus:border-foreground outline-none"
            value={loginForm.user} onChange={e => setLoginForm({...loginForm, user: e.target.value})}
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full border p-2 bg-transparent focus:border-foreground outline-none"
            value={loginForm.pass} onChange={e => setLoginForm({...loginForm, pass: e.target.value})}
          />
          <button type="submit" className="w-full bg-foreground text-background py-3 font-semibold">Login</button>
        </form>
      </div>
    )
  }

  return (
    <div className="pt-24 lg:pt-32 pb-24 max-w-5xl mx-auto px-4">
      <div className="flex justify-between items-end mb-8 border-b pb-4">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <button onClick={() => setAuthHeader(null)} className="text-sm underline underline-offset-4">Logout</button>
      </div>

      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 text-sm font-semibold border ${activeTab === 'projects' ? 'bg-foreground text-background' : 'hover:border-foreground'}`}
          >
            Projects
          </button>
          <button 
            onClick={() => setActiveTab('messages')}
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
        <div className="overflow-x-auto border">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted text-muted-foreground uppercase text-xs">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4 w-full">Message</th>
              </tr>
            </thead>
            <tbody>
              {contacts.length === 0 && (
                <tr><td colSpan={4} className="p-4 text-center">No messages yet.</td></tr>
              )}
              {contacts.map(c => (
                <tr key={c.id} className="border-t">
                  <td className="p-4">{new Date(c.created_at).toLocaleDateString()}</td>
                  <td className="p-4 font-medium">{c.name}</td>
                  <td className="p-4">{c.email}</td>
                  <td className="p-4 whitespace-normal min-w-[300px]">{c.message}</td>
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
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projectsList.length === 0 && (
                <tr><td colSpan={3} className="p-4 text-center">No projects found.</td></tr>
              )}
              {projectsList.map(p => (
                <tr key={p.id} className="border-t">
                  <td className="p-4 font-medium">{p.title}</td>
                  <td className="p-4">{p.category}</td>
                  <td className="p-4 flex gap-4">
                    <button onClick={() => handleEdit(p.slug)} className="text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(p.slug)} className="text-red-600 hover:underline">Delete</button>
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
            <button onClick={() => setActiveTab('projects')} className="text-sm underline">Cancel</button>
          </div>
          
          <form onSubmit={handleProjectSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/20 p-6 border">
            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase font-bold tracking-widest text-muted-foreground block mb-1">Title *</label>
                <input required type="text" className="w-full border p-2 bg-background outline-none" value={projForm.title} onChange={e => setProjForm({...projForm, title: e.target.value})} />
              </div>
              <div>
                <label className="text-xs uppercase font-bold tracking-widest text-muted-foreground block mb-1">Slug (URL-friendly) *</label>
                <input required type="text" className="w-full border p-2 bg-background outline-none" value={projForm.slug} onChange={e => setProjForm({...projForm, slug: e.target.value})} />
              </div>
              <div>
                <label className="text-xs uppercase font-bold tracking-widest text-muted-foreground block mb-1">Industry</label>
                <input type="text" className="w-full border p-2 bg-background outline-none" value={projForm.industry} onChange={e => setProjForm({...projForm, industry: e.target.value})} />
              </div>
              <div>
                <label className="text-xs uppercase font-bold tracking-widest text-muted-foreground block mb-1">Role</label>
                <input type="text" className="w-full border p-2 bg-background outline-none" value={projForm.role} onChange={e => setProjForm({...projForm, role: e.target.value})} />
              </div>
              <div>
                <label className="text-xs uppercase font-bold tracking-widest text-muted-foreground block mb-1">Project Image</label>
                <input type="file" accept="image/*" className="w-full border p-2 bg-background outline-none text-sm" onChange={(e) => handleImageUpload(e, false)} disabled={uploadLoading} />
                {uploadLoading && <p className="text-xs text-muted-foreground mt-1">Uploading...</p>}
                {projForm.imageUrl && (
                  <div className="mt-2">
                    <img src={projForm.imageUrl} alt="Preview" className="w-full h-32 object-cover border" />
                    <p className="text-xs text-muted-foreground mt-1 truncate">{projForm.imageUrl}</p>
                  </div>
                )}
              </div>
              <div>
                <label className="text-xs uppercase font-bold tracking-widest text-muted-foreground block mb-1">Image Background (For Hero/Featured Sections)</label>
                <input type="file" accept="image/*" className="w-full border p-2 bg-background outline-none text-sm" onChange={(e) => handleImageUpload(e, true)} disabled={uploadBgLoading} />
                {uploadBgLoading && <p className="text-xs text-muted-foreground mt-1">Uploading background...</p>}
                {projForm.backgroundImageUrl && (
                  <div className="mt-2">
                    <p className="text-xs text-green-600 mt-1 truncate">✓ Background set: {projForm.backgroundImageUrl}</p>
                  </div>
                )}
              </div>
              <div>
                <label className="text-xs uppercase font-bold tracking-widest text-muted-foreground block mb-1">Project Video (.mp4, .webm, .mov)</label>
                <input type="file" accept=".mp4,.webm,.mov" className="w-full border p-2 bg-background outline-none text-sm" onChange={handleVideoUpload} disabled={uploadVideoLoading} />
                {uploadVideoLoading && <p className="text-xs text-muted-foreground mt-1">Uploading video...</p>}
                {projForm.videoUrl && (
                  <div className="mt-2">
                    <video src={projForm.videoUrl} className="w-full h-32 object-cover border" muted />
                    <p className="text-xs text-green-600 mt-1 truncate">✓ Video set: {projForm.videoUrl}</p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="featured" checked={projForm.featured} onChange={e => setProjForm({...projForm, featured: e.target.checked})} />
                <label htmlFor="featured" className="text-sm font-semibold">Featured Project (Hero Display)</label>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="is3d" checked={projForm.is3d} onChange={e => setProjForm({...projForm, is3d: e.target.checked})} />
                <label htmlFor="is3d" className="text-sm font-semibold">3D Project</label>
              </div>
              {projForm.is3d && (
                <div className="pt-2">
                  <label className="text-xs uppercase font-bold tracking-widest text-muted-foreground block mb-1">Upload 3D Model (.glb / .gltf)</label>
                  <input type="file" accept=".glb,.gltf" className="w-full border p-2 bg-background outline-none text-sm" onChange={handle3dUpload} disabled={upload3dLoading} />
                  {upload3dLoading && <p className="text-xs text-muted-foreground mt-1">Uploading 3D model...</p>}
                  {projForm.modelUrl && (
                    <p className="text-xs text-green-600 mt-1">✓ Model: {projForm.modelUrl}</p>
                  )}
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase font-bold tracking-widest text-muted-foreground block mb-1">Summary</label>
                <textarea rows={2} className="w-full border p-2 bg-background outline-none" value={projForm.summary} onChange={e => setProjForm({...projForm, summary: e.target.value})} />
              </div>
              <div>
                <label className="text-xs uppercase font-bold tracking-widest text-muted-foreground block mb-1">Problem Statement</label>
                <textarea rows={2} className="w-full border p-2 bg-background outline-none" value={projForm.problem} onChange={e => setProjForm({...projForm, problem: e.target.value})} />
              </div>
              <div>
                <label className="text-xs uppercase font-bold tracking-widest text-muted-foreground block mb-1">Approach & Result</label>
                <textarea rows={2} className="w-full border p-2 bg-background outline-none" placeholder="Approach..." value={projForm.approach} onChange={e => setProjForm({...projForm, approach: e.target.value})} />
                <textarea rows={2} className="w-full border p-2 bg-background outline-none mt-2" placeholder="Result..." value={projForm.result} onChange={e => setProjForm({...projForm, result: e.target.value})} />
              </div>
              <div>
                <label className="text-xs uppercase font-bold tracking-widest text-muted-foreground block mb-1">Tools (comma separated)</label>
                <input type="text" placeholder="Solidworks, Blender" className="w-full border p-2 bg-background outline-none" value={projForm.tools} onChange={e => setProjForm({...projForm, tools: e.target.value})} />
              </div>
              <div>
                <label className="text-xs uppercase font-bold tracking-widest text-muted-foreground block mb-1">Tags (comma separated)</label>
                <input type="text" placeholder="Industrial Design, 3D Modeling" className="w-full border p-2 bg-background outline-none" value={projForm.tags} onChange={e => setProjForm({...projForm, tags: e.target.value})} />
              </div>
            </div>
            <div className="md:col-span-2 mt-4">
              <button disabled={projLoading} type="submit" className="bg-foreground text-background px-8 py-3 font-semibold uppercase tracking-widest text-sm w-full md:w-auto disabled:opacity-50">
                {projLoading ? "Saving..." : (editingSlug ? "Update Project" : "Create Project")}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
