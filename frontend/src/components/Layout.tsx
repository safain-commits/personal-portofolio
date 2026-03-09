import { useState } from "react"
import { Link, Outlet, useLocation } from "react-router-dom"
import { Menu, X } from "lucide-react"
import { cn } from "../lib/utils"
import { ThemeToggle } from "./ThemeToggle"
import safLogo from "../assets/saf.svg"

function Navbar() {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ]

  return (
    <header className="fixed top-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b border-border/50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" onClick={() => setIsMenuOpen(false)} className="z-50">
          <img src={safLogo} alt="Safain Logo" className="h-8 lg:h-9 w-auto theme-invert" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-4 sm:gap-6 text-sm font-medium text-muted-foreground">
          {navLinks.map((link) => (
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
            {navLinks.map((link) => (
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
    <footer className="border-t border-border mt-auto py-12">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
        <div>&copy; {new Date().getFullYear()} Safain A. All rights reserved.</div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-foreground transition-colors">LinkedIn</a>
          <a href="#" className="hover:text-foreground transition-colors">Behance</a>
        </div>
      </div>
    </footer>
  )
}

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-foreground bg-background selection:bg-foreground selection:text-background">
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
