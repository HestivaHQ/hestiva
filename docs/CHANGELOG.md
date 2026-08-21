# Technical changelog

This is the append-only technical change history for implemented repository and material verified operational changes. It begins with the documentation baseline and does not invent undocumented releases.

## 2026-08-21

### Quote service-model source reconciliation

- Removed `Apartment Cleaning` and `Eco-Friendly Cleaning` from the React quote form's primary-service source so the server-rendered form now matches the approved canonical model without post-hydration correction.
- Preserved Apartment as a property type and eco-friendly products as a separate Yes/No preference in the quote flow.
- Removed the obsolete `CanonicalServiceModelEnhancement` MutationObserver and its root-route wiring; canonical service options are now rendered correctly at source.
- Corrected the shared FAQ so apartment cleaning is described as cleaning an apartment property using the selected canonical service, not as a standalone primary service.
- Preserved HestivaOS transport, pricing authority, historical/compatibility mappings, Laundry/Ironing semantics, payment policy, and public-service compatibility routes.

## 2026-08-14

### Website Quote Contract v2 and Laundry/Ironing finalization

- Finalized the website side of HestivaOS Issue #79 with structured Website Quote Contract v2 transport and fail-closed HestivaOS acknowledgement before quote confirmation correspondence.
- Retained `/services/laundry-folding` for compatibility and customer information while presenting it as **Laundry & Ironing Add-On**, not a standalone service.
- Removed remaining `Laundry Folding` primary-service semantics from the legacy quote source and frequency controller while preserving valid Laundry and Ironing add-ons.
- Preserved facilities, laundry outcome, laundry-load quantity and ironing-load quantity as structured contract data rather than deriving them from display labels.
- Added and verified regression coverage for valid washer/dryer Laundry, no-washer rejection, ironing-only requests and rejection of Laundry Folding as a primary service.
- Verified the PR quality gates through TypeScript, tests, lint, formatting, production build, runtime SEO and Cloudflare Worker dry-run.
- Kept production activation blocked pending operational verification of Website → HestivaOS runtime secrets and HestivaOS COIDA/routing configuration; HestivaOS routing runtime/documentation currently also requires reconciliation between OpenRouteService implementation and older Google Routes documentation.

## 2026-08-13

### Customer-facing payment and recurring-policy alignment

- Added canonical website payment/billing policy documentation covering the approved 50% initial/once-off deposit, 50% completion balance, standard recurring one-visit advance, optional month-end billing, cancellation/refund/payment-dispute rules and launch manual-EFT boundary.
- Updated the public Terms of Service to remove the superseded statement that Homent has no universal deposit percentage and to expose the approved customer-facing payment, recurring, cancellation, refund and price-change rules.
- Updated the shared FAQ content so the dedicated FAQ page and any shared FAQ surfaces use the approved deposit, recurring billing, month-end billing, cancellation and refund answers.
- Updated the customer quote-request acknowledgement email to state explicitly that a quote request is not a booking confirmation, that no payment is due merely for submitting the request, and that the priced quotation/booking correspondence will disclose the 50% booking amount and completion balance.
- Preserved the existing quote-request transport, pricing authority, Website ↔ HestivaOS contract boundary, Resend delivery path and booking-confirmation architecture; this change does not introduce a payment gateway or website-owned financial ledger.

## 2026-08-12

### Quote routing and validation UX correction

- Routed the Contact-page `Request a Quote` CTA to the dedicated `/quote` journey after production QA confirmed it incorrectly scrolled to the general Contact enquiry form; verified the major global Navbar, homepage and service-page quote CTAs already target `/quote`.
- Aligned the visible quote form's required markers and error summary with the core fields already enforced by the progressive quote-flow enhancement, including home-layout, visit-planning, access/household and conditional pet details.
- Changed past-date handling so preferred and alternative dates earlier than tomorrow produce an explicit `Please choose a date from tomorrow onwards.` error instead of being silently discarded, and exposed tomorrow as the browser date minimum.
- Added visible focused feedback when final contact consent is missing instead of silently returning, and made DOM-generated inline errors idempotent to avoid repeated MutationObserver churn.
- Preserved pricing, `HOM-` reference generation, server-side schema validation, email routing, rate limiting, honeypot protection, file handling and Website ↔ HestivaOS integration boundaries.
- Production QA remains required after deployment before these customer-facing UX corrections are considered verified live.

### Homent favicon performance correction

- Re-measured the migrated Homent production site with Lighthouse run `31624786999` and verified that page-level application performance remained healthy while transfer size regressed to roughly 2.5 MB because the replacement favicon files were oversized.
- Replaced the four Homent favicon PNGs at their existing public paths with true-size optimized PNGs: 16×16 at 210 bytes, 32×32 at 306 bytes, 180×180 at 1,063 bytes, and 512×512 at 2,926 bytes.
- Preserved favicon URLs and page metadata; no routing, pricing, quote-flow, email, deployment-authority, or Website ↔ HestivaOS integration behavior changed.
- A post-deployment production Lighthouse rerun remains required to verify the expected transfer-size recovery.

