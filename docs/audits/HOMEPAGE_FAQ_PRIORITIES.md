# Homepage FAQ priorities

Status: IMPLEMENTED

The homepage FAQ preview keeps the existing accordion and shared canonical FAQ answers, but now prioritises the six questions most likely to remove friction before a quote request:

1. Which areas does Homent serve?
2. How do I request a cleaning quote?
3. If I request a date, is my booking confirmed?
4. Do I have to pay a deposit?
5. Can I arrange recurring cleaning?
6. How much notice should I give to cancel or reschedule?

## Scope

- Reuses the existing canonical answers from `src/content/faqs.ts`.
- Changes homepage selection only; the full FAQ library is unchanged.
- Preserves the existing `View all FAQs` route and accordion UI.
- Does not change business rules, pricing, booking logic, payment processing, or HestivaOS integration.
