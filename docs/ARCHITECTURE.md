# Architecture baseline

## Scope and status

This document describes architecture currently implemented in the Hestiva website repository. It distinguishes implemented website transport from quotation/pricing authority owned by HestivaOS.

## System overview

Hestiva is a TypeScript, React 19 website built with TanStack Start and TanStack Router through Vite. TanStack Start produces server-rendered application output and client assets. The production target is the `hestiva` Cloudflare Worker; static files are served through its `ASSETS` binding.

The active public-form runtime paths are:

```text
Contact:
Browser -> hestiva.co.za -> Cloudflare Worker -> TanStack server function -> Resend HTTPS API

Residential quote:
Browser -> hestiva.co.za -> Cloudflare Worker -> structured quote server function
                                         |-> private HestivaOS quote ingestion
                                         `-> Resend admin/customer correspondence after OS acknowledgement
```

## Repository structure

- `src/routes/` contains TanStack file routes. `src/routeTree.gen.ts` is generated routing output and is not a hand-maintained route registry.
- `src/routes/__root.tsx` defines the HTML shell, common head assets, not-found UI, outlet, and route-gated lazy loading boundaries for browser-only form/quote enhancements.
- `src/router.tsx` creates the router and common error UI.
- `src/components/` contains shared page sections, navigation, layouts, form wiring, browser-only quote enhancements, and UI primitives.
- `src/content/services.ts` is the typed service catalogue.
- `src/content/service-areas.ts` is the authoritative approved service-area source. It currently contains 66 areas across five Johannesburg/Midrand clusters.
- `src/content/locations.ts` defines the generated location-page content model for the approved service areas.
- `src/content/location-visuals.ts` maps exactly three unique people-free residential interior images to each approved location page and rejects duplicate Pexels photo IDs.
- `src/lib/` contains site/SEO/structured-data helpers, route policy, content helpers, quote client/server helpers, the contact/email path, and the Website → HestivaOS structured quote mapper/adapter.
- `public/` contains static discovery, brand, and image assets.
- `supabase/` contains Supabase project configuration and migrations. These files establish a database history but are not evidence that the current website runtime queries Supabase.

## Static image delivery

Approved source PNG assets remain tracked under `public/` as visual-source and browser-fallback files. Performance-critical website surfaces prefer responsive WebP derivatives where available rather than transferring those full-resolution PNGs to every viewport.

- The homepage hero uses 480, 768, and 1200 pixel WebP derivatives selected through `srcset`/`sizes`, while the original PNG remains the `<img>` fallback and the hero keeps intentional high fetch priority.
- `src/components/ServiceImage.tsx` uses the existing 480, 768, and 1200 pixel WebP derivatives for images under `/images/services/`, while retaining the service PNG as fallback. Existing lazy/eager and fetch-priority semantics are preserved.
- Navbar and Footer use 144 and 288 pixel transparent WebP derivatives of the white logo with the original white PNG retained as fallback.
- Add-on and other imagery without an approved responsive derivative set continues to use its existing source rather than generating unverified URLs at runtime.

The responsive derivatives are static Cloudflare `ASSETS`; there is no runtime image-resizing service, image proxy, or new external image dependency in this architecture.

## Routing and SEO information architecture

The implemented public route families include:

- `/`, `/about`, `/contact`, `/quote`, `/services`, `/locations`, `/privacy`, and `/terms`;
- service detail routes including dynamic `/services/$serviceSlug` pages backed by the service catalogue;
- dynamic `/locations/$locationSlug` pages backed by the authoritative 66-area geography and unique location content; and
- the server-rendered `/sitemap.xml` route.

TanStack Start renders route output on the server and hydrates React in the browser. Route modules define their metadata and structured data. Shared navigation, footer, and page layouts are composed from React components.

The current SEO geography is intentionally driven from `src/content/service-areas.ts` so location pages, service-area presentation, and structured business service areas do not maintain competing geographic lists. Service pages link into approved core geographic hubs and the full Areas We Serve hub. Location pages link to approved nearby locations through crawlable links.

## Server and client boundaries

Most route and component code participates in SSR and then hydrates on the client.

`src/components/LiveFormSubmission.tsx` remains the legacy browser controller for shared quote-step DOM enhancement/validation and ordinary contact submission. It is dynamically imported only on `/quote` and `/contact`.

`src/components/StructuredQuoteSubmission.tsx` is mounted only on `/quote`. Its capture-phase handler owns the final residential `Send Request` action before the legacy bubble-phase email-only quote handler can run. It accumulates structured form state while steps mount/unmount, keeps one stable submission UUID/UTC timestamp and stable client photo identities across retry, compresses supported browser images using the existing policy, and calls the structured server function. A failed attempt retains the exact pending snapshot so retry cannot accidentally change an already-accepted HestivaOS replay identity.

`src/components/BrandedFormNotices.tsx` is mounted only on `/quote` and `/contact`. It replaces browser-native `window.alert()` presentation where the existing notice bridge recognizes the submission result while leaving transport semantics to the relevant submission controller.

`src/components/ContactValidationEnhancements.tsx` applies immediate phone/email feedback on `/quote` and `/contact`. `src/lib/contact-validation.ts` owns the shared public form policy. South African local numbers must compact to 10 digits beginning with `0`; international numbers require a leading `+` and 8–15 digits. The HestivaOS contract mapper additionally normalizes supported South African local numbers to `+27` E.164 before authoritative quote ingestion.

`src/components/AddonQuantityEnhancements.tsx` remains quote-only and keeps positive-integer quantity controls for approved quantity-bearing generic add-ons such as Extra refrigerator and Balcony / Patio Cleaning. Display labels may include the quantity for review, while the HestivaOS v2 mapper converts the selected website value and quantity into structured generic add-on entries before transport.

`src/components/LaundryOperatingModelEnhancement.tsx` enforces the approved Laundry/Ironing operating model on `/quote`. Laundry is unavailable as a primary booking, only Regular Home Cleaning and Deep Cleaning can carry Laundry/Ironing, washer/dryer versus washer/line facilities resolve the permitted Laundry outcome, no-washer Laundry fails closed, and Laundry/Ironing requested loads remain separate positive quantities. The component also maintains a first-class structured Laundry request state exported to the structured submitter; v2 transport does not reconstruct facilities or load counts from presentation labels.

`src/components/PostRenovationFrequencyEnhancement.tsx` remains a quote-only launch repair that restores approved frequency choices when `Post-Renovation Cleaning` is selected. Structured transport now maps the selected primary service and frequency into the HestivaOS contract; the enhancement itself does not price or persist the quote.

The customer-facing quote source no longer treats `Laundry Folding` as a selectable primary-service option in `src/lib/quote-options.ts`. The legacy React route source is still guarded at runtime by `LaundryOperatingModelEnhancement` until that older selector definition is removed in a focused source cleanup; the customer cannot retain Laundry Folding as the primary selection.

## Public contact submission

`src/lib/contact.functions.ts` defines the existing TanStack Start server function used by ordinary contact enquiries. It validates with Zod, enforces same-origin and honeypot/rate-limit controls, validates allowed attachments, builds human-readable email packages, and sends through Resend.

The old quote-capable code remains temporarily in that shared legacy function for compatibility, but `/quote` final submission is intercepted by `StructuredQuoteSubmission` before the legacy quote handler executes.

## Structured Website → HestivaOS quote submission

`src/lib/quote/hestiva-os-contract.ts` maps the website snapshot to Website Quote Contract v2. It owns exact enum/value translation, South African mobile normalization, generic add-on quantity extraction, structured Laundry/Ironing placement in `request.laundry`, and the complete Customer/Property/Request/Visit/Access/Household/Safety/Notes shape. It does not calculate authoritative pricing.

`src/lib/quote/structured-submission.functions.ts` is the quote-only TanStack server function. It:

1. validates the structured browser snapshot and bounded file envelope;
2. reuses the public contact validation policy and same-origin/honeypot/rate-limit controls;
3. validates email attachments;
4. creates image transfer metadata with stable client UUIDs, byte sizes and SHA-256 hashes;
5. builds the HestivaOS Contract v2 payload;
6. sends it to the private HestivaOS ingestion route using server-only runtime configuration;
7. requires a successful HestivaOS acknowledgement with an authoritative quote reference; and
8. only then sends the existing admin/customer Resend correspondence using that HestivaOS reference.

A missing endpoint configuration, missing integration credential, timeout, rejected HestivaOS response, or malformed acknowledgement fails closed. The website does not send a success email pretending that authoritative quote intake succeeded.

## Quote file handling

The quote interface can retain up to 10 selected files. Browser-side submission attempts to compress ordinary decodable images to a maximum 1920-pixel dimension at 82% JPEG quality when that produces a smaller file; HEIC/HEIF files are preserved when browser decoding is unavailable.

Server attachment validation continues to allow the approved image/document formats for email correspondence. HestivaOS structured photo transfer includes image files only; each image carries a stable client photo UUID, content type, byte size, SHA-256 and base64 upload body. Non-image documents remain email attachments rather than being misclassified as HestivaOS Quote Photos.

This repository still does not own the durable quote-photo object store. HestivaOS ingestion owns the downstream quote-photo persistence/transfer contract.

## Supabase

The repository includes Supabase configuration, migrations, and public/anonymous variable names. No current file under `src/` imports a Supabase client or performs a Supabase query. Supabase is therefore configured repository/deployment context, not an active dependency in the observed website request or form-submission path.

Public or anonymous keys are not authorization controls. If Supabase is activated in application code later, database permissions and Row Level Security must remain the data-security boundary.

## Resend

Resend is actively used for contact emails and for quote correspondence after authoritative HestivaOS acknowledgement. The API credential is a Cloudflare encrypted Secret in production. The source contains no Resend SDK dependency and calls the API with `fetch`.

## Security boundaries and current limitations

- Cloudflare terminates public traffic and protects server-only runtime variables/secrets.
- The browser never receives `RESEND_API_KEY` or `HESTIVA_WEBSITE_INTEGRATION_SECRET`.
- HestivaOS quote ingestion is server-to-server and uses the dedicated integration bearer credential over HTTPS.
- Quote retry reuses one stable submission identity and frozen pending snapshot until the attempt succeeds, preserving HestivaOS replay semantics if an earlier stage may already have committed the quote.
- Zod, enum mapping, same-origin checks, bounded attachments and HestivaOS validation constrain the public-to-private boundary. Browser validation remains convenience only.
- Contact and Quote each use their own five-per-15-minute server-enforced bucket within a Worker isolate. These are best-effort, not globally reliable Cloudflare rate limiting.
- Turnstile is still not active; activation requires separately provisioned Cloudflare configuration and server verification.
- HestivaOS requests use a bounded 12-second timeout; provider bodies and credentials are not returned to clients or logged.
- Resend failures occur after HestivaOS acknowledgement in the structured quote path. Browser retry therefore deliberately reuses the same frozen quote identity rather than creating another quote.
- No customer authentication layer is present on the public website.
- Cloudflare Logs, Traces, exports, and sampling remain limited/disabled as documented elsewhere, reducing production diagnostics.

## Quotation-system ownership boundary

The website now implements structured quote transport but does not own authoritative quotation persistence, pricing, profitability calculation, quote state, accepted-quote operational orchestration, Work Orders, Recurring Service Agreements, collections, or financial state. Those are HestivaOS responsibilities.

The website remains responsible for customer-facing collection/validation/presentation and correspondence. HestivaOS remains the authoritative operational/commercial destination for accepted structured quote intake. Later Accept/Decline actions, customer self-service, or newer quote schema versions require separate coordinated decisions and implementation.
