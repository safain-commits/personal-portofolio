import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import ProjectCard from "../components/ProjectCard"
import SkillProfile from "../components/SkillProfile"
import { getProjects, type Project } from "../lib/api"
import { useTitle } from "../hooks/useTitle"

export default function Home() {
  useTitle("Portfolio")
  const [projects, setProjects] = useState<Project[]>([])
  const [featuredProject, setFeaturedProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProjects().then(data => {
      const featured = data.find(p => p.featured)
      setFeaturedProject(featured || null)
      setProjects(data.filter(p => p.id !== featured?.id).slice(0, 4))
      setLoading(false)
    })
  }, [])

  return (
    <div className="space-y-32 pb-32 overflow-x-hidden">
      {/* Hero Section */}
      <section className="mb-0 min-h-screen pt-0 lg:pt-16 md:pt-8 sm:pt-4 pb-16 w-full flex flex-col items-center justify-center text-foreground">

        {/* Typographic Header — full-width justified layout */}
        <div className="w-full max-w-6xl mx-auto mt-8 md:mt-16 z-10 relative px-5 sm:px-5 lg:px-0">

          {/* Top row: 20/26 + Portfolio */}
          <div className="flex items-start justify-start">
            {/* The 20 26 block — left-aligned */}
            <div className="flex flex-col text-4xl sm:text-6xl md:text-[5.5rem] lg:text-[6.5rem] font-black leading-[0.8] tracking-tighter mr-1 sm:mr-2 md:mr-4 pt-0">
              <span>20</span>
              <span>26</span>
            </div>

            {/* The Portfolio block */}
            <div className='hero-top text-justify'>
              <h1 className="text-7xl sm:text-[8rem] md:text-[10.5rem] lg:text-[13.5rem] font-black leading-[0.8] tracking-tighter">
                Portfolio
              </h1>
              {/* Name below — right-aligned to the full container edge */}
              <h2 className="text-4xl sm:text-6xl md:text-[5.5rem] lg:text-[6.2rem] font-black tracking-tighter leading-[0.85] -mt-0 sm:-mt-0.5 lg:-mt-1">
                Achmad Safain
              </h2>
            </div>
          </div>
        </div>

        {/* Illustration & Bottom Text Area */}
        <div className="mt-3 md:mt-10 w-full max-w-6xl relative px-6 sm:px-6 lg:px-24 flex flex-col items-center">
          {/* The illustration */}
          <div className="relative w-full flex justify-center items-center">
            <img
              src="/img/hero-illustration.png"
              alt="Hero Illustration"
              className="w-full max-w-4xl object-contain theme-invert"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="300" viewBox="0 0 800 300"><rect fill="transparent" width="800" height="300"/><text fill="%23000000" font-family="sans-serif" font-size="20" font-weight="bold" x="50%" y="50%" text-anchor="middle">Simpan gambar ilustrasi hero Anda di frontend/public/img/hero-illustration.png</text></svg>';
              }}
            />

            {/* Floating Text — justified left & right */}
            <div className="absolute bottom-0 md:bottom-8 left-0 md:left-8 lg:left-16 text-l sm:text-2xl md:text-3xl font-black leading-tight tracking-tighter text-left">
              Industrial<br />Design
            </div>
            <div className="absolute bottom-0 md:bottom-8 right-0 md:right-8 lg:right-16 text-l sm:text-2xl md:text-3xl font-black leading-tight tracking-tighter text-right">
              Design &<br />Engineering
            </div>
          </div>
        </div>
      </section>

      {/* Skills Snippet */}
      <section className="mb-16 sm:mb-16 md:mb-20 lg:mb-28 mt-0 sm:mt-0 lg:mt-0 w-screen relative left-1/2 -translate-x-1/2 bg-muted">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 sm:py-24 lg:py-48 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.618fr] gap-16 lg:gap-24">

            {/* Left Column — Expertise & Skills */}
            <div className="flex flex-col justify-between h-full space-y-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 font-joystix">Expertise</h2>
                <p className="text-muted-foreground leading-relaxed max-w-sm">
                  A comprehensive toolkit spanning 3D CAD modeling, rendering, and traditional 2D drafting.
                </p>
              </div>
              <div className="space-y-2 max-w-sm">
                <SkillProfile name="Autodesk Inventor" level={5} />
                <SkillProfile name="Autodesk AutoCAD" level={5} />
                <SkillProfile name="Blender" level={4} />
                <SkillProfile name="Solidworks" level={4} />
                <SkillProfile name="DaVinci Resolve" level={4} />
                <SkillProfile name="Ilustrator" level={4} />
              </div>
              <Link to="/about" className="inline-block mt-8 font-semibold hover:underline underline-offset-4">
                More about my capabilities &rarr;
              </Link>
            </div>

            {/* Right Column — Education & Languages */}
            <div className="flex flex-col justify-between h-full space-y-12">
              {/* Education */}
              <section>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-6 mt-1 lg:mt-2">Education</h3>
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-2 sm:gap-4">
                    <div>
                      <h4 className="font-bold text-sm">Bachelor in Data Science</h4>
                      <p className="text-muted-foreground text-sm mt-0.5">Universitas Terbuka, Surabaya</p>
                    </div>
                    <span className="text-sm text-muted-foreground whitespace-nowrap">25/26 - Today</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-2 sm:gap-4">
                    <div>
                      <h4 className="font-bold text-sm">Interior Design</h4>
                      <p className="text-muted-foreground text-sm mt-0.5">Indonesian Institute in the Arts, Surakarta</p>
                    </div>
                    <span className="text-sm text-muted-foreground whitespace-nowrap">14/15 - 19/20</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-2 sm:gap-4">
                    <div>
                      <h4 className="font-bold text-sm">Bachelor in Informatics Engineering</h4>
                      <p className="text-muted-foreground text-sm mt-0.5">UPN Veteran, Jawa Timur</p>
                    </div>
                    <span className="text-sm text-muted-foreground whitespace-nowrap">11/12 - 14/15</span>
                  </div>
                </div>
              </section>

              {/* Languages */}
              <section>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">Languages</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-sm">Indonesian</h4>
                    <p className="text-muted-foreground text-sm">Native language</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">English</h4>
                    <p className="text-muted-foreground text-sm">B1 English level</p>
                  </div>
                </div>
              </section>
            </div>

          </div>
        </div>
      </section>

      {/* Selected Projects */}
      <section className="pt-0 sm:pt-0 md:pt-8 lg:pt-16 pb-16 sm:pb-16 md:pb-20 lg:pb-28 w-screen relative left-1/2 -translate-x-1/2">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12 border-b border-border pb-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Works</h2>
            <Link to="/projects" className="font-semibold hover:underline underline-offset-4 hidden sm:block">
              See all projects &rarr;
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="aspect-square bg-muted"></div>
                  <div className="h-6 bg-muted w-3/4"></div>
                  <div className="h-4 bg-muted w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {projects.map(project => (
                <ProjectCard
                  key={project.id}
                  title={project.title}
                  slug={project.slug}
                  category={project.category}
                  imageUrl={project.imageUrl}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Project */}
      {featuredProject && (
        <section className="mt-0 sm:mt-0 lg:mt-0 pt-0 sm:pt-0 lg:pt-0">
          <div className="w-screen relative left-1/2 -translate-x-1/2">
            <Link to={`/projects/${featuredProject.slug}`} className="group block">
              {/* Desktop layout (lg+): image behind text like a background */}
              {/* Mobile layout: image on top, text below */}
              <div className="relative">
                {/* Image — full width, determines section height */}
                {(featuredProject.backgroundImageUrl || featuredProject.imageUrl) ? (
                  <>
                    {/* Desktop: image as flow element, text overlaid */}
                    <div className="hidden lg:block">
                      <img
                        src={featuredProject.backgroundImageUrl || featuredProject.imageUrl!}
                        alt={featuredProject.title}
                        className="w-full h-auto block group-hover:scale-[1.02] transition-transform duration-700"
                      />
                      {/* Text overlay on desktop */}
                      <div className="absolute inset-0 z-10 flex items-center">
                        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                          <div className="flex flex-col justify-center items-end text-right ml-auto max-w-[50%]">
                            <span className="text-xs uppercase tracking-[0.3em] font-semibold mb-4 text-black">
                              Featured Project
                            </span>
                            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-tight leading-[0.9] mb-6 text-black font-joystix">
                              {featuredProject.title}
                            </h2>
                            <p className="leading-relaxed text-sm md:text-lg max-w-2xl text-black">
                              {featuredProject.summary}
                            </p>
                            <span className="inline-block mt-8 font-semibold text-sm uppercase tracking-widest group-hover:underline underline-offset-4 text-black">
                              View Project &rarr;
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mobile: image on top, text below */}
                    <div className="lg:hidden">
                      <img
                        src={featuredProject.backgroundImageUrl || featuredProject.imageUrl!}
                        alt={featuredProject.title}
                        className="w-full h-auto block"
                      />
                      <div className="p-8">
                        <span className="text-xs uppercase tracking-[0.3em] font-semibold mb-4 block text-muted-foreground">
                          Featured Project
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-[0.9] mb-6 font-joystix">
                          {featuredProject.title}
                        </h2>
                        <p className="leading-relaxed text-sm md:text-lg max-w-2xl text-muted-foreground">
                          {featuredProject.summary}
                        </p>
                        <span className="inline-block mt-8 font-semibold text-sm uppercase tracking-widest group-hover:underline underline-offset-4">
                          View Project &rarr;
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Fallback when no image */
                  <div className="bg-muted/30 p-8 lg:p-16 lg:py-32">
                    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="flex flex-col justify-center items-end text-right ml-auto lg:max-w-[50%]">
                        <span className="text-xs uppercase tracking-[0.3em] font-semibold mb-4 text-muted-foreground">Featured Project</span>
                        <h2 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-tight leading-[0.9] mb-6 font-joystix">{featuredProject.title}</h2>
                        <p className="leading-relaxed text-sm md:text-lg max-w-2xl text-muted-foreground">{featuredProject.summary}</p>
                        <span className="inline-block mt-8 font-semibold text-sm uppercase tracking-widest group-hover:underline underline-offset-4">View Project &rarr;</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}
