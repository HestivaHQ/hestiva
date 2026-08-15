# Homent Website Chat Handover — 15 August 2026

Status: Current handover reference
Repository: `HestivaHQ/hestiva`
Canonical branch: `main`

## 1. Purpose

This handover captures the website work completed in the current working thread, the documentation reconciliation performed at handover, and the exact remaining threads a new chat should know about. It is intended to let a new development chat continue without reconstructing decisions from conversation history.

## 2. Current repository state

- The customer FAQ work is complete and merged.
- PR #131, **Add comprehensive customer FAQ**, merged `feature/comprehensive-faq` into `main` on 13 August 2026.
- The exact final FAQ feature head was `46e3a26e280c9b40ee2ba23a6e68a50f71891a56`; its Hestiva PR Check completed successfully.
- The old `feature/comprehensive-faq` branch is historical. Do not continue new work from it.
- PR #132 subsequently synchronized the approved payment/recurring-service policy into the public Terms, shared FAQ source and quote acknowledgement email.
- PR #136 subsequently changed only the homepage FAQ selection so the six preview questions emphasize service areas, quote requests, booking confirmation, deposits, recurring cleaning and cancellation notice.
- PR #139 finalized the website side of Issue #79 and merged the structured Website Quote Contract v2/Laundry & Ironing work.
- PRs #142 and #143 completed the remaining customer-facing Laundry/Ironing terminology and specialist garment-care wording cleanup.
- PR #144, **Fix quote submission ownership**, merged on 15 August 2026. It makes `StructuredQuoteSubmission` load synchronously on `/quote` so the structured HestivaOS submission handler owns final quote submission deterministically while the lazy legacy controller remains for progressive form UX/contact behavior.
- At handover there are no open pull requests owned by the repository user.

## 3. Comprehensive FAQ implementation

### Architecture

- `/faq` is the canonical comprehensive customer FAQ page.
- `src/content/faqs.ts` is the shared customer-facing FAQ source of truth.
- The homepage consumes a short preview from that same FAQ dataset and links to `/faq`.
- The footer links to `/faq`.
- `/faq` is indexable and included through the existing route-policy/sitemap system.
- The main navigation was intentionally not expanded solely for FAQ.
- The dedicated static FAQ page follows the existing static-page structured-data policy. `FAQPage` schema was deliberately not broadened to `/faq`; the SEO verifier remains strict rather than being weakened for the new page.

### Source discipline

The FAQ was built from verified public repository facts, especially Terms, Privacy, service definitions, quote options/flow, service areas, site contact data, About/homepage positioning and later the canonical payment/billing policy.

The FAQ must not expose backend/security implementation, staff-only procedures, credentials, infrastructure identifiers, anti-abuse thresholds, fraud controls, internal logs or unsupported claims.

### Still-unresolved FAQ policy questions

Do not invent answers for these until explicit business policy exists:

- Who supplies normal cleaning products/equipment?
- How far in advance should customers book?
- Are same-day/next-day bookings available?
- Is there a standard/guaranteed arrival window?
- How long will a particular clean take?
- Will the same cleaning professional attend every recurring visit?
- Which faster payment methods, if any, will supplement manual EFT for near-term bookings?

Manual/ordinary EFT itself is approved as a first-class launch workflow under `docs/PAYMENT_AND_BILLING_POLICIES.md`; the old FAQ-audit wording that treated every payment method as unresolved has been corrected in this handover documentation branch.

## 4. Approved payment/customer policy now relevant to FAQ

The canonical payment/billing source is `docs/PAYMENT_AND_BILLING_POLICIES.md`.

Key public rules already synchronized into customer-facing surfaces include:

- 50% deposit to secure an initial/once-off booking.
- Remaining 50% due on completion.
- Quote request/requested date is not itself a confirmed booking.
- Standard recurring service has no fixed-term lock-in and uses the approved recurring advance/payment mechanics.
- Individual visit cancellation/rescheduling follows the 24-hour rule.
- Optional month-end billing has separate eligibility/approval rules.
- Manual/ordinary EFT is a first-class launch payment workflow; POP is not equivalent to cleared funds.
- No payment gateway should be assumed merely because future automated payment methods are contemplated.

