import { Link } from "react-router-dom"
import { cn } from "../lib/utils"

interface ProjectCardProps {
  title: string
  subtitle?: string
  slug: string
  category: string
  imageUrl?: string
  className?: string
}

export default function ProjectCard({
  title,
  subtitle,
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
      <div className="aspect-square sm:aspect-[4/3] bg-muted overflow-hidden mb-4 relative rounded-sm border border-border/50">
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
      <div className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground font-semibold">
          {category}
        </p>
        <div>
          <h3 className="font-bold text-xl tracking-tight mb-1 group-hover:underline underline-offset-4">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
