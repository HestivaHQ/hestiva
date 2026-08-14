# Hestiva Engineering & Product Specification (HEPS)

Version: 2.0  
Status: Living specification  
Authority: Primary product, brand, engineering and AI implementation reference

## 1. Purpose

Hestiva is a new premium residential cleaning brand and business. This repository currently contains the proven technical foundation of the former Maintenance Marshall website. The migration objective is to preserve the working application architecture while replacing all customer-facing branding, content, services, assets and positioning with Hestiva.

This document merges the approved governance principles from the Hestiva Master Blueprint with the practical website, engineering and AI-agent requirements needed to complete the migration safely.

## 2. Source-of-truth hierarchy

When instructions conflict, use this order:

1. Explicit current instruction from the project owner.
2. This HEPS document.
3. Approved Hestiva brand assets and written brand board.
4. Existing working application behavior and architecture.
5. Existing repository conventions.
6. Historical Maintenance Marshall content, only as a reusable technical reference.

Do not silently resolve a material conflict. Stop and report the conflict with a recommended solution.

## 3. Project governance

- Record approved decisions only.
- Hestiva is the active brand and business.
- Maintenance Marshall and Cleaning Marshall are historical references only.
- Historical code may be reused where technically useful, but historical customer-facing identity must not remain.
- Merge duplicate rules and content rather than creating competing specifications.
- Mark superseded decisions in the change log rather than erasing project history.
- Build intentionally and prefer quality over speed.
- Implement one coherent feature or migration phase at a time.
- Do not claim completion without build and QA evidence.

## 4. Product vision

Create a premium residential cleaning website that feels elegant, calm, trustworthy and welcoming. The customer should feel comfortable inviting Hestiva into their home.

The site must communicate:

- residential cleaning specialization;
- respect for the home and its occupants;
- reliable and professional service;
- consistent attention to detail;
- a simple, low-friction enquiry experience;
- peace of mind rather than task-based cleaning language.

## 5. Current business scope

### Included

- Residential cleaning only.
- Homeowners and residential tenants.
- Regular home cleaning.
- Deep cleaning.
- Move-in cleaning.
- Move-out cleaning.
- Kitchen cleaning.
- Bathroom sanitisation.
- Bedroom and living-area cleaning.
- Interior window cleaning where practical.
- Laundry & Ironing as add-ons only to eligible cleaning visits; they are not standalone primary services.
### Excluded for the current launch

- Commercial or industrial cleaning.
- Medical, biohazard or hazardous-material cleaning.
- High-rise or specialist-access window cleaning.
- Pressure washing.
- Carpet extraction or equipment-heavy specialist services unless explicitly approved later.
- Pest control.
- Post-disaster remediation.
- Any service requiring certification, machinery or operational capacity the business does not yet have.

Do not invent service availability, pricing, guarantees, memberships, certifications or staff vetting claims.

## 6. Target customer

Primary audience:

- middle- to upper-income homeowners;
- busy professionals;
- families;
- older homeowners or retirees;
- people who value reliability, presentation, privacy and consistency.

The copy must not alienate customers by sounding elitist, extravagant or unaffordable. The brand should communicate premium care rather than luxury excess.

## 7. Brand identity

### Name

Hestiva

### Primary tagline

Grace in Every Detail.

Use this exact wording and punctuation unless an approved brand update supersedes it.

### Brand personality

- elegant;
- warm;
- calm;
- trustworthy;
- professional;
- refined;
- human;
- attentive;
- understated.

### Prohibited tone

Do not sound:

- industrial;
- aggressive;
- corporate and distant;
- overly luxurious;
- gimmicky;
- sales-heavy;
- generic or obviously AI-written.

### Copy principles

- Lead with the customer's desired outcome: a cared-for, calm, comfortable home.
- Use clear South African English.
- Prefer short, natural sentences.
- Be specific without making unsupported promises.
- Avoid exaggerated superlatives.
- Avoid jargon.
- Avoid clichés such as “industry-leading”, “best-in-class”, “one-stop solution”, “we go above and beyond” and “satisfaction guaranteed”.
- Never fabricate testimonials, review scores, years of experience, team size or credentials.

## 8. Visual direction

Use the approved Hestiva logo and brand board as the authoritative visual source when supplied.

