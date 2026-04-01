# Changelog — 2026-04-01

## Scope
This update hardens the CV page for dark-mode use, improves the About page narrative, and aligns project-related pages with the portfolio's current technical positioning.

## Changes

### CV dark-mode hardening
- Kept the CV sheet as an always-light paper preview while allowing the surrounding page shell to follow the active theme.
- Added a dedicated CV paper palette for text, borders, chips, cards, sidebar, and bullets.
- Reduced reliance on global theme tokens inside the CV sheet.
- Added dedicated CV link styling to avoid dark-theme contrast issues on hover.
- Preserved print-ready A4 behavior and visual consistency between on-screen preview and print output.

### About page improvements
- Added a subtitle below the main `Achmad Safain` heading:
  - `Mechanical Drafter, Engineering Support & 3D CAD Modeler`
- Removed date of birth from the hero area and kept location only.
- Renamed the main profile section from `About` to `Professional Overview`.
- Rewrote the overview copy to be more concise, technical, and recruiter-friendly.
- Polished the CV CTA copy.
- Added LinkedIn to the contact block.
- Renamed the supporting tools label for clearer professional wording.

### Projects page alignment
- Repositioned the projects index from `Projects & Design Work` to `Projects & Technical Work`.
- Updated visible copy, SEO copy, prerender metadata, and structured data for the `/projects` route.
- Reworked project filters to better match the current portfolio direction:
  - `Technical Project Work`
  - `Engineering Support`
  - `3D CAD Modeling`
- Improved the search placeholder and empty-state wording for technical portfolio browsing.

### Shared project taxonomy
- Added `frontend/src/lib/projectTaxonomy.ts` to centralize project text analysis, bucket assignment, and display labels.
- Reused the same labeling logic for both the Projects page and Home page cards.
- Reduced leakage of legacy category labels such as older industrial-design-oriented wording.

### Home page polish
- Updated project card labels on the Home page to use the shared technical taxonomy.
- Rewrote remaining legacy alt text in the hero and featured project imagery to match the updated technical positioning.

### Project detail page alignment
- Shifted project detail copy away from older design-showcase phrasing.
- Updated section titles:
  - `Design Problem` → `Project Context`
  - `CAD & Design Approach` → `Drafting & Technical Approach`
  - `Engineering Result` → `Project Outcome`
- Updated video and 3D viewer descriptions to better fit drafting, documentation, and technical review workflows.
- Adjusted fallback SEO title wording from `Case Study` toward `Technical Project Overview`.

## Verification
- Frontend build completed successfully after the changes.
- Prerender completed successfully for public routes including `/cv`, `/cv/id`, and `/projects`.
- `portfolio-dev` was restarted after the update batch.
