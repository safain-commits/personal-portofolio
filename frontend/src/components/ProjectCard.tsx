import { Link } from "react-router-dom"
import { cn } from "../lib/utils"

interface ProjectCardProps {
  title: string
  slug: string
  category: string
  imageUrl?: string
  className?: string
}

export default function ProjectCard({ 
  title, 
  slug, 
  category, 
  imageUrl,
  className 
}: ProjectCardProps) {
  return (
    <Link 
      to={`/projects/${slug}`} 
      className={cn("group block", className)}
    >
      <div className="aspect-square sm:aspect-[4/3] bg-muted overflow-hidden mb-4 relative">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/50">
            No Image
          </div>
        )}
      </div>
      <div>
        <h3 className="font-bold text-xl tracking-tight mb-1 group-hover:underline underline-offset-4">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm font-medium">
          {category}
        </p>
      </div>
    </Link>
  )
}
