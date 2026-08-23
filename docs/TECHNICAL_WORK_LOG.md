# Technical work log

This append-only log records verified engineering and material operational work without reconstructing unsupported history. Add newest entries first. Link pull requests/commits when available and describe validation without including secrets or customer data.

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
- deliberately did not reuse an unrelated service image because no approved Post-Event visual asset exists;
- updated `docs/POST_EVENT_CLEANING_WEBSITE_V1.md`, `docs/ARCHITECTURE.md`, `docs/TECHNICAL_WORK_LOG.md` and `docs/CHANGELOG.md` to keep the implemented public-form/business-workflow boundary documented; and
- kept merge blocked on HestivaOS PR #210, which owns the receiving Website Quote v2 Post-Event contract.

**Verification:** The implementation head `028e00b5347a2cd510cd480836170f9d302cfdc1` passed the complete Hestiva PR Check run `32644096017`: diff integrity, documentation policy/companion gate, tracked-secret scan, environment validation, TypeScript, public-form/structured-quote tests including Post-Event cases, targeted lint, Prettier, production build, runtime SEO and Cloudflare Worker dry-run. Earlier runs correctly caught and led to fixes for a Prettier import issue, a missing internal link for the new indexable service page, and an invalid literal TanStack route link. A new full gate is required after this final documentation reconciliation.

**Cross-system state:** HestivaOS PR #210 was green on its exact implementation head but subsequently became one commit behind `main` after Messaging PR #209 merged. The new `main` commit changes Messaging-only files and has no file overlap with #210's Website Quote/Post-Event files. Refresh/merge of #210 remains owned by the HestivaOS lane; website #174 must remain unmerged until that receiving contract is merged.

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

**Verification state:** Source reconciliation is complete on `audit/final-consistency-launch-readiness`. The normal Hestiva PR quality gate must pass before merge.

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

**Activation blockers:** Production activation remains unapproved until the Cloudflare values for `HESTIVA_OS_API_URL` and `HESTIVA_WEBSITE_INTEGRATION_SECRET` are verified operationally and HestivaOS confirms authoritative COIDA/routing configuration. HestivaOS runtime currently uses `OPENROUTESERVICE_API_KEY` while its canonical ingestion-boundary document still describes Google Routes; that inconsistency requires reconciliation on the OS side.

**Scope:** Website-side Issue #79 implementation and verification only. This entry does not assert that HestivaOS operational load-cap/accepted-booking work is complete and does not authorize merging or production activation by itself.

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

**Verification state:** Source investigation and CTA sweep are complete on PR #128. The full Hestiva PR Check and post-deployment production QA are required before the customer-facing correction is considered complete.

## 2026-08-12 — Corrected Homent favicon transfer regression

**Purpose:** Resolve the post-cutover production transfer regression identified by Homent Lighthouse run `31624786999` without reopening speculative application-runtime optimisation.

**Work recorded:**

- verified Homent production medians remained healthy at performance `92/94/93` for Homepage/Services/Quote while total transfer regressed to approximately `2.50/2.57/2.45 MB`;
- traced the regression to replacement favicon assets, including `favicon-16.png` at `1,143,225` bytes and `favicon-32.png` at `1,157,806` bytes, plus oversized 180×180 and 512×512 variants;
- regenerated the four favicon PNGs at their declared dimensions and retained the existing public paths and metadata references;
- reduced the files to `210` bytes (16×16), `306` bytes (32×32), `1,063` bytes (180×180), and `2,926` bytes (512×512); and
- made no route, JavaScript architecture, pricing, quote-flow, email, deployment-authority, or Website ↔ HestivaOS integration change.

**Verification state:** Repository byte sizes are verified on the feature branch. Full PR CI and a post-deployment production Lighthouse rerun are still required before the Homent regression is closed.

## 2026-08-12 — Added Homent visual assets and wired public asset references

**Purpose:** Prepare the customer-facing visual layer for the Hestiva → Homent rebrand without changing the current production domain, public email addresses, or internal application architecture.

**Work recorded:**