### Homent visual asset cutover

- Added the approved Homent logo family and customer-facing replacement visual assets, including the homepage hero, service imagery, add-on imagery, profile badge, favicons and social-share image.
- Preserved the existing responsive image strategy: homepage/service WebPs at 480/768/1200 widths, add-on WebPs at 384/640/960 widths, and white navbar/footer logo WebPs at 144/288 widths.
- Updated `src/lib/site.ts`, `Navbar.tsx`, `Footer.tsx`, and `HeroSection.tsx` so public logo and hero references use the new Homent asset filenames while retaining the current Hestiva domain and email addresses for a later controlled cutover.
- Kept the existing monogram asset unchanged and made no routing, pricing, quote-flow, email-delivery, deployment-authority, or Website ↔ HestivaOS architecture change.

## 2026-08-11

### Launch-readiness repairs

- Split the public form throttle into separate Contact and Quote buckets so repeated quote activity cannot exhaust the Contact form's per-isolate allowance; kept the same five-submissions-per-15-minutes best-effort limit for each channel.
- Replaced browser-native `window.alert()` submission dialogs on `/quote` and `/contact` with Hestiva-branded in-page success/error notices, removing the browser/hostname notification header while preserving submission semantics.
- Added regression coverage for the exact Contact-page payload shape and for independent Contact/Quote rate-limit buckets.
- Repaired the Post-Renovation Cleaning quote path so selecting that primary service exposes `One-time` and `Custom` frequency choices instead of leaving the required Frequency field empty and blocking quote completion. The repair is `/quote`-only and does not change pricing, submission transport, persistence, or Website ↔ HestivaOS integration.

### Public form validation

- Added one shared browser/server phone and email validation policy for the public quote/contact flows: South African local numbers must compact to 10 digits beginning with `0`, international numbers require a leading `+` and 8–15 digits, and email values use bounded practical local-part and DNS-style domain checks. The enhancement is route-gated to `/quote` and `/contact` and does not normalize, persist, or match HestivaOS customer records.
- Added ADR-0002 to preserve the validation policy and its separation from future Website ↔ HestivaOS matching/normalization work.

### Quote catalogue alignment

- Moved `Post-Renovation Cleaning` into the primary-service quote catalogue and server validation, removed the legacy `Post-renovation dust removal` add-on, and preserved `Recently renovated` as a separate Home Condition without implementing the future Website ↔ HestivaOS transport layer.
- Extended the quote-only add-on quantity enhancement so `Balcony / Patio Cleaning` can carry a positive-integer quantity with default `1` when multiple areas exist, alongside the existing `Extra refrigerator` quantity behaviour, without defining the future structured Website ↔ HestivaOS quantity schema.
- Added quantity handling for the `Extra refrigerator` add-on with default quantity `1`; the quote-only browser enhancement preserves the selected quantity in the existing add-on submission text without defining the future structured Website ↔ HestivaOS quantity schema.
- Converted `Eco-friendly products` from an add-on into a separate optional Yes/No quote preference and preserved that preference in the existing administrative quote details without introducing the future structured Website ↔ HestivaOS handoff contract.
- Renamed the quote add-on `Balcony or patio` to the approved Slice 5M catalogue name `Balcony / Patio Cleaning` while keeping the outdoor-area property field separate and making no quantity, pricing, transport, identity, or handoff changes.
- Removed the unsupported bathroom `Other` option from the quote flow so bathroom values align with the approved Slice 5M `1`, `2`, `3`, `4`, `5+` business rule.
- Preserved the existing bedroom-dependent narrowing for smaller homes and made no Website ↔ HestivaOS transport, identity, security, pricing, or storage changes.

### Documentation governance

- Adopted repository-wide documentation as part of the Definition of Done through root `AGENTS.md`.
- Added append-only architecture decision records under `docs/decisions/` and accepted ADR-0001 for the documentation policy.
- Added `scripts/validate_documentation.py` and wired it into the normal PR quality gate so meaningful implementation/configuration changes require a `docs/` companion change.
- Backfilled verified 2026-08-10 through 2026-08-11 work from merged pull-request records without reconstructing unsupported history.

### Performance and location visuals

