# Quote submission diagnostic hardening — 2026-08-15

## Context

Production quote testing after the structured HestivaOS intake work continued to show the same generic customer alert for materially different failure classes. The server already distinguishes validation, same-origin/security, rate-limit, HestivaOS delivery and unexpected failures, but `StructuredQuoteSubmission` discarded that distinction and displayed one generic message.

The production audit also confirmed that the website uses a best-effort per-Worker-isolate throttle of five quote attempts per Cloudflare IP identity in 15 minutes. The counter is consumed before HestivaOS delivery, so repeated failed production tests can themselves lead to later `rate_limit` failures that look identical to the original defect when the category is hidden.

## Change

`StructuredQuoteSubmission` now preserves the existing fail-closed behavior while presenting a safe, non-secret diagnostic code for the category already returned by the server:

- `Q-VALIDATION` — submitted quote state did not pass the server-side validation boundary;
- `Q-RATE-LIMIT` — the existing submission throttle rejected the attempt;
- `Q-DELIVERY` — the website prepared the request but HestivaOS delivery/acknowledgement failed;
- `Q-SECURITY` — same-origin or honeypot verification failed;
- `Q-UNEXPECTED` — an unclassified server-side preparation failure occurred;
- `Q-CLIENT` — the browser/server-function call itself threw before a structured result was returned;
- `Q-UNKNOWN` — defensive fallback for an unrecognized failure response.

No HestivaOS URL, secret, response body, customer data, internal stack trace or credential detail is exposed to the browser. The authoritative success boundary remains unchanged: the website reports success only after HestivaOS returns a non-empty `quoteReference`.

## Verified surrounding facts

- PR #139 recorded a successful real production website submission after the HestivaOS route correction and runtime configuration, proving the architecture and credential contract had worked in production.
- Current `structured-submission.functions.ts` retains the same HestivaOS base-URL construction, Bearer-secret authentication, 12-second timeout and authoritative `quoteReference` acknowledgement requirement.
- Later correspondence handling changes only prevent a post-acknowledgement email failure from falsely telling the customer that the quote itself was not received.
- The Townhouse progression regression could produce a pre-delivery payload mapping failure by clearing required `outdoor`/`estate` values; this is separate from an actual HestivaOS delivery failure.

## Verification

Run the full exact-head Hestiva PR Check before merge. After deployment, use one deliberate production quote attempt after the 15-minute throttle window has cleared. If the request still fails, record the displayed `Q-*` code before making further changes. A `Q-DELIVERY` result requires Cloudflare runtime/HestivaOS endpoint-auth investigation; `Q-VALIDATION` or `Q-UNEXPECTED` keeps the investigation inside the website payload/state path.