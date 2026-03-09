import { useEffect, useState, Suspense, lazy } from "react"
import { useParams, Link } from "react-router-dom"
import { getProjectBySlug, type Project } from "../lib/api"
import { ArrowLeft } from "lucide-react"
import MediaGallery from "../components/MediaGallery"

const ModelViewer = lazy(() => import('../components/ModelViewer'))

export default function ProjectDetail() {
  const { slug } = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      getProjectBySlug(slug).then(data => {
        setProject(data)
        setLoading(false)
        if (data) {
          document.title = `${data.title} | Safain A.`
        }
      })
    }
  }, [slug])

  if (loading) {
    return (
      <div className="pt-24 lg:pt-32 pb-24 max-w-4xl mx-auto animate-pulse">
        <div className="h-12 bg-muted w-1/2 mb-6"></div>
        <div className="aspect-video bg-muted mb-12"></div>
        <div className="space-y-4">
          <div className="h-6 bg-muted w-3/4"></div>
          <div className="h-6 bg-muted w-full"></div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="pt-24 lg:pt-32 pb-24 text-center max-w-xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
        <p className="text-muted-foreground mb-8">The project you are looking for does not exist or has been removed.</p>
        <Link to="/projects" className="underline underline-offset-4 font-semibold">
          Return to projects
        </Link>
      </div>
    )
  }

  return (
    <div className="pt-24 lg:pt-32 pb-24 max-w-5xl mx-auto">
      <Link to="/projects" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-8 group transition-colors">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to projects
      </Link>

      {/* {project.backgroundImageUrl && (
        <div 
          className="w-screen relative left-1/2 -translate-x-1/2 h-[50vh] md:h-[60vh] lg:h-[70vh] bg-cover bg-center mb-16" 
          style={{ backgroundImage: `url(${project.backgroundImageUrl})` }} 
        />
      )} */}

      <div className="mb-12">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4">{project.title}</h1>
        <div className="flex flex-wrap gap-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
          <span>{project.category}</span>
          <span className="hidden sm:inline">&bull;</span>
          <div className="flex gap-3">
            {project.tags.map(tag => <span key={tag}>{tag}</span>)}
          </div>
        </div>
      </div>

      {project.is3d && project.modelUrl ? (
        <div className="mb-16">
          <Suspense fallback={
            <div className="aspect-video bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">Loading 3D Model...</p>
            </div>
          }>
            <ModelViewer modelUrl={project.modelUrl} />
          </Suspense>
        </div>
      ) : project.imageUrl ? (
        <div className="aspect-video bg-muted mb-16 overflow-hidden">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : null}

      {project.videoUrl && (
        <div className="mb-16">
          <video 
            src={project.videoUrl}
            controls
            autoPlay
            loop
            muted
            playsInline
            className="w-full aspect-video bg-black object-contain"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24 relative">
        <div className="md:col-span-8 space-y-16 prose prose-neutral prose-lg">
          <section>
            <h2 className="text-3xl font-bold tracking-tight mb-6">Problem</h2>
            <p className="text-muted-foreground leading-relaxed">{project.problem || project.summary}</p>
          </section>

          <section>
            <h2 className="text-3xl font-bold tracking-tight mb-6">Approach</h2>
            <p className="text-muted-foreground leading-relaxed">{project.approach || "Detailed approach to be added."}</p>
          </section>

          <section>
            <h2 className="text-3xl font-bold tracking-tight mb-6">Result</h2>
            <p className="text-muted-foreground leading-relaxed">{project.result || "Outcome to be documented."}</p>
          </section>
        </div>

        <div className="md:col-span-4 space-y-12 shrink-0 md:sticky top-24 self-start">
          {project.industry && (
            <section>
              <h3 className="text-sm tracking-widest uppercase font-bold text-muted-foreground mb-2">Industry</h3>
              <p className="text-lg font-medium">{project.industry}</p>
            </section>
          )}

          {project.role && (
            <section>
              <h3 className="text-sm tracking-widest uppercase font-bold text-muted-foreground mb-2">Role</h3>
              <p className="text-lg font-medium">{project.role}</p>
            </section>
          )}

          <section className="bg-muted/50 p-6">
            <h3 className="text-sm tracking-widest uppercase font-bold text-muted-foreground mb-4">Tools Used</h3>
            <ul className="space-y-2 font-medium">
              {project.tools.map(tool => (
                <li key={tool} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-foreground rounded-full"></div>
                  {tool}
                </li>
              ))}
            </ul>
          </section>

          {project.constraints && (
            <section className="p-6 border border-border">
              <h3 className="text-sm tracking-widest uppercase font-bold text-muted-foreground mb-4">Constraints</h3>
              <p className="text-sm leading-relaxed font-medium">
                {project.constraints}
              </p>
            </section>
          )}
        </div>
      </div>

      {project.media && <MediaGallery media={project.media} />}
    </div>
  )
}
