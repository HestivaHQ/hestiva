# Technical work log

This append-only log records verified engineering and material operational work without reconstructing unsupported history. Add newest entries first. Link pull requests/commits when available and describe validation without including secrets or customer data.

## 2026-08-24 — Integrated Post-Event visual and reconciled current website documentation

**Purpose:** Finish the Post-Event public-service presentation and perform a current-state documentation sweep after the Homent cutover and cross-system Post-Event rollout.

**Work recorded:**

- verified the operator-uploaded Post-Event source PNG and its 480/768/1200 WebP derivatives are present on website `main` under `public/images/services/`;
- added the approved Post-Event image metadata to `src/content/post-event-cleaning-service.ts`, allowing the existing `ServiceImage` component to use the responsive WebP set with the original PNG fallback and allowing the service to participate in the normal visual Services catalogue;
- replaced the root README's stale Hestiva customer-facing identity, legacy `hestiva.co.za` website address and superseded service list with the current Homent identity, `https://www.homent.co.za`, canonical primary-service model and Website → HestivaOS authority boundary;
- reconciled `docs/POST_EVENT_CLEANING_WEBSITE_V1.md` from its stale staged/#210 blocker state to the verified merged state: HestivaOS PR #212 superseded #210 and merged before website PR #174;
- reconciled `docs/ARCHITECTURE.md` so Post-Event imagery is described as implemented rather than absent;
- reviewed repository-wide Hestiva references against `AGENTS.md`, `docs/HOMENT_PUBLIC_CUTOVER.md`, merged website PR history and current HestivaOS state; retained historical pre-cutover Hestiva wording and technically accurate HestivaOS/internal identifiers rather than rewriting valid history; and
- reviewed website PR history through the Homent cutover, canonical service-model reconciliation, launch closeout and Post-Event rollout to distinguish shipped state from old PR-era blockers.

**Preserved boundaries:** No Post-Event pricing, quote validation vocabulary, Website Quote Contract, HestivaOS ingestion, deployment topology, authentication, payment, or operational workflow changed. The image integration uses the existing static service-image architecture.

**Verification required before merge:** Normal Hestiva PR quality gates on the exact final head, including documentation policy, secret/environment checks, TypeScript, targeted tests, lint/format, production build, runtime SEO and Cloudflare Worker dry-run.

## 2026-08-23 — Added Post-Event Cleaning website quote flow and public service

**Purpose:** Extend the Homent website for the approved Post-Event Cleaning service without moving quotation/pricing authority out of HestivaOS or allowing the public website to get ahead of the receiving Website Quote Contract.

**Work recorded:**

- created website PR #174 from exact `main` `898ad984598e7e04a6c4923e70995c1035b96b4e` and kept the work isolated on `feat/post-event-cleaning-website-v1`;
- added `Post-Event Cleaning` to the live `/quote` primary-service flow through a route-gated enhancement rather than creating a second final-submit owner;
- enforced the approved one-time frequency and collected the approved event/venue, approximate guest count, bathrooms used, kitchen use, dishwashing, outdoor event areas, ordinary waste, ordinary spills/soiling and review-trigger facts;
- failed closed in the browser when required Post-Event facts are incomplete or invalid while retaining HestivaOS as the authoritative contract-validation, workload, profitability, automatic-quote-limit and `NEEDS_ATTENTION` authority;
- added `src/lib/quote/post-event-hestiva-os-payload.ts` so the existing Website Quote Contract v2 transport carries the Post-Event fact set in `request.postEvent` while preserving `schemaVersion: 2.0`, `source: HESTIVA_WEBSITE`, the existing private endpoint/authentication boundary and existing non-Post-Event mapping;
- added Post-Event mapping and missing-fact regression coverage to the existing quote-contract test file that the normal PR gate executes, while retaining focused mapper tests;
- added `/services/post-event-cleaning` as a canonical indexable service page with customer-facing scope, FAQs and SEO metadata, admitted it through the public service policy and static/sitemap path set, and added a typed footer navigation link;
- deliberately did not reuse an unrelated service image because no approved Post-Event visual asset existed at that point;
- updated `docs/POST_EVENT_CLEANING_WEBSITE_V1.md`, `docs/ARCHITECTURE.md`, `docs/TECHNICAL_WORK_LOG.md` and `docs/CHANGELOG.md` to keep the implemented public-form/business-workflow boundary documented; and
- kept merge blocked on the then-current HestivaOS PR #210 receiving-contract lane until that work was safely reconstructed and superseded by PR #212.

