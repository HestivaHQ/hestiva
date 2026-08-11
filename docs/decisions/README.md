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
