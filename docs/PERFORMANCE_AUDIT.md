# Website performance audit

Verified 2026-08-11 against current production-build output and current `main` after PR #108.

## Scope

This audit resumes the performance work that was paused after PR #97. It focuses on application-owned browser JavaScript, route-level code splitting, shared navigation, image loading semantics, production bundle output, and repeatable production measurement. It does not redesign the website or change Website ↔ HestivaOS integration architecture.

## Verified improvements already in place

- Homepage decorative Framer Motion usage was removed in PR #74.
- The unused `tw-animate-css` stylesheet import was removed in PR #75.
- Shared logo images have intrinsic dimensions to reduce layout shift from PR #76.
- The homepage hero retains deliberate high-priority loading and intrinsic dimensions.
- Service imagery is lazy-loaded by default, with eager/high-priority loading reserved for intentional hero/LCP cases.
- PR #97 moved the large quote/contact `LiveFormSubmission` controller behind a route-gated dynamic import, so ordinary landing pages do not synchronously import it.
- Quote-only add-on quantity enhancements are also dynamically imported only on `/quote`.
- PR #108 moved standard internal global Navbar destinations to TanStack Router `Link`, avoiding unnecessary full-document reloads during primary in-app navigation while preserving the `/#why-us` hash link as a normal anchor.

## Current production-build baseline

The 2026-08-11 GitHub production build after PR #107 reported:

- shared stylesheet: 54.66 kB raw / 10.41 kB gzip;
- homepage route chunk: 17.50 kB raw / 5.57 kB gzip;
- `LiveFormSubmission`: 19.65 kB raw / 6.47 kB gzip and route-gated to `/quote` and `/contact`;
- quote route chunk: 28.17 kB raw / 9.16 kB gzip;
- Navbar chunk: 35.79 kB raw / 11.47 kB gzip;
- largest shared client chunk: 364.00 kB raw / 116.02 kB gzip.

The large shared chunk is a framework/shared-runtime bundle and should not be modified by speculative app-level refactoring without evidence. The current application-specific route chunks are comparatively small, and the most important known app-owned controller is already code-split.

## Finding: global internal navigation

Before PR #108, the shared Navbar still used normal `<a href>` navigation for internal pages. That caused browser-level document navigation instead of using the already-loaded TanStack Router for ordinary internal route transitions.

PR #108 changed normal internal Navbar destinations to TanStack Router `Link`, while deliberately retaining `/#why-us` as a normal hash anchor. External/protocol links remain normal anchors.

Expected benefit: avoid unnecessary full-document reloads when visitors move between primary website pages through the global Navbar, improving repeat-navigation responsiveness without increasing integration scope or changing page semantics.

## Production measurement workflow

Source-level inspection is no longer sufficient to justify additional refactoring. The repository therefore includes a separate manual production Lighthouse workflow at `.github/workflows/hestiva-performance-check.yml` with configuration in `lighthouserc.cjs`.

The workflow:

- audits `https://www.hestiva.co.za/`, `https://www.hestiva.co.za/services`, and `https://www.hestiva.co.za/quote`;
- collects three Lighthouse runs per URL to reduce normal run-to-run variance;
- writes Lighthouse results to filesystem output rather than public temporary storage;
- uploads the generated reports as a GitHub Actions artifact retained for 30 days; and
- does not currently assert or block on score thresholds.

No performance threshold is introduced before a verified baseline exists. After the first successful production run is reviewed, stable budgets may be proposed in a separate focused change if the measurements justify them.

## Verified production Lighthouse baseline

GitHub Actions run `31456227764` audited production from `main` commit `3e74a04137b42b5171cc2ecc20c20a45a9b76c08` with three mobile Lighthouse runs per URL. Median values were:

| Page | Performance | FCP | LCP | Total transfer | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Homepage | 72 | 2.407 s | 16.621 s | 5.328 MB | 0 ms | 0 |
| Services | 78 | 2.462 s | 5.052 s | 9.692 MB | 0 ms | 0 |
| Quote | 94 | 2.535 s | 2.535 s | 3.014 MB | 0 ms | 0 |

The Services runs were volatile: the three performance scores were 66, 78, and 96, and one LCP run reached 25.875 seconds. The transfer size remained 9.692 MB in all three runs.

The reports did not support another JavaScript-architecture rewrite: median TBT was 0 ms on all three audited pages and CLS was 0. The material remaining issue was image transfer size. The homepage hero PNG was roughly 2.32 MB while rendered much smaller on the mobile audit viewport, and service PNGs were roughly multi-megabyte originals rendered around service-card widths. The shared white logo was also substantially oversized for its rendered dimensions.

## Evidence-backed image-delivery response

PR #110 introduces responsive WebP delivery while retaining the approved PNG originals as browser fallbacks:

- the homepage hero has 480, 768, and 1200 pixel WebP derivatives and uses `srcset`/`sizes` while preserving high fetch priority;
- service images use the existing 480, 768, and 1200 pixel WebP derivatives already present under `public/images/services/`, with the original PNG retained as fallback;
- Navbar and Footer use 144 and 288 pixel transparent WebP derivatives of the white logo, with the original PNG retained as fallback; and
- service-image lazy/eager loading behaviour remains unchanged.

The generated hero derivatives are approximately 27.7 KB, 54.2 KB, and 97.2 KB. The generated white-logo derivatives are approximately 1.8 KB and 3.8 KB. Existing 480-pixel service WebPs are roughly 12-27 KB and 1200-pixel versions are roughly 41-124 KB, depending on the image.

A second production Lighthouse run was completed after deployment, as recorded below.

## Verified post-WebP production comparison

GitHub Actions run `31457228551` audited production from merged `main` commit `4f6002d8f7b0a76cddf07837377387afcdec7a66` using the same three-run mobile method. Median values were:

| Page | Performance | LCP | Total transfer |
| --- | ---: | ---: | ---: |
| Homepage | 93 | 2.70 s | 2.54 MB |
| Services | 93 | 2.70 s | 2.61 MB |
| Quote | 94 | 2.53 s | 2.50 MB |

Compared with the original baseline, homepage performance increased from 72 to 93, homepage median LCP fell from 16.621 s to 2.70 s, and transfer fell from 5.328 MB to 2.54 MB. Services performance increased from 78 to 93, median LCP fell from 5.052 s to 2.70 s, and transfer fell from 9.692 MB to 2.61 MB. Quote performance remained effectively unchanged while transfer decreased.

One homepage run remained anomalous with a long render delay despite the optimized hero being selected at roughly 54 KB; this is recorded as run-to-run volatility rather than evidence that the multi-megabyte hero returned.

## Favicon follow-up

The post-WebP reports exposed a separate static-asset defect: `favicon-16.png` and `favicon-32.png` were each stored as 1254×1254 PNGs even though the HTML declares them as 16×16 and 32×32 icons. GitHub Actions verified the original sizes at 1,143,225 bytes and 1,157,806 bytes. PR #111 resizes the same artwork to the declared dimensions and writes optimized PNGs at the same public paths, producing 657-byte and 1,864-byte files respectively.

This favicon change removes roughly 2.30 MB of avoidable transfer without changing favicon URLs, metadata semantics, routing, or visual branding intent.

## Final production verification and audit closure

GitHub Actions run `31495511555` audited production from merged `main` commit `e87a1794ffab3a27b25daef70bc90f4dd554cbe7` after the favicon correction, using the same three-run mobile method. Median values were:

| Page | Performance | FCP | LCP | Total transfer | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Homepage | 93 | 2.40 s | 2.72 s | 240 KB | 0 ms | 0 |
| Services | 95 | 2.34 s | 2.41 s | 308 KB | 0 ms | 0 |
| Quote | 93 | 2.55 s | 2.55 s | 196 KB | 0 ms | 0 |

Compared with the original verified baseline, total transfer fell from 5.328 MB to 240 KB on the homepage, from 9.692 MB to 308 KB on Services, and from 3.014 MB to 196 KB on Quote. The median homepage and Services performance scores remained in the low-to-mid 90s after the favicon fix.

One homepage run scored materially lower because of a temporary Total Blocking Time spike rather than renewed image-transfer growth. The median homepage transfer remained 240 KB and the other two homepage runs scored 93, so the run is recorded as measurement volatility rather than evidence of an unresolved static-asset regression.

The evidence-backed performance audit is therefore **closed**. The measured application-owned bottlenecks identified in this audit were corrected, deployed, and re-measured in production. Further performance changes require new production evidence rather than speculative refactoring.

## Dependency observations

`framer-motion` remains declared in `package.json` even though repository source search no longer finds application imports. Removing the unused declaration and lockfile entry is optional dependency hygiene, but it is not treated as a browser-runtime performance fix because unused code is not currently imported into application source. A future dependency-cleanup PR may remove it with a regenerated, verified Bun lockfile.

## Audit conclusion

The material application-owned initial-load issue identified during the earlier audit—the globally imported quote/contact controller—has been corrected. Route-level code splitting is functioning, and no evidence supports a risky framework-level rewrite merely to chase the shared runtime chunk.

Global client-side internal navigation is corrected through PR #108. The first production Lighthouse baseline then identified image transfer as the material evidence-backed bottleneck, leading to responsive WebP delivery in PR #110 and the favicon correction in PR #111. Final production run `31495511555` verified median performance scores of 93, 95, and 93 for the homepage, Services, and Quote pages respectively, with transfer reduced to 240 KB, 308 KB, and 196 KB. The performance audit is closed; future optimization work must be driven by new production evidence rather than speculative source refactoring.