**Verification:** The implementation head `028e00b5347a2cd510cd480836170f9d302cfdc1` passed the complete Hestiva PR Check run `32644096017`: diff integrity, documentation policy/companion gate, tracked-secret scan, environment validation, TypeScript, public-form/structured-quote tests including Post-Event cases, targeted lint, Prettier, production build, runtime SEO and Cloudflare Worker dry-run. Earlier runs correctly caught and led to fixes for a Prettier import issue, a missing internal link for the new indexable service page, and an invalid literal TanStack route link. Final website PR #174 subsequently merged after HestivaOS PR #212 cleared the receiving-contract dependency.

**Cross-system final state:** HestivaOS PR #212 superseded stale #210 and merged the Website Quote v2 Post-Event receiving contract. Website PR #174 then merged the website Post-Event flow and public service. HestivaOS Issue #73 remains the historical coordination source, not a current website merge blocker.

**Preserved boundaries:** No website-owned authoritative Post-Event price calculation, quote persistence, Work Order creation, booking acceptance, financial state, runtime secret, deployment topology, or second quote-submission owner was introduced.

## 2026-08-21 — Reconciled quote service options at source

**Purpose:** Complete the canonical-service cleanup by making the actual server-rendered quote form agree with the approved service model rather than relying on a browser MutationObserver to repair incorrect options after hydration.

**Work recorded:**

- verified `src/routes/quote.tsx` still hard-coded `Apartment Cleaning` and `Eco-Friendly Cleaning` as primary-service choices even though Apartment is property context and eco-friendly products are a separate Yes/No preference;
- removed those two non-primary values from the React quote source while preserving `Apartment` in Property Type and the existing eco-friendly-products preference;
- removed `CanonicalServiceModelEnhancement` and its root-route wiring because the source form now renders the canonical primary-service list directly;
- corrected the shared Apartment FAQ to explain that customers choose the cleaning service they need and identify Apartment as the property type;
- retained the deliberately permissive legacy contact/server vocabulary and HestivaOS historical compatibility mappings rather than deleting backward-compatibility paths that are not customer-facing primary-service selectors; and
- updated architecture and change records to reflect the source-level ownership change.

**Preserved boundaries:** No pricing, HestivaOS service IDs, Website Quote Contract v2 mapping, submission transport, authentication, payment policy, Laundry/Ironing operating model, public compatibility URLs, or historical records were changed.

**Verification state:** Source reconciliation was merged through website PR #171; website launch closeout was subsequently recorded through PR #172.

## 2026-08-14 — Finalized Website Quote Contract v2 and Laundry/Ironing website semantics

**Purpose:** Complete the website side of HestivaOS Issue #79 without activating production quote ingestion before its external prerequisites are verified.

**Work recorded:**

- retained `/services/laundry-folding` as an informational compatibility route while presenting its customer-facing content as **Laundry & Ironing Add-On** and explicitly preventing standalone-booking semantics;
- removed `Laundry Folding` from the legacy quote Primary Service source and removed the final unreachable legacy frequency fallback while preserving legitimate Laundry and Ironing add-on options;
- preserved laundry facilities, resolved outcome, `laundryLoads`, and `ironingLoads` as structured first-class Website Quote Contract v2 data rather than reconstructing those values from display labels;
- implemented fail-closed Website → HestivaOS submission before customer/admin Resend correspondence and required an authoritative HestivaOS `quoteReference` acknowledgement before reporting successful intake;
- verified HestivaOS `main` contains the corresponding v2 ingestion/validation path alongside backward-compatible v1 handling;
- added and passed regression coverage for washer + dryer, no-washer rejection, ironing-only requests, and rejection of `Laundry Folding` as a primary service;
- corrected the retained compatibility page metadata so runtime SEO verification passes; and
- verified the website PR quality gate through TypeScript, 15 regression tests, lint, Prettier, production build, runtime SEO and Cloudflare Worker dry-run before the final source/documentation reconciliation.

