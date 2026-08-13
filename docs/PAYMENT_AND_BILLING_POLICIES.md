# Homent Canonical Payment and Billing Policies

Date established: 13 August 2026
Status: Approved canonical payment/billing policy

## Authority and relationship to other documentation

This document is the specific canonical source of truth for Homent payment, billing, refund, payment-dispute and related customer-facing financial policy. Where an older payment statement in `docs/BUSINESS_POLICIES.md` conflicts with this document, this document supersedes the older statement.

This document records approved business policy. HestivaOS implementation architecture remains the responsibility of the HestivaOS repository; website implementation must communicate and enforce the customer-facing rules recorded here and pass the required structured information to HestivaOS.

## Documentation batching rule

Routine documentation synchronization may batch up to approximately 15 substantive approved decisions because each cross-system migration has material coordination cost. An earlier checkpoint is still required where a decision materially changes architecture, security, legal/compliance behaviour, production infrastructure, or would make continued implementation unsafe or inconsistent.

## Initial and once-off bookings

- A 50% deposit is required to secure an initial or once-off cleaning booking.
- The remaining 50% is due upon completion of the cleaning service.
- Customer-facing correspondence must show actual rand amounts wherever known, not only percentages.
- A requested date or quotation is not by itself a confirmed booking.

## Standard recurring service — per-job billing

- Recurring residential service has no fixed-term lock-in.
- A customer may end or pause the recurring arrangement with at least 14 days' notice.
- Individual visit cancellation/rescheduling follows the normal 24-hour cancellation policy.
- Standard recurring billing is per job, using a standing advance equal to 50% of one normal scheduled visit.
- After each completed recurring visit, payment settles the outstanding portion of that visit and replenishes the 50% advance securing the next visit.
- Four- and five-visit months naturally differ according to actual visits; Homent does not assume every month contains four weekly services.
- If a late-cancellation/failed-access charge legitimately consumes the advance, the required advance must be restored before the next service proceeds.

## Optional month-end billing

### Eligibility

- Month-end billing is optional and is not available to a new recurring customer immediately.
- A recurring customer becomes eligible to request it after two successfully paid months of standard per-job recurring service.
- Approval requires the account to be current, with satisfactory payment history and no unresolved outstanding balance/repeated payment failures.
- Eligibility is not automatic approval.

### Billing-date choice

- An approved customer chooses an exact billing day from the salary-cycle window: 25, 26, 27, 28, 29, 30, 31, 1, 2, 3, 4, 5, 6 or 7.
- The selected day is stored as structured data.
- If the selected 29th, 30th or 31st does not exist in a shorter month, payment is due on the final calendar day of that month.
- The fallback affects only that month; the customer's original selected day remains unchanged for later months.
- Weekend/public-holiday collection behaviour remains unresolved and must follow an explicitly approved rule/payment-provider behaviour later; it must not be invented by implementation.

### Transition into month-end billing

- Additional transition payment required: R0.
- The customer's existing 50% one-normal-visit advance remains held as standing account security.
- Month-end billing begins with the first scheduled service after the customer's next selected billing-date anchor.
- This avoids a confusing partial/immediate first billing cycle.

### Running bill

- Each completed service in the active month-end billing cycle is added to a live accumulating bill/statement.
- The customer must be able to understand the services accumulated, running amount and next due date from website/customer correspondence/account surfaces as implemented.
- The system must use actual applicable services, so four-clean and five-clean cycles naturally produce different totals.
- The same authoritative billing information must be available to HestivaOS for operational cash-flow visibility; the website must not create a conflicting duplicate financial truth.

## Customer financial disclosure and correspondence

Material financial terms must be disclosed automatically and explicitly in the quotation/booking/confirmation experience. Owners, supervisors and cleaners must not be relied upon to explain standard financial mechanics manually.

Where amounts are known, show actual rand values, including as applicable:

- total service price;
- amount payable now;
- balance due after service;
- advance held for the next recurring visit;
- billing cadence/method;
- selected month-end billing date;
- completed services in the active billing cycle;
- running amount/expected amount due;
- next payment date;
- cancellation/rescheduling consequences; and
- consequences of non-payment.

