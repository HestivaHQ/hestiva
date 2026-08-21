# Public Service Catalogue Reconciliation — 2026-08-21

## Status

Implemented for review.

## Authority

- `docs/CANONICAL_SERVICE_MIGRATION_MAPPING.md`
- HestivaOS `docs/CANONICAL_SERVICE_SCOPE_PRICING_V1.md`

## Finding

The public Website catalogue still presented Apartment Cleaning and Eco-Friendly Cleaning as standalone primary services even though the approved canonical model reclassifies Apartment as property context and Eco-Friendly as a Yes/No preference. Post-Renovation Cleaning remained an approved primary service but did not have equivalent public service-page treatment.

## Correction

- Added an indexable `/services/post-renovation-cleaning` page.
- The Post-Renovation page explicitly states that assessment and quotation are required and does not expose an automatic per-square-metre price.
- Removed Apartment Cleaning and Eco-Friendly Cleaning from the customer-facing `/services` overview through the catalogue reconciliation enhancement.
- Removed the Apartment and Eco-Conscious legacy routes from the sitemap/indexable route policy.
- Marked those retained legacy URLs `noindex, follow` so existing links can continue to resolve without representing either concept as a canonical primary service in search.
- Removed Service structured-data treatment from the reclassified legacy concepts.
- Preserved Laundry & Ironing and Cleaning Add-On explanatory pages; they remain clearly described as add-on concepts rather than primary-service identities.

## Scope boundary

This change does not delete historical URLs or compatibility content. It does not change HestivaOS service IDs, pricing logic or quote payload compatibility. Apartment remains available as property context in the quote flow and Eco-Friendly remains a separate quote preference.

## Follow-up

The final customer-facing consistency audit should verify service terminology across FAQ, Terms, location pages, correspondence and any remaining marketing copy before final launch-readiness sign-off.