**Historical activation note:** At this point production activation still depended on external Website → HestivaOS configuration and OS-side costing/routing prerequisites. Later launch-closeout records supersede this as current website state; the provisional COIDA input remains an HestivaOS operational follow-up rather than a website implementation blocker.

**Scope:** Website-side Issue #79 implementation and verification only.

## 2026-08-12 — Corrected quote routing and validation feedback

**Purpose:** Resolve production QA findings where quote intent could be sent to the general Contact form and where required quote information, invalid past dates, or missing final consent did not always produce clear customer feedback.

**Work recorded:**

- verified the Contact-page hero `Request a Quote` CTA pointed to `#enquiry-form` while the dedicated quote journey is `/quote`, and changed that CTA to a TanStack Router `/quote` link;
- swept the main global quote-intent surfaces and confirmed the Navbar, homepage quote CTA, service-page quote CTA and service availability CTA already target `/quote`, so those working links were left unchanged;
- reconciled the visible React required-field configuration with the core progressively required quote fields already enforced by `LiveFormSubmission`, adding visible markers/error-summary coverage for home layout, visit planning, access/household and conditional pet details;
- set preferred/alternative visit dates to a minimum of tomorrow and replaced silent past-date clearing with an explicit inline `Please choose a date from tomorrow onwards.` rejection;
- replaced the final consent guard's silent return with a visible focused consent error; and
- made DOM-generated inline errors idempotent so repeated quote `MutationObserver` synchronization does not recreate an unchanged warning.

**Preserved boundaries:** No pricing, `HOM-` reference, server validation, Resend/email routing, rate limiting, Contact honeypot, photo/file handling, persistence, or Website ↔ HestivaOS integration contract changed.

**Verification state:** Source investigation and CTA sweep were completed on PR #128 and later launch-readiness work verified the website at repository level.

## 2026-08-12 — Corrected Homent favicon transfer regression

**Purpose:** Resolve the post-cutover production transfer regression identified by Homent Lighthouse run `31624786999` without reopening speculative application-runtime optimisation.

**Work recorded:**

- verified Homent production medians remained healthy at performance `92/94/93` for Homepage/Services/Quote while total transfer regressed to approximately `2.50/2.57/2.45 MB`;
- traced the regression to replacement favicon assets, including `favicon-16.png` at `1,143,225` bytes and `favicon-32.png` at `1,157,806` bytes, plus oversized 180×180 and 512×512 variants;
- regenerated the four favicon PNGs at their declared dimensions and retained the existing public paths and metadata references;
- reduced the files to `210` bytes (16×16), `306` bytes (32×32), `1,063` bytes (180×180), and `2,926` bytes (512×512); and
- made no route, JavaScript architecture, pricing, quote-flow, email, deployment-authority, or Website ↔ HestivaOS integration change.

**Verification state:** The subsequent performance audit closed after final production verification.

## 2026-08-12 — Added Homent visual assets and wired public asset references

**Purpose:** Prepare the customer-facing visual layer for the Hestiva → Homent rebrand without changing the then-current production domain, public email addresses, or internal application architecture.

**Work recorded:**

- added the approved Homent logo family plus replacement homepage hero, service, add-on, profile-badge, favicon and social-share assets on PR #123;
- preserved the existing responsive delivery strategy with homepage/service WebPs at 480/768/1200 widths, add-on WebPs at 384/640/960 widths, and white navbar/footer logo WebPs at 144/288 widths;
- updated `src/lib/site.ts` to reference Homent logo filenames while retaining the then-current `hestiva.co.za` production URL and Hestiva email addresses for the later controlled cutover;
- updated Navbar and Footer responsive logo references and the homepage Hero responsive/fallback image references to the new Homent filenames;
- kept the existing monogram asset unchanged; and
- made no pricing, quote-flow, email-delivery, deployment-authority, routing, security-boundary, or Website ↔ HestivaOS architecture change.