- added the approved Homent logo family plus replacement homepage hero, service, add-on, profile-badge, favicon and social-share assets on PR #123;
- preserved the existing responsive delivery strategy with homepage/service WebPs at 480/768/1200 widths, add-on WebPs at 384/640/960 widths, and white navbar/footer logo WebPs at 144/288 widths;
- updated `src/lib/site.ts` to reference Homent logo filenames while retaining the current `hestiva.co.za` production URL and Hestiva email addresses for a later controlled cutover;
- updated Navbar and Footer responsive logo references and the homepage Hero responsive/fallback image references to the new Homent filenames;
- kept the existing monogram asset unchanged; and
- made no pricing, quote-flow, email-delivery, deployment-authority, routing, security-boundary, or Website ↔ HestivaOS architecture change.

**Verification state:** GitHub's first PR check reached the repository documentation gate and failed only because these implementation changes initially lacked companion documentation. This entry and the changelog update record the implementation so the normal PR quality gate can rerun.

## 2026-08-11 — Repaired Contact form launch behaviour and public form feedback

**Purpose:** Address the launch-readiness failure where Contact submissions could be rejected after repeated Quote QA activity and replace browser-hostname alert dialogs with branded Hestiva notices.

**Work recorded:**

- verified that Contact and Quote used the same isolate-local five-submissions-per-15-minutes rate-limit bucket even though they are separate customer journeys;
- preserved the same per-channel limit while separating server-side `contact` and `quote` keys using the existing Cloudflare-provided request identity and service vocabulary, without introducing a new client-trusted channel field;
- added regression coverage proving the exact Contact-page payload passes the authoritative schema and that exhausting the Contact bucket does not exhaust the Quote bucket;
- added `/quote` and `/contact`-only `BrandedFormNotices` so existing submission success/error messages render in-page under Hestiva branding instead of browser-native `window.alert()` dialogs that display the site hostname;
- updated architecture and recovery guidance and accepted ADR-0003 for the durable rate-limit channel decision; and
- made no change to the existing Resend recipient/sender path, five-per-15-minute per-channel limit, HestivaOS integration, pricing, persistence, shared quote identity, or authentication.

**Scope:** Public website Contact/Quote launch UX and best-effort abuse-control isolation only. Production re-verification is required after deployment before the Contact incident is considered closed.

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
- added the same value to the server-side allowed service enum so the current email submission path accepts the new primary-service value;
- removed `Post-renovation dust removal` from the selectable add-on list;
- preserved `Recently renovated` as a separate Home Condition that may coexist with the primary service; and
- made no Website ↔ HestivaOS endpoint, structured payload, pricing, shared-reference, Accept/Decline, persistence, or authentication change.

**Scope:** Focused website catalogue alignment only.

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

**Verification:** GitHub Actions run `31495511555` completed successfully and uploaded the production Lighthouse artifact for `main` commit `e87a1794ffab3a27b25daef70bc90f4dd554cbe7`.

## 2026-08-11 — Corrected oversized favicon assets after post-WebP production measurement

**Purpose:** Remove the remaining evidence-backed static-asset waste identified after responsive WebP delivery materially improved production Lighthouse results.

**Work recorded:**

- reviewed production Lighthouse run `31457228551` from merged `main` commit `4f6002d8f7b0a76cddf07837377387afcdec7a66`;
- recorded post-WebP median homepage performance `93`, LCP `2.70 s`, and transfer `2.54 MB`, compared with baseline `72`, `16.621 s`, and `5.328 MB`;
- recorded post-WebP median Services performance `93`, LCP `2.70 s`, and transfer `2.61 MB`, compared with baseline `78`, `5.052 s`, and `9.692 MB`;
- verified the remaining `favicon-16.png` and `favicon-32.png` files were incorrectly stored at `1254×1254` despite being declared as 16×16 and 32×32 browser icons;
- resized the existing favicon artwork to the declared dimensions and saved optimized PNGs without changing favicon paths or HTML references;
- reduced `favicon-16.png` from `1,143,225` bytes to `657` bytes and `favicon-32.png` from `1,157,806` bytes to `1,864` bytes; and
- introduced no runtime dependency, routing, SEO policy, quote-flow, pricing, deployment-authority, or Website ↔ HestivaOS integration change.