Current approved direction:

- burgundy as the principal brand colour;
- antique gold as a restrained accent;
- light, warm neutral backgrounds;
- generous whitespace;
- elegant typography;
- subtle, premium borders and shadows;
- rounded corners only where they support the brand;
- subtle motion that never distracts;
- olive-branch visual language where present in approved assets.

Do not guess exact colour codes, typefaces or logo proportions when the brand asset contains them. Extract and implement the approved values. If the assets are unavailable, use temporary tokens clearly marked for replacement rather than presenting guessed values as final.

## 9. Photography and imagery

Images should show clean, calm, lived-in residential spaces and careful human service. Prefer natural light, realistic homes and understated styling.

Avoid:

- commercial offices;
- industrial equipment;
- exaggerated before/after grime;
- visibly unsafe chemical handling;
- generic teams posing in uniforms unless authentic Hestiva photography exists;
- over-staged luxury mansions that misrepresent the customer base;
- unrelated stock images.

All images require meaningful alt text when informative. Decorative images should use empty alt text. Do not keyword-stuff alt attributes.

Temporary stock or placeholder images must be isolated through reusable asset references and documented for later replacement.

## 10. Technical foundation

The existing application has been confirmed to use TanStack file routing and modular React components. Preserve the existing technical foundation unless repository inspection proves otherwise or an approved change is necessary.

Expected stack to verify before editing:

- TanStack Start / TanStack Router;
- React;
- TypeScript;
- Tailwind CSS or the repository's existing styling system;
- Vite-based tooling;
- Cloudflare deployment configuration;
- Supabase integration;
- Resend or existing email-delivery flow;
- GitHub source control.

The codebase, package manifest and deployment configuration are the final authority on exact versions and commands. Do not upgrade dependencies as part of the rebrand unless required to fix a verified issue.

## 11. Architecture rules

Preserve unless a documented defect requires a change:

- route structure;
- folder structure;
- component hierarchy;
- reusable UI primitives;
- responsive behavior;
- form behavior;
- validation;
- backend integrations;
- environment-variable names;
- Cloudflare build and deployment flow;
- analytics and consent behavior, if present;
- accessibility behavior already working.

Do not replace working components merely to make the code look different. Refactor only where it reduces duplication, fixes a defect, improves accessibility or makes the Hestiva migration substantially safer.

No unnecessary dependencies. Prefer the existing component and icon libraries.

## 12. Repository safety

- Never commit directly to `main` for the migration.
- Use the existing `agent/hestiva-rebrand` branch if that is the active Codex branch, otherwise create a clearly named migration branch.
- Do not commit secrets.
- Do not expose service-role keys, private API keys or deployment tokens.
- Treat client-side publishable Supabase values according to Supabase's intended security model, but verify Row Level Security and never assume a public key makes data secure.
- Do not modify environment values unless necessary and authorized.
- Do not delete historical assets until all references are replaced and the application builds.
- Keep commits coherent and reviewable.

## 13. Required pre-edit repository audit

Before changing code, create a concise repository map containing:

- package manager and exact build, dev, lint and test commands;
- routes and pages;
- shared layout and navigation;
- homepage section components;
- forms, validation and submission handlers;
- Supabase usage;
- email-delivery usage;
- Cloudflare configuration;
- environment variables by name only, never secret values;
- design tokens and global styles;
- images, logos, favicons and social-preview assets;
- sitemap, robots, manifest and SEO configuration;
- analytics, tracking and cookie tools;
- every Maintenance Marshall, Cleaning Marshall, old-domain and old-contact reference;
- tests and CI workflows;
- dead or duplicate files that may affect the migration.

Do not begin broad changes until this audit is complete. Small inspection-only commands are allowed.

## 14. Homepage structure

Preserve the existing modular page flow unless inspection identifies a stronger existing route structure. The known homepage sequence is:

1. Navbar
2. Hero
3. Services
4. Why Hestiva
5. About
6. Contact
7. Footer

### Navbar

- Hestiva logo and accessible brand label.
- Clear navigation to relevant sections or routes.
- One primary enquiry CTA.
- Mobile menu must remain keyboard accessible and operable.

### Hero

