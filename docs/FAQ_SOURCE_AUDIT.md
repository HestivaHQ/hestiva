# Homent FAQ Source Audit

Date: 13 August 2026
Last reconciled: 15 August 2026
Status: Current implementation reference

## Purpose

This document records the verified sources and public-content boundaries used to build Homent's customer FAQ. The FAQ is intentionally customer-facing. It must not expose backend architecture, security mechanisms, internal routing, internal escalation logic, staff-only procedures, credentials, implementation details or other sensitive operational information.

## Verified source set

The FAQ content is derived from current repository evidence, primarily:

- `src/routes/terms.tsx` for quotation, booking, access, cancellation, payment, additional-work, service-concern and damage-reporting rules.
- `src/routes/privacy.tsx` for customer-facing POPIA and personal-information statements.
- `src/content/services.ts` and `src/routes/services.tsx` for the current residential service scope, inclusions, add-ons and service limitations.
- `src/routes/quote.tsx` and `src/lib/quote-options.ts` for information collected during a quote request, recurring-service options, access/household questions, photos/notes and contact preferences.
- `src/content/service-areas.ts` and `src/lib/site.ts` for the approved service-area footprint and current Homent contact details.
- `src/routes/about.tsx`, `src/components/FounderSection.tsx` and current homepage content for public brand positioning and customer expectations.
- `docs/PAYMENT_AND_BILLING_POLICIES.md` for the approved 50% initial/once-off deposit, recurring-service billing, cancellation/refund/payment-dispute rules and manual-EFT launch boundary.

## Public FAQ boundaries

The FAQ may explain information a customer reasonably needs before, during or after a cleaning service, including:

- residential services and the differences between service types;
- approved service areas;
- how quotations are prepared and when a booking becomes confirmed;
- scope changes and add-ons;
- access, pets, fragile items, restricted areas and relevant household restrictions;
- cancellations and rescheduling;
- payment information at the level stated in the Terms and canonical payment policy;
- service expectations and specialist/unsafe work boundaries;
- reporting cleaning-quality concerns or suspected loss/damage;
- customer-facing privacy information and contact routes.

The FAQ must not publish:

- anti-spam, rate-limit, server, email-routing or other security implementation details;
- staff-only access or escalation procedures;
- credentials, secrets, infrastructure identifiers or operational dashboards;
- internal decision thresholds, fraud controls or technical logs;
- unverified claims about vetting, insurance, guarantees, product safety, certifications, staffing or availability;
- pricing that has not been separately approved for public display.

## Questions deliberately left unresolved

The current repository does not provide a sufficiently clear approved public answer for the following common customer questions, so the FAQ does not invent answers for them:

- Who supplies the cleaning products and equipment for a normal visit?
- How far in advance should a customer book?
- Are same-day or next-day bookings available?
- Is there a standard arrival window or guaranteed arrival time?
- How long will a particular clean take?
- Will the same cleaning professional attend every recurring visit?
- Which faster payment methods, if any, will supplement manual EFT for near-term bookings at launch?

Manual/ordinary EFT is approved as a first-class launch payment workflow. Future gateway/provider-specific methods remain unresolved until explicitly approved and implemented.

These questions should only be added after an explicit business policy is approved and reflected in the authoritative product/operational documentation.

## Information architecture

- `/faq` is the canonical, comprehensive customer FAQ page.
- The homepage displays a short preview of high-value questions and links to `/faq`.
- FAQ content is maintained in `src/content/faqs.ts` so the dedicated page and homepage preview use the same answers.
- The dedicated FAQ page follows the repository's existing structured-data policy for static pages; FAQPage schema remains limited to the route types already approved by the SEO verifier.
- `/faq` is an indexable route and is included in the generated XML sitemap through `src/lib/route-policy.ts`.
- The footer links to `/faq`; the primary navigation remains focused on core service and conversion routes.

## Implementation status

- The comprehensive FAQ implementation merged in PR #131.
- The approved payment and recurring-service policy was synchronized into the shared FAQ source in PR #132.
- The homepage FAQ preview was reprioritized in PR #136 to emphasize service areas, quote requests, booking confirmation, deposits, recurring cleaning and cancellation notice.
- The original `feature/comprehensive-faq` branch is historical/merged and must not be treated as the active development branch.
