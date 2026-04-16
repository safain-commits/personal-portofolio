# Changelog — 2026-04-16

## Scope
This update improves the contact experience, adds email notification delivery for contact submissions, makes route changes easier to notice in the SPA, and strengthens on-site SEO signals for the shorter brand query `Safain`.

## Changes

### Contact page UX refresh
- Reworked the `/contact` page into a more conversion-ready layout with clearer messaging and stronger hierarchy.
- Added inline validation for `name`, `email`, and `message`.
- Replaced blocking `alert()` feedback with inline status messaging for success and error states.
- Added helper text so visitors know what kind of brief is useful before submitting.
- Improved the success state with clearer next steps and direct fallback channels.
- Clarified the difference between using the form, email, WhatsApp, and Instagram.

### Contact email delivery
- Added SMTP-based email notifications for contact form submissions using `nodemailer`.
- Added a dedicated backend mail helper for transport setup and contact notification formatting.
- Introduced a branded HTML email template aligned with the portfolio's visual language.
- Kept plain-text email output as a fallback for clients that do not render HTML.
- Preserved database logging for contact submissions even when SMTP is unavailable.

### Navigation clarity improvements
- Added route-based scroll reset so page changes always start from the top.
- Added a subtle route transition cue using a thin progress bar and a light content-enter animation.
- Tuned the motion to be more understated and added reduced-motion support.
- Closed the mobile navigation menu automatically on route changes.

### SEO improvements for `Safain`
- Expanded homepage, about page, CV, projects, and contact metadata to connect `Safain`, `Achmad Safain`, and `LinearSAF`.
- Added `alternateName` schema values for person and site-level structured data.
- Strengthened homepage copy so `Safain` appears naturally as a personal brand alias rather than a stuffed keyword.
- Updated prerendered SEO metadata so crawlers receive the `Safain` signal directly in static HTML.
- Adjusted global SEO helpers and Open Graph site naming to reinforce the shorter brand query.

## Verification
- `npm run build` completed successfully in `frontend`.
- Frontend prerender completed successfully for public routes after the SEO updates.
- Backend mailer and route changes passed syntax validation during implementation.
