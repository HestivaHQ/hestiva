# Homepage contact CTA navigation

Status: IMPLEMENTED

The homepage Contact CTA now uses internal TanStack Router navigation for both customer actions.

## Customer-facing routes

- `Request a Quote` routes to `/quote`.
- `Contact Homent` routes to `/contact`.

## Scope

- Replaces the previous plain internal anchor for `/quote` with a router link.
- Replaces the previous direct `mailto:` secondary action with the Contact page so customers can choose from the contact options presented there.
- Keeps the existing CTA copy, styling, and homepage layout unchanged.
- Does not change quote processing, contact handling, business rules, pricing, or HestivaOS integration.
