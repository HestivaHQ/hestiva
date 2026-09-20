# Final Website Launch Readiness Audit — 2026-08-28

## Scope

This audit re-validates the Homent website after the registered legal-identity closeout and after manually running the comprehensive Quote Readiness Browser Test against `main` commit `49b049bec43949c8bece6a4c2cd4a2b4ec670574`.

## Browser-suite evidence

Manual workflow run `32745687276` executed 110 Playwright tests across desktop and mobile Chromium.

Result before remediation:

- 108 tests passed.
- 2 tests failed: the same `canonical-service-model.spec.mjs` assertion on desktop and mobile.
- The application correctly exposed `Post-Event Cleaning` in the primary-service selector; the test's expected list was stale and still represented the pre-Post-Event catalogue.
- The failure therefore identified test drift, not a customer-facing service-model defect.

The passing coverage included:

- every sitemap page loading cleanly with one visible primary heading and no horizontal overflow;
- internal links exposed by sitemap pages resolving without broken HTTP responses;
- core quote, services, contact and legal navigation destinations;
- complete indexable metadata, stable canonicals, sitemap/robots consistency and not-found noindex behavior;
- quote validation, back/forward state retention, consent handling, success/failure/retry behavior and structured error categories;
- photo selection, removal, limits, mobile camera behavior and structured submission boundaries;
- keyboard navigation/focus behavior and add-on accessibility;
- Laundry & Ironing eligibility and no-washing-machine rejection.

## Remediation

Updated `tests/browser/canonical-service-model.spec.mjs` so the canonical expected primary-service sequence includes `Post-Event Cleaning` immediately after `Post-Renovation Cleaning` and before `Not sure`.

No application service catalogue, quote behavior, pricing, Website ↔ HestivaOS contract, legal content, SEO policy or deployment behavior was changed by this remediation.

## Remaining verification

Before launch sign-off:

1. the normal Hestiva PR Check must pass on the exact remediation head;
2. the comprehensive Quote Readiness Browser Test must be re-run against the corrected merged head and pass;
3. production smoke verification should confirm the deployed footer legal identity plus Terms and Privacy pages.

The site should not be declared fully launch-ready until those final gates are green.
