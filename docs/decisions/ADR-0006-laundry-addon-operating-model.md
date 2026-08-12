# ADR-0006: Enforce the laundry add-on operating model in the quote flow

- **Status:** Accepted
- **Date:** 2026-08-12

## Context

The public quote flow previously exposed `Laundry Folding` as both a primary service and an add-on. The approved canonical Hestiva service specification supersedes that model: laundry is an add-on only to qualifying whole-home cleaning, uses the customer's on-site washing equipment, derives the outcome from available drying facilities, and keeps ironing separate.

## Decision

The website quote flow must:

- remove `Laundry Folding` from customer-selectable primary services at runtime;
- make Laundry and Ironing selectable only when the primary service is `Regular Home Cleaning` or `Deep Cleaning`;
- derive **Wash, Dry & Fold** when the customer has a washing machine and tumble dryer;
- derive **Wash & Hang** when the customer has a washing machine but no tumble dryer and uses a washing line/drying rack;
- reject Laundry when no working washing machine is available;
- collect requested standard-load quantities for Laundry and Ironing;
- present the approved launch prices of R175/load for Wash, Dry & Fold, R125/load for Wash & Hang and R150/load for Ironing;
- keep Ironing separate from Laundry and allow it for already-clean/dry clothing;
- preserve the current email quote-submission path while the structured Website → HestivaOS ingestion endpoint remains a separate integration slice.

The current route enhancement is deliberately `/quote`-only and lazy-loaded so ordinary landing pages do not inherit the additional browser code.

## Consequences

The website will no longer let a normal customer choose Laundry as the primary reason for the booking. Existing historical strings may still exist in older records and source history; new runtime behaviour follows the canonical operating model.

The website can collect requested quantities, but the final accepted quantity must still be bounded by HestivaOS operational duration/labour feasibility before a Work Order is approved.

## Review triggers

Review this ADR if Laundry becomes standalone, Hestiva introduces off-site laundry, the eligible primary-service set changes, customer equipment assumptions change, or the approved per-load prices change.
