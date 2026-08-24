# Technical changelog

This is the append-only technical change history for implemented repository and material verified operational changes. It begins with the documentation baseline and does not invent undocumented releases.

## 2026-08-24

### Registered legal identity closeout

- Added the registered legal entity to the public footer: Hestiva (Pty) Ltd trading as Homent, Registration No. 2026/635515/07, with the operator-confirmed B-BBEE Level 1 status.
- Updated the Terms of Service so Hestiva (Pty) Ltd is explicitly identified as the contracting legal entity trading as Homent.
- Updated the Privacy Policy so Hestiva (Pty) Ltd is explicitly identified as the POPIA responsible party trading as Homent.
- Kept the SARS tax number and B-BBEE application/reference number out of the public website and repository documentation; neither is required for the approved public footer presentation.

### Post-Event visual integration and documentation closeout

- Integrated the operator-approved Post-Event Cleaning visual into the typed service model using `/images/services/post-event-cleaning.png` as the original fallback and the committed 480/768/1200 WebP derivatives through the existing responsive `ServiceImage` convention.
- Made Post-Event Cleaning eligible for the normal visual Services catalogue rather than the temporary no-image navigation fallback.
- Replaced the stale root README's Hestiva customer identity, legacy domain and superseded service list with the current Homent identity, `https://www.homent.co.za`, canonical primary-service model and Website → HestivaOS authority boundary.
- Reconciled the focused Post-Event status document and architecture with merged HestivaOS PR #212 and website PR #174; stale references to pending PR #210 are no longer presented as current state.
- Audited remaining Hestiva references against current documentation policy: historical pre-cutover records and technically accurate HestivaOS/internal identifiers remain intentionally preserved rather than rewritten as if they were current customer branding.

## 2026-08-23

### Post-Event Cleaning website quote flow and public service

- Added `Post-Event Cleaning` to the live `/quote` primary-service flow through the existing route-gated quote-enhancement architecture and enforced the approved one-time frequency.
- Added structured collection for the approved Post-Event event/venue, guest, bathroom, kitchen/dishwashing, outdoor-area, waste, ordinary-soiling and review-trigger facts, with browser-side fail-closed validation for required facts.
- Extended the Website Quote Contract v2 mapper boundary so Post-Event requests carry `request.postEvent` while preserving `schemaVersion: 2.0`, website provenance, the existing private HestivaOS endpoint/authentication model, stable retry identity and HestivaOS pricing/review authority.
- Added `/services/post-event-cleaning` as an indexable canonical public service page with customer-facing scope, FAQs, SEO metadata, sitemap/static-path participation and a typed internal navigation link; no unrelated image was reused when no approved Post-Event visual exists.
- Added focused Post-Event mapping/fail-closed regression coverage to the quote-contract test path used by CI.
- Verified exact website head `028e00b5347a2cd510cd480836170f9d302cfdc1` through documentation policy, tracked-secret and environment checks, TypeScript, public-form/structured-quote tests, targeted lint, Prettier, production build, runtime SEO and Cloudflare Worker dry-run before the final documentation reconciliation.
- Kept website merge blocked until the corresponding HestivaOS Website Quote v2 Post-Event contract is merged; the website does not get ahead of the accepting backend contract.

## 2026-08-21

### External Hestiva → Homent migration completion

- Recorded operator confirmation that Cloudflare permanent redirects for both legacy Hestiva hostnames are complete using the required path-preserving migration behaviour to `https://www.homent.co.za`.
- Recorded operator confirmation that the corresponding Google Search Console Hestiva → Homent migration/property work is complete.
- Closed the legacy-domain/Search Console item as an external operational follow-up while retaining the old Hestiva domain as an intentional migration asset.

### Quote service-model source reconciliation

- Removed `Apartment Cleaning` and `Eco-Friendly Cleaning` from the React quote form's primary-service source so the server-rendered form now matches the approved canonical model without post-hydration correction.
- Preserved Apartment as a property type and eco-friendly products as a separate Yes/No preference in the quote flow.
- Removed the obsolete `CanonicalServiceModelEnhancement` MutationObserver and its root-route wiring; canonical service options are now rendered correctly at source.
- Corrected the shared FAQ so apartment cleaning is described as cleaning an apartment property using the selected canonical service, not as a standalone primary service.
