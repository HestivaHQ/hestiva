# ADR-0005: Preserve public form failure stage in the client

- **Status:** Accepted
- **Date:** 2026-08-11

## Context

ADR-0004 introduced bounded non-sensitive server failure categories for public Quote and Contact submissions. The existing client controller still reduced every non-success result to one generic catch path before the branded notice was shown. As a result, production Contact failures remained operationally indistinguishable even though the server had already classified them.

## Decision

The shared submission-result helper preserves one bounded failure category from the most recent non-success result until the branded form-notice layer consumes it. The supported categories are `validation`, `bot`, `origin`, `rate_limit`, `delivery`, `unexpected`, and `framework`.

`framework` is a client-only diagnostic category for an absent result or a framework-style HTTP failure object. It does not expose response bodies, stack traces, credentials, customer data, provider details, or raw request identity.

The branded notice maps each category to customer-safe Hestiva copy. Quote and Contact continue to use the same existing server submission function and the same explicit `{ success: true }` acknowledgement contract.

## Consequences

- Production form failures can be distinguished without exposing sensitive internals.
- Existing generic controller catch paths remain compatible while the branded notice provides the useful customer-facing explanation.
- Failure state is consumed after one notice so an old category cannot leak into a later unrelated submission.
- Contact fallback guidance remains `info@hestiva.co.za`; Quote fallback guidance remains `quotes@hestiva.co.za`.
