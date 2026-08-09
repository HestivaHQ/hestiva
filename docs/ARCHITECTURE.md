# Architecture baseline

## Scope and status

This is the architecture implemented in the repository at the time of the baseline. It is not a
design for a future production quotation system.

## System overview

Hestiva is a TypeScript, React 19 website built with TanStack Start and TanStack Router through
Vite. TanStack Start produces a server-rendered application and client assets. The production
target is the `hestiva` Cloudflare Worker; static files are served through its `ASSETS` binding.

The runtime request path is:

```text
Browser -> hestiva.co.za -> Cloudflare Worker -> TanStack Start SSR/router
                                     |-> static ASSETS
                                     `-> server function -> Resend HTTPS API
```

## Repository structure

- `src/routes/` contains TanStack file routes. `src/routeTree.gen.ts` is generated routing output;
  it must not be treated as a hand-maintained route registry.
- `src/routes/__root.tsx` defines the HTML shell, common head assets, not-found UI, outlet, and the
  client-side form bridge.
- `src/router.tsx` creates the router and common error UI.
- `src/components/` contains shared page sections, navigation, form wiring, layouts, and UI
  primitives.
- `src/content/services.ts` and `src/content/locations.ts` are typed content/catalogue sources used
  to render service and location pages.
- `src/lib/` contains site/SEO/structured-data helpers, route policy, content helpers, quotation
  options, and the contact/email server path.
- `public/` contains static discovery, brand, and image assets.
- `supabase/` contains Supabase project configuration and migrations. These files establish a
  database history but are not evidence that the current website runtime queries Supabase.

## Routing

The implemented file routes are:

- `/`, `/about`, `/contact`, `/quote`, `/services`, `/locations`, `/privacy`, and `/terms`;
- `/services/apartment-cleaning`;
- dynamic `/services/$serviceSlug` and `/locations/$locationSlug` pages backed by repository
  content; and
- the server-rendered `/sitemap.xml` route.

TanStack Start renders route output on the server and hydrates React in the browser. Route modules
define their own metadata and structured data. Shared navigation, footer, and page layouts are
composed from React components.

## Server and client boundaries

Most route and component code participates in SSR and then hydrates on the client. Browser-only
form orchestration is isolated in `src/components/LiveFormSubmission.tsx`: its effect reads the DOM,
handles submissions, and calls the exported server function.

`src/lib/contact.functions.ts` defines the `POST` TanStack Start server function. On the server it:

1. validates input with Zod;
2. performs the existing honeypot/minimum-time checks;
3. hashes the request IP before the existing rate-limit stub logs it;
4. validates attachment metadata/content;
5. builds the administrative and customer email packages; and
6. invokes the Resend adapter.

`src/lib/quote/email-service.ts` is server-only in this flow. It reads `RESEND_API_KEY` from the
runtime environment and calls the Resend email API. The secret must never cross into browser code
or tracked documentation.

## Supabase

The repository includes Supabase configuration, migrations, and public/anonymous variable names.
No current file under `src/` imports a Supabase client or performs a Supabase query. Supabase is
therefore configured repository/deployment context, not an active dependency in the observed
website request or form-submission path. Migrations document existing database artifacts; this
baseline does not assert that they are currently used in production.

Public or anonymous keys are not authorization controls. If Supabase is activated in application
code later, database permissions and Row Level Security must remain the data-security boundary.

## Resend

Resend is actively used for contact and quote emails. The server function sends an administrative
message and a customer confirmation concurrently over HTTPS. The API credential is a Cloudflare
encrypted Secret in production. The source contains no Resend SDK dependency and calls the API
with `fetch`.

## Security boundaries and current limitations

- Cloudflare terminates public traffic and provides Worker runtime variables/secrets.
- The Worker/TanStack server-function boundary protects `RESEND_API_KEY`; only non-secret form data
  crosses from the browser.
- Zod and attachment validation constrain accepted server-function payloads. These controls do not
  replace authentication or authorization.
- The honeypot and elapsed-time checks are implemented. The named rate-limit function is currently
  a permissive stub and must not be represented as production rate limiting.
- No authentication or authorization layer is visible in the website source.
- Supabase publishable/anonymous values are intended to be public; security for any future client
  access would depend on database authorization/RLS, which this baseline does not validate.
- Cloudflare Logs, Traces, exports, and sampling are currently disabled, limiting production
  diagnostics.

## Future quotation-system boundary

The current `/quote` experience collects state in the browser and submits email messages through
the existing server function. The repository does **not** implement quotation persistence,
idempotency, a quotation state machine, authenticated staff workflows, or a verified active
Supabase quotation data path.

Those capabilities are future architecture and require separate decisions, security review, and
implementation PRs. Nothing in this baseline presents them as existing or selects their design.