For detailed financial behavior, use the canonical payment document rather than reconstructing policy from FAQ prose.

## 5. Quote submission architecture at handover

The current website quote path must preserve one authoritative final residential quote submission owner.

PR #144 fixed a race between two capture-phase handlers by loading `StructuredQuoteSubmission` synchronously on `/quote`. The legacy live-form controller remains lazy for progressive form enhancements and contact behavior. Do not reintroduce competing final quote submission ownership through load order.

The website-side Issue #79 architecture merged in PR #139 requires the structured residential quote path to fail closed unless HestivaOS acknowledges the submission and returns the authoritative `quoteReference` before the website sends confirmation correspondence/reports success.

The Website Quote Contract v2 carries structured facilities and Laundry/Ironing outcome/quantity data. Laundry and Ironing are add-ons, not primary booking services. `/services/laundry-folding` remains only as an informational compatibility route presented as **Laundry & Ironing Add-On**.

## 6. Remaining cross-system Issue #79 work

The website side is complete. Remaining Issue #79 acceptance belongs to HestivaOS and must not be silently reimplemented in the website:

- Persist Laundry/Ironing quantities into accepted WorkOrder/RecurringServiceAgreement add-on structures.
- Enforce operational load-cap feasibility.
- Reconcile remaining HestivaOS operational wording such as legacy `Extra Laundry Folding` where applicable.
- Reconcile HestivaOS routing runtime/documentation: current runtime uses OpenRouteService while older documentation still references Google Routes.
- Replace the provisional `HESTIVA_COIDA_RATE=0.01` when the authoritative Compensation Fund assessed rate is known.

Keep Issue #79 open until those HestivaOS-side acceptance items are verified.

## 7. Documentation reconciliation performed for this handover

This handover pass identified one stale point in `docs/FAQ_SOURCE_AUDIT.md`: it still listed all exact payment methods as unresolved even though the later canonical payment policy approved manual EFT as a launch workflow. The audit is updated on this documentation branch to distinguish approved manual EFT from unresolved future faster/gateway methods.

The FAQ ADR already reflects the final structured-data decision: the dedicated FAQ page uses the existing static-page schema policy and does not broaden `FAQPage` expectations.

This handover file records the later merged FAQ/payment/quote-ownership work so the next chat does not resume from the pre-merge FAQ branch state.

## 8. Verification and branch discipline for the next chat

- Start new implementation work from current `main`, never from `feature/comprehensive-faq`.
- Use one focused feature/fix branch per task.
- Preserve repository documentation-as-Definition-of-Done requirements and add/update `docs/` alongside meaningful implementation/configuration changes.
- Run the full Hestiva PR Check on the exact final head before merge.
- Do not weaken SEO/security/contract verification merely to make a new feature pass; reconcile the feature with the established policy unless the policy itself is intentionally being changed and documented.
- Do not merge a branch with known conflicts or stale assumptions.

## 9. Recommended first action in the new chat

Read this handover plus the current versions of:

- `docs/FAQ_SOURCE_AUDIT.md`
- `docs/decisions/ADR-0007-canonical-customer-faq.md`
- `docs/PAYMENT_AND_BILLING_POLICIES.md`
- `docs/ISSUE_79_CLOSURE_NOTE.md`
- `docs/CHANGELOG.md`
- the current `/quote` route and structured quote submission code

Then fetch current `main` and confirm there are no newer PRs before making changes.

## 10. Handover bottom line

There is no unfinished FAQ implementation branch to continue. The FAQ feature is merged and has already received later payment-policy and homepage-priority updates. The most recent website repair, PR #144, is also merged. The next chat should therefore treat current `main` as the baseline and choose the next explicit website task, while keeping the listed unresolved business-policy questions and HestivaOS-side Issue #79 acceptance work separate from completed website work.