Customers should affirmatively acknowledge material payment terms before entering the applicable arrangement, and the information must be available in durable correspondence such as confirmation email and any future customer account.

## Recurring price increases

- Homent gives recurring customers at least 30 calendar days' written notice before a price increase takes effect.
- The notice must show the current price, new price, effective date, current standing advance, new 50% standing advance, any resulting advance adjustment and revised estimated month-end amount where applicable.
- No retrospective repricing is allowed.
- Services before the effective date retain the old price; services on/after the effective date use the new price.
- Any increase to the standing advance is incorporated into the first applicable payment at the new price rather than demanded immediately when notice is issued.
- Because recurring service has no fixed-term lock-in, the customer may end the recurring arrangement before the increase takes effect under the applicable termination rule.

## Refunds and overpayments

- Homent initiates an approved refund within 5 business days. Bank/payment-provider reflection time may be additional and is outside Homent's direct control.
- Refunds may include refundable deposits/advances, overpayments, duplicate payments, Homent-cancelled services and amounts resulting from reduced/waived cancellation charges where applicable.
- If a customer overpays, the customer chooses whether the excess is refunded or retained as account credit for future Homent services.
- Refund approval is Admin-only at launch.
- Supervisors may submit a refund request with a reason/supporting information but cannot approve it or mark funds as refunded.
- Future delegation of refund authority may be controlled by Admin as a separate permission and may use rand-value limits; implementation belongs in HestivaOS.

## Underpayments

- Any unpaid remainder remains an outstanding balance.
- An outstanding amount of R50 or less does not by itself place the next service on hold.
- An outstanding amount greater than R50 triggers the applicable service-hold rule.
- The R50 threshold is an operational tolerance, not debt forgiveness; the outstanding amount remains visible/payable.

## Overdue-payment workflow

No late-payment fee or interest is currently approved.

- Due date: payment becomes due under the applicable arrangement.
- +24 hours: if still unpaid and not legitimately in an approved clearing/dispute state, an automatic friendly payment reminder is sent.
- +72 hours: if still unpaid, an automatic final payment warning is sent.
- Before any subsequent clean: if the applicable previous balance remains unpaid beyond the approved R50 tolerance, the upcoming visit is placed on service hold and does not proceed.
- A service hold caused by an outstanding balance is not itself a new customer cancellation and does not automatically create another cleaning/cancellation charge.
- +7 calendar days: if still unpaid, the account enters payment suspension until the outstanding amount is settled.

The automated correspondence system is an approved requirement, but its technical implementation must be discussed separately with the HestivaOS owner/development chat before implementation. No email provider, payment provider, retry engine or additional channel is approved merely by this policy.

## Loss and restoration of month-end billing privilege

- One serious default does not permanently remove month-end billing.
- If a customer reaches payment suspension twice within a rolling 12-month period, month-end billing privilege is withdrawn after the outstanding account is settled.
- The recurring service schedule may remain active, but billing reverts to standard per-job recurring payment.
- After 3 consecutive months of successful per-job payments, with the account current and no payment suspensions during that period, the customer becomes eligible to request month-end billing again.
- Restoration is not automatic; it remains subject to approval.

## Payment disputes

- A genuine payment/invoice dispute applies only to the specifically identified disputed amount.
- Automated collection consequences pause for the disputed amount while it is under good-faith review.
- Undisputed amounts remain payable.
- Homent automatically acknowledges a dispute and records the relevant invoice/payment, amount, stated reason and available supporting information.
- Initial human review target: within 2 business days.
- Target resolution: within 5 business days. If more investigation is genuinely required, the customer receives an update rather than silence.
- A genuine dispute does not by itself suspend future recurring service where the account is otherwise current and there is no independent reason to suspend service.
- Resolution may result in correction/credit/refund, confirmation that the amount is payable, partial adjustment, or a documented goodwill resolution.
- A dispute must not be usable as a blanket mechanism to freeze unrelated invoices or future obligations.

## Launch payment method — manual EFT

