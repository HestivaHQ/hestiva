# Environment baseline

> **Form-security prerequisite:** No Turnstile credential or rate-limit resource is currently
> declared. Turnstile requires an operator-created widget for production/preview hosts, a public
> browser site key, and a distinct encrypted Worker secret for server-side Siteverify. Globally
> consistent rate limiting requires a separately reviewed Durable Object binding and migration.
> Do not reuse or expose `RESEND_API_KEY` or `HESTIVA_WEBSITE_INTEGRATION_SECRET` for either purpose.

## Rules

- Record variable names and roles only. Never place secret values in documentation, issues, build
  logs, or commits.
- `VITE_` variables are client-exposed by convention and must never contain secrets.
- Cloudflare dashboard runtime configuration is environment-specific. A local `.env` is not proof
  of a production value.
- Do not rename variables without a separately reviewed application/configuration migration.

## Application-consumed variables

| Name                                | Exposure                          | Purpose                                                                       | Requirement                                                                                                                  | Expected environment                                                                             | Source consumption                                                          |
| ----------------------------------- | --------------------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| `RESEND_API_KEY`                    | Server-only secret                | Authorizes HTTPS calls to Resend for contact/quote email delivery             | Required when a contact or quote submission sends email; the adapter throws if absent/blank                                  | Cloudflare encrypted Secret in production; an untracked secret mechanism for local email testing | `src/lib/quote/email-service.ts` via `process.env`                           |
| `HESTIVA_OS_API_URL`                | Server-only runtime configuration | Base URL for the authoritative HestivaOS API used by structured quote intake  | Required when `/quote` submits through HestivaOS; missing/blank fails the quote closed before email confirmation              | Cloudflare runtime variable in production; untracked local integration config                    | `src/lib/quote/structured-submission.functions.ts` via `process.env`        |
| `HESTIVA_WEBSITE_INTEGRATION_SECRET` | Server-only secret                | Authorizes the private Website → HestivaOS quote-ingestion request            | Required when `/quote` submits through HestivaOS; missing/blank fails closed                                                  | Cloudflare encrypted Secret in production; an untracked local secret mechanism                    | `src/lib/quote/structured-submission.functions.ts` via `process.env`        |

None of these names may be prefixed with `VITE_`. The integration secret must never be exposed to
browser code, checked into Wrangler variables, printed in logs, or reused for unrelated services.

All three values are runtime-only: ordinary pages, static assets, navigation, and form entry do not
require them at build time. Contact enquiries continue to require only `RESEND_API_KEY` when email
is actually sent. Quote submission requires the HestivaOS endpoint and integration secret first;
after HestivaOS accepts or replays the structured quote, the existing Resend admin/customer email
flow runs using the authoritative HestivaOS quote reference. If either integration value is absent,
the quote request fails closed and no confirmation email is sent pretending that HestivaOS accepted
it.

`import.meta.env.DEV`, read in `src/router.tsx`, is a Vite built-in mode boolean used only to decide
whether to display error detail. Operators do not configure it as a Hestiva runtime variable.

## Configured Supabase public variables

The following names exist in tracked environment/Wrangler configuration and/or verified Cloudflare
runtime variables. Current `src/` code does not read them and no Supabase client/query was found, so
their requirement for current website behavior is **not established**.

| Name                            | Exposure classification                             | Intended/configured purpose                               | Required?                            | Expected environment                                                                   | Current source consumption |
| ------------------------------- | --------------------------------------------------- | --------------------------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------- | -------------------------- |
| `SUPABASE_URL`                  | Server-side name, but value is a public project URL | Supabase API/project endpoint                             | Not provably required by current app | Tracked local/config input and Cloudflare runtime variable                             | None found                 |
| `SUPABASE_PUBLISHABLE_KEY`      | Public/publishable credential                       | Supabase publishable client credential                    | Not provably required by current app | Tracked local/config input and Cloudflare runtime variable                             | None found                 |
| `SUPABASE_ANON_KEY`             | Public/anonymous credential                         | Supabase anonymous client credential                      | Not provably required by current app | Root Wrangler config and Cloudflare runtime variable                                   | None found                 |
| `SUPABASE_PROJECT_ID`           | Public project identifier                           | Identifies the Supabase project for local/tooling context | Not provably required by current app | Tracked `.env`                                                                         | None found                 |
| `VITE_SUPABASE_URL`             | Client-exposed                                      | Browser-bundle form of the Supabase endpoint              | Not provably required by current app | Tracked `.env`, root Wrangler config, and generated/bundled environments if referenced | None found                 |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Client-exposed public credential                    | Browser-bundle form of the publishable key                | Not provably required by current app | Tracked `.env`, root Wrangler config, and generated/bundled environments if referenced | None found                 |
| `VITE_SUPABASE_PROJECT_ID`      | Client-exposed public identifier                    | Browser-bundle project identifier                         | Not provably required by current app | Tracked `.env`                                                                         | None found                 |

Publishable and anonymous Supabase credentials are not service-role secrets. Their public nature
does not grant database access by itself and does not prove safety: authorization and RLS must be
reviewed before any application code begins using Supabase. No service-role variable was found in
the application source or tracked configuration inspected for this baseline.

## Cloudflare binding

`ASSETS` is a Cloudflare static-asset binding, not an environment variable. The generated Wrangler
configuration binds the built public directory under that name. Current application source does
not directly read the binding.

## Repository validation

Run `bun run verify:environment` after changing source or environment configuration. The lightweight
static check enforces the approved source-read locations, requires the Resend adapter and HestivaOS
quote adapter to retain fail-closed configuration checks, rejects secret-like `VITE_` names in
tracked environment configuration, and ensures `keep_vars` remains enabled without placing
`RESEND_API_KEY` or `HESTIVA_WEBSITE_INTEGRATION_SECRET` in tracked Wrangler variables. It checks
names and structure only; it neither reads nor proves the presence of Cloudflare dashboard values.

CI cannot safely validate production secret values or presence because GitHub Actions is not the
owner of production runtime configuration. Diagnose runtime absence in Cloudflare, while build
failures should be investigated as code/build configuration problems rather than “fixed” by copying
runtime secrets into CI.

## Change checklist

When an application change adds or removes an environment read:

1. update this inventory in the same PR;
2. classify client exposure and reject secrets in `VITE_` names;
3. document whether startup or only a feature requires the value;
4. update the appropriate non-production and production Cloudflare settings through an approved
   operational change; and
5. verify without printing the value.
