import { cn } from "../lib/utils"

export type MediaItem = {
  id: string
  type: 'image' | 'video'
  url: string
  alt?: string
}

interface MediaGalleryProps {
  media: MediaItem[]
  className?: string
}

export default function MediaGallery({ media, className }: MediaGalleryProps) {
  if (!media || media.length === 0) return null

  return (
    <div className={cn("space-y-8 md:space-y-16 mt-16", className)}>
      <h2 className="text-3xl font-bold tracking-tight border-b border-border pb-4">Gallery</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {media.map((item, index) => (
          <div 
            key={item.id} 
            className={cn(
              "bg-muted overflow-hidden relative",
              // Make the first item take full width if there's an odd number of items,
              // or just stagger them interesting ways. Here, making every 3rd item span full.
              index % 3 === 0 ? "md:col-span-2 aspect-video" : "aspect-square"
            )}
          >
            {item.type === 'image' ? (
              <img 
                src={item.url} 
                alt={item.alt || "Gallery image"} 
                loading="lazy"
                className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700"
              />
            ) : (
              <video 
                src={item.url} 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
