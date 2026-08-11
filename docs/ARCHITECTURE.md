# Architecture baseline

## Scope and status

This document describes architecture currently implemented in the Hestiva website repository. It is not a design for a future production quotation/pricing system.

## System overview

Hestiva is a TypeScript, React 19 website built with TanStack Start and TanStack Router through Vite. TanStack Start produces server-rendered application output and client assets. The production target is the `hestiva` Cloudflare Worker; static files are served through its `ASSETS` binding.

The runtime request path is:

```text
Browser -> hestiva.co.za -> Cloudflare Worker -> TanStack Start SSR/router
                                     |-> static ASSETS
                                     `-> server function -> Resend HTTPS API
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
- `src/lib/` contains site/SEO/structured-data helpers, route policy, content helpers, quote client/server helpers, and the contact/email server path.
- `public/` contains static discovery, brand, and image assets.
- `supabase/` contains Supabase project configuration and migrations. These files establish a database history but are not evidence that the current website runtime queries Supabase.

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

Browser-only quote/contact orchestration is implemented in `src/components/LiveFormSubmission.tsx`. It contains DOM enhancement/validation, quote-file compression/submission helpers, and contact/quote submission handling. The controller is not imported synchronously into the global application bundle: `src/routes/__root.tsx` dynamically imports and mounts it only when the current route is `/quote` or `/contact`.

`src/components/ExtraRefrigeratorQuantity.tsx` is a quote-only browser enhancement. It is dynamically imported by `src/routes/__root.tsx` only on `/quote`, watches the existing Extra refrigerator add-on control, exposes a positive-integer quantity input with default `1`, keeps that quantity visible in the review UI, and encodes the selected quantity into the existing add-on label consumed by the current submission controller. It does not define the future structured Website ↔ HestivaOS quantity schema.

`src/lib/contact.functions.ts` defines the `POST` TanStack Start server function. On the server it:

1. validates input with Zod;
2. rejects cross-origin requests and treats the honeypot only as a supplemental bot signal;
3. applies a deterministic five-submissions-per-15-minutes throttle keyed only from Cloudflare's `CF-Connecting-IP`, using an isolate-salted hash and never logging or retaining the raw address;
4. validates attachment metadata/content;
5. builds the administrative and customer email packages; and
6. invokes the Resend adapter.

`src/lib/quote/email-service.ts` is server-only in this flow. It reads `RESEND_API_KEY` from the runtime environment and calls the Resend email API. The secret must never cross into browser code or tracked documentation.

## Quote file handling

The quote interface can retain up to 10 selected files. Browser-side submission logic attempts to compress ordinary decodable images to a maximum 1920-pixel dimension at 82% JPEG quality when that produces a smaller file; HEIC/HEIF files are preserved when browser decoding is unavailable.

Server validation allows up to 10 attachment objects, bounds base64 length, and content-sniffs supported file types. `src/lib/quote/file-validation.ts` enforces a 10 MiB decoded-file limit and validates supported image/document formats before email attachment packaging. Quote attachments are sent through the email flow; this repository does not implement an object-storage bucket for them.

## Supabase

The repository includes Supabase configuration, migrations, and public/anonymous variable names. No current file under `src/` imports a Supabase client or performs a Supabase query. Supabase is therefore configured repository/deployment context, not an active dependency in the observed website request or form-submission path. Migrations document existing database artifacts; this document does not assert that they are currently used in production.

Public or anonymous keys are not authorization controls. If Supabase is activated in application code later, database permissions and Row Level Security must remain the data-security boundary.

## Resend

Resend is actively used for contact and quote emails. The server function sends an administrative message and a customer confirmation over HTTPS. The API credential is a Cloudflare encrypted Secret in production. The source contains no Resend SDK dependency and calls the API with `fetch`.

## Security boundaries and current limitations

- Cloudflare terminates public traffic and provides Worker runtime variables/secrets.
- The Worker/TanStack server-function boundary protects `RESEND_API_KEY`; only non-secret form data crosses from the browser.
- Zod and attachment validation constrain accepted server-function payloads. These controls do not replace authentication or authorization.
- Strict Zod validation bounds strings/collections, allows at most 10 attachments, caps each encoded attachment at 14 MiB, and rejects unknown fields. Attachment validation separately caps decoded files at 10 MiB and checks content signatures.
- Browser timing is not submitted or trusted. The honeypot is only a signal; same-origin and server-side validation are authoritative controls.
- The five-per-15-minute throttle is server-enforced but scoped to one Worker isolate. It is useful best-effort resistance, **not globally reliable Cloudflare rate limiting**. Globally consistent enforcement requires a separately provisioned Durable Object binding and migration.
- Turnstile is justified for this public email-generating endpoint, but activation requires a Cloudflare widget/site key and encrypted secret plus server-side verification. No fail-open placeholder is present.
- Resend requests abort after 10 seconds. Provider bodies and network details are not returned to clients; structured logs avoid customer PII.
- No authentication or authorization layer is visible in the website source.
- Supabase publishable/anonymous values are intended to be public; security for any future client access would depend on database authorization/RLS, which this baseline does not validate.
- Cloudflare Logs, Traces, exports, and sampling are currently disabled, limiting production diagnostics.

## Future quotation-system boundary

The current `/quote` experience collects detailed customer/home/service state in the browser and submits the request through the existing email server function. The repository does **not** implement quotation persistence, a pricing/calculation engine, idempotent quotation records, a quotation state machine, authenticated staff workflows, or a verified active Supabase quotation data path.

Those capabilities are future architecture and require separate decisions, security review, documentation, and implementation PRs. Nothing in this document presents them as existing or selects their final design.
