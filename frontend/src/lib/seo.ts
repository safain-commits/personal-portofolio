export const SITE_NAME = "Achmad Safain"
export const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://linearsaf.com").replace(/\/$/, "")
export const DEFAULT_DESCRIPTION = "Portfolio of Achmad Safain featuring mechanical drafting, industrial design, 3D CAD modeling, technical drawings, and engineering design case studies."
export const DEFAULT_OG_IMAGE = `${SITE_URL}/img/hero-illustration.png`

export function buildPageTitle(title?: string) {
  if (!title) return `${SITE_NAME} — Mechanical Drafter & Industrial Designer`
  return `${title} | ${SITE_NAME}`
}

export function buildCanonicalUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) return path
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  if (normalizedPath === '/') return `${SITE_URL}/`
  return `${SITE_URL}${normalizedPath.replace(/\/+$/, '')}`
}

export function toAbsoluteUrl(pathOrUrl?: string | null) {
  if (!pathOrUrl) return undefined
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
  const normalizedPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`
  return `${SITE_URL}${normalizedPath}`
}

export function normalizeMetaDescription(description?: string) {
  const value = (description || DEFAULT_DESCRIPTION).replace(/\s+/g, ' ').trim()
  if (value.length <= 160) return value
  return `${value.slice(0, 157).trimEnd()}...`
}