**Verification state:** Binary dimensions and byte sizes were verified in GitHub Actions. Full repository CI and a final production Lighthouse comparison remain required before closing the performance audit.

## 2026-08-11 — Added responsive WebP delivery for measured image bottlenecks

**Purpose:** Act on the first verified production Lighthouse baseline, which showed image transfer—not JavaScript blocking—as the material remaining performance bottleneck on the homepage and Services page.

**Work recorded:**

- reviewed manual production Lighthouse run `31456228551` from `main` commit `3e74a04137b42b5171cc2ecc20c20a45a9b76c08` using three mobile runs each for the homepage, Services, and Quote pages;
- recorded median homepage performance `72`, FCP `2.407 s`, LCP `16.621 s`, transfer `5.328 MB`, TBT `0 ms`, and CLS `0`;
- recorded median Services performance `78`, FCP `2.462 s`, LCP `5.052 s`, transfer `9.692 MB`, TBT `0 ms`, and CLS `0`, including the observed run-to-run LCP volatility;
- generated 480, 768, and 1200 pixel WebP derivatives from the approved homepage hero PNG and 144/288 pixel WebP derivatives from the approved transparent white logo without replacing the originals;
- wired the homepage hero to responsive WebP `srcset`/`sizes` with the original PNG fallback while preserving high fetch priority;
- wired `ServiceImage` to the existing responsive WebP derivatives already tracked for `/images/services/`, retaining service PNG fallbacks and existing lazy/eager semantics;
- wired Navbar and Footer to responsive white-logo WebPs with the original PNG fallback; and
- introduced no runtime image proxy, image CDN dependency, application-framework rewrite, pricing change, quote transport change, or Website ↔ HestivaOS integration change.

**Verification state:** Source/asset implementation is complete on PR #110. A post-deployment Lighthouse comparison is still required before claiming a measured production performance improvement.

## 2026-08-11 — Added production Lighthouse diagnostics

**Purpose:** Move performance work from speculative source refactoring to repeatable production measurement after the source-level audit found no further evidence-backed application-runtime rewrite.

**Work recorded:**

- added `lighthouserc.cjs` with three production URLs: the homepage, Services page, and Quote page;
- configured three Lighthouse runs per URL to reduce normal run-to-run variance;
- added the manual `.github/workflows/hestiva-performance-check.yml` diagnostic workflow using Lighthouse CI 0.15.1;
- configured filesystem report export and 30-day GitHub Actions artifact retention instead of public temporary report storage;
- deliberately introduced no score assertions or blocking thresholds before a verified production baseline exists; and
- updated the performance/documentation records without changing application runtime, deployment authority, pricing, quote transport, or Website ↔ HestivaOS architecture.

**Scope:** Diagnostic repository workflow and performance documentation only. The workflow is manual and non-blocking until production measurements justify a separate threshold decision.

## 2026-08-11 — Completed global Navbar client-routing optimization

**Verified source:** merged PR #108.

**Work recorded:**

- replaced normal internal global Navbar document-navigation anchors with TanStack Router `Link` on desktop and mobile;
- retained `/#why-us` as a normal hash anchor so section navigation semantics remain intact;
- preserved mobile-menu close behaviour, scroll behaviour, styling, accessibility states, and logo dimensions; and
- completed the source-level performance audit without introducing speculative framework/shared-runtime refactoring.

**Verification:** PR #108 passed the Hestiva PR Check and merged into `main`.

## 2026-08-11 — Added Balcony / Patio Cleaning quantity handling

**Purpose:** Implement the Slice 5M decision that Balcony / Patio Cleaning may use quantity when multiple areas exist, while preserving the already-approved Extra refrigerator quantity behaviour and avoiding the unresolved future structured handoff schema.

**Work recorded:**

