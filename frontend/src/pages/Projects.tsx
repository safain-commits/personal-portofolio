import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import ProjectCard from "../components/ProjectCard"
import { getProjects, type Project } from "../lib/api"
import { Search } from "lucide-react"
import { useTitle } from "../hooks/useTitle"

export default function Projects() {
  useTitle("Work")
  const [searchParams, setSearchParams] = useSearchParams()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const query = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''

  const categories = ["All", "Industrial Design", "Product Design", "Appliance Design", "Engineering"]

  useEffect(() => {
    setLoading(true)
    getProjects(query, category).then(data => {
      setProjects(data)
      setLoading(false)
    })
  }, [query, category])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = new URLSearchParams(searchParams)
    if (e.target.value) {
      next.set('q', e.target.value)
    } else {
      next.delete('q')
    }
    setSearchParams(next)
  }

  const handleCategory = (c: string) => {
    const next = new URLSearchParams(searchParams)
    if (c === "All") {
      next.delete('category')
    } else {
      next.set('category', c)
    }
    setSearchParams(next)
  }

  return (
    <div className="container mx-auto px-6 pt-24 lg:pt-32 pb-24">
      <div className="max-w-3xl mb-16">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6">Projects</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          A selected body of work spanning industrial design, 2D drafting, and 3D modeling.
          Browse by category or search for specific tools and concepts.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center mb-12 pb-6 border-b border-border">
        <div className="flex flex-wrap gap-2">
          {categories.map(c => {
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

        <div className="relative w-full md:w-64 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
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
          <p className="text-xl font-medium mb-2">No projects found</p>
          <p className="text-muted-foreground">Try adjusting your search or filters.</p>
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
              category={project.category}
              imageUrl={project.heroImageUrl || project.imageUrl}
            />
          ))}
        </div>
      )}
    </div>
  )
}
