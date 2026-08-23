# Post-Event Cleaning — Website v1

## Status

Implementation is staged on the website feature branch and must not be merged ahead of the accepting HestivaOS contract change in HestivaOS PR #210.

## Customer-facing quote collection

When `Post-Event Cleaning` is selected on `/quote`, the website enforces a one-time frequency and collects structured event/workload facts for:

- event type;
- venue/property context;
- approximate guest band;
- bathrooms used;
- substantial kitchen use;
- dishwashing level;
- optional outdoor event areas (patio, balcony, braai area, garden entertainment area);
- ordinary waste level;
- significant ordinary spills/soiling;
- late-night or overnight requirement;
- bulk/off-site waste-removal request;
- specialist contamination or bodily-fluid cleanup indicator;
- specialist carpet/upholstery treatment indicator; and
- large or operationally complex venue indicator.

Required Post-Event fields fail closed in the browser before the customer can continue past the Cleaning Requirements step. Browser validation is convenience only; HestivaOS remains authoritative for contract validation, pricing and review-required outcomes.

## Transport mapping

The website continues to use Website Quote Contract v2 (`schemaVersion: 2.0`, `source: HESTIVA_WEBSITE`) and the existing private HestivaOS quote endpoint. Post-Event facts are transported under `request.postEvent` using the exact canonical vocabulary approved in HestivaOS PR #210.

The website does not calculate Post-Event prices. HestivaOS remains the sole authority for workload, profitability safeguards, automatic-quote limits and `NEEDS_ATTENTION` review boundaries.

The existing `StructuredQuoteSubmission` remains the only final `/quote` submit owner. The Post-Event enhancement only adds service-specific collection/validation; it does not add a competing submission handler.

## Review-triggering facts

The website deliberately allows customers to state facts that may require HestivaOS review, including 150+ guests, overnight work, bulk/off-site waste removal, specialist contamination, specialist carpet/upholstery work and complex venues. These facts are transported explicitly rather than hidden or converted into website pricing assumptions.

## Cross-system dependency

Website merge/deployment is blocked until the HestivaOS Website Quote v2 Post-Event contract is green, merged and available at the receiving integration boundary. The coordinating HestivaOS change is PR #210 and the shared coordination source is HestivaOS Issue #73.