**Verification state:** This was pre-cutover work. PR #122 and later migration hardening/closeout records establish the current Homent public state.

## 2026-08-11 — Repaired Contact form launch behaviour and public form feedback

**Purpose:** Address the launch-readiness failure where Contact submissions could be rejected after repeated Quote QA activity and replace browser-hostname alert dialogs with branded Hestiva notices.

**Work recorded:**

- verified that Contact and Quote used the same isolate-local five-submissions-per-15-minutes rate-limit bucket even though they are separate customer journeys;
- preserved the same per-channel limit while separating server-side `contact` and `quote` keys using the existing Cloudflare-provided request identity and service vocabulary, without introducing a new client-trusted channel field;
- added regression coverage proving the exact Contact-page payload passes the authoritative schema and that exhausting the Contact bucket does not exhaust the Quote bucket;
- added `/quote` and `/contact`-only `BrandedFormNotices` so existing submission success/error messages render in-page under then-current Hestiva branding instead of browser-native `window.alert()` dialogs that display the site hostname;
- updated architecture and recovery guidance and accepted ADR-0003 for the durable rate-limit channel decision; and
- made no change to the existing Resend recipient/sender path, five-per-15-minute per-channel limit, HestivaOS integration, pricing, persistence, shared quote identity, or authentication.

**Scope:** Historical pre-Homent-cutover public website work. Later cutover records supersede the customer-facing brand wording while preserving the technical rate-limit and notice architecture.

## 2026-08-11 — Repaired Post-Renovation Cleaning quote completion path

**Purpose:** Fix a launch-readiness blocker discovered after Post-Renovation Cleaning was promoted to a primary service: the existing frequency controller did not recognize the new service and therefore exposed no selectable frequency values.

**Work recorded:**

- verified that `Post-Renovation Cleaning` was present in the quote primary-service selector and server enum but absent from `LiveFormSubmission`'s service-frequency mapping;
- added a `/quote`-only browser enhancement that restores `One-time` and `Custom` frequency choices for Post-Renovation Cleaning;
- preserved the existing quote state, required-field progression, email submission path, and server-side service validation;
- kept the repair route-gated so ordinary landing pages do not load it; and
- made no pricing, HestivaOS transport, persistence, shared quote identity, Accept/Decline, or authentication change.

**Scope:** Launch-blocker repair for the standalone quote flow only.

## 2026-08-11 — Strengthened public phone and email validation

**Purpose:** Align the standalone website's public contact data quality with the approved Slice 5M requirement for stronger phone/email validation while keeping HestivaOS matching and normalization out of scope.

**Work recorded:**

- added `src/lib/contact-validation.ts` as the shared browser/server validation source for public phone and email values;
- accepted South African local phone numbers only when their compact form is exactly 10 digits beginning with `0`, and accepted international numbers only with an explicit leading `+` and 8–15 digits;
- replaced the previous permissive server phone regex and separate email rule with shared helper refinements at the Zod server boundary;
- added route-gated `/quote` and `/contact` browser validation through `ContactValidationEnhancements`, including immediate feedback and input-length bounds without rewriting submitted values;
- expanded form-security tests with valid South African/international phone examples and rejected malformed phone/email examples;
- recorded the durable validation policy in ADR-0002; and
- made no HestivaOS customer matching, contact normalization, persistence, shared quote identity, pricing, Accept/Decline, or transport change.

**Scope:** Public website contact-data validation only. Server validation remains authoritative.

## 2026-08-11 — Moved Post-Renovation Cleaning to the primary-service catalogue

**Purpose:** Align the standalone website quote catalogue with the approved Slice 5M business rule that Post-Renovation Cleaning is a primary service rather than an add-on.

**Work recorded:**

