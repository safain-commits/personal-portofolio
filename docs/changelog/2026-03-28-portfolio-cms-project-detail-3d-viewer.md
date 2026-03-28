# Changelog — 2026-03-28

## Scope
Major refinement session for the portfolio app covering:
- CMS project editor UX
- Project Detail layout and markdown rendering
- media workflow improvements
- 3D viewer quality, performance, and per-project configurability
- backend/API/schema support for the new editor and viewer features

## Highlights

### 1) Admin login persistence
- Confirmed `Remember me` cookie-based admin login is working on `/admin`.
- Backend auth flow now supports persistent admin session cookies.

### 2) Project data model upgrades
- Added support for `subtitle` on projects.
- Extended project media to support explicit image roles:
  - `hero`
  - `gallery`
  - `drawing`
- Existing image data was backfilled so older projects remain compatible.

### 3) CMS editor improvements
- Added markdown editor support for project narrative fields, including `Constraints`.
- Improved save experience:
  - removed blocking browser alert after save
  - keep editor open after successful save
  - show inline save notification inside the editor
  - added manual close/back-to-list controls
- Added clearer guidance in the editor for advanced 3D viewer controls.
- Added `Reset to defaults` for 3D viewer overrides.

### 4) Markdown rendering improvements
- Added stronger markdown rendering for:
  - headings
  - links
  - blockquotes
  - inline/fenced code
  - bullet and numbered lists
  - task lists/checklists
  - tables
- Refined markdown table styling with:
  - visible borders
  - distinct header styling
  - zebra striping
  - alignment support for left/center/right columns

### 5) Media workflow improvements
- CMS now supports:
  - hero image upload
  - multiple gallery images
  - multiple technical drawings
  - caption per gallery/drawing image
  - drag-and-drop reorder for gallery/drawing image sequences
- Detail page gallery/drawing rendering follows the saved order.

### 6) Project Detail layout refinement
- Refined Project Detail header layout to reduce empty space when summary is short and metadata/constraints are taller.
- Kept `Constraints` in its existing placement as requested.
- Moved the hero image higher in the left content flow for better balance.
- Fixed duplicate tag/category labels in the Project Detail header by deduplicating the rendered labels.

### 7) 3D viewer optimization and polish
- Optimized viewer performance by deferring 3D mounting until the viewer approaches the viewport.
- Reduced initial scroll jank on pages with heavy 3D content.
- Introduced a refined default viewer look:
  - soft studio lighting
  - grounded shadow feel
  - neutral background treatment
  - theme-aware light/dark handling
- Tuned the `MAGNET-TRAP` viewer presentation iteratively:
  - orientation correction
  - closer framing
  - visual centering in viewport
  - refined lighting and shadow balance

### 8) 3D viewer presets and advanced overrides
- Formalized named viewer presets:
  - `theme-adaptive`
  - `soft-studio-grounded-light`
  - `soft-studio-grounded-dark`
- Added per-project 3D viewer controls through CMS and API:
  - viewer preset
  - rotation preset
  - auto-rotate on/off
  - camera distance
  - camera height
  - horizontal offset
  - vertical offset
- Backfilled `MAGNET-TRAP` to use the new per-project viewer override system.

### 9) Backend and API support
- Expanded backend schema and API payload mapping for:
  - subtitles
  - image roles and structured media payloads
  - markdown-backed narrative fields
  - 3D viewer preset and advanced viewer overrides
- Synced frontend and backend mapping so CMS state, API responses, and public Project Detail rendering stay aligned.

## Notable UX outcomes
- Project editor is significantly more usable for long-form case study writing.
- Image-heavy project storytelling is now better structured.
- 3D projects can be tuned without code edits.
- The default 3D viewer is now suitable as a reusable baseline for future uploads.

## Follow-up ideas
Potential next steps if needed later:
- save/apply viewer settings from another project
- richer preview of 3D presets inside CMS
- additional named 3D presets for different project types
- code-splitting / bundle optimization around the 3D viewer chunk
