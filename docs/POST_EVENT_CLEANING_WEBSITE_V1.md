# Post-Event Cleaning — Website v1

## Status

Implemented and merged on the website and HestivaOS sides. Website PR #174 introduced the public Post-Event service page, quote collection and Website Quote Contract v2 mapping. HestivaOS PR #212 superseded stale PR #210 and merged the receiving Website Quote v2 Post-Event contract before website PR #174 was merged.

The approved Post-Event visual assets were added to website `main` on 2026-08-24. The final website integration uses the original PNG as the fallback and the 480/768/1200 WebP derivatives through the existing responsive `ServiceImage` delivery pattern.

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

The website uses Website Quote Contract v2 (`schemaVersion: 2.0`, `source: HESTIVA_WEBSITE`) and the existing private HestivaOS quote endpoint. Post-Event facts are transported under `request.postEvent` using the canonical vocabulary accepted by merged HestivaOS PR #212.

The website does not calculate Post-Event prices. HestivaOS remains the sole authority for workload, profitability safeguards, automatic-quote limits and `NEEDS_ATTENTION` review boundaries.

The existing `StructuredQuoteSubmission` remains the only final `/quote` submit owner. The Post-Event enhancement only adds service-specific collection/validation; it does not add a competing submission handler.

## Public service presence and imagery

`/services/post-event-cleaning` is a canonical indexable primary-service page. Its approved visual depicts outdoor cleanup after a children's birthday party and is stored under `/images/services/post-event-cleaning.*` using the same PNG-fallback plus responsive-WebP convention as the established service-image library.

Because the service now has an `image` entry, it participates in the normal visual service catalogue rather than relying on the temporary no-image navigation fallback used when PR #174 first shipped.

## Review-triggering facts

The website deliberately allows customers to state facts that may require HestivaOS review, including 150+ guests, overnight work, bulk/off-site waste removal, specialist contamination, specialist carpet/upholstery work and complex venues. These facts are transported explicitly rather than hidden or converted into website pricing assumptions.

## Cross-system state

The Website Quote v2 Post-Event receiving contract is merged in HestivaOS through PR #212. Website PR #174 is merged. HestivaOS Issue #73 remains the historical coordination source for the cross-system work; it is not a current website merge blocker.
