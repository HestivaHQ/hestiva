# Homent homepage LCP preload experiment

Date: 2026-08-12

## Production evidence

Post-favicon production Lighthouse run `31629904502` restored lightweight page transfer after the Homent cutover. The homepage median remained approximately 92 performance with LCP around 2.86 s, while total transfer returned to roughly 252 KB and median TBT/CLS remained 0.

The homepage LCP candidate is the responsive hero image rendered by `src/components/HeroSection.tsx`. The hero already uses 480/768/1200 WebP candidates, explicit dimensions, `fetchPriority="high"`, and async decoding. The existing route/document head did not preload that image.

## Focused change

The homepage route now emits a responsive `rel="preload" as="image"` link for the Homent hero. The preload uses the same 480/768/1200 WebP candidate set and the same `sizes` expression as the rendered `<picture>`, with the 1200 WebP as the fallback `href` and high fetch priority.

The canonical SEO link is preserved by composing the preload with the existing `createSeoHead()` links rather than replacing them. The preload is scoped to `/` only; Services, Quote, Contact, location and service pages do not receive it.

The 2.44 MB PNG fallback is not preloaded.

## Verification rule

This is an evidence-driven experiment, not a claimed production improvement. The full PR quality gate must pass before merge. After deployment, the manual production Lighthouse workflow must be rerun with the existing three-run mobile method. The change is retained only if the production comparison supports an LCP benefit without a material transfer, correctness, SEO, or stability regression.
