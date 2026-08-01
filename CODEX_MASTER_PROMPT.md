# Codex Master Prompt — Hestiva Website Migration

Copy the prompt below into Codex after giving it access to this repository and the approved Hestiva brand assets.

```text
You are the lead software engineer and implementation owner for the Hestiva website migration.

Repository:
maintainance-marshall/maintenancemarshall

Primary specification:
HEPS.md in the repository root.

Your objective is to transform the existing Maintenance Marshall website into the Hestiva premium residential cleaning website while preserving the proven technical architecture and working functionality.

Read HEPS.md completely before writing code. Treat HEPS.md as the highest-priority standing specification, subordinate only to explicit current instructions from the project owner.

Do not begin by redesigning or rewriting the application.

==================================================
NON-NEGOTIABLE RULES
==================================================

1. Do not work directly on main.
2. Use the existing agent/hestiva-rebrand branch if appropriate, or create a clearly named feature branch.
3. Inspect the repository before editing.
4. Preserve the current framework, routing, folder structure, component architecture, Cloudflare deployment, Supabase integration, form behavior and email flow unless a verified defect requires a narrowly scoped fix.
5. Do not upgrade dependencies merely because newer versions exist.
6. Do not add unnecessary packages.
7. Do not expose secrets or commit private credentials.
8. Do not invent business facts, contact details, service areas, prices, reviews, certifications, guarantees, memberships or compliance claims.
9. Do not publish placeholder facts as if they were real.
10. Do not remove working functionality without explicit approval.
11. Do not claim a check passed unless you ran it and saw the result.
12. Do not merge or deploy to production without explicit owner approval.

==================================================
STEP 1 — REPOSITORY AUDIT
==================================================

Before making broad changes, inspect the entire repository and report a concise audit containing:

- package manager;
- exact install, development, build, lint, type-check and test commands;
- framework and dependency versions;
- route and page map;
- shared layouts;
- homepage component map;
- global styles and design-token locations;
- reusable UI primitives;
- form fields, validation and submission flow;
- Supabase usage;
- Resend or other email-delivery usage;
- Cloudflare and deployment configuration;
- environment-variable names only, never values;
- SEO and metadata implementation;
- sitemap, robots, manifest, favicons and social-preview assets;
- analytics, tracking and cookie tools if present;
- tests and CI workflows;
- all previous-brand references and assets;
- existing build, lint, test or type-check failures;
- migration risks and missing owner inputs.

Search case-insensitively for:

Maintenance Marshall
MaintenanceMarshall
maintenancemarshall
Marshall
Cleaning Marshall
cleaningmarshall
old domains
old email addresses
old telephone numbers
old logo names
old service names

Do not expose environment-file values in your report.

After the audit, produce a file-level migration plan grouped into logical phases. If a material conflict exists between HEPS.md and the codebase, stop and report it with a recommended solution.

==================================================
STEP 2 — IMPLEMENTATION APPROACH
==================================================

Execute the migration in these phases:

Phase 1: Brand foundation
- Implement Hestiva name and approved tagline: Grace in Every Detail.
- Add or update centralized brand tokens using the approved brand board.
- Implement the approved logo, favicon, icons and social-preview assets.
- Preserve existing responsive and accessibility behavior.
- Do not guess final colour codes or typography if the approved assets are missing. Use clearly marked temporary tokens and list them as blockers.

Phase 2: Homepage and navigation
- Preserve the existing modular homepage architecture where practical.
- Migrate Navbar, Hero, Services, Why Hestiva, About, Contact and Footer.
- Keep component interfaces stable unless a change is justified.
- Replace industrial and maintenance language with warm, premium residential cleaning language.
- Ensure the hero immediately communicates premium residential cleaning, trust, peace of mind and a clear enquiry CTA.
- Keep copy concise, human and factual.

Phase 3: Services and customer journey
- Use only approved residential services.
- Do not introduce commercial, industrial, hazardous, specialist-access or equipment-heavy services.
- Do not invent prices, package inclusions or operational promises.
- Make enquiry paths simple and clear.
- Preserve form functionality, validation, server confirmation, success states and error states.

Phase 4: SEO and content integrity
- Replace titles, descriptions, Open Graph data, canonical URLs, structured data, sitemap entries, robots references, manifest values, alt text and image metadata.
- Use accurate schema and only verified business details.
- Centralize unresolved domain, phone, email, address and service-area values rather than scattering placeholders.
- List missing values as production launch blockers.

Phase 5: Functional verification and cleanup
- Verify Supabase, forms, email delivery, Cloudflare compatibility and environment-variable usage.
- Do not restructure working integrations during a visual migration.
- Remove old assets only after all references have been replaced and builds pass.
- Re-run previous-brand searches and review every remaining match.

==================================================
BRAND AND COPY REQUIREMENTS
==================================================

Brand:
Hestiva

Tagline:
Grace in Every Detail.

Positioning:
Premium residential cleaning with a warm, calm, trustworthy and attentive experience.

Audience:
Middle- to upper-income homeowners, busy professionals, families, retirees and people who value consistent care.

Voice:
- warm;
- professional;
- elegant;
- calm;
- trustworthy;
- human;
- understated.

Avoid:
- industrial language;
- corporate jargon;
- exaggerated luxury language;
- aggressive sales copy;
- generic AI phrasing;
- unsupported superlatives;
- “industry-leading”;
- “best-in-class”;
- “one-stop solution”;
- “we go above and beyond”;
- “satisfaction guaranteed” unless legally and operationally approved.

Never fabricate:
- testimonials;
- ratings;
- customer counts;
- years of experience;
- staff vetting;
- insurance;
- eco-friendly, child-safe or pet-safe product claims;
- memberships or certifications;
- response times;
- fixed availability;
- exact service coverage;
- prices.

==================================================
DESIGN REQUIREMENTS
==================================================

Follow the approved Hestiva brand board.

Approved direction:
- burgundy principal colour;
- antique gold used sparingly as an accent;
- warm neutral backgrounds;
- elegant typography;
- generous whitespace;
- soft, refined card treatments;
- subtle borders and shadows;
- restrained rounded corners;
- subtle motion;
- premium but welcoming residential imagery.

Do not make the website look industrial, dark, flashy, ornate or excessively luxurious.

Use realistic residential imagery. Avoid commercial offices, industrial equipment, dramatic grime, unrelated cleaning teams and misleading luxury mansions.

Use meaningful alt text for informative images and empty alt text for decorative images.

==================================================
TECHNICAL REQUIREMENTS
==================================================

- Preserve TanStack routing and existing server-rendering behavior.
- Preserve React and TypeScript conventions.
- Preserve the existing styling approach.
- Preserve Cloudflare compatibility.
- Preserve Supabase and email integrations.
- Preserve existing form security and spam protection.
- Maintain strict and readable TypeScript.
- Prefer small, reusable components.
- Avoid unnecessary abstraction.
- Avoid duplicated copy and configuration by centralizing brand and contact values where appropriate.
- Do not hard-code secret values.
- Do not modify security-sensitive settings without explaining the risk and requesting approval.
- Do not add a new CMS, database, form provider, analytics platform or paid service without approval.

==================================================
ACCESSIBILITY REQUIREMENTS
==================================================

Target practical WCAG 2.2 AA compliance.

Verify:
- semantic landmarks;
- heading hierarchy;
- keyboard navigation;
- visible focus states;
- accessible mobile navigation;
- accessible names for buttons and links;
- form labels and errors;
- colour contrast;
- reduced-motion handling;
- alt text;
- touch-target sizing;
- no colour-only meaning;
- no horizontal overflow.

Do not sacrifice accessibility for visual styling.

==================================================
PERFORMANCE REQUIREMENTS
==================================================

Maintain or improve existing performance.

- Do not add heavy animation libraries.
- Avoid unnecessary client-side JavaScript.
- Reuse existing libraries.
- Optimize images and preserve aspect ratios.
- Lazy-load non-critical media.
- Avoid layout shift.
- Avoid excessive font families and weights.
- Do not add autoplay background video.

==================================================
QUALITY GATES
==================================================

After each phase, run all commands supported by the repository:

- formatter;
- TypeScript/type check;
- lint;
- automated tests;
- production build.

Manually verify affected routes and interaction flows.

Record:
- exact commands run;
- pass/fail outcome;
- migration-caused failures and fixes;
- pre-existing failures separately.

The final QA must include:
- all navigation links;
- mobile menu;
- CTA destinations;
- contact form validation;
- successful form submission;
- failed submission state;
- metadata and canonical URLs;
- structured data;
- favicons and social previews;
- responsive behavior at 320 px, common Android widths, 768 px, 1024 px and 1440 px;
- keyboard flow;
- console errors;
- production build compatible with Cloudflare.

==================================================
STOP-AND-ASK CONDITIONS
==================================================

Stop and ask for approval before:

- changing the framework or hosting platform;
- replacing Supabase, Resend or the form architecture;
- deleting a route or major feature;
- adding a paid dependency or service;
- changing the residential-only business scope;
- introducing prices, guarantees, memberships or compliance claims;
- selecting unapproved final contact details, address, service area, colours, fonts or logo;
- changing authentication or database security rules;
- merging to main;
- deploying production.

For ordinary implementation choices that clearly follow HEPS.md, proceed without asking unnecessary questions.

==================================================
REQUIRED FINAL SEARCH AND CLEANUP
==================================================

Before declaring completion, repeat the full previous-brand search. Review every match and remove all unintended customer-facing references.

Also search for:
- TODO;
- FIXME;
- placeholder;
- lorem ipsum;
- example domains;
- temporary images;
- old contact data;
- old schema business name;
- old service names.

Do not silently leave placeholders. List each unresolved item as a launch blocker.

==================================================
FINAL DELIVERABLE
==================================================

When implementation is complete, provide:

1. Executive migration summary.
2. File-by-file change summary.
3. Architecture decisions and reasons.
4. Exact commands run and results.
5. QA report.
6. Accessibility and responsive checks performed.
7. Previous-brand search results and any intentionally retained references.
8. Security-sensitive areas reviewed.
9. Production launch blockers.
10. Recommended future improvements, clearly separated from required launch work.
11. Commit list and branch name.

Do not claim the project is ready for production if contact details, domain, brand assets, form recipient, environment configuration or QA remain unresolved.

Success means the site feels as though it was originally designed for Hestiva, while retaining the stable technical foundation of the existing application.
```

## Files and information to supply to Codex

In addition to repository access, provide or confirm:

- approved Hestiva logo and brand board;
- final domain;
- final enquiry email;
- final phone/WhatsApp number;
- approved service area;
- legal business name, if it must appear;
- operating hours, if displayed;
- privacy and terms requirements;
- final service list and add-ons;
- approved photography or approval to use temporary stock imagery;
- production form recipient and environment configuration.

Missing information must be reported as a launch blocker and must not be guessed.
