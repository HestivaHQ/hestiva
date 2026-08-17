# Quote browser readiness testing — Phase 2

Status: Active CI expansion
Date introduced: 2026-08-17

## Purpose

Phase 2 extends the non-destructive GitHub Actions browser-readiness layer beyond property/service/add-on branching and into the later residential quote journey.

It runs against the locally started website in GitHub Actions and intentionally stops on the Review and Submit step. It does not send a real quote, create HestivaOS operational records, send customer correspondence, use production integration secrets or consume the production quote rate limit.

## Coverage added

The Phase 2 browser specification verifies the following on both desktop Chromium and mobile Chromium:

- Preferred Visit rejects a date before the form's authoritative minimum date and keeps the customer on that step.
- Selecting a pet-present option exposes Pet type and Pet temperament and requires both before progression.
- Product Restrictions and Allergies remain attached to Access and Household Details and survive forward/back navigation through Photos and Notes.
- A malformed email address blocks progression from Your Details and exposes the approved validation message.
- A representative end-to-end customer journey reaches Review and Submit with service, date and contact method preserved, then survives Back → edit → Continue navigation without losing entered customer details.

## Test isolation rules

- Tests follow the quote form's progressive-disclosure order rather than selecting future controls before their prerequisites are satisfied.
- Conditional-field tests populate unrelated required fields first so each failure isolates the rule under test.
- Date tests read the rendered input's `min` value instead of hard-coding a calendar date.
- The Review journey deliberately does not activate final submission.
- Phase 2 does not alter customer policy, submission ownership or HestivaOS behavior.

## Relationship to Phase 1

`tests/browser/quote-readiness.spec.mjs` remains the Phase 1 regression shield for property branching, conditional explanations, primary-service selection, Laundry/Ironing eligibility and Laundry feasibility.

`tests/browser/quote-readiness-phase2.spec.mjs` owns the later-step readiness scenarios documented here.

Together they run under `.github/workflows/quote-readiness-browser.yml` for quote-surface pull requests.

## Remaining future expansion

Useful future slices remain, but should be added incrementally rather than turning every PR into an excessive combinatorial matrix:

- file upload limits/types and removal behavior;
- broader keyboard-only navigation and focus-order checks;
- contact consent behavior at final review;
- safe mocked success/failure submission outcomes that prove final submission ownership without creating real operational records;
- controlled production smoke testing for Website → HestivaOS authentication and persistence.
