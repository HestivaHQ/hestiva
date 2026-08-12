# Homent public cutover

## 2026-08-12

This document records the active customer-facing Hestiva → Homent cutover implemented on PR #122 after the Homent visual assets were merged separately in PR #123.

### Public identity

- Customer-facing brand name: Homent.
- Canonical production origin: `https://www.homent.co.za`.
- General enquiry address: `info@homent.co.za`.
- Quote-system and quote enquiry address: `quotes@homent.co.za`.
- Transactional quote mail sender/reply address: `Homent Quotes <quotes@homent.co.za>` / `quotes@homent.co.za`.
- Homent's Resend sending domain was verified before the application sender was switched.

### Application changes

- Public page copy, navigation, forms, service/location content, legal pages and transactional email branding use Homent.
- Quote references use the `HOM-` prefix.
- Canonical URLs, sitemap/robots policy, structured metadata expectations, `llms.txt`, reverse-geocoding identification and Lighthouse production targets use `homent.co.za`.
- Contact submissions route to `info@homent.co.za`; quote submissions route to `quotes@homent.co.za`.
- Public POPIA/privacy requests use the verified `info@homent.co.za` contact rather than exposing an unverified new dedicated mailbox.

### Preserved internals and history

The rebrand does not require blanket renaming of internal identifiers, repository names, workflow names, historical documentation or architecture references that contain `Hestiva`. Those references remain where they are implementation-internal or historically accurate unless a separate migration explicitly changes them.

The existing monogram and internal architecture remain unchanged. No pricing, quote-calculation, storage, authentication, or Website ↔ HestivaOS boundary is changed by this public identity cutover.
