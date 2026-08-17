# Quote Browser Readiness — Phase 6

## Scope

Phase 6 verifies distinct customer-facing structured-submission failure categories without contacting production HestivaOS.

Covered outcomes:

- validation → `Q-VALIDATION`
- rate limit → `Q-RATE-LIMIT`
- origin/security rejection → `Q-SECURITY`
- unexpected server-side failure → `Q-UNEXPECTED`
- unknown/unclassified failure → `Q-UNKNOWN`
- thrown browser/network failure → `Q-CLIENT`

`delivery` / `Q-DELIVERY` remains covered by Phase 3 and is intentionally not duplicated here. `origin` and `bot` intentionally share the same customer-facing `Q-SECURITY` response, so one representative security case is sufficient.

## Assertions

Each Phase 6 case proves that:

1. the final structured submission owner receives the request through the existing development-only stub;
2. the branded customer notice shows the expected failure code and meaningful recovery copy;
3. the final Send Request button is restored and remains retryable;
4. the stub is invoked exactly once.

## Safety boundary

Phase 6 does not:

- call production HestivaOS;
- send production correspondence;
- consume production quote rate limits;
- create operational records.

## Expected matrix

The merged Phase 5 baseline contains 84 browser executions. Phase 6 adds 6 logical scenarios across desktop and mobile Chromium, for an expected total of 96 executions.
