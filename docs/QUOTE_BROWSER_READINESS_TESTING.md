# Quote browser readiness testing

Status: Active CI readiness layer
Date introduced: 2026-08-16

## Purpose

The quote flow has accumulated conditional property, service, add-on, validation and submission behavior that is not fully exercised by the existing unit/contract checks. This browser-readiness layer runs in GitHub Actions so maintainers do not need a locally supported Playwright environment.

The suite is intentionally non-destructive. It exercises the locally started website and stops before real quote submission, so brute testing does not create HestivaOS Quotes, send customer correspondence, consume the production Website integration secret or exhaust the production quote rate limit.

## Runtime model

- GitHub Actions uses `ubuntu-latest`.
- The repository's normal frozen Bun dependency install remains unchanged.
- `@playwright/test` is installed only inside the CI runner and is not added to the website's normal runtime dependency graph.
- Playwright installs Chromium on the GitHub-hosted runner.
- The test config starts the local Vite/TanStack application on `127.0.0.1:4173`.
- The same readiness scenarios run with desktop-Chromium and mobile-Chromium viewport/device settings.
- Failure artifacts retain the Playwright HTML report, screenshots, traces and videos when available.

## Initial coverage matrix

The first readiness slice covers production regressions and high-risk branches already encountered in the quote flow:

- `/quote` renders without browser console errors.
- Empty Step 1 exposes required-field feedback and focuses the first invalid control.
- House storeys does not expose the superseded `Not sure` choice.
- Apartment uses unit-floor choices rather than storeys.
- Townhouse keeps Storeys, Balcony/Patio and Estate/Complex controls independently usable.
- `Other` property type exposes and requires a property-description field.
- `Not sure` primary service exposes and requires a cleaning-requirements explanation.
- `Custom` frequency exposes and requires a frequency explanation.
- Laundry and Ironing are enabled and selectable after every currently supported primary-service option, including `Not sure`.
- Selecting Laundry exposes structured facilities/load controls; selecting Ironing exposes its structured load control.
- Laundry with `No washing machine` is rejected before the customer can leave the add-on step.

## Explicit boundary

This CI suite does not prove production Website → HestivaOS authentication, Cloudflare runtime secrets, Resend delivery or authoritative HestivaOS persistence because exercising those paths at brute-test volume would create real operational records and anti-abuse traffic. Those remain controlled production smoke tests.

The browser suite should expand incrementally to cover the remaining quote steps, back/forward state persistence, date rules, pets/access conditional fields, contact validation, review-page persistence, keyboard/focus behavior and safe mocked submission outcomes.

## Workflow

The workflow is `.github/workflows/quote-readiness-browser.yml` and is available through `workflow_dispatch`. It also runs automatically for pull requests to `main` that modify the quote/browser-test surface.

Do not weaken or delete scenarios merely because a legitimate implementation change makes them fail. Reconcile the implementation with the established quote policy, or explicitly update the policy/documentation and tests together when the business rule itself changes.
