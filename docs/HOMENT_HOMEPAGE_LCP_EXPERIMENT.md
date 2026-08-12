# Homent homepage LCP preload experiment

Date: 2026-08-12

## Production evidence

Post-favicon production Lighthouse run `31629904502` restored lightweight page transfer after the Homent cutover. The homepage median remained approximately 92 performance with LCP around 2.86 s, while total transfer returned to roughly 252 KB and median TBT/CLS remained 0.

The homepage LCP candidate is the responsive hero image rendered by `src/components/HeroSection.tsx`. The hero already uses 480/768/1200 WebP candidates, explicit dimensions, `fetchPriority="high"`, and async decoding. The existing route/document head did not preload that image.

## Experiment

PR #125 added a homepage-only responsive `rel="preload" as="image"` link for the Homent hero using the same 480/768/1200 WebP candidate set and `sizes` expression as the rendered `<picture>`. The canonical SEO link remained intact and the 2.44 MB PNG fallback was not preloaded.

The full PR quality gate passed and the change was deployed. Production Lighthouse run `31633820063` then measured the same three mobile homepage runs after deployment.

## Measured result

Before preload, the homepage median was approximately performance 92, FCP 2.53 s, LCP 2.86 s and transfer 252 KB.

After preload, the homepage median was approximately performance 93, FCP 2.33 s, LCP 2.79 s and transfer 258 KB, with TBT and CLS remaining 0. The three observed homepage LCP values were approximately 2.31 s, 2.79 s and 2.88 s.

The approximately 70 ms median LCP change is too small relative to ordinary Lighthouse run-to-run variance to justify retaining additional preload complexity. The experiment therefore failed its retention rule and the homepage route is restored to its previous head configuration.

## LCP phase evidence

The Lighthouse LCP breakdown for the three post-preload homepage traces identified the hero image as the LCP element. Observed phase timings were:

| Run | TTFB | Resource load delay | Resource load duration | Element render delay |
| --- | ---: | ---: | ---: | ---: |
| 1 | 257.6 ms | 60.9 ms | 53.8 ms | 116.2 ms |
| 2 | 149.0 ms | 11.8 ms | 64.0 ms | 47.7 ms |
| 3 | 204.0 ms | 11.7 ms | 67.1 ms | 53.2 ms |

The hero resource itself is already small and quick to transfer. The phase evidence does not support another image-compression or preload experiment as the next optimization. The more useful next investigation is the initial document/render path, including TTFB and the render-blocking stylesheet reported by Lighthouse.

## Decision

Remove the responsive preload introduced by PR #125. Keep the existing responsive WebP hero, explicit dimensions and `fetchPriority="high"`. Any further homepage LCP work must be driven by measured server/document/render-path evidence rather than speculative hero-image changes.
