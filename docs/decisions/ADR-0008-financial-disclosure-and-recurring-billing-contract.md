# ADR-0008: Coordinate financial disclosure and recurring billing with HestivaOS

- Status: Accepted
- Date: 2026-08-13

## Decision

The public website must not invent an independent recurring-payment model. HestivaOS remains the authoritative operational/pricing/financial source for structured recurring billing state, while the website and customer correspondence present approved financial terms consistently.

Month-end billing is an optional approved arrangement for established recurring customers only. Eligibility, selected billing date, short-month fallback, standing security, live accumulated cycle amount, overdue account state, refunds and recurring price-change state belong to the coordinated Website ↔ HestivaOS contract rather than website-only logic.

Material customer financial terms must be explicit. When actual ZAR amounts are known, the website/correspondence must present actual amounts rather than percentages alone. Recurring disclosure includes normal visit price, standing advance, applicable balance, next-visit advance allocation, amount payable, next visit and cancellation/rescheduling consequences. Approved month-end disclosure additionally includes selected billing date, completed services in the cycle, running amount, expected amount due, standing security and next payment date.

Any new shared financial field must be structured and versioned through the HestivaOS Slice 5M Issue #73 coordination process before incompatible implementation is merged.

Automated financial correspondence is an approved business requirement but its technical sending architecture is not approved. No email provider, payment-link provider, job/retry design or additional communication channel is selected by this ADR.

## Consequences

The website remains a presentation/submission surface rather than a second financial authority. Financial disclosures can evolve only with coordinated contract changes, and correspondence-provider implementation must wait for a separate approved design.