The hero must immediately communicate premium residential cleaning and trust.

Required message themes:

- a beautifully cared-for home;
- peace of mind;
- reliable residential service;
- “Grace in Every Detail.”;
- a clear enquiry or quote CTA.

Do not overload the hero with service lists or unsupported claims.

### Services

Show a curated launch service set rather than an overwhelming catalogue. Each service must have a clear plain-language description and must be operationally plausible.

### Why Hestiva

Focus on customer benefits:

- respect for the home;
- reliable professionals;
- attention to detail;
- consistent quality;
- flexible scheduling, only if operationally supported;
- peace of mind.

### About

Explain the Hestiva standard through care, consistency, professionalism and trust. Do not invent a founding story or company history.

### Contact

Retain the existing functional form and replace branding and service choices. Collect only information needed to respond. Clearly state what happens after submission. Use verified phone, email, domain, service area and operating information; leave explicit TODO markers where the owner has not supplied final values.

### Footer

Include accurate brand, contact, navigation, service-area and legal information. Remove every historical business reference.

## 15. Forms and enquiry flow

Existing working contact functionality must be preserved.

Requirements:

- clear labels, not placeholder-only fields;
- keyboard and screen-reader accessibility;
- client- and server-side validation where already supported;
- useful error messages;
- loading and success states;
- spam protection if already present;
- no exposure of private keys;
- no silent failures;
- no misleading success message before the server confirms submission;
- verified recipient email before production launch;
- preserve or improve the existing Resend/Supabase/Cloudflare workflow based on the actual repository.

Do not restructure backend email delivery during the visual migration unless it is broken. If broken, document the defect and isolate the fix.

## 16. SEO requirements

Replace all previous-brand SEO data, including:

- titles;
- meta descriptions;
- canonical URLs;
- Open Graph data;
- social-preview image references;
- schema.org structured data;
- image alt text;
- sitemap entries;
- robots rules where domain-specific;
- manifest and application name;
- favicon and icon references;
- route-level metadata;
- old business name, old domain, old contact data and old service descriptions.

Use accurate schema. Prefer a suitable local service business type supported by schema.org and the site's real information. Do not add review, rating, price-range, opening-hour or address data unless verified.

Final domain, phone, email, physical address and service area are required inputs. Until supplied, use centralized clearly named placeholders or TODOs and list them as launch blockers; do not invent them.

## 17. Accessibility

Target practical WCAG 2.2 AA compliance.

At minimum verify:

- semantic landmarks;
- logical heading hierarchy;
- keyboard navigation;
- visible focus states;
- mobile-menu accessibility;
- button and link names;
- form labels and errors;
- sufficient colour contrast;
- reduced-motion preference;
- descriptive alt text;
- touch-target size;
- no content dependent solely on colour;
- no horizontal overflow at common mobile widths.

Do not sacrifice accessibility for visual styling.

## 18. Performance

Maintain or improve current performance.

- Avoid unnecessary client-side JavaScript.
- Reuse existing libraries.
- Optimize image dimensions and delivery.
- Prevent layout shift by setting image dimensions or aspect ratios.
- Lazy-load non-critical imagery.
- Preserve server rendering where used.
- Avoid loading multiple font families or excessive weights.
- Do not add video backgrounds without explicit approval.
- Do not add heavy animation libraries for minor effects.

## 19. Responsive design

Verify at minimum:

- 320 px narrow mobile;
- common Android mobile widths;
- 768 px tablet;
- 1024 px small desktop;
- 1440 px desktop.

No clipped content, inaccessible menus, overlapping CTAs, tiny text or unintended horizontal scrolling.

## 20. Content integrity

The site must not claim any of the following unless the owner provides evidence and approval:

- insured or bonded status;
- background-checked staff;
- eco-friendly products;
- child-safe or pet-safe products;
- NCCA or other memberships;
- certified chemical handling;
- fixed response times;
- guaranteed availability;
- satisfaction guarantees;
- years in business;
- review totals;
- Gauteng-wide coverage or specific suburbs not approved;
- exact pricing.

Use factual, modest wording. Place unresolved facts in the final launch-blocker list.

## 21. Testing and quality gates

After each migration phase:

