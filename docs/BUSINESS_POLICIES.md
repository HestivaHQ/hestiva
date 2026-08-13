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

### Standard recurring bookings — rolling 50% advance

The previously considered model of taking a 50% deposit against an entire upcoming monthly recurring cycle is superseded. Homent instead uses a rolling advance equal to 50% of one normal scheduled recurring visit.

- The first visit follows the initial-booking policy: 50% is paid in advance to secure the visit.
- When the customer continues as a recurring customer, Homent maintains an advance equal to 50% of one normal scheduled visit toward the customer's next appointment.
- After a recurring clean, the customer's payment settles the unpaid portion of the completed visit and replenishes the 50% advance for the next scheduled visit.
- Customer-facing communications should describe this as an advance payment toward the next scheduled clean rather than relying on the internal shorthand "rolling deposit".
- The advance is based on the customer's normal recurring service price. An occasional add-on does not permanently increase the recurring advance.
- If the normal recurring scope and price change permanently, the standing advance may be adjusted to remain equal to 50% of the new normal visit price.
- Four- and five-visit months require no special monthly calculation under standard recurring billing: each actual scheduled/completed visit is handled on its own rolling basis.
- If a customer skips or reschedules a visit with at least 24 hours' notice, the advance may follow the replacement or next scheduled visit.
- If an applicable late-cancellation or failed-access charge consumes the advance, the advance must be replenished before the next service proceeds.
- If payment due after a completed recurring clean is not received, future services may be placed on hold until the outstanding balance and required advance are restored.
- Homent must not allow unpaid recurring visits to accumulate indefinitely.
- When recurring service ends and no further visit will consume the advance, any unused advance remaining after legitimate amounts owed are settled must be refunded or otherwise dealt with in accordance with the agreed customer instruction and applicable law.

## Recurring-service commitment, pause and termination

- Recurring residential cleaning has no fixed-term lock-in.
- A customer may end or pause the recurring arrangement by giving at least 14 days' notice.
- Changing, skipping or rescheduling one individual visit is governed by the normal 24-hour cancellation/rescheduling policy rather than the 14-day recurring-arrangement notice period.
- A pause releases the customer's regular time slot; the same day/time is not guaranteed when service resumes.
- Homent may end a recurring arrangement on reasonable notice.
- Homent may suspend or terminate sooner where serious circumstances justify it, including serious safety concerns, abuse or harassment, unlawful conduct, repeated failed access, or serious/repeated non-payment, subject to applicable law and the circumstances.

## Optional month-end billing for established recurring customers

Month-end billing is not the default recurring payment arrangement and is not available immediately to a new customer.

### Eligibility

- A recurring customer becomes eligible to request month-end billing only after completing two successful months under the standard recurring payment arrangement.
- Eligibility does not create an automatic entitlement to month-end billing; Homent must approve the arrangement.
- At approval, the account must be current and in good standing, with prior services paid on time and no unresolved repeated payment failures.

### Operation

- The existing 50% advance for one normal scheduled visit remains in place as standing security when an approved customer moves to month-end billing.
- Month-end billing covers the actual completed visits in the applicable billing cycle. A cycle containing five weekly cleans therefore costs more than a cycle containing four; the system must not assume that every month contains four weeks.
- Before the customer opts into month-end billing, Homent must clearly disclose the expected financial effect, including the standing advance, the estimated upcoming monthly commitment, the agreed payment date and the consequences of non-payment.
- If a month-end payment is not received as agreed, future cleaning visits may be placed on hold rather than allowing another month's debt to accumulate.
- Repeated month-end payment failures may result in withdrawal of month-end billing and return to standard recurring billing, or termination/suspension of the recurring arrangement where appropriate.
- Longer-term implementation should support an authorised automatic recurring collection method where commercially and technically appropriate; manual EFT must not be assumed to be the permanent design.

### Approved selectable month-end billing dates

- An approved month-end-billing customer chooses their exact agreed payment/collection date from a scrollable/selectable list covering the salary-cycle window from the 25th through the 7th of the following month.
- Supported day numbers are 25, 26, 27, 28, 29, 30, 31 where that day exists in the applicable month, followed by 1, 2, 3, 4, 5, 6 and 7.
- The selected day becomes the customer's agreed recurring month-end billing date and must be stored as structured data rather than free text.
- Where a selected day does not exist in a shorter calendar month, the implementation must not silently invent a substitute rule; the final fallback behaviour requires explicit implementation approval.
- No additional grace period beyond the agreed billing date has been approved. The system must not advertise or infer one until separately decided.

## Financial disclosure and booking correspondence

Material financial terms must be communicated automatically and explicitly as part of the customer's quotation, booking information and/or confirmation process. Homent owners, supervisors and cleaners must not be relied upon to verbally explain standard financial policies to each customer.

The system must present the actual customer-specific rand amounts wherever they are known rather than requiring the customer to calculate percentages.

For an initial or once-off booking, this should include at minimum:

- total quoted service price;
- 50% amount payable to secure the booking;
- remaining amount due upon completion;
- applicable cancellation/rescheduling terms; and
- the fact that a requested date or quotation is not itself confirmation of a booking.

