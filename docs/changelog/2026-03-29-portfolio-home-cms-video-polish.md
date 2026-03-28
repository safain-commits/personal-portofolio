# Changelog — 2026-03-29

## Scope
Follow-up polish pass for the portfolio app after the larger CMS / Project Detail / 3D viewer upgrade.

## Changes

### Home page
- Updated the **Works** section so featured projects are still allowed to appear there.
  - This prevents the Works section from becoming empty when only one project exists and it is also marked as featured.
- Updated the **Featured Project** area to support **multiple featured projects**.
  - Home now renders all projects marked as featured instead of only the first match.
  - The existing large showcase style is preserved and repeated per featured project.

### Admin CMS project editor
- Removed the extra informational text on the left side of the sticky bottom action bar.
- Moved the save status notification into the **sticky bottom action area** so it stays visible while editing lower sections of the form.
- Preserved the manual close / back-to-list workflow introduced earlier.

### Project Detail
- Disabled the visible **download option** in the native Showcase Video player where browser support allows it.
- Also restricted context-menu / PiP / remote playback controls to keep the public video presentation cleaner.

## Verification
- Frontend build completed successfully after each tweak batch.
- `portfolio-dev` was restarted after the updates.

## Notes
- These changes are intended as a small polish batch and are separate from the larger 2026-03-28 changelog.
