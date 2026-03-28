import { useEffect, useState, Suspense, lazy } from "react"
import { useParams, Link } from "react-router-dom"
import { getProjectBySlug, type Project } from "../lib/api"
import { ArrowLeft } from "lucide-react"
import MediaGallery from "../components/MediaGallery"
import MarkdownContent from "../components/MarkdownContent"

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
      <div className="pt-24 lg:pt-32 pb-24 max-w-6xl mx-auto px-4 animate-pulse">
        <div className="h-12 bg-muted w-1/2 mb-6"></div>
        <div className="aspect-[16/9] bg-muted mb-12"></div>
        <div className="grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
          <div className="space-y-4">
            <div className="h-6 bg-muted w-3/4"></div>
            <div className="h-6 bg-muted w-full"></div>
            <div className="h-6 bg-muted w-5/6"></div>
          </div>
          <div className="h-48 bg-muted"></div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="pt-24 lg:pt-32 pb-24 text-center max-w-xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
        <p className="text-muted-foreground mb-8">The project you are looking for does not exist or has been removed.</p>
        <Link to="/projects" className="underline underline-offset-4 font-semibold">
          Return to projects
        </Link>
      </div>
    )
  }

  const heroImage = project.heroImageUrl || project.imageUrl || project.backgroundImageUrl
  const headerLabels = [project.category, ...project.tags].filter(Boolean).filter((label, index, arr) => arr.findIndex(item => item?.toLowerCase() === label?.toLowerCase()) === index)

  return (
    <div className="pt-24 lg:pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 lg:space-y-20">
      <Link to="/projects" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground group transition-colors">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to projects
      </Link>

      <header className="grid gap-12 lg:grid-cols-[1.4fr_0.8fr] items-start">
        <div className="space-y-8">
          <div className="flex flex-wrap gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            {headerLabels.map(label => <span key={label}>{label}</span>)}
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tighter leading-[0.95]">{project.title}</h1>
            {project.subtitle && (
              <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed max-w-4xl">
                {project.subtitle}
              </p>
            )}
          </div>
          {project.summary && (
            <div className="max-w-4xl border-l-2 border-foreground/20 pl-5">
              <MarkdownContent content={project.summary} className="text-muted-foreground prose-p:text-lg prose-p:leading-relaxed" />
            </div>
          )}

          {heroImage && (
            <div className="space-y-4">
              <div className="aspect-[16/9] overflow-hidden border border-border/60 bg-muted rounded-sm">
                <img src={heroImage} alt={project.title} className="w-full h-full object-cover" />
              </div>
            </div>
          )}
        </div>

        <aside className="border border-border/70 bg-muted/20 p-6 space-y-6 lg:sticky lg:top-24 self-start">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            {project.industry && (
              <section>
                <h2 className="text-xs tracking-[0.24em] uppercase font-bold text-muted-foreground mb-2">Industry</h2>
                <p className="text-lg font-medium leading-snug">{project.industry}</p>
              </section>
            )}
            {project.role && (
              <section>
                <h2 className="text-xs tracking-[0.24em] uppercase font-bold text-muted-foreground mb-2">Role</h2>
                <p className="text-lg font-medium leading-snug">{project.role}</p>
              </section>
            )}
            {project.tools.length > 0 && (
              <section className="sm:col-span-2 lg:col-span-1">
                <h2 className="text-xs tracking-[0.24em] uppercase font-bold text-muted-foreground mb-3">Tools Used</h2>
                <ul className="flex flex-wrap gap-2">
                  {project.tools.map(tool => (
                    <li key={tool} className="px-3 py-1.5 text-sm border border-border bg-background/80">
                      {tool}
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {project.constraints && (
              <section className="sm:col-span-2 lg:col-span-1">
                <h2 className="text-xs tracking-[0.24em] uppercase font-bold text-muted-foreground mb-2">Constraints</h2>
                <MarkdownContent content={project.constraints} className="text-sm text-muted-foreground prose-p:my-2 prose-ul:my-2 prose-ol:my-2" />
              </section>
            )}
          </div>
        </aside>
      </header>

      <div className="space-y-12">
        {project.videoUrl && (
          <section className="space-y-4">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tight mb-3">Showcase Video</h2>
              <p className="text-muted-foreground leading-relaxed">A motion-driven overview to quickly understand the project outcome and product behavior.</p>
            </div>
            <video
              src={project.videoUrl}
              controls
              controlsList="nodownload noremoteplayback"
              disablePictureInPicture
              disableRemotePlayback
              playsInline
              onContextMenu={(event) => event.preventDefault()}
              className="w-full aspect-[16/9] border border-border/60 bg-black object-contain rounded-sm"
            />
          </section>
        )}

        {project.is3d && project.modelUrl && (
          <section className="space-y-4">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tight mb-3">3D Model Viewer</h2>
              <p className="text-muted-foreground leading-relaxed">Interact with the model directly to inspect form, volume, and detail from multiple angles.</p>
            </div>
            <Suspense fallback={
              <div className="aspect-[16/9] bg-muted flex items-center justify-center border border-border/60 rounded-sm">
                <p className="text-muted-foreground">Loading 3D model...</p>
              </div>
            }>
              <ModelViewer
                modelUrl={project.modelUrl}
                viewerPreset={project.viewerPreset}
                viewerRotationPreset={project.viewerRotationPreset}
                viewerAutoRotate={project.viewerAutoRotate}
                viewerCameraDistance={project.viewerCameraDistance}
                viewerCameraHeight={project.viewerCameraHeight}
                viewerOffsetX={project.viewerOffsetX}
                viewerOffsetY={project.viewerOffsetY}
              />
            </Suspense>
          </section>
        )}
      </div>

      <section className="grid gap-8 lg:gap-10">
        <div className="grid gap-8 lg:grid-cols-3">
          <article className="border border-border/70 p-6 lg:p-8 bg-background/60 lg:col-span-1">
            <h2 className="text-2xl font-bold tracking-tight mb-5">Problem</h2>
            <MarkdownContent content={project.problem || project.summary} className="text-muted-foreground" />
          </article>
          <article className="border border-border/70 p-6 lg:p-8 bg-background/60 lg:col-span-1">
            <h2 className="text-2xl font-bold tracking-tight mb-5">Approach</h2>
            <MarkdownContent content={project.approach} className="text-muted-foreground" fallback="Detailed approach to be added." />
          </article>
          <article className="border border-border/70 p-6 lg:p-8 bg-background/60 lg:col-span-1">
            <h2 className="text-2xl font-bold tracking-tight mb-5">Result</h2>
            <MarkdownContent content={project.result} className="text-muted-foreground" fallback="Outcome to be documented." />
          </article>
        </div>
      </section>

      {project.drawingImages && project.drawingImages.length > 0 && (
        <MediaGallery
          media={project.drawingImages}
          title="Technical Drawings"
          description="Technical views, drafting outputs, and engineering-oriented visuals related to the project."
          variant="drawing"
        />
      )}

      {project.galleryImages && project.galleryImages.length > 0 && (
        <MediaGallery
          media={project.galleryImages}
          title="Project Gallery"
          description="Additional imagery showcasing the project from supporting angles, details, and presentation views."
          variant="gallery"
        />
      )}
    </div>
  )
}
