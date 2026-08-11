# ADR-0002: Public contact validation policy

- **Status:** Accepted
- **Date:** 2026-08-11

## Context

The website's public quote and contact flows require reliable phone and email data for customer communication. The Slice 5M Website ↔ HestivaOS contract also requires contact matching to rely on dependable email/phone values rather than weakly validated free text.

Before this decision, server-side phone validation allowed any 7–30 character value made from digits and a small set of punctuation, while the quote UI only required the mobile field to be non-empty. Email validation was stronger on the server than in the quote UI.

## Decision

Public contact details use one shared website validation policy across the browser enhancements and server submission boundary:

- Phone input may contain digits, spaces, parentheses and hyphens, with an optional leading `+`.
- A South African local number is accepted when its compact form is exactly 10 digits beginning with `0`, for example `082 123 4567`.
- An international number is accepted only when written with a leading `+` and its compact form contains 8–15 digits beginning with a non-zero country code, for example `+27 82 123 4567`.
- Email input is capped at 254 characters, requires exactly one `@`, a practical unquoted local part of at most 64 characters, and a dotted DNS-style domain with valid labels.
- Browser validation gives customers an immediate correction opportunity, but the server schema remains authoritative and applies the same shared helper functions.
- Validation does not normalize, rewrite, persist, or merge customer contact values. HestivaOS matching/normalization remains separate integration work.

## Consequences

- Obvious placeholders, incomplete numbers, alphabetic phone text, malformed domains, and malformed local email parts are rejected before email delivery.
- Common South African local formatting and explicit international formatting remain accepted.
- The quote/contact enhancement stays route-gated to `/quote` and `/contact`; ordinary landing pages do not load it.
- Future changes to accepted phone/email semantics must update the shared helper and this decision history rather than silently changing only one validation layer.