- added `Post-Renovation Cleaning` to the quote-flow primary-service selector;
- added the same value to the server-side allowed service enum so the then-current email submission path accepted the new primary-service value;
- removed `Post-renovation dust removal` from the selectable add-on list;
- preserved `Recently renovated` as a separate Home Condition that may coexist with the primary service; and
- made no Website ↔ HestivaOS endpoint, structured payload, pricing, shared-reference, Accept/Decline, persistence, or authentication change at that stage.

**Scope:** Historical focused website catalogue alignment. Later Website Quote Contract work supersedes the old email-only transport state.

## 2026-08-11 — Closed the production performance audit after final verification

**Purpose:** Record the final production measurement after the favicon correction and formally close the evidence-backed website performance audit.

**Work recorded:**

- reviewed successful Lighthouse production run `31495511555` from merged `main` commit `e87a1794ffab3a27b25daef70bc90f4dd554cbe7` using the same three-run mobile method as the earlier measurements;
- recorded median homepage performance `93`, FCP `2.40 s`, LCP `2.72 s`, transfer `240 KB`, TBT `0 ms`, and CLS `0`;
- recorded median Services performance `95`, FCP `2.34 s`, LCP `2.41 s`, transfer `308 KB`, TBT `0 ms`, and CLS `0`;
- recorded median Quote performance `93`, FCP/LCP `2.55 s`, transfer `196 KB`, TBT `0 ms`, and CLS `0`;
- confirmed transfer fell from the original baseline of `5.328 MB`, `9.692 MB`, and `3.014 MB` to `240 KB`, `308 KB`, and `196 KB` respectively;
- retained one lower homepage run as documented measurement volatility because the anomaly was a temporary blocking-time spike rather than a return of oversized static-asset transfer; and
- formally closed the performance audit without introducing any new runtime code, dependency, deployment, pricing, quote-flow, or Website ↔ HestivaOS integration change.

**Verification:** GitHub Actions run `31495511555` completed successfully and uploaded the production Lighthouse reports.

## 2026-08-11 — Corrected favicon transfer and verified the responsive-image improvement

**Purpose:** Remove the remaining oversized favicon transfer identified after the responsive-WebP deployment and record the first production evidence that PR #110 materially improved page performance.

**Work recorded:**

- inspected the existing favicon files in GitHub Actions and verified `favicon-16.png` was 1254×1254 at 1,143,225 bytes and `favicon-32.png` was 1254×1254 at 1,157,806 bytes despite being declared as 16×16 and 32×32 in the page head;
- resized the existing artwork to the declared dimensions, producing a 16×16 PNG at 657 bytes and a 32×32 PNG at 1,864 bytes while preserving the same public paths and PNG format;
- reviewed successful production Lighthouse run `31457228551` after PR #110 and verified median homepage performance improved from `72` to `93` with LCP from `16.621 s` to `2.70 s`, while Services improved from `78` to `93` with LCP from `5.052 s` to `2.70 s`;
- verified the remaining oversized transfer in that run came from the favicon requests rather than the newly responsive hero/service images; and
- kept the correction limited to the two favicon assets plus performance/documentation records.

**Verification:** Favicon dimensions and byte sizes were measured in GitHub Actions with Pillow. A final production Lighthouse run after deployment was required and later completed before the performance audit was closed.

## 2026-08-11 — Added responsive WebP delivery after the first production Lighthouse baseline

**Purpose:** Address the verified image-transfer bottleneck from the first production Lighthouse measurement without changing approved visuals or introducing runtime image infrastructure.

**Work recorded:**

