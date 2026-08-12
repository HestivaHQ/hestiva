# Homent quote routing and validation UX correction

Date: 2026-08-12

## Production findings

Production review identified three customer-facing quote-flow issues:

1. The Contact page hero CTA was labelled `Request a Quote` but linked to `#enquiry-form`, so it scrolled to the general Contact form instead of opening the dedicated `/quote` journey.
2. The quote page React validation marked only a subset of the fields that the browser enhancement layer treats as required. This created inconsistent required-field presentation and made some omissions less obvious to customers.
3. The quote enhancement silently cleared preferred or alternative dates earlier than tomorrow. The value disappeared instead of explaining why it was invalid. The final consent guard also returned silently when consent was not checked.

A source sweep confirmed the primary global quote-intent surfaces already use `/quote`, including the Navbar, homepage ContactSection CTA and ServicePageLayout quote/availability CTAs. The Contact-page hero was the confirmed inconsistent website CTA.

## Corrections

- The Contact-page hero `Request a Quote` CTA now uses the TanStack Router link to `/quote`.
- The quote page's visible required-field configuration now includes the core home-layout, visit-planning and access/household fields that are required by the progressive quote flow.
- The visible required markers and error summary are aligned with those core requirements, including conditional pet details.
- Preferred and alternative date inputs now expose a minimum date of tomorrow.
- If a past date is entered, the value is retained and the customer receives the explicit inline message `Please choose a date from tomorrow onwards.` rather than having the value silently erased.
- The final consent guard now displays `Please confirm that Homent may contact you.` and focuses the consent control rather than returning with no feedback.

## Preserved boundaries

These corrections do not change pricing, quote reference generation, email routing, Resend configuration, server-side schema validation, rate limiting, the Contact honeypot, file handling, or the future Website ↔ HestivaOS integration contract.

## Verification requirement

The normal PR quality gate must pass before merge. After deployment, production QA should confirm:

- Contact → Request a Quote opens `/quote`;
- leaving a required quote answer blank blocks Continue with a specific visible message;
- a past preferred/alternative date remains visible and shows the explicit date error;
- an unchecked final consent checkbox produces a visible consent error; and
- a valid completed quote can still submit through the normal Homent quote path.
