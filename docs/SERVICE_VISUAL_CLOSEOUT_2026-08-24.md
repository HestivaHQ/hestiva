# Primary Service Visual Closeout — 2026-08-24

## Current state

The Homent public service catalogue has 11 canonical primary services. Post-Event Cleaning and Post-Renovation Cleaning are both canonical primary services and have dedicated public service pages.

The operator committed approved responsive image families for both services under `public/images/services/`:

- `post-event-cleaning.png` with 480/768/1200 WebP derivatives;
- `post-renovation-cleaning.png` with 480/768/1200 WebP derivatives.

## Issue found during final website audit

The `/services` overview maintained a second hard-coded presentation list in addition to the canonical public-service catalogue. Post-Event Cleaning had been added correctly to the canonical catalogue and had a valid image, but it was absent from that second list. The overview therefore filtered it out even though its dedicated route, sitemap/indexability state and visual were already valid.

Post-Renovation Cleaning was intentionally rendered through a separate image-less fallback card because it previously had no approved visual.

## Implemented closeout

PR #176 removes the duplicated primary-service presentation authority from `/services` and renders the visual catalogue from `canonicalPrimaryServicePages`, the existing canonical public-service source.

The change also attaches the operator-approved Post-Renovation image family to `postRenovationService`. With that visual available, the old image-less Post-Renovation fallback card is no longer required.

Expected result after merge:

- all 11 canonical primary services render in the normal `/services` visual sequence;
- Post-Event Cleaning appears in the overview and continues to link to `/services/post-event-cleaning`;
- Post-Renovation Cleaning appears with its approved responsive image and continues to link to `/services/post-renovation-cleaning`;
- future canonical primary services cannot silently disappear merely because a second overview-only service list was not updated;
- `ServiceImage` continues to select the 480/768/1200 WebP variants responsively with the original PNG as fallback.

## Preserved boundaries

This closeout does not change primary-service classification, pricing, quote calculation, Website Quote Contract semantics, HestivaOS authority, submission transport, sitemap policy, robots policy, canonical URLs, or service-page indexability.

## Verification required

Before merge, the normal Hestiva PR Check must pass on the exact final PR head, including TypeScript, public-form/quote tests, lint, formatting, production build, runtime SEO verification and Cloudflare Worker dry-run. Runtime SEO must continue to verify the Post-Event and Post-Renovation dedicated routes as indexable public pages.
