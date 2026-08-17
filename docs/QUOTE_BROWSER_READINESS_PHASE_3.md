# Quote browser readiness testing — Phase 3

Status: Active CI expansion
Date introduced: 2026-08-17

## Purpose

Phase 3 extends the non-destructive GitHub Actions browser-readiness layer through final quote submission ownership without contacting production HestivaOS, sending email, consuming the production quote rate limit or creating operational records.

The production submission owner remains `StructuredQuoteSubmission`. Browser tests exercise that real click, consent, button-state and customer-message logic while replacing only the final server-function call with a development-only deterministic test seam.

## Production-safety boundary

`StructuredQuoteSubmission` checks `import.meta.env.DEV` before consulting `window.__HOMENT_TEST_STRUCTURED_QUOTE_SUBMIT__`.

Production builds therefore continue to call `submitStructuredQuoteForm` directly and do not use the browser-test seam. The seam exists only so local/GitHub Actions browser execution can prove final submission behavior without invoking the Website → HestivaOS production boundary.

The tests do not mock React state, bypass consent validation or replace the final submission controller.

## Coverage added

Phase 3 verifies on both desktop Chromium and mobile Chromium that:

- final consent is mandatory and blocks the structured submission owner before any submission attempt;
- a successful structured submission is owned exactly once, surfaces the returned quote reference and leaves the final button disabled as `Request Sent`;
- a delivery-category failure surfaces the approved `Q-DELIVERY` customer message and restores `Send Request` so the customer can retry;
- the structured snapshot reaching the final submission boundary retains the selected primary service.

## Relationship to earlier phases

- Phase 1 protects property/service/add-on branching and Laundry/Ironing eligibility/feasibility.
- Phase 2 protects later-step validation and state persistence through Review and Submit without sending.
- Phase 3 protects final structured-submission ownership and customer-visible success/failure behavior through a production-disabled test seam.

All three specifications run under `.github/workflows/quote-readiness-browser.yml`.

## Remaining future expansion

Useful later slices include:

- file upload limits/types and removal behavior;
- broader keyboard-only navigation and focus-order checks;
- additional mocked submission categories where they add distinct customer-value coverage;
- controlled production smoke testing for Website → HestivaOS authentication and persistence, kept separate from the normal brute-force matrix.
