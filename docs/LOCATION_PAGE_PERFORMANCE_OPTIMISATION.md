# Location Page Performance Optimisation

## Scope

This change responds to the production Lighthouse baseline recorded in PR #165, where the representative Sandton location page trailed the other sampled customer routes.

## Implemented

- The shared location-page hero image now advertises responsive Pexels widths through `srcset` and `sizes` instead of always requesting the 1400px source.
- The hero image is marked `fetchPriority="high"` while remaining eager-loaded, matching its role as the location-page LCP candidate.
- Supporting location gallery images also advertise responsive Pexels widths and remain lazy-loaded.
- Small uppercase gold labels on location pages use a darker gold tone to improve text contrast against the light backgrounds while preserving the Homent visual language.
- Nearby-location links now use their visible text as the accessible name instead of a separate `aria-label`, removing the Lighthouse accessible-name mismatch.

## Deliberate non-change

The Pexels location image library remains externally hosted. Self-hosting was not required to address the measured LCP/image-sizing issue and would add asset ingestion, storage, licensing-record and cache-management complexity. The existing Pexels attribution and licence metadata remain unchanged.

## Verification

The change must pass the normal Hestiva PR gate and the existing whole-site/browser readiness coverage. A follow-up production Lighthouse run should be used to compare the representative location-page result against the PR #165 baseline, where Sandton's median performance score was 87 with zero CLS and zero Total Blocking Time.
