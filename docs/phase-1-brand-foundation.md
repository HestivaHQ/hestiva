# Phase 1: Hestiva brand foundation

## Scope completed

- Centralized approved identity, default metadata, optional business details, and optional brand asset
  paths in `src/lib/site.ts`.
- Configured global metadata to omit canonical, favicon, and social-image tags until their approved
  values are available.
- Replaced Marshall-specific CSS custom-property names with semantic, temporary brand tokens.
- Reserved stable public paths for the approved logo, favicon, and social-preview image without
  publishing fabricated assets.

No route, contact, Supabase, Resend, authentication, environment-variable, Cloudflare-binding, or
deployment behavior changed in this phase.

## Architecture decisions

### Optional business configuration

Unknown domain, contact, service-area, legal, address, and operating-hour values are `null` or empty
arrays. UI and metadata must test these values before rendering dependent content. The
`absoluteUrl` helper returns `null` until the production domain is approved.

### Assets

Approved assets will use these stable public paths:

- `/brand/logo.svg`
- `/brand/favicon.svg`
- `/brand/social-preview.jpg`

The paths remain `null` in site configuration until real files are supplied. Legacy images remain
untouched because replacing customer-facing imagery belongs to a later approved phase.

### Design tokens

The current palette and Inter font remain temporary to avoid inventing a final visual identity.
Semantic `--brand-*` variables now isolate the values that the approved brand board will replace.

## Route and redirect strategy for later approval

Keep the TanStack file-route architecture. When the service list and domain are approved, prepare a
route-by-route mapping from every legacy service and location URL to the closest truthful Hestiva
destination. Use permanent redirects only after the owner approves that mapping. Do not redirect
unrelated legacy services to misleading cleaning pages; use the most relevant overview or an
explicit retired-content destination.

No route or redirect changed in Phase 1.

## Sitemap recommendation

The dynamic `src/routes/sitemap[.]xml.ts` implementation should become the future source of truth
because it is generated from route content. Retain `public/sitemap.xml` until the approved domain,
service routes, location routes, and deployment precedence have been verified. Then remove the
static duplicate in the SEO phase as a separately reviewed change.

## Security observations

- `.env` and `wrangler.jsonc` are tracked. The inspected values are Supabase project identifiers,
  URLs, and publishable/anonymous keys; no assigned Resend API key or Supabase service-role key was
  found in the current tree or inspected Git history.
- Publishable Supabase keys are designed for client use, but database protection still depends on
  correct Row Level Security. Their presence does not prove the database is secure.
- Move environment-specific public values out of tracked files if deployment operations support
  centralized Cloudflare configuration. This is a future operational recommendation, not a Phase 1
  change.
- Rotation of the currently tracked publishable key is not required solely because it is public.
  Rotate it if the Supabase project changes, if RLS review finds unsafe access, or as part of the
  production cutover. No credentials were rotated.
- The active contact rate-limit stub and dormant Supabase paths remain unchanged as explicitly
  required for this phase.

## Remaining launch blockers

- Production domain
- Phone number
- WhatsApp number
- Business email and confirmed form recipient
- Approved service areas
- Legal company details, if displayed
- Operating hours, if displayed
- Approved logo, favicon, and social-preview image
- Approved brand board, exact colours, and typography
- Approved residential service list and add-ons
- Approved photography or permission to source temporary photography
- Privacy and terms requirements
- Approved redirect map
- Production environment and end-to-end contact delivery verification

## Deferred work

Customer-facing Navbar, Hero, Services, Why Us, About, Contact, Footer, service pages, location pages,
route-level SEO, static discovery files, and transactional email branding remain for later approved
phases. Their legacy references are intentionally not represented as completed Phase 1 work.
