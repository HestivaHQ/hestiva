# ADR-0007: Canonical customer FAQ page and shared FAQ source

Date: 13 August 2026
Status: Accepted

## Context

Homent needs a comprehensive customer-facing FAQ that answers real pre-booking and post-service questions without duplicating or exposing sensitive internal information. The repository already contains verified customer-facing rules across the Terms, Privacy Policy, service definitions, quote flow, service-area configuration and About content.

A large FAQ embedded only on the homepage would make the homepage unnecessarily long and would create pressure to duplicate answers elsewhere. Independent FAQ copies would risk divergence between visible copies.

## Decision

1. `/faq` is the canonical comprehensive customer FAQ page.
2. FAQ content is stored centrally in `src/content/faqs.ts`.
3. The homepage displays only a short preview selected from that same dataset and links to `/faq`.
4. The dedicated FAQ page follows the repository's existing structured-data policy for static pages rather than broadening `FAQPage` schema expectations.
5. `/faq` is classified as indexable and therefore enters the XML sitemap through the existing route-policy system.
6. The footer links to `/faq`; the main navigation is not expanded solely for this feature.
7. Customer-facing FAQ content must not disclose backend, security, staff-only or other sensitive internal implementation details.
8. Questions without an approved, repository-supported public answer are omitted until the relevant business policy is explicitly decided and documented.

## Consequences

- Customers get a single comprehensive help resource without overloading the homepage.
- Homepage FAQ answers cannot silently diverge from the dedicated page because both consume the same data.
- Search engines can crawl the FAQ as a normal indexable page with canonical metadata and breadcrumb/page structured data under the existing SEO policy.
- Future policy changes require updating one FAQ source rather than multiple copies.
- Common but unresolved customer questions remain intentionally unpublished until Homent approves the underlying policy.
