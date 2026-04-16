import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import ProjectCard from "../components/ProjectCard"
import SEO from "../components/SEO"
import { getProjects, type Project } from "../lib/api"
import { Search } from "lucide-react"
import { PROJECT_FILTERS, type FilterLabel, buildProjectText, getProjectBuckets, getPrimaryProjectLabel } from "../lib/projectTaxonomy"

export default function Projects() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [allProjects, setAllProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const query = searchParams.get("q") || ""
  const category = (searchParams.get("category") || "") as FilterLabel | ""

  useEffect(() => {
    setLoading(true)
    getProjects().then(data => {
      setAllProjects(data)
      setLoading(false)
    })
  }, [])

  const projects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return allProjects.filter(project => {
      const matchesCategory = !category || category === "All"
        ? true
        : getProjectBuckets(project).includes(category)

      if (!matchesCategory) return false
      if (!normalizedQuery) return true

      return buildProjectText(project).includes(normalizedQuery)
    })
  }, [allProjects, query, category])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = new URLSearchParams(searchParams)
    if (e.target.value) {
      next.set("q", e.target.value)
    } else {
      next.delete("q")
    }
    setSearchParams(next)
  }

  const handleCategory = (c: FilterLabel) => {
    const next = new URLSearchParams(searchParams)
    if (c === "All") {
      next.delete("category")
    } else {
      next.set("category", c)
    }
    setSearchParams(next)
  }

  return (
    <div className="container mx-auto px-6 pt-24 lg:pt-32 pb-24">
      <SEO
        title="Projects & Technical Work"
        description="Browse selected projects by Achmad Safain, also known as Safain, across mechanical drafting, engineering support, 3D CAD modeling, technical documentation, and plant-related design work."
        path="/projects"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Projects & Technical Work",
          description: "Selected project work spanning mechanical drafting, engineering support, technical documentation, and 3D CAD modeling.",
          url: "https://linearsaf.com/projects"
        }}
      />

      <div className="max-w-3xl mb-16">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6">Projects</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Selected technical work across mechanical drafting, engineering support, and 3D CAD modeling.
          Browse by focus area or search by project title, equipment, and keywords.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center mb-12 pb-6 border-b border-border">
        <div className="flex flex-wrap gap-2">
          {PROJECT_FILTERS.map(c => {
            const isActive = c === "All" ? !category : category === c
            return (
              <button
                key={c}
                onClick={() => handleCategory(c)}
                className={`px-4 py-2 text-sm font-medium transition-colors border ${isActive
                  ? "bg-foreground text-background border-foreground"
                  : "bg-transparent text-foreground border-border hover:border-foreground"
                }`}
              >
                {c}
              </button>
            )
          })}
        </div>

        <div className="relative w-full md:w-72 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects, equipment, or keywords..."
            value={query}
            onChange={handleSearch}
            className="w-full pl-9 pr-4 py-2 bg-transparent border border-border focus:outline-none focus:border-foreground transition-colors"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="animate-pulse space-y-4">
              <div className="aspect-[4/3] bg-muted"></div>
              <div className="h-6 bg-muted w-3/4"></div>
              <div className="h-4 bg-muted w-1/2"></div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-border flex flex-col items-center">
          <p className="text-xl font-medium mb-2">No matching projects found</p>
          <p className="text-muted-foreground">Try another keyword or clear the selected filter.</p>
          <button
            onClick={() => setSearchParams({})}
            className="mt-6 font-semibold underline underline-offset-4"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              subtitle={project.subtitle}
              slug={project.slug}
              category={getPrimaryProjectLabel(project)}
              imageUrl={project.heroImageUrl || project.imageUrl}
            />
          ))}
        </div>
      )}
    </div>
  )
}
