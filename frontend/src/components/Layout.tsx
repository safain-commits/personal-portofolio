import { useEffect, useState } from "react"
import { Link, Outlet, useLocation } from "react-router-dom"
import { Menu, X } from "lucide-react"
import { cn } from "../lib/utils"
import { ThemeToggle } from "./ThemeToggle"
import safLogo from "../assets/saf.svg"

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const

const FOOTER_LINKS = [
  ...NAV_LINKS,
  { label: "CV (EN)", href: "/cv" },
  { label: "CV (ID)", href: "/cv/id" },
] as const

function RouteChangeIndicator() {
  const location = useLocation()
  const [active, setActive] = useState(false)

  useEffect(() => {
    setActive(true)
    const timeoutId = window.setTimeout(() => setActive(false), 360)
    return () => window.clearTimeout(timeoutId)
  }, [location.pathname, location.search, location.hash])

  return (
    <div
      aria-hidden="true"
      className={cn("route-progress", active && "route-progress-active")}
    />
  )
}

function Navbar() {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname, location.search, location.hash])

  useEffect(() => {
    if (location.hash) return
    window.scrollTo({ top: 0, left: 0, behavior: "auto" })
  }, [location.pathname, location.search, location.hash])

  return (
    <header className="fixed top-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b border-border/50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" onClick={() => setIsMenuOpen(false)} className="z-50">
          <img src={safLogo} alt="Safain Logo" className="h-10 lg:h-12 w-auto theme-invert" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-4 sm:gap-6 text-sm font-medium text-muted-foreground">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "hover:text-foreground transition-colors",
                location.pathname === link.href && "text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="w-px h-4 bg-border mx-2 self-center" />
          <ThemeToggle />
        </nav>

        {/* Mobile Toggle & Menu Header Items */}
        <div className="flex items-center gap-4 md:hidden z-50">
          <ThemeToggle />
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1 -mr-1 text-foreground"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-background border-b border-border/50 shadow-lg md:hidden flex flex-col py-4 px-6 gap-4 text-base font-medium z-40">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "hover:text-foreground transition-colors py-2",
                  location.pathname === link.href ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border mt-auto bg-muted/20">
      <div className="container mx-auto px-6 py-14 lg:py-16">
        <div className="grid gap-10 md:grid-cols-[1.35fr_0.75fr_0.9fr] lg:gap-14">
          <div className="space-y-4 max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-muted-foreground">
              Achmad Safain
            </p>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight leading-tight text-foreground">
              Mechanical Drafter, Engineering Support &amp; 3D CAD Modeler
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground max-w-lg">
              Technical drawings, 3D CAD modeling, and fabrication-oriented engineering documentation for cement plant-related work, structural support, and practical site execution needs.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Available for technical drafting, 3D CAD modeling, and engineering support work.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.26em] text-muted-foreground mb-4">
              Quick Links
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-muted-foreground sm:grid-cols-1">
              {FOOTER_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.26em] text-muted-foreground mb-4">
              Connect
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <a href="mailto:a_sfn@live.com" className="block hover:text-foreground transition-colors">
                a_sfn@live.com
              </a>
              <a href="https://www.linkedin.com/in/achmad-safain/" className="block hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
              <a href="https://www.instagram.com/hy_saf/" className="block hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
              <p>East Java, Indonesia</p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border/70 pt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm text-muted-foreground">
          <div>&copy; {new Date().getFullYear()} Achmad Safain. All rights reserved.</div>
          <div>Portfolio • CV • Engineering Documentation</div>
        </div>
      </div>
    </footer>
  )
}

export default function Layout() {
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col font-sans text-foreground bg-background selection:bg-foreground selection:text-background">
      <RouteChangeIndicator />
      <Navbar />
      <main className="flex-1 w-full">
        <div key={`${location.pathname}${location.search}`} className="route-content-enter">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}
