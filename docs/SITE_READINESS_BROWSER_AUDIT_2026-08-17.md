# Whole-Site Browser Readiness Audit — 17 August 2026

## Status

In progress on `test/site-readiness-audit`.

## Purpose

Extend the existing quote-specific browser readiness suite into a customer-facing whole-site launch/readiness sweep without duplicating the mature `/quote` scenario matrix.

## Source of truth

The audit discovers customer-facing HTML pages from the live development server's `/sitemap.xml`, which is generated from the repository's canonical `indexablePaths` route policy. This keeps the audit aligned with current static, service and location pages without maintaining a second hard-coded route catalogue.

## Browser coverage

The Playwright configuration executes this specification through the existing desktop Chromium and mobile Chromium projects.

The first audit slice verifies:

- every sitemap-listed page returns a non-error HTTP response;
- every sitemap-listed page exposes exactly one visible `h1`;
- no sitemap-listed page produces browser console errors or uncaught page errors during load;
- no sitemap-listed page creates horizontal document overflow at the tested viewport;
- internal links exposed across sitemap-listed pages resolve without HTTP 4xx/5xx responses;
- the homepage exposes working customer destinations for Quote, Services, Contact, FAQ, Privacy and Terms.

## Safety and scope

This suite does not submit real quote or contact forms and does not call production HestivaOS, email, payment or other external operational systems. The existing safe quote readiness suite remains authoritative for `/quote` behavioural depth.

The initial whole-site audit is intended to surface genuine customer-facing routing, rendering, responsive-layout and navigation defects. CI findings must be investigated before production code is changed; tests must not be weakened merely to accommodate real broken behaviour.