- Replaced the earlier geographic location-gallery implementation with 198 unique Pexels people-free residential interior images: exactly three images for each of 66 approved location pages, guarded against duplicate photo IDs (PR #96).
- Lazy-loaded the large quote/contact `LiveFormSubmission` controller only on `/quote` and `/contact`, reducing unnecessary JavaScript on normal SEO landing pages while preserving form behaviour (PR #97).
- Changed standard internal global Navbar destinations to TanStack Router `Link` so primary navigation no longer forces full-document reloads, while preserving the `/#why-us` hash link as a normal anchor (PR #108).
- Added a manual production Lighthouse diagnostic workflow covering the homepage, Services page, and Quote page with three runs per URL and 30-day filesystem report artifacts; no score threshold is enforced before a verified baseline exists.
- Recorded the first production Lighthouse baseline and responded to its image-transfer bottleneck by adding responsive WebP delivery for the homepage hero, service imagery, and shared white logo while preserving approved PNG fallbacks; the later production run verified material improvement in homepage and Services performance (PR #110).
- Verified the post-WebP production improvement, then corrected the two remaining oversized favicon files from 1254×1254 source images to true 16×16 and 32×32 optimized PNGs, reducing them from roughly 2.30 MB combined to 2,521 bytes while preserving their existing public paths (PR #111).
- Closed the performance audit after final production run `31495511555` verified median performance scores of 93/95/93 for Homepage/Services/Quote and reduced transfer to 240 KB/308 KB/196 KB respectively, with no further evidence-backed application performance change required.

## 2026-08-10

### Geographic and on-page SEO

- Locked one authoritative 66-area service geography across Sandton/Johannesburg North, Randburg, Rosebank/Central-North Johannesburg, Roodepoort/Johannesburg West, and Midrand/Waterfall/Kyalami; removed Riverlea and legacy Pretoria/Centurion/East Rand location targets from generated location data and structured business service areas (PR #88).
- Added unique local SEO content profiles for all 66 approved location pages (PR #89).
- Added restrained founder/trust content to the About page without unsupported biography or credibility claims (PR #90).
- Redesigned location pages into Hestiva's light visual system and iterated verified/vicinity geographic galleries (PRs #91 and #92); that gallery implementation was later superseded by PR #96 while the location-page design and SEO structure remained.
- Refined homepage and service-page metadata/content around residential cleaning in Johannesburg and Midrand (PR #93).
- Strengthened internal-link architecture across canonical navigation, service pages, the Areas We Serve hub, core location hubs, and nearby-location links (PR #94).

### Quote, contact, legal, launch and performance hardening

- Re-verified the hardened production form path after PR #68, including successful live Cloudflare/Resend quote delivery, and documented the resolved lazy rate-limit salt initialization issue (PR #71).
- Corrected service-page contact targets and tablet navigation behaviour (PRs #72 and #73).
- Reduced homepage animation JavaScript, removed unused animation CSS, and reserved logo layout dimensions (PRs #74, #75 and #76).
- Updated live contact messaging, finalised privacy/service-policy content, aligned structured business data, removed the public business address and sensitive-access notices, and cleaned redundant CI diagnostic workflows (PRs #77 through #82).
- Added end-to-end quote photo attachments, mobile camera/gallery controls, optional geolocation/reverse geocoding, consistent home-layout questions, exact unit floor/access capture, image compression, expanded photo limits, service-dependent frequency/date rules, required restrictions/allergy choices, and progressively stricter quote validation/access rules (PRs #83 through #85 and current `main` state).
- Repaired the malformed quote-controller class string that caused a production build failure, restoring a passing Cloudflare/Vite build while preserving intended quote-flow behaviour (PR #87).

## 2026-08-09

### Documentation

- Hardened public contact/quote submissions with strict bounded server validation, same-origin checks, server-generated references, a supplemental honeypot, an isolate-scoped throttle, a ten-second provider timeout, sanitized failures, privacy-safe logs, and focused tests. Recorded the Durable Object and Turnstile prerequisites without adding infrastructure or keys.
- Recorded the verified `undici@7.28.0` Nitro tooling exposure, exhausted upstream remediation routes, operational constraints, non-blocking deployment decision, and temporary accepted-risk disposition without describing the vulnerability as resolved.
- Added a daily read-only upstream remediation watch that reports clean current-Nitro and newer Nitro 3 paths from authoritative npm metadata; future remediation remains a separate reviewed PR requiring a post-change OSV scan.
- Recorded the operationally verified Cloudflare clean-checkout production sequence: `bun install`, the required `bun run build`, and `npx wrangler deploy`.
- Documented that omitting the Build command caused Wrangler to fail on the missing `dist/server/server.js` entry point, and that configuring `bun run build` resolved the deployment.
- Captured Bun 1.2.15 and Node.js 24.18.0 as the versions shown by the verified Cloudflare build environment.
- Established the canonical engineering-document index.
- Documented the implemented application architecture and the boundary between the current quote email flow and any future production quotation system.
- Recorded the verified Cloudflare native Git production deployment path and settings, including its sole-authority decision and the root/generated Wrangler relationship.
- Added a names-only environment inventory and handling rules for the server-only Resend secret and configured public Supabase variables.
- Added an operational recovery guide and lightweight technical work log.

No application behavior, infrastructure, runtime configuration, dependencies, or secrets changed by the original documentation-baseline work.
