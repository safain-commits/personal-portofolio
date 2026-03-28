import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "./theme-provider"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const cycles = [
    { value: "light" as const, icon: <Sun className="w-5 h-5" />, label: "Light theme" },
    { value: "dark" as const, icon: <Moon className="w-5 h-5" />, label: "Dark theme" },
    { value: "system" as const, icon: <Monitor className="w-5 h-5" />, label: "System theme" },
  ]

  const currentIndex = cycles.findIndex((c) => c.value === theme)
  const nextItem = cycles[(currentIndex + 1) % cycles.length]

  return (
    <button
      onClick={() => setTheme(nextItem.value)}
      aria-label={`Current theme is ${theme}. Switch to ${nextItem.value}`}
      className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
    >
      {cycles[currentIndex].icon}
    </button>
  )
}