- reviewed production Lighthouse run `31456227764`, which measured three mobile runs each for Homepage, Services, and Quote from merged `main` commit `3e74a04137b42b5171cc2ecc20c20a45a9b76c08`;
- recorded median baseline performance of `72/78/94`, LCP of `16.621/5.052/2.535 s`, and transfer of `5.328/9.692/3.014 MB` for Homepage/Services/Quote respectively;
- confirmed TBT remained `0 ms` and CLS `0`, pointing to image transfer rather than JavaScript blocking as the material bottleneck;
- added 480/768/1200 WebP derivatives for the homepage hero and 144/288 WebP derivatives for the shared white logo, while reusing the responsive service WebPs already present in the repository;
- updated HeroSection, ServiceImage, Navbar, and Footer to prefer the responsive WebPs while retaining every approved PNG as fallback;
- preserved existing dimensions, hero fetch priority, service lazy/eager semantics, alt text, layout, routing, quote flow, pricing, email, and Website ↔ HestivaOS boundaries; and
- removed the temporary same-repository asset-generation workflow after it committed the derivatives, leaving no new runtime dependency or CI workflow in the final branch.

**Verification:** Generated asset sizes were inspected in GitHub Actions. Production Lighthouse was rerun after deployment and later verified the material improvement recorded above.

## 2026-08-11 — Added production Lighthouse diagnostics and reconciled navigation optimization history

**Purpose:** Move the performance audit from source/build inspection to repeatable production measurement without introducing a permanent application dependency or blocking threshold before a baseline exists.

**Work recorded:**

- added manual `.github/workflows/hestiva-performance-check.yml` using Lighthouse CI `0.15.1` on the GitHub runner;
- added `lighthouserc.cjs` with production URLs for Home, Services, and Quote and `numberOfRuns: 3`;
- configured Lighthouse reports to remain on the workflow filesystem and upload as a 30-day Actions artifact instead of using temporary public Lighthouse storage;
- kept the workflow diagnostic-only with no score assertions until production measurements establish evidence-backed thresholds;
- reconciled the previously merged PR #108 Navbar optimization into the canonical technical work log and changelog; and
- made no application source, dependency manifest, lockfile, runtime configuration, deployment authority, pricing, quote transport, or Website ↔ HestivaOS change.

**Verification:** Feature-branch diff was reviewed against `main`; the change set was limited to the workflow, Lighthouse configuration, and required documentation.

## 2026-08-11 — Adopted repository documentation governance and backfilled recent history

**Purpose:** Make documentation a required part of the website engineering workflow and reconcile the recent implemented state with authoritative records.

**Work recorded:**

- added root `AGENTS.md` with documentation principles, required update matrix, historical-record rules, operational-action rules, and the implementation/PR checklist;
- added `docs/decisions/` and accepted ADR-0001 for repository documentation policy;
- added `scripts/validate_documentation.py` and wired it into `.github/workflows/hestiva-pr-check.yml` so meaningful implementation/configuration changes require a `docs/` companion change;
- updated `docs/README.md` with the policy and canonical document map;
- backfilled the verified 2026-08-10 through 2026-08-11 work below from merged PR records and current repository state without reconstructing unsupported details;
- reconciled `docs/ARCHITECTURE.md` with the current 66-area geography, 198-image interior location library, route-gated form controller, and ten-file quote limit; and
- preserved the existing deployment/environment records except where current code or merged PR evidence justified correction.

**Verification:** The governance PR changed only repository workflow/documentation files. Historical entries below are based on merged PR records and current repository state; closed unmerged PRs are not recorded as shipped.

## 2026-08-10 — Rebuilt location visuals as a unique people-free residential interior library

**Source:** PR #96.

**Work recorded:**

- replaced the earlier location-photo approach with exactly 3 images for each of the 66 approved location pages, for 198 image assignments total;
- required all Pexels photo IDs to be unique across the full library and added runtime/build guards for duplicate IDs or invalid per-page counts;
- constrained the library to people-free residential interiors such as living rooms, bedrooms, bathrooms, kitchens, apartments, and well-kept home spaces;
- removed geographic-gallery wording and changed the page presentation to residential interior inspiration; and
- preserved existing SEO copy, routes, location definitions, service content, internal links, and quote flow.

**Verification:** PR #96 merged after replacing PR #95, which was closed intentionally after visual review. The current architecture reflects PR #96, not the rejected PR #95 visual direction.

## 2026-08-10 — Code-split the quote/contact browser controller

**Source:** PR #97.

