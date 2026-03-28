import { cn } from "../lib/utils"

interface SkillProfileProps {
  name: string
  level: 1 | 2 | 3 | 4 | 5
  className?: string
}

export default function SkillProfile({ name, level, className }: SkillProfileProps) {
  return (
    <div className={cn("flex items-center justify-between py-1", className)}>
      <span className="font-medium">{name}</span>
      <div className="flex gap-1.5 justify-end w-28" aria-label={`Proficiency level ${level} out of 5`}>
        {Array.from({ length: level }).map((_, i) => (
          <div 
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-foreground"
          />
        ))}
      </div>
    </div>
  )
}
