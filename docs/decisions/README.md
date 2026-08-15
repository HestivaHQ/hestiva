# Hestiva website decision records

This directory contains append-only Architecture Decision Records (ADRs) for durable website engineering and operational decisions.

## Rules

- Accepted ADRs preserve the decision and rationale that existed when they were accepted.
- Do not rewrite an accepted ADR to make historical reasoning match later implementation.
- When a durable decision changes, create a new ADR that explicitly supersedes the earlier record and update this index.
- Use ADRs for architectural, security, deployment, indexing/information-architecture, or repository-governance choices that future maintainers need to understand.
- Routine implementation details belong in the technical work log and changelog instead of receiving an ADR.

## Index

- [ADR-0001: Repository documentation policy](ADR-0001-repository-documentation-policy.md) — **Accepted.** Documentation is part of the website repository Definition of Done and is enforced by CI.
- [ADR-0002: Public contact validation policy](ADR-0002-public-contact-validation-policy.md) — **Accepted.** Quote and contact phone/email validation use one shared browser/server policy while HestivaOS matching remains separate integration work.
- [ADR-0003: Separate public form rate-limit channels](ADR-0003-separate-public-form-rate-limit-channels.md) — **Accepted.** Contact and Quote retain independent best-effort per-isolate throttle buckets while sharing the same server submission boundary.
- [ADR-0004: Contact enquiry routing and safe failure categories](ADR-0004-contact-enquiry-routing-and-failure-categories.md) — **Accepted.** Contact enquiries route to `info@hestiva.co.za`, residential quote submissions remain on `quotes@hestiva.co.za`, and browser diagnostics expose only bounded non-sensitive failure categories.
- [ADR-0005: Preserve public form failure stage in the client](ADR-0005-preserve-public-form-failure-stage-in-client.md) — **Accepted.** The client preserves one bounded server failure category long enough for the branded notice to identify the failure stage without exposing sensitive internals.
- [ADR-0006: Enforce the laundry add-on operating model in the quote flow](ADR-0006-laundry-addon-operating-model.md) — **Accepted.** Laundry is add-on only to qualifying whole-home cleaning, facilities determine Wash/Dry/Fold versus Wash/Hang, and Ironing remains a separate per-load add-on.
- [ADR-0007: Canonical customer FAQ page and shared FAQ source](ADR-0007-canonical-customer-faq.md) — **Accepted.** `/faq` is the canonical comprehensive customer FAQ backed by one shared source.
- [ADR-0008: Coordinate financial disclosure and recurring billing with HestivaOS](ADR-0008-financial-disclosure-and-recurring-billing-contract.md) — **Accepted.** The website presents coordinated financial terms while HestivaOS remains the authoritative financial/operational source.
- [ADR-0009: Website quote authority handoff](ADR-0009-website-quote-authority-handoff.md) — **Accepted.** Residential quote creation is acknowledged by HestivaOS before website correspondence, while stable submission identity and structured Laundry/Ironing data are preserved across retries.
- [ADR-0010: Laundry and ironing content positioning](ADR-0010-laundry-and-ironing-content-positioning.md) — **Accepted.** Public Laundry & Ironing content may remain for education and search visibility while the service remains add-on-only and is never presented as a primary booking option.
- [ADR-0011: Homent public identity authority](ADR-0011-homent-public-identity-authority.md) — **Accepted.** Homent is the active customer-facing website identity; pre-cutover Hestiva-specific public-brand instructions are superseded while valid historical/internal Hestiva identifiers remain preserved.