**Work recorded:**

- removed the static `LiveFormSubmission` import from the global root bundle;
- added a dynamic import and route check so the controller loads only on `/quote` and `/contact`;
- preserved quote/contact form behavior while reducing unnecessary JavaScript on homepage, service, location, and other landing pages; and
- preserved the existing homepage LCP image prioritization.

**Verification:** PR #97 merged. The current root route still owns this route-gated lazy boundary.

## 2026-08-10 — Strengthened internal SEO linking

**Source:** PR #94.

**Work recorded:**

- routed primary navigation to canonical About, Contact, and Quote pages instead of stale homepage fragments;
- replaced stale service-area links with approved core hubs;
- added a `View All Areas` path from service pages; and
- converted nearby-location text pills into links to approved neighboring location pages.

## 2026-08-10 — Refined core homepage and service search intent

**Source:** PR #93.

**Work recorded:**

- sharpened homepage title, description, keywords, hero copy, and structured-data page title around residential/home cleaning in Johannesburg and Midrand;
- refined individual service-page metadata and descriptions to match actual cleaning intent and service footprint; and
- preserved existing canonical and structured-data architecture.

## 2026-08-10 — Added founder trust content

**Source:** PR #90.

**Work recorded:**

- added the restrained founder section to the About page;
- identified Smangaliso Nkosi as the then-Hestiva founder without adding unsupported biography, qualifications, experience, awards, or customer counts; and
- preserved existing About-page metadata and structured data.

## 2026-08-10 — Made all 66 location pages content-distinct

**Source:** PR #89.

**Work recorded:**

- added an individual content profile for every approved service area;
- replaced cluster-level content reuse with area-specific service angles in hero, overview, and FAQ content; and
- kept all local claims grounded in the actual service workflow.

## 2026-08-10 — Locked the approved 66-area geography

**Source:** PR #88.

**Work recorded:**

- created one authoritative service-area source for the five approved clusters;
- removed Riverlea and legacy Pretoria, Centurion, Kempton Park, Boksburg, Benoni, Edenvale, and Germiston targets from generated location data;
- aligned structured business service areas with the same source; and
- regenerated location-page/sitemap data from the approved territory.

## 2026-08-10 — Repaired the quote form production build

**Source:** PR #87.

**Work recorded:**

- repaired a malformed `LiveFormSubmission.tsx` class string that caused the Cloudflare/Vite build to fail with an unterminated string literal; and
- preserved the intended strict quote-flow behavior while restoring a valid formatted production build.

**Historical note:** PR #86 was closed unmerged after its intended quote-flow changes had already reached `main` through a separate formatting workflow; the malformed string was then repaired through PR #87. The current code, not the closed PR, is authoritative.

## 2026-08-10 — Expanded and tightened quote capture

**Sources:** PRs #83, #84, #85 and the current post-PR #87 implementation state.

**Work recorded:**

- made quote photo attachments functional end-to-end;
- added mobile `Take a photo` and `Choose photos` controls;
- added optional browser geolocation with server-side reverse geocoding and editable address fields;
- made property-layout questions conditional and internally consistent;
- added exact apartment/townhouse floor selection and building access capture;
- added client image compression for supported JPEG/PNG uploads;
- expanded the attachment limit to 10 files while retaining the 10 MB per-file limit;
- added service-dependent frequency choices and tomorrow-or-later visit dates;
- made product restrictions and allergies explicit required choices with conditional details; and
- progressively enforced required quote choices while preserving optional notes and photos.

**Current-state correction:** Quote photos are not stored in a website object-storage bucket. They are validated and sent as email attachments.

## 2026-08-10 — Finalized public legal policy content

**Sources:** PRs #78, #81 and #82.

**Work recorded:**

- finalized public Privacy and Terms content and removed unresolved launch placeholders;
- removed the public street/business address from current website surfaces and central structured-data config;
- removed customer-facing sensitive-access warnings that were not appropriate for public pages; and
- preserved service-area references where they describe coverage rather than a business address.