- replaced the refrigerator-specific quantity enhancer with one quote-only add-on quantity enhancement shared by the approved quantity-based add-ons;
- retained positive-integer quantity handling with default `1` for `Extra refrigerator`;
- added the same positive-integer quantity handling with default `1` for `Balcony / Patio Cleaning`;
- kept selected quantities visible in the final quote review and encoded them into the existing add-on labels consumed by the current email submission controller;
- preserved the `/quote`-only lazy-loading boundary; and
- made no pricing, structured payload-schema, quote-identity, endpoint, security-token, photo-storage, or HestivaOS ingestion changes.

**Scope:** Focused website quote-flow quantity behaviour using the current browser/email submission path. The future structured Website ↔ HestivaOS quantity representation remains unresolved.

## 2026-08-11 — Added Extra refrigerator quantity handling

**Purpose:** Implement the Slice 5M decision that Extra Refrigerator is quantity-based and defaults to quantity `1` without inventing the future shared handoff schema.

**Work recorded:**

- added a quote-only browser enhancement that exposes a positive-integer quantity control when the existing `Extra refrigerator` add-on is selected;
- defaulted the control to `1` and prevented values below `1` from surviving the control;
- kept the selected quantity visible in the final quote review;
- encoded the selected quantity into the existing add-on label consumed by the current email submission controller so the administrative quote retains the quantity;
- route-gated the enhancement to `/quote` through the existing lazy-loading pattern; and
- made no pricing, structured payload-schema, quote-identity, endpoint, security-token, photo-storage, or HestivaOS ingestion changes.

**Scope:** Focused website quote-flow quantity behaviour using the current browser/email submission path. The future structured Website ↔ HestivaOS quantity representation remains unresolved.

## 2026-08-11 — Converted eco-friendly products to a quote preference

**Purpose:** Implement the Slice 5M product decision that eco-friendly products are a customer Yes/No preference rather than a chargeable/selectable add-on.

**Work recorded:**

- removed `Eco-friendly products` from the quote add-on list;
- added a separate optional `Use eco-friendly products?` Yes/No selector in the Personalise Your Service step;
- included the selected preference in the customer-facing quote summary and final review;
- preserved the preference through the existing quote submission bridge so it appears as a distinct line in the current administrative quote details; and
- made no shared payload-schema, quote-identity, pricing, endpoint, token/security, photo-storage, or HestivaOS handoff changes.

**Scope:** Focused website quote-flow product semantics and existing email-presentation transport only. No cross-repository structured integration contract or architecture boundary changed.

## 2026-08-11 — Aligned Balcony / Patio Cleaning add-on naming

**Purpose:** Replace the ambiguous website add-on label `Balcony or patio` with the approved Slice 5M catalogue name `Balcony / Patio Cleaning`.

**Work recorded:**

- changed only the customer-facing add-on value used by the quote flow from `Balcony or patio` to `Balcony / Patio Cleaning`;
- preserved the existing outdoor-area property field, which remains a separate non-chargeable property fact;
- made no quantity-model, pricing, payload-schema, identity, endpoint, security, photo-storage, or HestivaOS handoff changes; and
- left the remaining unresolved/approved catalogue changes for separate focused slices.

**Scope:** Focused quote-flow catalogue alignment only. No architecture boundary, email infrastructure, deployment configuration, or cross-repository transport contract changed.

## 2026-08-11 — Aligned bathroom quote values with Slice 5M contract

**Purpose:** Remove the unsupported bathroom `Other` value from the website quote flow so the customer-facing selector matches the approved Website ↔ HestivaOS Slice 5M business rule.

**Work recorded:**

- changed the bathroom option logic so all supported paths terminate at the canonical `1`, `2`, `3`, `4`, `5+` value set;
- preserved the existing bedroom-dependent narrowing for smaller homes;
- left bedroom `Other` untouched because Issue #73 only resolves the bathroom vocabulary in this slice; and
- made no structured handoff, identity, endpoint, security, pricing, photo-storage, or HestivaOS integration changes.

**Scope:** Focused quote-flow catalogue alignment only. No architecture boundary, email infrastructure, deployment configuration, or cross-repository transport contract changed.

## 2026-08-11 — Adopted repository documentation governance and backfilled verified history

**Purpose:** Make engineering documentation part of the Hestiva website Definition of Done and close the verified historical gap after the original documentation baseline.

