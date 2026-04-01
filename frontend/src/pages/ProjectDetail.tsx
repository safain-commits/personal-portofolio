import { useEffect, useState, Suspense, lazy } from "react"
import { useParams, Link } from "react-router-dom"
import { getProjectBySlug, type Project } from "../lib/api"
import SEO from "../components/SEO"
import { ArrowLeft } from "lucide-react"
import MediaGallery from "../components/MediaGallery"
import MarkdownContent from "../components/MarkdownContent"
import { SITE_URL, toAbsoluteUrl } from "../lib/seo"
import projectSeoOverrides from "../content/project-seo-overrides.json"
import { stripMarkdown, truncateText } from "../lib/text"

const ModelViewer = lazy(() => import('../components/ModelViewer'))

type ProjectSeoOverride = {
  seoTitle?: string
  seoDescription?: string
  focusKeywords?: string[]
  intro?: string
  heroAlt?: string
}

const typedProjectSeoOverrides = projectSeoOverrides as Record<string, ProjectSeoOverride>

const uniqueKeywordPhrases = (values: Array<string | null | undefined>) => {
  const seen = new Set<string>()
  return values
    .map(value => value?.trim())
    .filter((value): value is string => Boolean(value))
    .filter(value => {
      const key = value.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
}

const buildDisciplineText = (labels: string[]) => {
  if (labels.length === 0) return 'Design'
  if (labels.length === 1) return labels[0]
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`
  return `${labels.slice(0, -1).join(', ')}, and ${labels.at(-1)}`
}

export default function ProjectDetail() {
  const { slug } = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      getProjectBySlug(slug).then(data => {
        setProject(data)
        setLoading(false)
      })
    }
  }, [slug])

  if (loading) {
    return (
      <div className="pt-24 lg:pt-32 pb-24 max-w-6xl mx-auto px-4 animate-pulse">
        <SEO
          title="Project"
          description="Loading project details from the portfolio."
          path={slug ? `/projects/${slug}` : '/projects'}
        />
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
        <SEO
          title="Project Not Found"
          description="The requested portfolio project could not be found."
          path={slug ? `/projects/${slug}` : '/projects'}
          noIndex
        />
        <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
        <p className="text-muted-foreground mb-8">The project you are looking for does not exist or has been removed.</p>
        <Link to="/projects" className="underline underline-offset-4 font-semibold">
          Return to projects
        </Link>
      </div>
    )
  }

  const heroImage = project.heroImageUrl || project.imageUrl || project.backgroundImageUrl
  const projectSeoOverride = typedProjectSeoOverrides[project.slug]
  const cmsFocusKeywords = project.focusKeywords || []
  const headerLabels = uniqueKeywordPhrases([project.category, ...project.tags])
  const disciplineText = buildDisciplineText(headerLabels)
  const industryText = project.industry ? project.industry.split('/')[0].trim() : ''
  const projectKeywordPhrases = uniqueKeywordPhrases([
    ...cmsFocusKeywords,
    ...(projectSeoOverride?.focusKeywords || []),
    `${project.title} case study`,
    project.category ? `${project.category} case study` : null,
    project.industry ? `${project.industry} design project` : null,
    project.industry ? `${project.industry} case study` : null,
    'Mechanical drafting',
    'Technical drawings',
    '3D CAD modeling',
    'Engineering support',
    'Technical documentation',
    ...project.tags,
    ...project.tools.map(tool => `${tool} project`),
  ])
  const projectCaseStudyTitle = project.seoTitle || projectSeoOverride?.seoTitle || `${project.title} – Technical Project Overview`
  const leadOutcomeText = stripMarkdown(project.subtitle || project.summary || project.problem || '')
  const projectIntro = project.seoIntro || projectSeoOverride?.intro || `${project.title} is a ${disciplineText} project${industryText ? ` for ${industryText.toLowerCase()} applications` : ''} focused on mechanical drafting, technical documentation, and practical engineering coordination.`
  const seoDescription = project.seoDescription || projectSeoOverride?.seoDescription || truncateText(
    `${project.title} is a ${disciplineText} project${industryText ? ` for ${industryText.toLowerCase()} applications` : ''} focused on mechanical drafting, technical documentation, and ${leadOutcomeText.toLowerCase()}`,
    160
  )
  const canonicalPath = `/projects/${project.slug}`
  const projectStructuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: project.title,
      headline: project.title,
      description: seoDescription,
      url: `${SITE_URL}${canonicalPath}`,
      image: heroImage ? [toAbsoluteUrl(heroImage)] : undefined,
      author: {
        "@type": "Person",
        name: "Achmad Safain",
        url: SITE_URL
      },
      creator: {
        "@type": "Person",
        name: "Achmad Safain",
        url: SITE_URL
      },
      genre: project.category,
      keywords: projectKeywordPhrases.join(', '),
      about: project.industry || undefined,
      inLanguage: 'en'
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: 'Home',
          item: SITE_URL
        },
        {
          "@type": "ListItem",
          position: 2,
          name: 'Projects',
          item: `${SITE_URL}/projects`
        },
        {
          "@type": "ListItem",
          position: 3,
          name: project.title,
          item: `${SITE_URL}${canonicalPath}`
        }
      ]
    }
  ]

  return (
    <div className="pt-24 lg:pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 lg:space-y-20">
      <SEO
        title={projectCaseStudyTitle}
        description={seoDescription}
        path={canonicalPath}
        image={heroImage}
        type="article"
        structuredData={projectStructuredData}
      />

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
            <p className="max-w-4xl text-base sm:text-lg text-muted-foreground leading-relaxed">
              {projectIntro}
            </p>
          </div>
          {project.summary && (
            <div className="max-w-4xl border-l-2 border-foreground/20 pl-5">
              <MarkdownContent content={project.summary} className="text-muted-foreground prose-p:text-lg prose-p:leading-relaxed" />
            </div>
          )}

          {heroImage && (
            <div className="space-y-4">
              <div className="aspect-[16/9] overflow-hidden border border-border/60 bg-muted rounded-sm">
                <img src={heroImage} alt={project.heroAlt || projectSeoOverride?.heroAlt || `${project.title} ${headerLabels[0] || "design"} case study preview with CAD and engineering details`} className="w-full h-full object-cover" />
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
              <h2 className="text-3xl font-bold tracking-tight mb-3">Project Video</h2>
              <p className="text-muted-foreground leading-relaxed">A motion-based overview of the project scope, technical intent, and resulting design solution.</p>
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
              <h2 className="text-3xl font-bold tracking-tight mb-3">3D CAD Model Viewer</h2>
              <p className="text-muted-foreground leading-relaxed">Interact with the 3D CAD model to review configuration, spatial relationships, and technical detail from multiple angles.</p>
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
            <h2 className="text-2xl font-bold tracking-tight mb-5">Project Context</h2>
            <MarkdownContent content={project.problem || project.summary} className="text-muted-foreground" />
          </article>
          <article className="border border-border/70 p-6 lg:p-8 bg-background/60 lg:col-span-1">
            <h2 className="text-2xl font-bold tracking-tight mb-5">Drafting & Technical Approach</h2>
            <MarkdownContent content={project.approach} className="text-muted-foreground" fallback="Detailed approach to be added." />
          </article>
          <article className="border border-border/70 p-6 lg:p-8 bg-background/60 lg:col-span-1">
            <h2 className="text-2xl font-bold tracking-tight mb-5">Project Outcome</h2>
            <MarkdownContent content={project.result} className="text-muted-foreground" fallback="Outcome to be documented." />
          </article>
        </div>
      </section>

      {project.drawingImages && project.drawingImages.length > 0 && (
        <MediaGallery
          media={project.drawingImages}
          title="Technical Drawings"
          description="Technical drawings, drafting outputs, and documentation visuals related to the project."
          variant="drawing"
        />
      )}

      {project.galleryImages && project.galleryImages.length > 0 && (
        <MediaGallery
          media={project.galleryImages}
          title="Project Gallery"
          description="Additional imagery showing supporting views, details, and presentation material related to the project."
          variant="gallery"
        />
      )}
    </div>
  )
}
