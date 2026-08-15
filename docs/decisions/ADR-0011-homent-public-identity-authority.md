# ADR-0011: Homent public identity authority

Status: Accepted
Date: 2026-08-15

## Context

The repository completed the public Hestiva → Homent cutover in August 2026. Active website source, production URLs, public email addresses, transactional branding and SEO identity now use Homent, as recorded in `docs/HOMENT_PUBLIC_CUTOVER.md`.

`HEPS.md` predates that cutover and remains a broad living product/engineering specification. It still contains Hestiva-specific public-brand instructions such as naming Hestiva as the active customer-facing brand and prescribing Hestiva-era tagline/copy. Those statements conflict with verified current production identity even though many non-brand HEPS rules remain useful and valid.

A blanket rename of every `Hestiva` identifier would be incorrect because historical records, the repository name and the HestivaOS integration boundary legitimately retain that name.

## Decision

1. **Homent is the active customer-facing website brand.**
2. `docs/HOMENT_PUBLIC_CUTOVER.md` is the current authority for customer-facing brand, production origin and public email cutover state.
3. `AGENTS.md` must explicitly warn implementation agents not to reintroduce Hestiva customer-facing branding from superseded HEPS wording or historical documents.
4. Pre-cutover Hestiva-specific public-brand instructions in `HEPS.md` are superseded by the verified Homent cutover record and current active source.
5. Non-brand HEPS rules remain in force unless separately superseded, including engineering safety, accessibility, content-integrity, testing, architecture-preservation and governance requirements.
6. Historical documentation and implementation-internal identifiers may retain `Hestiva` where historically or technically accurate. In particular, this decision does not rename HestivaOS, repository identifiers, historical ADRs, historical work logs or integration variable names solely for cosmetic consistency.
7. Active customer-facing source must continue to avoid legacy `hestiva.co.za` public URLs/email addresses, with `scripts/verify-homent-migration.mjs` retaining regression protection for active `src/` and `public/` text assets.

## Consequences

- Future coding agents have an explicit current-identity rule before making website changes.
- Historical engineering evidence remains intact instead of being rewritten to resemble the present.
- A Hestiva reference is no longer treated as automatically wrong; reviewers distinguish public/customer-facing identity from valid historical or internal naming.
- No runtime behavior, pricing, quote contract, HestivaOS boundary, deployment configuration or secret changes are introduced by this decision.

## Verification basis

- `docs/HOMENT_PUBLIC_CUTOVER.md` records the completed public cutover and the intentional preservation of internal/historical Hestiva identifiers.
- Current repository migration verification checks active source for legacy `hestiva.co.za` public identity regressions.
- Current production quote and contact configuration uses the Homent domain and public mailboxes.
