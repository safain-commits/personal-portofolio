import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const distDir = path.join(rootDir, 'dist')
const projectSeoOverridesPath = path.join(rootDir, 'src', 'content', 'project-seo-overrides.json')

const SITE_NAME = 'Achmad Safain'
const SITE_BRAND = 'Safain'
const SITE_URL = (process.env.PRERENDER_SITE_URL || 'https://linearsaf.com').replace(/\/$/, '')
const API_ORIGIN = (process.env.PRERENDER_API_ORIGIN || 'http://127.0.0.1:5000').replace(/\/$/, '')
const DEFAULT_OG_IMAGE = `${SITE_URL}/img/hero-illustration.png`
const DEFAULT_ROBOTS = 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'
const ADMIN_ROBOTS = 'noindex,nofollow,noarchive'

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')

const buildPageTitle = (title) => title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Mechanical Drafter, Engineering Support & 3D CAD Modeler`
const buildCanonicalUrl = (pathname = '/') => {
  if (/^https?:\/\//i.test(pathname)) return pathname
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`
  return normalized === '/' ? `${SITE_URL}/` : `${SITE_URL}${normalized.replace(/\/+$/, '')}`
}
const toAbsoluteUrl = (value) => {
  if (!value) return undefined
  if (/^https?:\/\//i.test(value)) return value
  return `${SITE_URL}${value.startsWith('/') ? value : `/${value}`}`
}
const stripMarkdown = (input = '') => String(input)
  .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
  .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
  .replace(/```[\s\S]*?```/g, ' ')
  .replace(/`([^`]+)`/g, '$1')
  .replace(/^[>#\-*+]\s?/gm, '')
  .replace(/^\d+\.\s?/gm, '')
  .replace(/[*_~`]/g, '')
  .replace(/\n+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
const truncateText = (input = '', maxLength = 160) => input.length <= maxLength ? input : `${input.slice(0, maxLength).trimEnd()}...`
const safeJson = (value) => JSON.stringify(value).replace(/</g, '\\u003c')

const parseStringArray = (value) => {
  if (Array.isArray(value)) return value.map(item => String(item))
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed.map(item => String(item)) : []
    } catch {
      return []
    }
  }
  return []
}

