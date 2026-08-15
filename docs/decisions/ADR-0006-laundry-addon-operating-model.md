# ADR-0006: Enforce the laundry add-on operating model in the quote flow

- **Status:** Accepted
- **Date:** 2026-08-12
- **Eligibility amended:** 2026-08-15

## Context

The public quote flow previously exposed `Laundry Folding` as both a primary service and an add-on. The approved canonical Hestiva service specification supersedes that model: laundry is an add-on only, uses the customer's on-site washing equipment, derives the outcome from available drying facilities, and keeps ironing separate.

The initial implementation limited Laundry and Ironing to `Regular Home Cleaning` and `Deep Cleaning`. Production quote testing subsequently showed that this commercial eligibility restriction made valid add-on requests unavailable when customers selected another supported primary cleaning service. On 2026-08-15 the eligible primary-service set was explicitly broadened so Laundry and Ironing remain add-ons, but may accompany any supported primary cleaning-service selection in the website quote flow. Operational feasibility remains subject to HestivaOS acceptance and load-cap rules.

## Decision

The website quote flow must:

- remove `Laundry Folding` from customer-selectable primary services at runtime;
- make Laundry and Ironing selectable as add-ons after any supported primary cleaning-service selection, including the `Not sure` quote path;
- derive **Wash, Dry & Fold** when the customer has a washing machine and tumble dryer;
- derive **Wash & Hang** when the customer has a washing machine but no tumble dryer and uses a washing line/drying rack;
- reject Laundry when no working washing machine is available;
- collect requested standard-load quantities for Laundry and Ironing;
- present the approved launch prices of R175/load for Wash, Dry & Fold, R125/load for Wash & Hang and R150/load for Ironing;
- keep Ironing separate from Laundry and allow it for already-clean/dry clothing;
- preserve structured Website → HestivaOS submission and authoritative HestivaOS acknowledgement before customer-facing quote acceptance.

The current route enhancement is deliberately `/quote`-only and lazy-loaded so ordinary landing pages do not inherit the additional browser code.

## Consequences

The website will no longer let a normal customer choose Laundry as the primary reason for the booking. Existing historical strings may still exist in older records and source history; new runtime behaviour follows the canonical operating model.

Laundry and Ironing are no longer disabled merely because the customer selected a primary service other than Regular Home Cleaning or Deep Cleaning. This broadens quote-request capture only; it does not guarantee that every requested quantity or combination can be operationally accepted.

The website can collect requested quantities, but the final accepted quantity must still be bounded by HestivaOS operational duration/labour feasibility before a Work Order is approved.

## Review triggers

Review this ADR if Laundry becomes standalone, Homent introduces off-site laundry, the eligible primary-service set changes again, customer equipment assumptions change, or the approved per-load prices change.
