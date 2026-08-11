# Technical changelog

This is the append-only technical change history for implemented repository and material verified operational changes. It begins with the documentation baseline and does not invent undocumented releases.

## 2026-08-11

### Quote catalogue alignment

- Converted `Eco-friendly products` from an add-on into a separate optional Yes/No quote preference and preserved that preference in the existing administrative quote details without introducing the future structured Website ↔ HestivaOS handoff contract.
- Renamed the quote add-on `Balcony or patio` to the approved Slice 5M catalogue name `Balcony / Patio Cleaning` while keeping the outdoor-area property field separate and making no quantity, pricing, transport, identity, or handoff changes.
- Removed the unsupported bathroom `Other` option from the quote flow so bathroom values align with the approved Slice 5M `1`, `2`, `3`, `4`, `5+` business rule.
- Preserved the existing bedroom-dependent narrowing for smaller homes and made no Website ↔ HestivaOS transport, identity, security, pricing, or storage changes.

### Documentation governance

- Adopted repository-wide documentation as part of the Definition of Done through root `AGENTS.md`.
- Added append-only architecture decision records under `docs/decisions/` and accepted ADR-0001 for the documentation policy.
- Added `scripts/validate_documentation.py` and wired it into the normal PR quality gate so meaningful implementation/configuration changes require a `docs/` companion change.
- Backfilled verified 2026-08-10 through 2026-08-11 work from merged PR records without reconstructing unsupported history.

### Performance and location visuals

- Replaced the earlier geographic location-gallery implementation with 198 unique Pexels people-free residential interior images: exactly three images for each of 66 approved location pages, guarded against duplicate photo IDs (PR #96).
- Lazy-loaded the large quote/contact `LiveFormSubmission` controller only on `/quote` and `/contact`, reducing unnecessary JavaScript on normal SEO landing pages while preserving form behaviour (PR #97).

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