## 2026-08-10 — Aligned public business/contact presentation

**Sources:** PRs #72, #77 and #79, with PR #81 later removing the public address.

**Work recorded:**

- corrected service-detail phone/WhatsApp targets to the then-current contact number;
- updated the Contact page to reflect that online submission is live; and
- aligned structured business email/phone details with the live site before the later address-removal decision.

## 2026-08-10 — Improved responsive and runtime performance

**Sources:** PRs #73 through #76.

**Work recorded:**

- moved full desktop navigation from the 768px breakpoint to 1024px to avoid tablet crowding;
- removed decorative Framer Motion runtime usage from rendered homepage/navigation components;
- removed the unused `tw-animate-css` stylesheet import; and
- added intrinsic dimensions to the shared logo images to reduce layout-shift risk.

## 2026-08-10 — Cleaned redundant CI diagnostics

**Source:** PR #80.

**Work recorded:**

- removed two manual Nitro/Miniflare diagnostic workflows that duplicated the scheduled upstream remediation watch; and
- removed the obsolete `agent/hestiva-rebrand` push trigger while preserving normal PR quality checks.

## 2026-08-10 — Verified Cloudflare production baseline

**Source:** PR #71 and operator-confirmed production smoke evidence recorded there.

**Work recorded:**

- documented the successful Cloudflare native Git production path after the PR #68 hardening merge;
- recorded a successful live quote submission returning HTTP 200 with administrative and customer email delivery; and
- recorded the resolved preview/runtime issue where module-load `crypto.randomUUID()` in the rate limiter was replaced by lazy per-isolate initialization.

## 2026-08-09 — Hardened public form submissions

**Source:** merged PR #68 and current implementation.

**Work recorded:**

- centralized public quote/contact server validation;
- added strict bounded field schemas and service allowlists;
- added server-generated submission references;
- enforced same-origin checks and a supplemental honeypot;
- added a best-effort in-memory five-submissions-per-15-minutes throttle;
- added a ten-second Resend timeout;
- sanitized client-visible failures and kept logs free of raw customer content; and
- added focused form-security tests.

**Deferred by design:** Turnstile was not enabled because no site/secret key pair was provisioned. Durable Object rate limiting was not introduced because the repository had no binding or migration authority for it.

## 2026-08-09 — Established scheduled dependency-remediation monitoring

**Sources:** merged PRs #66 and #67.

**Work recorded:**

- recorded the verified `undici@7.28.0` exposure through the Nitro tooling chain;
- tested current Nitro, Nitro 3 alpha, overrides, package-manager migration, and `bun update` routes without finding a safe clean remediation path;
- documented the temporary accepted-risk disposition rather than describing the vulnerability as fixed;
- added a daily read-only upstream remediation watch using authoritative npm metadata; and
- kept future dependency changes behind a separate reviewed PR and OSV verification.

## 2026-08-09 — Verified Cloudflare clean-checkout production build/deploy sequence

**Source:** operator-verified Cloudflare build evidence.

**Work recorded:**

- confirmed Cloudflare's native Git integration builds from a clean checkout;
- confirmed dependency installation alone does not produce the Worker entry point;
- verified `bun run build` creates `dist/server/server.js`;
- verified `npx wrangler deploy` succeeds after the build;
- recorded Bun 1.2.15 and Node.js 24.18.0 from the successful build environment; and
- documented the final Cloudflare settings and production deployment baseline.

## 2026-08-09 — Established engineering documentation baseline

**Purpose:** Create a durable, evidence-based engineering record for the website repository.

**Work recorded:**

- documented the current TanStack Start/Vite/Cloudflare Worker architecture;
- documented the verified Cloudflare native Git production deployment path and sole-authority decision;
- documented environment-variable names and secret-handling rules without storing values;
- added recovery procedures for local validation, Cloudflare deployment failures, environment configuration, source-control mistakes, and future database migration work; and
- established this technical work log as a lightweight engineering record.

**Verification basis:** Repository source and operator-verified Cloudflare dashboard/build evidence available during the documentation task.