**Work recorded:**

- added root `AGENTS.md` with a mandatory documentation update matrix, historical-record rules, operational-action rules, and PR completion checklist;
- created the append-only ADR system under `docs/decisions/` and accepted ADR-0001 for repository documentation governance;
- added `scripts/validate_documentation.py`, which rejects meaningful implementation/configuration PRs when no `docs/` companion change exists;
- integrated the documentation validator into the normal pull-request quality gate; and
- backfilled the 2026-08-10 to 2026-08-11 implementation history below using merged pull-request records and current repository state rather than reconstructing unsupported details from memory.

**Scope:** Repository process, CI validation, and documentation only. No customer-facing application behaviour, runtime secret, production deployment authority, or infrastructure is changed by this governance work.

## 2026-08-11 — Rebuilt location visuals and reduced global form-controller JavaScript

**Verified sources:** PR #96 and PR #97.

**Work recorded:**

- replaced the earlier geographic location-photo system with 198 unique Pexels residential-interior images: exactly three people-free interior photographs for each of the 66 approved location pages, with a duplicate-ID guard;
- limited location presentation to one primary and two supporting interior images while preserving location SEO copy, routes, service content, internal links, and quote flow;
- code-split `LiveFormSubmission` so the quote/contact controller loads only on `/quote` and `/contact` rather than being imported into the global application bundle; and
- preserved the homepage hero's existing fixed dimensions and high-priority LCP loading strategy.

**Verification:** PR #96 was visually preview-checked before merge. PR #97 passed the Hestiva PR Check and `/quote`, `/contact`, and the homepage were manually preview-checked before merge.

## 2026-08-10 — Established the current geographic SEO and location-page architecture

**Verified sources:** PRs #88, #89, #90, #91, #92, #93, and #94. Later PR #96 superseded the visual-library implementation from #91/#92 but not the geographic or SEO architecture.

**Work recorded:**

- established one authoritative 66-area service-area source across five clusters and removed Riverlea plus legacy Pretoria/Centurion/East Rand targets from generated location data and structured business service areas;
- generated dedicated location pages and sitemap coverage from the approved geography and linked every approved area from the Areas We Serve hub;
- replaced cluster-template local copy with unique area-specific hero, overview, FAQ, service-angle, and visual-brief content for all 66 locations;
- added restrained founder/trust content to the About page without unsupported biography or credibility claims;
- redesigned location pages into the Hestiva cream/burgundy/gold visual system and iterated the location-gallery sourcing policy before that gallery implementation was later replaced by PR #96;
- refined homepage and service-page search intent around residential cleaning in Johannesburg and Midrand while retaining canonical and structured-data architecture; and
- strengthened internal linking by routing primary navigation to canonical pages, linking service pages to approved core geographic hubs and the full areas hub, and converting nearby-location pills into crawlable location-page links.

**Scope:** SEO information architecture, location/service content, internal linking, and location-page visual presentation. The approved 66-area geography remains the authoritative service-area source.

## 2026-08-10 — Hardened and completed the live quote/contact experience and launch UI

**Verified sources:** PRs #68, #71 through #85, and #87. Closed unmerged PR #86 is not recorded as shipped; its intended production logic was later represented by current `main` and the build repair in #87.

**Work recorded:**

- verified the post-#68 production deployment and full live quote submission path through Cloudflare and Resend, including administrative and customer email delivery;
- corrected stale contact links and responsive navigation behaviour, removed decorative homepage animation JavaScript and unused animation CSS, and added intrinsic navbar/footer logo dimensions to reduce layout-shift risk;
- updated public contact/legal/business-data surfaces, including live contact-form messaging, final privacy/service policies, structured business data, and removal of the public street address and sensitive-access notices;
- cleaned redundant CI diagnostic workflows while preserving the read-only Undici remediation watch and normal PR quality gates;
- implemented quote photo attachments, mobile camera/gallery controls, optional browser geolocation with reverse-geocoded editable address fields, consistent property-layout questions, exact unit floor/access choices, client-side image compression, expanded photo limits, service-dependent frequency options, date rules, required restrictions/allergy choices, and progressively stricter required-field/access flow;
- repaired the malformed `LiveFormSubmission.tsx` class string that temporarily caused the Cloudflare/Vite production build to fail, restoring a passing production build without discarding the intended quote-flow behaviour.

