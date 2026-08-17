# SEO Technical Launch Audit

## Scope

This audit verifies the customer-facing website's technical search-engine readiness against the rendered application rather than source assumptions alone.

The browser suite reads the live local `/sitemap.xml` and checks every indexable path for:

- a non-empty, reasonably bounded page title;
- a non-empty, reasonably bounded meta description;
- a production-origin canonical URL matching the sitemap path;
- `index, follow` robots and Googlebot directives;
- matching Open Graph URL, title and description metadata;
- `summary_large_image` Twitter card metadata;
- `en-ZA` document language;
- unique page titles across the sitemap;
- present and parseable JSON-LD structured data.

Technical endpoint coverage also verifies:

- `/sitemap.xml` responds successfully as XML;
- sitemap URLs are unique, production-origin, query/hash free and canonically slash-normalized;
- `/robots.txt` allows crawling and references the production sitemap;
- canonical and Open Graph URLs remain stable when a customer arrives with query parameters, fragments or a trailing slash;
- unknown pages return HTTP 404 and expose `noindex, follow` to both general robots and Googlebot.

## Safety boundary

The audit uses the local CI application server. It does not submit real quote/contact forms, send production email, or call HestivaOS production ingestion.

## Interpretation

A failure is evidence to inspect. Production metadata or routing should be changed only when the rendered browser output demonstrates a genuine launch-readiness defect; stale or overly strict test assumptions should be corrected in the test instead.
