# Quote form consistency and submission audit — 15 August 2026

Status: implementation companion note

## Scope

This change corrects customer-facing `/quote` form inconsistencies reported during production testing without changing pricing, payment policy, Website Quote Contract v2 ownership, HestivaOS pricing authority, email routing, authentication, or the fail-closed Website → HestivaOS acknowledgement boundary.

## Form corrections

- `Add-on Services` is removed from the Primary service selector. Add-ons remain selectable only in the dedicated add-on step.
- Townhouse no longer exposes the apartment-style `Unit floor / level` selector. Townhouses use the home-storey question only.
- House storey options no longer include `Not sure`.
- Townhouse storeys use `1 storey`, `2 storeys`, `3+ storeys`, and `Not sure` rather than apartment floor-level semantics.
- Bathroom selection no longer depends on a bedroom selection. Required-field validation remains responsible for requiring both bedroom and bathroom answers before leaving the home-details step.
- Selecting `Other` as Property type reveals a mandatory description field.
- Selecting `Not sure` as Primary service reveals a mandatory description field so the customer can explain what they want cleaned.
- Selecting `Custom` frequency reveals a mandatory field for the customer's requested cadence.
- Conditional storey/unit-floor questions are now mandatory when they apply.
- Conditional textarea errors use the same visible, focusable, accessible error treatment as the existing text/select fields.
- Review, sidebar summary and WhatsApp fallback use the customer's entered custom property/service/frequency description rather than displaying only `Other`, `Not sure`, or `Custom`.

## Submission ownership preserved

PR #144 established `StructuredQuoteSubmission` as the deterministic final residential quote submission owner while the legacy lazy controller remains responsible for progressive UX/contact behaviour. This correction does not reintroduce a competing final submission handler.

PR #139 established the fail-closed Website Quote Contract v2 path: HestivaOS must accept the structured request and return the authoritative `quoteReference` before the website sends success correspondence.

## Current production send-error diagnosis

The website adapter requires both `HESTIVA_OS_API_URL` and `HESTIVA_WEBSITE_INTEGRATION_SECRET` at Cloudflare runtime. `docs/ENVIRONMENT.md` explicitly states that either value being absent/blank causes quote submission to fail closed before confirmation email is sent.

The 2026-08-14 changelog also records that production activation remained blocked pending operational verification of the Website → HestivaOS runtime secrets/configuration. The current HestivaOS contract documentation confirms that `POST /api/v1/integrations/website/quotes` is the guarded ingestion endpoint and that successful website intake requires an acknowledgement containing `quoteReference`.

Therefore the production `quote not sent` symptom must not be “fixed” by bypassing HestivaOS or restoring the legacy email-only quote path. The production runtime values and HestivaOS endpoint reachability/authentication must be verified operationally without exposing secret values.

## Required verification

Before merge, run the normal Hestiva PR Check on the exact final head. After deployment, production QA should verify:

1. required-field errors are visible rather than later fields becoming unusable without explanation;
2. Townhouse, House, Apartment, Duplex and Other property branches render the intended conditional questions;
3. Primary service cannot be `Add-on Services`;
4. custom property/service/frequency text is mandatory and survives into the structured form snapshot;
5. a real quote reaches HestivaOS and returns an authoritative reference before the website reports success.
