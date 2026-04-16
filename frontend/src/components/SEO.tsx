import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { buildCanonicalUrl, buildPageTitle, DEFAULT_OG_IMAGE, normalizeMetaDescription, SITE_BRAND, toAbsoluteUrl } from "../lib/seo"

type StructuredData = Record<string, unknown> | Array<Record<string, unknown>>

type SEOProps = {
  title?: string
  description?: string
  path?: string
  image?: string | null
  type?: string
  noIndex?: boolean
  structuredData?: StructuredData
}

const ROBOTS_INDEX = "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
const ROBOTS_NOINDEX = "noindex,nofollow,noarchive"

const upsertMeta = (selector: string, attributes: Record<string, string>) => {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null

  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element!.setAttribute(key, value)
  })
}

const upsertCanonical = (href: string) => {
  let element = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null

  if (!element) {
    element = document.createElement('link')
    element.rel = 'canonical'
    document.head.appendChild(element)
  }

  element.href = href
}

export default function SEO({ title, description, path, image, type = 'website', noIndex = false, structuredData }: SEOProps) {
  const location = useLocation()

  useEffect(() => {
    const canonicalUrl = buildCanonicalUrl(path || location.pathname)
    const metaTitle = buildPageTitle(title)
    const metaDescription = normalizeMetaDescription(description)
    const ogImage = toAbsoluteUrl(image) || DEFAULT_OG_IMAGE

    document.title = metaTitle
    document.documentElement.lang = 'en'

    upsertCanonical(canonicalUrl)
    upsertMeta('meta[name="description"]', { name: 'description', content: metaDescription })
    upsertMeta('meta[name="author"]', { name: 'author', content: 'Achmad Safain (Safain)' })
    upsertMeta('meta[name="robots"]', { name: 'robots', content: noIndex ? ROBOTS_NOINDEX : ROBOTS_INDEX })

    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: type })
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: `${SITE_BRAND} | Achmad Safain Portfolio` })
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: metaTitle })
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: metaDescription })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl })
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: ogImage })

    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: metaTitle })
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: metaDescription })
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: ogImage })

    const scriptId = 'structured-data-json-ld'
    const existing = document.getElementById(scriptId)

    if (structuredData) {
      const script = existing || document.createElement('script')
      script.id = scriptId
      script.setAttribute('type', 'application/ld+json')
      script.textContent = JSON.stringify(structuredData)
      if (!existing) {
        document.head.appendChild(script)
      }
    } else if (existing) {
      existing.remove()
    }
  }, [description, image, location.pathname, noIndex, path, structuredData, title, type])

  return null
}