const uniqueStrings = (values = []) => {
  const seen = new Set()
  return values
    .map(value => typeof value === 'string' ? value.trim() : '')
    .filter(Boolean)
    .filter(value => {
      const key = value.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
}

async function loadProjectSeoOverrides() {
  try {
    const raw = await fs.readFile(projectSeoOverridesPath, 'utf8')
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

function replaceTag(html, pattern, replacement, label) {
  if (!pattern.test(html)) {
    throw new Error(`Missing tag for ${label}`)
  }
  return html.replace(pattern, replacement)
}

function injectStructuredData(html, structuredData) {
  const script = `<script id="structured-data-json-ld" type="application/ld+json">${safeJson(structuredData)}</script>`
  if (/<script id="structured-data-json-ld" type="application\/ld\+json">[\s\S]*?<\/script>/i.test(html)) {
    return html.replace(/<script id="structured-data-json-ld" type="application\/ld\+json">[\s\S]*?<\/script>/i, script)
  }
  return html.replace('</head>', `  ${script}\n  </head>`)
}

function injectNoScriptSummary(html, summary) {
  const block = `<noscript><main style="max-width:72rem;margin:0 auto;padding:2rem 1.5rem;font-family:system-ui,sans-serif;line-height:1.6"><h1 style="font-size:2rem;margin-bottom:1rem">${escapeHtml(summary.title)}</h1><p>${escapeHtml(summary.description)}</p></main></noscript>`
  if (/<noscript><main style="max-width:72rem;[\s\S]*?<\/main><\/noscript>/i.test(html)) {
    return html.replace(/<noscript><main style="max-width:72rem;[\s\S]*?<\/main><\/noscript>/i, block)
  }
  return html.replace('<div id="root"></div>', `${block}\n    <div id="root"></div>`)
}

function renderHtml(template, meta) {
  let html = template
  html = replaceTag(html, /<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(meta.title)}</title>`, 'title')
  html = replaceTag(html, /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/i, `<meta name="description" content="${escapeHtml(meta.description)}" />`, 'description')
  html = replaceTag(html, /<meta\s+name="robots"\s+content="[\s\S]*?"\s*\/?>/i, `<meta name="robots" content="${escapeHtml(meta.robots)}" />`, 'robots')
  html = replaceTag(html, /<link\s+rel="canonical"\s+href="[\s\S]*?"\s*\/?>/i, `<link rel="canonical" href="${escapeHtml(meta.canonical)}" />`, 'canonical')
  html = replaceTag(html, /<meta\s+property="og:type"\s+content="[\s\S]*?"\s*\/?>/i, `<meta property="og:type" content="${escapeHtml(meta.ogType)}" />`, 'og:type')
  html = replaceTag(html, /<meta\s+property="og:title"\s+content="[\s\S]*?"\s*\/?>/i, `<meta property="og:title" content="${escapeHtml(meta.title)}" />`, 'og:title')
  html = replaceTag(html, /<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/?>/i, `<meta property="og:description" content="${escapeHtml(meta.description)}" />`, 'og:description')
  html = replaceTag(html, /<meta\s+property="og:url"\s+content="[\s\S]*?"\s*\/?>/i, `<meta property="og:url" content="${escapeHtml(meta.canonical)}" />`, 'og:url')
  html = replaceTag(html, /<meta\s+property="og:image"\s+content="[\s\S]*?"\s*\/?>/i, `<meta property="og:image" content="${escapeHtml(meta.image)}" />`, 'og:image')
  html = replaceTag(html, /<meta\s+name="twitter:title"\s+content="[\s\S]*?"\s*\/?>/i, `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`, 'twitter:title')
  html = replaceTag(html, /<meta\s+name="twitter:description"\s+content="[\s\S]*?"\s*\/?>/i, `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`, 'twitter:description')
  html = replaceTag(html, /<meta\s+name="twitter:image"\s+content="[\s\S]*?"\s*\/?>/i, `<meta name="twitter:image" content="${escapeHtml(meta.image)}" />`, 'twitter:image')
  html = injectStructuredData(html, meta.structuredData)
  html = injectNoScriptSummary(html, { title: meta.noScriptTitle || meta.title, description: meta.noScriptDescription || meta.description })
  return html
}

async function writeRouteHtml(routePath, html) {
  const relativePath = routePath === '/' ? 'index.html' : path.join(routePath.replace(/^\//, ''), 'index.html')
  const outputPath = path.join(distDir, relativePath)
  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  await fs.writeFile(outputPath, html, 'utf8')
  console.log(`prerendered ${routePath} -> ${relativePath}`)
}

async function fetchJson(url) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Request failed ${response.status} for ${url}`)
  }
  return response.json()
}

function staticPages() {
  return [
    {
      path: '/',
      title: buildPageTitle('Safain - Mechanical Drafter, Engineering Support & 3D CAD Portfolio'),
      description: 'Safain is the portfolio and personal brand of Achmad Safain, featuring mechanical drafting, engineering support, 3D CAD modeling, cement plant documentation, technical drawings, and fabrication-oriented engineering work.',
      robots: DEFAULT_ROBOTS,
      canonical: buildCanonicalUrl('/'),
      image: DEFAULT_OG_IMAGE,
      ogType: 'website',
      structuredData: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Achmad Safain Portfolio',
          alternateName: [
            'Safain',
            'Safain Portfolio',
            'LinearSAF'
          ],
          url: SITE_URL,
        },
        {
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Achmad Safain',
          alternateName: [
            'Safain',
            'Safain A.',
            'LinearSAF'
          ],
          url: SITE_URL,
          jobTitle: 'Mechanical Drafter, Engineering Support & 3D CAD Modeler',
          sameAs: [
            'https://www.linkedin.com/in/achmad-safain/',
            'https://www.instagram.com/hy_saf/'
          ],
          knowsAbout: [
            'Mechanical Drafting',
            'Technical Drawings',
            '3D CAD Modeling',
            'Engineering Support',
            'Cement Plant Equipment',
            'Shop Drawings',
            'As-Built Drawings',
            'Autodesk Inventor',
            'AutoCAD',
            'STAAD.Pro',
            'FEA Simulation'
          ]
        }
      ]
    },
    {
      path: '/about',
      title: buildPageTitle('About'),
      description: 'Learn more about Safain, the personal brand of Achmad Safain, a mechanical drafter, engineering support professional, and 3D CAD modeler with experience in cement plant documentation, technical drafting, structural support work, and fabrication-oriented design communication.',
      robots: DEFAULT_ROBOTS,
      canonical: buildCanonicalUrl('/about'),
      image: DEFAULT_OG_IMAGE,
      ogType: 'website',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: 'About Achmad Safain (Safain)',
        url: `${SITE_URL}/about`,
        mainEntity: {
          '@type': 'Person',
          name: 'Achmad Safain',
          alternateName: [
            'Safain',
            'Safain A.',
            'LinearSAF'
          ],
          url: SITE_URL,
          jobTitle: 'Mechanical Drafter, Engineering Support & 3D CAD Modeler',
          alumniOf: [
            'Universitas Terbuka',
            'Indonesian Institute of the Arts, Surakarta',
            'UPN Veteran Jawa Timur'
          ]
        }
      }
    },
    {
      path: '/cv',
      title: buildPageTitle('Curriculum Vitae'),
      description: 'Professional CV of Achmad Safain, also known as Safain, Mechanical Drafter, Engineering Support & 3D CAD Modeler, featuring cement plant drafting scope, 3D modeling, structural support work, and selected technical experience.',
      robots: DEFAULT_ROBOTS,
      canonical: buildCanonicalUrl('/cv'),
      image: toAbsoluteUrl('/img/cv-profile-3x4.jpg') || DEFAULT_OG_IMAGE,
      ogType: 'profile',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        name: 'Curriculum Vitae — Achmad Safain',
        url: `${SITE_URL}/cv`,
        mainEntity: {
          '@type': 'Person',
          name: 'Achmad Safain',
          alternateName: [
            'Safain',
            'Safain A.',
            'LinearSAF'
          ],
          url: SITE_URL,
          image: `${SITE_URL}/img/cv-profile-3x4.jpg`,
          jobTitle: 'Mechanical Drafter, Engineering Support & 3D CAD Modeler',
          alumniOf: [
            'Universitas Terbuka, Surabaya',
            'Indonesian Institute of the Arts, Surakarta',
            'UPN Veteran Jawa Timur, Surabaya'
          ],
          knowsAbout: [
            'Mechanical Drafting',
            'Industrial Design',
            '3D CAD Modeling',
            'Technical Drawing',
            'Autodesk Inventor',
            'AutoCAD',
            'SolidWorks',
            'Blender'
          ]
        }
      }
    },
    {
      path: '/cv/id',
      title: buildPageTitle('Curriculum Vitae Bahasa Indonesia'),
      description: 'CV profesional Achmad Safain, juga dikenal sebagai Safain, sebagai Mechanical Drafter, Engineering Support & 3D CAD Modeler, mencakup scope drafting di cement plant, pemodelan 3D, pekerjaan struktur, dan sorotan pengalaman teknis.',
      robots: DEFAULT_ROBOTS,
      canonical: buildCanonicalUrl('/cv/id'),
      image: toAbsoluteUrl('/img/cv-profile-3x4.jpg') || DEFAULT_OG_IMAGE,
      ogType: 'profile',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        name: 'Curriculum Vitae Bahasa Indonesia — Achmad Safain',
        url: `${SITE_URL}/cv/id`,
        mainEntity: {
          '@type': 'Person',
          name: 'Achmad Safain',
          alternateName: [
            'Safain',
            'Safain A.',
            'LinearSAF'
          ],
          url: SITE_URL,
          image: `${SITE_URL}/img/cv-profile-3x4.jpg`,
          jobTitle: 'Mechanical Drafter, Engineering Support & 3D CAD Modeler',
          alumniOf: [
            'Universitas Terbuka, Surabaya',
            'Institut Seni Indonesia Surakarta',
            'UPN Veteran Jawa Timur, Surabaya'
          ],
          knowsAbout: [
            'Mechanical Drafting',
            'Industrial Design',
            '3D CAD Modeling',
            'Technical Drawing',
            'Autodesk Inventor',
            'AutoCAD',
            'SolidWorks',
            'Blender'
          ]
        }
      }
    },
    {
      path: '/projects',
      title: buildPageTitle('Projects & Technical Work'),
      description: 'Browse selected projects by Achmad Safain, also known as Safain, across mechanical drafting, engineering support, 3D CAD modeling, technical documentation, and plant-related design work.',
      robots: DEFAULT_ROBOTS,
      canonical: buildCanonicalUrl('/projects'),
      image: DEFAULT_OG_IMAGE,
      ogType: 'website',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Projects & Technical Work',
        description: 'Selected project work spanning mechanical drafting, engineering support, technical documentation, and 3D CAD modeling.',
        url: `${SITE_URL}/projects`
      }
    },
    {
      path: '/contact',
      title: buildPageTitle('Contact'),
      description: 'Get in touch with Achmad Safain, also known as Safain, for mechanical drafting, industrial design, 3D modeling, and engineering-focused collaboration or freelance inquiries.',
      robots: DEFAULT_ROBOTS,
      canonical: buildCanonicalUrl('/contact'),
      image: DEFAULT_OG_IMAGE,
      ogType: 'website',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'Contact Achmad Safain (Safain)',
        url: `${SITE_URL}/contact`
      }
    },
    {
      path: '/admin',
      title: buildPageTitle('Admin Login'),
      description: 'Private admin area for managing portfolio content.',
      robots: ADMIN_ROBOTS,
      canonical: buildCanonicalUrl('/admin'),
      image: DEFAULT_OG_IMAGE,
      ogType: 'website',
      noScriptTitle: 'Admin Login',
      noScriptDescription: 'Private admin area for managing portfolio content.',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Admin Login',
        url: `${SITE_URL}/admin`,
        isPartOf: SITE_URL
      }
    }
  ]
}

