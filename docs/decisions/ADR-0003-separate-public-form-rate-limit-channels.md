# ADR-0003: Separate public form rate-limit channels

- **Status:** Accepted
- **Date:** 2026-08-11

## Context

The public Quote and Contact forms share the same TanStack Start server function and the same best-effort per-Worker-isolate abuse control. During launch QA, repeated valid Quote submissions could consume the single five-submissions-per-15-minutes bucket for the visitor IP and cause a subsequent Contact submission to be rejected even though the Contact form itself had not been abused.

The two public flows have distinct server-validated service vocabularies: Contact uses the enquiry types `Request a Quote`, `General Enquiry`, `Existing Booking`, `Service Area Check`, and `Feedback`, while the Quote flow submits residential cleaning service names. This allows the server to classify the channel without trusting a new browser-controlled field.

## Decision

Keep the existing five-submissions-per-15-minutes best-effort throttle, but derive two independent per-isolate keys from the Cloudflare-provided request identity:

- `contact|<identity>` for Contact-page enquiry types; and
- `quote|<identity>` for residential cleaning quote services.

The raw IP address remains unlogged and is still hashed with the isolate salt inside the existing rate-limit helper. This does not make the control globally consistent; Durable Object-backed or Cloudflare-native global enforcement remains separate future infrastructure work.

Public form success/error dialogs are also presented as Hestiva-branded in-page notices on `/quote` and `/contact` rather than browser-native alert dialogs. This presentation change does not alter server acknowledgement semantics.

## Consequences

- Repeated Quote submissions cannot exhaust the Contact form's per-isolate allowance, and vice versa.
- Each public channel still receives the same best-effort five-submissions-per-15-minutes protection.
- No new client-trusted rate-limit channel field is introduced.
- The existing limitations of isolate-local in-memory throttling remain unchanged.
- Changes to public form channel classification or throttle topology must update this decision history and the current architecture/recovery documentation.