1. Run the formatter if configured.
2. Run TypeScript checks.
3. Run lint.
4. Run automated tests.
5. Run the production build.
6. Fix all migration-caused failures.
7. Manually verify affected routes and forms.
8. Record pre-existing failures separately; do not conceal them.

Final QA must cover:

- all navigation links;
- mobile menu;
- CTA destinations;
- contact submission success and failure paths;
- form validation;
- metadata and canonical URL output;
- structured-data validity;
- favicon and social preview;
- responsive layouts;
- keyboard flow;
- no console errors caused by the migration;
- Cloudflare-compatible production build.

## 22. Migration phases

### Phase 0 — Audit and plan

Inspect the repository, identify risks, list verified commands, and produce a file-level migration plan.

### Phase 1 — Brand foundation

Implement centralized brand tokens, approved fonts, logo, icons, favicons, manifest values and global brand references.

### Phase 2 — Content and page migration

Migrate Navbar, Hero, Services, Why Hestiva, About, Contact and Footer while preserving component interfaces where practical.

### Phase 3 — SEO and assets

Replace metadata, structured data, canonical URLs, sitemaps, robots, social assets, alt text and all old-domain references.

### Phase 4 — Functional verification

Verify forms, Supabase, email delivery, validation, analytics and Cloudflare behavior.

### Phase 5 — QA and cleanup

Run full checks, remove dead historical assets only after confirming no references, and produce migration and launch-blocker reports.

Do not combine an unrelated framework upgrade with these phases.

## 23. Mandatory final repository searches

Before declaring completion, search case-insensitively for at least:

- Maintenance Marshall
- MaintenanceMarshall
- maintenancemarshall
- Marshall
- Cleaning Marshall
- cleaningmarshall
- old domain values
- old email addresses
- old phone numbers
- old logo filenames
- old structured-data business name
- old service names

Review each match. Some technical history may legitimately remain in Git history, but no unintended customer-facing reference may remain in active source or generated assets.

## 24. Definition of done

The migration is complete only when:

- the production build succeeds;
- migration-caused TypeScript, lint and test errors are resolved;
- all primary routes work;
- contact functionality is verified or a specific external configuration blocker is documented;
- the layout is responsive;
- accessibility checks pass at a practical AA level;
- no unintended previous-brand content remains;
- metadata and structured data describe Hestiva accurately;
- no secrets were added;
- no unsupported business claims were introduced;
- all placeholders and unresolved launch data are listed;
- a changed-file summary, QA report and launch-blocker list are provided.

## 25. AI-agent operating rules

Any AI coding agent must:

- read this file completely before editing;
- inspect code rather than relying on assumptions;
- preserve working architecture;
- make the smallest coherent set of changes needed;
- avoid dependency upgrades unless required;
- never fabricate business facts;
- stop for approval on material product, architecture, security or scope decisions;
- never claim tests passed without running them;
- provide commands run and their results;
- keep a concise migration log;
- state uncertainty clearly.

The agent may make routine implementation decisions that follow this specification. It must request approval before:

- changing framework or hosting platform;
- replacing Supabase, Resend or the form architecture;
- deleting a route or major feature;
- adding paid services;
- changing the agreed residential-only scope;
- publishing unverified contact, address, price or compliance information;
- merging to `main` or deploying production.

## 26. Required owner inputs before production launch

Codex must identify whether these have been supplied and treat missing items as blockers, not invitations to guess:

- final Hestiva domain;
- final enquiry email;
- final phone/WhatsApp number;
- approved service area;
- approved physical or mailing address, if any;
- approved operating hours, if displayed;
- approved legal company name and registration information, if displayed;
- privacy-policy and terms requirements;
- final logo package, favicon and social-preview asset;
- exact brand colour and typography values;
- approved service list and optional add-ons;
- authentic photography or approval to use selected stock imagery;
- confirmed form recipient and production environment configuration.

## 27. Change log

Record future changes using:

| Date | Decision | Reason | Supersedes | Approved by |
|---|---|---|---|---|
| 2026-07-31 | HEPS v2.0 created by consolidating the Hestiva governance blueprint and website migration requirements | Provide one practical source of truth for the owner, ChatGPT and Codex | Hestiva Master Blueprint v1.0 for website implementation detail; its governance principles are retained | Project owner |
