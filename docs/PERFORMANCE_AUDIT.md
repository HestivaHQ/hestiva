# Website performance audit

Verified 2026-08-11 against current production-build output and current `main` after PR #107.

## Scope

This audit resumes the performance work that was paused after PR #97. It focuses on application-owned browser JavaScript, route-level code splitting, shared navigation, image loading semantics, and production bundle output. It does not redesign the website or change Website ↔ HestivaOS integration architecture.

## Verified improvements already in place

- Homepage decorative Framer Motion usage was removed in PR #74.
- The unused `tw-animate-css` stylesheet import was removed in PR #75.
- Shared logo images have intrinsic dimensions to reduce layout shift from PR #76.
- The homepage hero retains deliberate high-priority loading and intrinsic dimensions.
- Service imagery is lazy-loaded by default, with eager/high-priority loading reserved for intentional hero/LCP cases.
- PR #97 moved the large quote/contact `LiveFormSubmission` controller behind a route-gated dynamic import, so ordinary landing pages do not synchronously import it.
- Quote-only add-on quantity enhancements are also dynamically imported only on `/quote`.

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

Before this audit completion, the shared Navbar still used normal `<a href>` navigation for internal pages. That caused a browser-level document navigation instead of using the already-loaded TanStack Router for ordinary internal route transitions.

The focused performance follow-up changes normal internal Navbar destinations to TanStack Router `Link`, while deliberately retaining `/#why-us` as a normal hash anchor. External/protocol links remain normal anchors.

Expected benefit: avoid unnecessary full-document reloads when visitors move between primary website pages through the global Navbar, improving repeat-navigation responsiveness without increasing integration scope or changing page semantics.

## Dependency observations

`framer-motion` remains declared in `package.json` even though repository source search no longer finds application imports. Removing the unused declaration and lockfile entry is optional dependency hygiene, but it is not treated as a browser-runtime performance fix because unused code is not currently imported into application source. A future dependency-cleanup PR may remove it with a regenerated, verified Bun lockfile.

## Audit conclusion

The material application-owned initial-load issue identified during the earlier audit—the globally imported quote/contact controller—has been corrected. Route-level code splitting is functioning, hero/service image loading semantics are intentional, and no evidence supports a risky framework-level rewrite merely to chase the shared runtime chunk.

The remaining focused optimization identified by this audit is global client-side internal navigation, implemented separately and verified through the normal CI/build gate. After that change, performance work should move to production measurement/QA (Core Web Vitals and real asset transfer sizes) rather than speculative source refactoring.
