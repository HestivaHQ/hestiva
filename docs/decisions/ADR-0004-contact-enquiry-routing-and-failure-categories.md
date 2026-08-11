# ADR-0004: Contact enquiry routing and safe failure categories

- **Status:** Accepted
- **Date:** 2026-08-11

## Context

Production launch QA confirmed that the public Contact form still failed after the earlier rate-limit channel split. The Contact page also showed `quotes@hestiva.co.za` as its fallback email even though general Contact enquiries belong with the Hestiva information inbox. The shared server function previously collapsed validation, origin, rate-limit, delivery, and unexpected failures into the same `{ success: false }` response, which prevented safe production diagnosis.

## Decision

- Contact-page enquiry types (`Request a Quote`, `General Enquiry`, `Existing Booking`, `Service Area Check`, and `Feedback`) are administrative Contact traffic and route to `info@hestiva.co.za`.
- Residential cleaning Quote submissions continue to route to `quotes@hestiva.co.za`.
- The server may return only a bounded non-sensitive failure category: `validation`, `bot`, `origin`, `rate_limit`, `delivery`, or `unexpected`.
- Provider response bodies, credentials, customer content, raw request identity, and internal exception details remain undisclosed.
- The branded browser notice converts those categories into customer-safe guidance. On the Contact page, the fallback address is `info@hestiva.co.za`.

## Consequences

- Contact and Quote administrative mail are delivered to the appropriate Hestiva inboxes while continuing to use the same validated server boundary and Resend adapter.
- Production QA can distinguish the stage that rejected a request without exposing sensitive internals.
- The existing independent Contact/Quote rate-limit buckets remain unchanged.
- A production Contact submission must be re-verified after deployment before the launch incident is closed.