Homent will not launch on the assumption that a payment gateway exists. Manual/ordinary EFT must be supported as a first-class launch payment workflow.

- Proof of payment (POP) is evidence that the customer initiated a payment; it is not final confirmation that Homent received cleared funds.
- Where a legitimate POP is received on time for an ordinary EFT, the payment may enter an awaiting-clearance state and normal overdue reminders for that payment pause while a reasonable clearing period is allowed.
- Launch clearing allowance: up to 2 business days for ordinary EFT settlement/verification.
- If funds have not reflected after that period, the payment is flagged for verification/customer contact rather than automatically being treated as proven paid.
- A new booking is financially confirmed when the required deposit is verified as received, not merely because a screenshot/POP was submitted.
- Customer-facing payment instructions must warn that standard EFT may take time to reflect and that near-term bookings may require a faster available payment method.
- The website/customer workflow should associate submitted POP information with the correct customer, booking/invoice and amount rather than relying on scattered manual email screenshots.

Future automated/gateway payments may have provider-specific retry behaviour. The previously discussed 3-hour automatic retry is NOT a universal launch rule. Any automatic retry must depend on a provider identifying the failure as safely retryable and must verify the original transaction state first to prevent duplicate collection.

## Manual payment verification authority

- At launch, only Admin is authorised to mark a manual EFT as verified/received.
- Supervisors may see payment status where their role permits but cannot convert an awaiting-clearance/unverified payment into paid.
- Future HestivaOS Admin Settings may allow Admin to delegate a specific manual-payment-verification permission without granting full Admin access.
- Verification must retain who verified the payment and when, with an audit trail; reversing/changing verified payment status requires equivalent or stronger authority and must also be auditable.
- Payment-verification authority is separate from refund authority.

## General launch financial-authority rule

Financial authority defaults to Admin-only at launch unless an approved policy explicitly states otherwise. Future delegation may be provided through Admin-controlled permissions with appropriate limits and audit history. This policy defines business authority; HestivaOS determines the implementation.

## Multi-invoice payments

- If a customer explicitly identifies which valid invoice(s) a payment is intended to settle, that allocation takes precedence.
- Otherwise, a payment covering multiple outstanding items is allocated to the oldest outstanding amount first.
- Allocation must remain recorded/auditable rather than treating the received amount as an unallocated generic payment.

## Invoices, receipts and corrections

- Every formally issued invoice receives a unique sequential invoice number.
- Issued financial history must not be silently edited or deleted.
- Corrections are made through appropriate auditable credit/adjustment documents rather than rewriting historical records without trace.
- Once payment is verified, the system should automatically generate/send a receipt or payment confirmation referencing the applicable invoice(s), amount, date and payment method.
- Ordinary invoice numbers/receipts should be system-generated rather than manually invented by staff.

## Cash payments

- Cash is not a standard launch payment method.
- Cleaning staff and supervisors must not routinely collect customer cash.
- Any exceptional cash acceptance requires explicit Admin authorisation and appropriate receipt/reconciliation/audit controls.

## Website ↔ HestivaOS boundary

This repository/chat owns the Homent website and customer-facing implementation. HestivaOS owns internal operating-system implementation such as permissions, internal financial dashboards, reconciliation engines, internal state-machine design, admin delegation, accounting workflows and payment-provider architecture.

When a website/business decision creates an OS requirement, the requirement must be synchronized through the established Website ↔ HestivaOS integration documentation/coordination process, but OS implementation design must not be duplicated in website policy work.

Website implementation must provide the customer-facing disclosures, inputs, confirmations and correspondence required by these policies and transmit the required structured information to HestivaOS through the approved integration contract.

## Still unresolved / deliberately deferred

The following are not approved by this document and must not be invented:

- weekend/public-holiday collection-date shifting;
- the eventual automated payment/debit/card provider;
- provider-specific automatic retry rules beyond the principles above;
- the technical architecture/provider for automated transactional email;
- additional communication channels beyond approved email correspondence requirements;
- any automatic late-payment fee or interest;
- any policy not expressly approved above.