**Scope:** Public website UX, quote/contact workflow, legal/contact content, performance hardening, and CI cleanup. No automatic pricing engine or persistent quotation database was introduced.

## 2026-08-09 — Hardened public form submission boundary

**Purpose:** Bound and sanitize the email-generating form path while recording infrastructure required for globally reliable abuse prevention.

**Work recorded:**

- replaced the permissive stub with a server-side, isolate-scoped five-per-15-minute throttle based only on Cloudflare's request identity, without logging raw identity data;
- removed client-selected references and browser timing, added strict bounded schemas, a honeypot signal, same-origin enforcement, server-generated references, and focused tests;
- added a ten-second Resend timeout plus stable provider-error sanitization and privacy-safe logs;
- recorded that Durable Object provisioning is required for globally consistent limiting; and
- assessed Turnstile as justified but deferred activation until dashboard-owned keys exist.

**Scope:** No quotation persistence, security headers, production configuration, database changes, credentials, or deployment were introduced.

## 2026-08-09 — Accepted temporary Undici tooling risk and added upstream watch

**Purpose:** Record the verified, non-runtime Undici exposure while upstream remediation is blocked, and detect a clean remediation without changing dependencies automatically.

**Work recorded:**

- recorded the five OSV advisories affecting the Nitro tooling path and the fixed Undici floor;
- recorded that browser, deployed Worker, and emitted Nitro request-runtime output inspection found no affected Undici instance;
- documented that compatible Miniflare 4, `env-runner`, and Nitro 3 remediation routes were exhausted and accepted **TEMPORARY ACCEPTED TOOLING RISK PENDING UPSTREAM FIX**;
- added a daily, read-only npm registry metadata watch for a current-Nitro or newer-Nitro-3 clean path, with a 14-day JSON report artifact and an Actions job summary; and
- required any future dependency change to use a separate reviewed PR and a post-change OSV scan.

**Scope:** No override or dependency change was introduced. No application source, production configuration, secrets, deployment workflow, or deployment authority changed. The vulnerability is not resolved.

## 2026-08-09 — Verified Cloudflare production build configuration

**Purpose:** Replace the unresolved clean-checkout build assumption with the operationally verified Cloudflare production sequence.

**Work recorded:**

- confirmed that the native Git integration for `HestivaHQ/hestiva` installs dependencies with `bun install` from the repository root (`/`) on the `main` production branch;
- recorded the required Build command as `bun run build`, followed by the existing deploy command `npx wrangler deploy` and version command `npx wrangler versions upload`;
- documented the failed deployment without the Build command, where Wrangler could not find `dist/server/server.js` and Cloudflare reported that the framework build needed to generate the entry point;
- recorded that manually configuring `bun run build` resolved the failure, the deployment completed successfully, and the production website remained operational; and
- captured the verified build-environment versions: Bun 1.2.15 and Node.js 24.18.0.

**Scope:** Documentation only. No application source, behavior, dependencies, Cloudflare configuration, credentials, secrets, or production deployment mechanism changed.

## 2026-08-09 — Architecture, deployment, and environment baseline

**Purpose:** Establish canonical operational documentation before production quotation-system development.

**Work recorded:**

- documented the current TanStack Start/React/TypeScript SSR application and Cloudflare Worker boundary;
- inventoried active and configured environment-variable names without adding values;
- recorded Cloudflare native Git integration as the sole production deployment authority and captured the supplied verified dashboard settings;
- built the repository to verify that Nitro derives ignored `.output/server/wrangler.json` and `.wrangler/deploy/config.json` from the tracked root configuration, while overriding generated entry-point/asset fields;
- established recovery guidance and a forward-only technical changelog; and
- explicitly separated the current email-based quote flow from future quotation-system architecture.

**Scope:** Documentation only. No application source, behavior, production configuration, dependencies, credentials, database objects, or deployment pipeline changed.