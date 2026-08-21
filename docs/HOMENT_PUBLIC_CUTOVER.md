# Homent public cutover

## 2026-08-12

This document records the active customer-facing Hestiva → Homent cutover implemented on PR #122 after the Homent visual assets were merged separately in PR #123.

### Public identity

- Customer-facing brand name: Homent.
- Canonical production origin: `https://www.homent.co.za`.
- General enquiry address: `info@homent.co.za`.
- Quote-system and quote enquiry address: `quotes@homent.co.za`.
- Transactional quote mail sender/reply address: `Homent Quotes <quotes@homent.co.za>` / `quotes@homent.co.za`.
- Homent's Resend sending domain was verified before the application sender was switched.

### Application changes

- Public page copy, navigation, forms, service/location content, legal pages and transactional email branding use Homent.
- Quote references use the `HOM-` prefix.
- Canonical URLs, sitemap/robots policy, structured metadata expectations, `llms.txt`, reverse-geocoding identification and Lighthouse production targets use `homent.co.za`.
- Contact submissions route to `info@homent.co.za`; quote submissions route to `quotes@homent.co.za`.
- Public POPIA/privacy requests use the verified `info@homent.co.za` contact rather than exposing an unverified new dedicated mailbox.

### Preserved internals and history

The rebrand does not require blanket renaming of internal identifiers, repository names, workflow names, historical documentation or architecture references that contain `Hestiva`. Those references remain where they are implementation-internal or historically accurate unless a separate migration explicitly changes them.

The existing monogram and internal architecture remain unchanged. No pricing, quote-calculation, storage, authentication, or Website ↔ HestivaOS boundary is changed by this public identity cutover.

## 2026-08-13 migration hardening

The repository-side migration guard was tightened after the public cutover.

### Active-source cleanup

- The contact-form fallback no longer contains a compatibility selector for `quotes@hestiva.co.za`; only the Homent quote address is recognised before the fallback is normalised to `info@homent.co.za`.
- The runtime form-notice DOM identifier was renamed from the legacy Hestiva identifier to a Homent identifier.
- Active form-security test fixtures now use the Homent hostname and Homent branding.

### Regression protection

`scripts/verify-homent-migration.mjs` is part of `verify:seo`. It checks active `src/` and `public/` text assets for the legacy `hestiva.co.za` domain/email suffix and verifies that the canonical Homent site identity remains configured in `src/lib/site.ts`, `public/robots.txt`, and `public/llms.txt`.

Historical documentation is intentionally excluded from this public-source guard because historical Hestiva references remain valid project records.

### External domain migration requirement

The repository establishes Homent canonical URLs, sitemap output and public metadata, but the old-domain move must also be enforced at the edge/DNS layer where the legacy Hestiva hostname is served.

The required external migration behaviour is:

- `https://hestiva.co.za/<path>` → permanent path-preserving redirect to `https://www.homent.co.za/<path>`.
- `https://www.hestiva.co.za/<path>` → permanent path-preserving redirect to `https://www.homent.co.za/<path>`.
- Query strings should be preserved unless there is a specific reason to discard them.
- The redirect should occur before application rendering so the old hostname cannot serve duplicate indexable content.
- The old domain should remain under control for the migration period rather than being allowed to lapse immediately.

The Cloudflare redirect configuration and Google Search Console migration steps are operational follow-ups and are not implemented by this repository-only change.

## 2026-08-14 homepage trust and conversion follow-up

- Homepage service cards are being converted from non-interactive presentation cards into direct links to their corresponding service-detail routes, with visible `Learn more` cues and a `View All Services` CTA.
- The generic homepage testimonial block is removed because the repository does not contain verified customer-review attribution for those statements.
- The removed testimonial block is replaced with a direct quote-request CTA using the existing `/quote` journey.
- Public social-media links remain intentionally hidden until the corresponding Homent profiles are live and customer-ready. Once the live profile URLs are confirmed, the Footer and Contact page are the preferred website surfaces for activation.
- This follow-up does not change pricing, quote transport, payment handling, deployment authority, service catalogue definitions, or the Website ↔ HestivaOS boundary.

## 2026-08-21 external migration completion

The operator confirmed that the external Hestiva → Homent domain migration has been completed.

- Cloudflare permanent redirects are configured for the legacy `hestiva.co.za` and `www.hestiva.co.za` hostnames to the canonical `https://www.homent.co.za` site, using the required path-preserving migration behaviour.
- The corresponding Google Search Console Hestiva → Homent migration/property work has been completed.
- The legacy Hestiva domain remains an intentionally retained migration asset rather than an active customer-facing canonical origin.

These are verified operational completions reported by the operator; they do not imply that the repository itself manages the Cloudflare or Google Search Console control planes.