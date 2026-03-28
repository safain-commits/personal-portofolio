import { cn } from "../lib/utils"
import type { ProjectMedia } from "../lib/api"

interface MediaGalleryProps {
  media: ProjectMedia[]
  className?: string
  title?: string
  description?: string
  variant?: 'gallery' | 'drawing'
}

export default function MediaGallery({ media, className, title = 'Gallery', description, variant = 'gallery' }: MediaGalleryProps) {
  if (!media || media.length === 0) return null

  return (
    <section className={cn("space-y-8 md:space-y-10", className)}>
      <div className="max-w-3xl space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>
        {description && <p className="text-muted-foreground leading-relaxed">{description}</p>}
      </div>

      <div className={cn(
        "grid gap-6",
        variant === 'drawing' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2'
      )}>
        {media.map((item, index) => (
          <figure
            key={item.id}
            className={cn(
              "overflow-hidden rounded-sm border border-border/60",
              variant === 'drawing'
                ? "bg-white p-4"
                : index === 0 ? "md:col-span-2 bg-muted" : "bg-muted"
            )}
          >
            {item.type === 'image' ? (
              <img
                src={item.url}
                alt={item.alt || title}
                loading="lazy"
                className={cn(
                  "w-full transition-transform duration-700",
                  variant === 'drawing'
                    ? "aspect-[4/3] object-contain"
                    : index === 0 ? "aspect-[16/9] object-cover hover:scale-[1.02]" : "aspect-[4/3] object-cover hover:scale-[1.02]"
                )}
              />
            ) : (
              <video
                src={item.url}
                controls
                className="w-full aspect-video bg-black object-contain"
              />
            )}
            {item.caption && (
              <figcaption className="px-1 pt-3 text-sm text-muted-foreground leading-relaxed">
                {item.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  )
}