For standard recurring service, correspondence/confirmation must additionally explain:

- the normal per-visit price;
- the 50% advance allocated to the next scheduled visit;
- how the post-service payment both settles the completed visit and replenishes the next-visit advance;
- the amount payable after each normal visit;
- the cancellation/rescheduling consequences for the advance;
- the 14-day rule for ending or pausing the recurring arrangement; and
- what happens if an outstanding payment is not received.

For approved month-end billing, correspondence/confirmation must additionally explain:

- that month-end billing is an approved alternative available only after the required successful recurring history;
- the standing 50% one-visit advance/security amount;
- the agreed payment/collection date selected from the approved 25th-through-7th window;
- the actual or estimated number of visits in the billing cycle;
- the estimated/actual monthly amount, including the effect of four- versus five-visit months;
- any initial or transition amount required to activate the arrangement once that calculation is approved;
- what happens if the scheduled payment fails or is not received; and
- that future services can be suspended rather than allowing unpaid balances to accumulate.

The customer should affirmatively acknowledge material payment terms before entering the relevant arrangement. The same information should be available in durable booking correspondence such as the booking-confirmation email and, if/when implemented, the customer account.

## Cancellation and rescheduling

### Standard notice period

Homent's standard cancellation/rescheduling threshold is 24 hours before the scheduled service.

### Cancellation or rescheduling with at least 24 hours' notice

- Cancellation is free of a cancellation charge.
- Rescheduling is free, subject to availability.
- The customer may choose to have an applicable unused deposit/advance refunded or transferred to the replacement/future booking where appropriate.
- For a recurring customer who reschedules, the advance allocated to the visit may follow the replacement visit.

### Cancellation with less than 24 hours' notice

- The standard late-cancellation charge is 50% of the total booked service price.
- The charge is not an automatic punitive forfeiture. It remains subject to applicable South African consumer law and must be reasonable in the circumstances.
- Homent may reduce or waive the charge where the circumstances reasonably justify doing so.
- Relevant circumstances may include the notice actually given, the nature of the service, whether Homent could reasonably refill the reserved appointment and other factors relevant under applicable consumer law.
- Where the customer's 50% booking deposit/advance equals the applicable standard late-cancellation charge, Homent does not charge an additional amount merely because the deposit/advance has already been paid.
- If the applicable reasonable cancellation charge is lower than the amount held, the remaining amount must be refunded or credited as appropriate.

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

## Deposit/advance and cancellation-charge distinction

A booking deposit or recurring advance and a cancellation charge are separate concepts.

The 50% initial deposit secures an initial/once-off booking. Under standard recurring billing, the 50% standing advance secures the next normal scheduled visit. The existence of either does not mean that 50% is automatically forfeited in every cancellation scenario.

Any cancellation charge must follow the approved cancellation policy and applicable consumer-law requirements.

## Cross-system operational visibility

HestivaOS must provide operational visibility into upcoming expected customer payments so management can plan cash flow without reconstructing expected receipts manually from Work Orders or recurring schedules.

The OS requirement is a dedicated Upcoming Payments capability that derives expected receipts from authoritative booking, recurring-agreement, payment-arrangement and payment-status data rather than duplicating customer-facing pricing logic.

At minimum, the operational view should support:

- customer;
- property;
- associated recurring agreement and/or Work Order where applicable;
- expected due date;
- billing arrangement, including standard per-visit recurring billing versus approved month-end billing;
- expected amount;
- standing advance already held;
- outstanding amount;
- next scheduled clean;
- payment status; and
- whether future service is active, at risk, or held because of payment status.

Management summaries should include expected receipts due today, in the next 7 days, during the remainder of the current month, expected month-end collections, and overdue amounts, with totals suitable for cash-flow planning.

This view is operational/management functionality. It must not expose ADMIN-only pricing information to unauthorised roles.

## Implementation requirement

The policies above must be propagated consistently to all relevant customer-facing and operational surfaces, including as applicable:

- Terms of Service;
- customer FAQ content;
- quotation and booking flows;
- booking confirmations and payment instructions;
- recurring-service communications;
- cancellation/rescheduling communications;
- HestivaOS recurring-service and financial-planning functionality; and
- any future payment automation or customer account experience.

Until implementation is completed, existing website wording that says Homent does not apply a universal deposit percentage is superseded by this approved policy and must be corrected.

The existing documentation statement that recurring customers use a 50% deposit against the entire upcoming monthly cycle is also superseded by the rolling one-visit advance model recorded above.

## Decisions still requiring separate approval

This document does not yet establish:

- the exact technical payment method(s) used to collect deposits, advances or balances;
- the exact automatic collection provider/mechanism for future recurring billing;
- fallback behaviour when a selected billing day does not exist in a shorter month;
- any grace period after the selected month-end billing date;
- the exact transition amount, if any beyond the existing one-visit standing advance, required when an eligible customer activates month-end billing;
- detailed refund processing timeframes;
- the advance-notice rule for recurring-service price increases; or
- any policy not expressly approved above.
