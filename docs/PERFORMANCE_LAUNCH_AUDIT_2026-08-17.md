# Production Performance Launch Audit — 2026-08-17

## Scope

The production Lighthouse audit runs against the deployed Homent website and is read-only. It does not submit quote/contact forms or call HestivaOS ingestion endpoints.

The audit samples five representative public routes:

- `/`
- `/services`
- `/quote`
- `/locations`
- `/locations/sandton`

Each route is collected three times to reduce reliance on a single noisy run. The workflow remains manually dispatchable and also runs on pull requests that modify the Lighthouse workflow or Lighthouse configuration.

## Baseline observed in run #7

Median Lighthouse performance scores from the three production runs per route:

- Home: 96
- Services: 96
- Quote: 99
- Locations: 94
- Sandton location page: 87

Total Blocking Time and Cumulative Layout Shift were both zero in all sampled runs.

The Sandton location page was the main optimisation target. Lighthouse identified oversized external location images, missing high fetch priority for the LCP image, small-label colour-contrast failures and accessible-name mismatches on nearby-location links. These findings are addressed in the same audit branch.

## Remaining external constraint

Location imagery is currently delivered from Pexels. Lighthouse reports third-party cookie/DevTools issues associated with that external image host. Eliminating those third-party findings would require self-hosting or moving the location imagery behind a Homent-controlled asset path; that is a separate architectural/content decision and is not silently changed by this audit.
