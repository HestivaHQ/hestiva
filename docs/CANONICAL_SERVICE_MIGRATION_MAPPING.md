# Hestiva Website → Canonical Service Migration Mapping

**Status:** Approved migration mapping

**Decision cutoff:** 2026-08-12

**Authority:** HestivaOS `docs/CANONICAL_SERVICE_SCOPE_PRICING_V1.md` and superseding ADR-0025.

## Purpose

This document maps the current website quote/service concepts to the approved canonical Hestiva model. It exists to prevent UI pseudo-options from becoming operational Services and to keep website quote payloads aligned with HestivaOS.

## Current website values that must change

### Keep as primary-service choices

- Regular Home Cleaning
- Deep Cleaning
- Move-In Cleaning
- Move-Out Cleaning
- Kitchen Cleaning
- Bathroom Sanitisation
- Bedroom Cleaning
- Living Area Cleaning
- Interior Window Cleaning
- Post-Renovation Cleaning

### Remove/reclassify from primary-service choices

- `Laundry Folding` → replace with **Laundry** as add-on only to qualifying whole-home cleaning; facility logic determines Wash, Dry & Fold vs Wash & Hang; Ironing remains a separate add-on.
- `Apartment Cleaning` → **Apartment** becomes property type/context.
- `Eco-Friendly Cleaning` → **Eco-Friendly** becomes a Yes/No preference on compatible services; launch surcharge R0.
- `Add-On Services` → UI grouping only; actual add-ons are selected individually.
- `Multiple Services Required` → UX helper/path only; resolve into real service/add-on selections before quote submission.
- `Other (Please Describe)` → customer escape hatch routed to manual/Admin review; not a service ID and never automatically priced.

## Job-type cleanup

The current quote options mix incompatible concepts inside `JOB_TYPES`. Migration must separate:

- service type;
- property type/context;
- recurrence/frequency;
- service scope;
- furnishing/condition information;
- add-ons;
- manual-review free text.

Examples of current values that must be reclassified:

- Move-In/Move-Out `Apartment` / `House` → property type, not job type.
- Bedroom `Linen Change` → included in normal Bedroom Cleaning when clean replacement linen is supplied; only extra beds outside purchased room scope use the extra-bed add-on price.
- Kitchen `Appliance Add-Ons` → UI grouping for actual appliance add-ons, not a job type.
- Laundry `Small/Medium/Large Load` → replace with standard machine-load quantity plus facility/outcome logic.
- `Other` values → manual review where still required; not silently canonicalised.

## Pricing source

The website must not maintain an independent conflicting price model. Customer-facing quote calculations and displayed `from` prices must remain aligned with HestivaOS canonical pricing and safeguards.

Key approved public-facing minimums include:

- Regular Cleaning: from R650
- Deep Cleaning: from R1,000
- Move-In / Move-Out: from R1,200
- Kitchen Cleaning: R600 standard; Deep/Detailed Kitchen from R950
- Bathroom Sanitisation: first standard bathroom R550
- Bedroom Cleaning: first standard bedroom R450
- Living Area Cleaning: first standard area R450
- Interior Window Cleaning: R400 minimum including up to 6 standard accessible interior windows

Final quotes remain subject to approved property/workload inputs, location/deployment economics, break-even safeguards and upward-to-next-R10 rounding.

## Add-on semantics

Website UI must support actual add-ons and quantities where commercially meaningful, including the approved rules for:

- Laundry: Wash, Dry & Fold R175/load; Wash & Hang R125/load; add-on only
- Ironing: R150/standard load; add-on only
- Balcony/Patio: R100 standard / R175 large / R250 very large terrace
- Garage: R250 single / R400 double / larger assessed
- Oven Interior: R350 standard / R500 double-large / +R150 severe condition
- Fridge Interior: R300 standard / R400 large combo / R500 side-by-side or French-door / +R100 severe condition
- Extractor Hood: R200 standard / R300 large or heavily greased
- Pantry basic: R75 small / R150 standard walk-in / R250 large walk-in
- Extra-bed linen change outside purchased bedroom scope: R40 standard / R60 large-complex

Do not expose specialist exclusions as selectable add-ons unless a future approved service introduces them.

## Laundry UI requirements

Laundry must only appear when the selected booking is an eligible whole-home clean.

Ask for facilities:

- Washing machine + tumble dryer → Wash, Dry & Fold
- Washing machine + washing line/drying rack → Wash & Hang
- No washing machine → unavailable

Load quantity must be bounded by booking-duration feasibility returned/enforced by the canonical system.

Ironing may be added separately, including for already-clean/dry clothing, but is not standalone.

## Scope messaging requirements

Customer-facing service descriptions/tooltips/FAQ must be generated from the canonical Hestiva scope. Important distinctions include:

- Standard vs Deep/Detailed Kitchen
- Cupboard interiors/contents handling only within approved deep scopes
- Move-In/Move-Out includes empty cabinetry, oven/fridge interiors, accessible interior windows and normal balcony/small patio
- Garage is optional even for Move-In/Move-Out
- Specialist couch/mattress/curtain cleaning is not offered in v1
- High-access/exterior specialist window work is excluded
- Customer valuables/sensitive items must be secured and can create an inaccessible-area exception

## Quote-policy UX requirements

Website/quote UX must support or clearly communicate:

- 50% deposit to confirm; 50% due on recorded completion
- recurring discount activates from second qualifying Regular Clean
- weekly 10%, fortnightly 7.5%, monthly 5% on Regular Cleaning base only, subject to profitability floor
- cancellation: >24h free; 12–24h 25%; <12h/same-day 50%; no-access/no-show 100%
- 30-minute access grace; customer-caused delay consumes reserved service window
- 24-hour service-quality guarantee with re-clean first
- material on-site price/scope increase requires customer approval when at/above greater of R100 or 10%
- ordinary favourable workload variance does not automatically reprice downward; genuine Hestiva quoting error is corrected/refunded

## Post-Renovation

Post-Renovation Cleaning remains a primary service but is assessment/quote-required for v1. Do not expose the earlier R40/m² discussion as an automatic binding instant quote.

## Data-contract rules

- Send deterministic structured values, not display-label guesses.
- Preserve property type separately from service type.
- Preserve recurrence separately from service scope.
- Preserve add-on IDs/quantities separately from primary service.
- Preserve eco-friendly preference separately from service identity.
- Free-text `Other` never becomes a guessed service value.
- Unknown/unmapped values fail closed or route to review.
- Preserve shared website/HestivaOS quote identity and existing integration idempotency rules.

## FAQ/checklist derivation

Website FAQ content must be derived from the canonical specification. Do not invent a second version of service scope in website copy.

The cleaner/supervisor checklist system is owned by the operational canonical model; website descriptions should match it but must not expose internal break-even formulas, margin logic, supervisor price-blind percentages or internal commercial controls.
