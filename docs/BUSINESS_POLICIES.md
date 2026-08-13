# Homent Canonical Business Policies

Date established: 13 August 2026
Status: Approved canonical business-policy reference

## Purpose

This document records approved Homent customer-facing and operational business policies that affect quotations, bookings, payments, recurring services, cancellations, refunds and related service administration.

Where customer-facing website copy, FAQs, quotation flows, booking communications or operational documentation discuss a policy covered here, they must remain consistent with this document.

This document records approved policy. It must not be used to invent undecided rules.

## Documentation workflow rule

Homent uses the repository as the durable source of truth for approved project and business decisions rather than relying on chat history or handover documents.

After approximately 3–5 substantive business or product decisions, the current canonical documentation must be updated before substantial further implementation or policy work continues.

A documentation update must happen sooner when a major policy, architecture, legal/customer-terms, payment, booking or operational decision is approved.

Minor clarifications that do not create or change policy do not individually trigger a checkpoint.

Handovers are navigation aids only. They do not replace canonical repository documentation.

Architecture and engineering decisions should continue to use the repository's ADR/engineering documentation where appropriate. Customer-facing and operational business rules belong in this business-policy reference unless a more specific canonical document is established.

## Payments and deposits

### Initial and once-off bookings

- A 50% deposit is required to secure an initial or once-off cleaning booking.
- The remaining 50% is due upon completion of the cleaning service.
- A requested date or quotation does not by itself confirm a booking; the applicable booking-confirmation process must still be completed.

### Recurring bookings

- The first visit follows the initial-booking payment policy: 50% deposit to secure the booking and the remaining 50% due upon completion.
- After the initial visit, an approved recurring customer may move onto a monthly recurring reservation cycle.
- The recurring customer's agreed payment date may be aligned with the customer's salary/payday cycle.
- A 50% deposit toward the upcoming recurring cycle reserves the scheduled visits in that cycle.
- The remaining balance attributable to each individual visit is due after that visit is completed.
- The recurring payment-date arrangement is intended to reduce unnecessary payment friction while preserving Homent's advance reservation protection. It is not intended to create an open-ended credit arrangement.

## Cancellation and rescheduling

### Standard notice period

Homent's standard cancellation/rescheduling threshold is 24 hours before the scheduled service.

### Cancellation or rescheduling with at least 24 hours' notice

- Cancellation is free of a cancellation charge.
- Rescheduling is free, subject to availability.
- The customer may choose to have the applicable deposit refunded or transferred to the replacement/future booking.
- For a recurring customer who reschedules, the payment already allocated to the visit follows the replacement visit where appropriate.

### Cancellation with less than 24 hours' notice

- The standard late-cancellation charge is 50% of the total booked service price.
- The charge is not an automatic punitive forfeiture. It remains subject to applicable South African consumer law and must be reasonable in the circumstances.
- Homent may reduce or waive the charge where the circumstances reasonably justify doing so.
- Relevant circumstances may include the notice actually given, the nature of the service, whether Homent could reasonably refill the reserved appointment and other factors relevant under applicable consumer law.
- Where the customer's 50% booking deposit equals the applicable standard late-cancellation charge, Homent does not charge an additional amount merely because the deposit has already been paid.
- If the applicable reasonable cancellation charge is lower than the deposit held, the remaining amount must be refunded or credited as appropriate.

### No-show and failed access

- A no-show or failure to provide safe, lawful and timely access may be treated as a late cancellation.
- The standard charge is up to 50% of the total booked service price, subject to the same reasonableness and consumer-law safeguards that apply to late cancellations.
- Homent staff must not bypass security or enter unlawfully to avoid a failed-access outcome.

### Refilled cancelled appointment

If Homent successfully fills a late-cancelled appointment, the cancellation charge should be reduced or waived where appropriate rather than automatically retaining the full standard charge. Any reasonable administrative or other actual loss may still be considered where legally appropriate.

### Death or hospitalisation

No cancellation charge is imposed where applicable South African consumer law prohibits a cancellation charge because the booking cannot be honoured due to the death or hospitalisation of the person for whom the booking was made.

### Cancellation by Homent

If Homent cancels a booking, the customer may choose either:

- a full refund of amounts paid for the affected service; or
- transfer of the full applicable amount to a replacement booking.

## Deposit and cancellation-charge distinction

A booking deposit and a cancellation charge are separate concepts.

The 50% deposit secures the booking or recurring reservation cycle. The existence of a 50% deposit does not mean that 50% is automatically forfeited in every cancellation scenario.

Any cancellation charge must follow the approved cancellation policy and applicable consumer-law requirements.

## Implementation requirement

The policies above must be propagated consistently to all relevant customer-facing and operational surfaces, including as applicable:

- Terms of Service;
- customer FAQ content;
- quotation and booking flows;
- booking confirmations and payment instructions;
- recurring-service communications;
- cancellation/rescheduling communications; and
- any future payment automation or customer account experience.

Until implementation is completed, existing website wording that says Homent does not apply a universal deposit percentage is superseded by this approved policy and must be corrected.

## Decisions still requiring separate approval

This document does not yet establish:

- the exact technical payment method(s) used to collect deposits or balances;
- whether recurring-cycle deposits will initially be collected manually, by payment link, debit order or another mechanism;
- the exact set of selectable payday/payment-date options exposed in the customer interface;
- detailed refund processing timeframes;
- any policy not expressly approved above.