async function projectPages(projectSeoOverrides = {}) {
  const listJson = await fetchJson(`${API_ORIGIN}/projects`)
  const projects = Array.isArray(listJson?.data) ? listJson.data : []
  const pages = []

  for (const project of projects) {
    if (!project?.slug) continue
    try {
      const detailJson = await fetchJson(`${API_ORIGIN}/projects/${encodeURIComponent(project.slug)}`)
      const detail = detailJson?.data
      if (!detail) continue
      const heroImage = detail.hero_image_url || detail.heroImageUrl || detail.imageUrl || detail.background_image_url || detail.backgroundImageUrl || null
      const projectSeoOverride = projectSeoOverrides[detail.slug] || {}
      const focusKeywordsFromCms = parseStringArray(detail.focus_keywords ?? detail.focusKeywords)
      const tags = Array.isArray(detail.tags) ? detail.tags : []
      const category = tags[0] || 'Project'
      const uniqueLabels = [...new Set([category, ...tags].map(value => String(value || '').trim()).filter(Boolean).map(value => value.toLowerCase()))]
      const readableLabels = [...new Map([category, ...tags].map(value => [String(value || '').trim().toLowerCase(), String(value || '').trim()]).filter(([, value]) => Boolean(value))).values()]
      const disciplineText = readableLabels.length === 0
        ? 'Design'
        : readableLabels.length === 1
          ? readableLabels[0]
          : readableLabels.length === 2
            ? `${readableLabels[0]} and ${readableLabels[1]}`
            : `${readableLabels.slice(0, -1).join(', ')}, and ${readableLabels.at(-1)}`
      const industryText = detail.industry ? String(detail.industry).split('/')[0].trim() : ''
      const description = truncateText(`${detail.title} is a ${disciplineText} case study${industryText ? ` for ${industryText.toLowerCase()} applications` : ''} focused on CAD drafting, technical drawings, and ${stripMarkdown(detail.subtitle || detail.summary || detail.problem || '').toLowerCase()}`, 160) || `Portfolio project: ${detail.title}`
      const seoDescription = detail.seo_description || detail.seoDescription || projectSeoOverride.seoDescription || description
      const seoTitle = detail.seo_title || detail.seoTitle || projectSeoOverride.seoTitle || `${detail.title} – ${category} Case Study`
      const canonicalPath = `/projects/${detail.slug}`
      const keywordPhrases = uniqueStrings([
        ...focusKeywordsFromCms,
        ...(Array.isArray(projectSeoOverride.focusKeywords) ? projectSeoOverride.focusKeywords : []),
        `${detail.title} case study`,
        `${category} case study`,
        detail.industry ? `${detail.industry} design project` : null,
        detail.industry ? `${detail.industry} case study` : null,
        'Mechanical drafting',
        'Technical drawings',
        '3D CAD modeling',
        'Engineering design',
        ...tags,
        ...(Array.isArray(detail.tools) ? detail.tools.map(tool => `${tool} project`) : []),
      ].filter(Boolean).map(value => String(value)))
      pages.push({
        path: canonicalPath,
        title: buildPageTitle(seoTitle),
        description: seoDescription,
        robots: DEFAULT_ROBOTS,
        canonical: buildCanonicalUrl(canonicalPath),
        image: toAbsoluteUrl(heroImage) || DEFAULT_OG_IMAGE,
        ogType: 'article',
        noScriptTitle: detail.title,
        noScriptDescription: seoDescription,
        structuredData: [
          {
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: detail.title,
            headline: detail.title,
            description: seoDescription,
            url: `${SITE_URL}${canonicalPath}`,
            image: heroImage ? [toAbsoluteUrl(heroImage)] : undefined,
            author: {
              '@type': 'Person',
              name: 'Achmad Safain',
              url: SITE_URL,
            },
            creator: {
              '@type': 'Person',
              name: 'Achmad Safain',
              url: SITE_URL,
            },
            genre: category,
            keywords: keywordPhrases.join(', '),
            about: detail.industry || undefined,
            inLanguage: 'en'
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: SITE_URL
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Projects',
                item: `${SITE_URL}/projects`
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: detail.title,
                item: `${SITE_URL}${canonicalPath}`
              }
            ]
          }
        ]
      })
    } catch (error) {
      console.warn(`skip project ${project.slug}: ${error.message}`)
    }
  }

  return pages
}

async function main() {
  const template = await fs.readFile(path.join(distDir, 'index.html'), 'utf8')
  const projectSeoOverrides = await loadProjectSeoOverrides()
  const pages = [...staticPages(), ...(await projectPages(projectSeoOverrides))]
  for (const meta of pages) {
    const html = renderHtml(template, meta)
    await writeRouteHtml(meta.path, html)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
