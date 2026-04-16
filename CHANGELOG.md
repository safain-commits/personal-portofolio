# Changelog

## 2026-04-16

### Added
- inline validation and status feedback on the Contact page
- SMTP-based email notifications for contact form submissions
- branded HTML email template for new contact inquiries
- route-change progress cue and subtle page-enter transition
- explicit `Safain` alias signals in site metadata and structured data
- detailed release notes in `docs/changelog/2026-04-16-contact-ux-email-navigation-and-safain-seo.md`

### Changed
- Contact page copy and layout were reworked for clearer inquiry guidance and better conversion UX
- SPA navigation now resets scroll position on internal route changes
- homepage, about page, CV, projects, contact page, and prerender output now reinforce `Safain` as the short-form brand query tied to `Achmad Safain`

### Notes
- ranking improvements for `Safain` will depend on Google recrawling and reindexing the updated pages after deployment

## 2026-03-30

### Added
- baseline technical SEO metadata for the portfolio frontend
- reusable SEO head management component and helper utilities
- `robots.txt` and sitemap index for frontend static assets
- backend dynamic sitemap endpoint at `/sitemap.xml`
- prerender build step for public routes and project detail pages
- structured data / JSON-LD for homepage, about, projects, contact, and project detail pages
- project-specific SEO override support in CMS admin
- SEO fields in project storage:
  - `seo_title`
  - `seo_description`
  - `focus_keywords`
  - `seo_intro`
  - `hero_alt`
- live SEO preview and character counters inside the CMS admin form
- per-project fallback SEO overrides in frontend content files

### Changed
- canonical domain standardized to `https://linearsaf.com`
- frontend build now runs prerender automatically after Vite build
- homepage copy and project detail copy were optimized for stronger keyword targeting
- project detail SEO now prioritizes CMS-managed SEO fields, then JSON fallback, then generated fallback
- admin route SEO is explicitly `noindex`

### Notes
- after creating or updating a project in CMS, run:
  - `cd /root/app/personal-portofolio/frontend && npm run build`
- this is required so prerendered raw HTML stays aligned with the latest project SEO data
