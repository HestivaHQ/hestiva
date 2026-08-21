# Canonical service model reconciliation — 2026-08-21

## Status

Implementation audit and correction against the approved HestivaOS canonical service specification.

## Finding

The Website retained two superseded primary-service choices in active quote presentation:

- `Apartment Cleaning`, although Apartment is canonical property type/context.
- `Eco-Friendly Cleaning`, although Eco-Friendly is canonical request preference data.

The approved primary-service set is Regular Home Cleaning, Deep Cleaning, Move-In Cleaning, Move-Out Cleaning, Kitchen Cleaning, Bathroom Sanitisation, Bedroom Cleaning, Living Area Cleaning, Interior Window Cleaning and Post-Renovation Cleaning. `Not sure` remains a customer escape hatch that routes to review rather than becoming a canonical Service.

The structured Website → HestivaOS contract already transports `property.propertyType` independently and transports `request.ecoFriendlyProducts` independently. Historical mapping aliases in the contract are retained for compatibility with already-created/replayed payloads; the live Website must no longer originate those superseded primary-service selections.

## Correction

- Added a quote-only canonical service-model enhancement that normalises the live `Primary service` selector to the approved primary-service set plus `Not sure`.
- Removed `Apartment Cleaning` and `Eco-Friendly Cleaning` from the legacy shared quote-option catalogue.
- Added `Post-Renovation Cleaning` to that legacy shared catalogue so compatibility helpers do not drift from the approved primary-service set.
- Preserved Apartment as the existing property-type choice.
- Preserved the existing `Use eco-friendly products?` Yes/No preference field.
- Preserved Post-Renovation as assessment/quote-required; this change does not introduce deterministic customer pricing.
- Preserved historical/internal service identifiers and compatibility mappings where removing them could alter replay/history semantics.
- Added browser regression coverage that requires the live Primary Service selector to omit Apartment Cleaning and Eco-Friendly Cleaning while retaining Apartment as a property type.

## Scope boundary

This slice corrects new quote origination semantics. It does not delete historical HestivaOS catalogue records, rewrite accepted Quote history, change pricing, change Website Quote Contract v2 transport shape, change Laundry/Ironing semantics, or alter contact/enquiry routing.

The public service-content catalogue still requires a separate presentation/SEO reconciliation for Apartment/Eco informational pages and a dedicated Post-Renovation service page. That work should be handled separately because route/indexing changes require an explicit information-architecture review rather than being bundled into quote-contract safety work.
