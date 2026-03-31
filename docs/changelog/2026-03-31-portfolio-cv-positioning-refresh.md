# Changelog — 2026-03-31

## Scope
This update adds a dedicated Curriculum Vitae experience to the portfolio and aligns the public-facing positioning across Home, About, metadata, and footer content.

## Changes

### New Curriculum Vitae pages
- Added a dedicated **CV page** at `/cv`.
- Added a dedicated **Bahasa Indonesia CV page** at `/cv/id`.
- Added a print-ready **A4 layout** with a dedicated print button.
- Added a close-up profile photo asset for the CV page.
- Added bilingual switching between English and Indonesian CV views.

### CV content and positioning
- Updated the CV headline to:
  - **Mechanical Drafter, Engineering Support & 3D CAD Modeler**
- Reworked the professional summary to reflect real cement plant drafting and engineering support scope.
- Added concrete scope details including:
  - RMK-related work
  - raw mill / coal mill / kiln / preheater support
  - fabrication / approval / presentation / site execution usage
  - ~50 drawings per year
  - Autodesk Inventor and AutoCAD as primary daily software
- Added work experience entries with stronger industrial context.
- Added selected technical experience sections for:
  - cement plant equipment drafting
  - AFR / structural support work
  - 3D modeling and simulation-related engineering contribution
- Refined the print version to feel more formal and corporate.

### About and Home page alignment
- Reworked **Home** copy, search topics, and metadata to better match the updated professional positioning.
- Reworked **About** copy so it is more concrete, technical, and aligned with the CV.
- Kept the CV linked from **About** only, rather than adding it to the main header navigation.
- Added consistent quick access to the CV via the footer.

### Footer refresh
- Replaced the minimal footer with a more intentional three-column footer.
- Added:
  - professional identity block
  - quick links including CV EN / ID
  - contact and social links
- Kept the footer clean and restrained to match the portfolio tone.

### SEO / prerender / sitemap
- Added prerender support for `/cv` and `/cv/id`.
- Added sitemap entries for both CV routes.
- Updated default site metadata and prerender metadata to match the new positioning.
- Synced Home / About / CV metadata and structured data more closely.

### Consistency polish
- Normalized several naming/details across pages, including:
  - software capitalization and labeling
  - education institution naming
  - education period formatting
  - contact / language labels
- Added `.gitignore` rules for local backup / patch artifacts.

## Verification
- Frontend build completed successfully after the changes.
- Prerender completed successfully for public routes including `/cv` and `/cv/id`.
- `portfolio-dev` was restarted after the updates.
