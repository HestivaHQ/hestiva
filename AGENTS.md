# Homent website engineering standards

These rules apply to every file in this repository. Documentation is part of the Definition of Done: implementation, configuration, operational state, and their authoritative documentation must not knowingly diverge.

## Current public identity

- The active customer-facing brand is **Homent**.
- The canonical production origin is `https://www.homent.co.za`.
- `docs/HOMENT_PUBLIC_CUTOVER.md` is the current authority for public brand/domain/email cutover state.
- Historical documentation and implementation-internal identifiers may still contain `Hestiva` where that wording remains technically or historically accurate, including the repository name and the HestivaOS integration boundary.
- Do not reintroduce Hestiva customer-facing branding, `hestiva.co.za` public URLs/email addresses, or superseded Hestiva taglines merely because an older specification or historical document still contains them.
- Where `HEPS.md` contains pre-cutover Hestiva-specific public-brand instructions, those instructions are superseded by the verified Homent cutover record and current active source. Preserve non-brand product, engineering, safety, accessibility, content-integrity, testing, and governance rules unless separately superseded.

## Documentation principles

- Record only state verified from code, configuration, tests, merged pull requests, deployment evidence, or an explicitly verified operator action. Never invent implementation details, production state, credentials, URLs, commands, customer facts, or decisions.
- Preserve engineering history. Append dated entries to historical records; do not rewrite earlier work to make the past resemble the present.
- ADRs are append-only historical records. A later durable decision supersedes an earlier ADR with a new ADR instead of rewriting the accepted record.
- Prefer updating an existing authoritative document over creating competing documentation.
- Never store secrets or credentials. Document variable names and safe operational procedures only.
- Distinguish verified current state, planned work, historical state, and unresolved uncertainty.
- Material manual production/dashboard actions are engineering work when they alter operational state. Record them in the technical work log and update the affected operational document even when no application code changes.

## Required update matrix

For every meaningful implementation, configuration, or operational change, inspect every applicable category below and update every affected document. `docs/TECHNICAL_WORK_LOG.md` and `docs/CHANGELOG.md` are mandatory for every implementation/configuration change and for material verified operational changes.

- **Application architecture, repository structure, routing boundaries, component ownership, or code-splitting boundaries:** update `docs/ARCHITECTURE.md`, `docs/TECHNICAL_WORK_LOG.md`, `docs/CHANGELOG.md`, and add an ADR when a durable architectural decision is introduced or superseded.
- **Cloudflare, build/deploy workflow, CI/CD, production or preview configuration:** update `docs/DEPLOYMENT.md`, `docs/RECOVERY_GUIDE.md`, `docs/ARCHITECTURE.md` when topology changes, `docs/TECHNICAL_WORK_LOG.md`, `docs/CHANGELOG.md`, and add an ADR for durable operational decisions.
- **Environment variables, runtime configuration, or secrets handling:** update `docs/ENVIRONMENT.md`, `docs/DEPLOYMENT.md` and/or `docs/RECOVERY_GUIDE.md` as applicable, `docs/TECHNICAL_WORK_LOG.md`, and `docs/CHANGELOG.md`.
- **Public forms, validation, email delivery, rate limiting, security boundaries, or file handling:** update `docs/ARCHITECTURE.md`, `docs/RECOVERY_GUIDE.md` and/or `docs/ENVIRONMENT.md` as applicable, `docs/TECHNICAL_WORK_LOG.md`, `docs/CHANGELOG.md`, and add an ADR for durable security or architecture decisions.
- **SEO architecture, sitemap/robots/canonical/indexability policy, structured data, or service/location information architecture:** update `docs/ARCHITECTURE.md` when system structure changes, `docs/TECHNICAL_WORK_LOG.md`, `docs/CHANGELOG.md`, and add an ADR for durable information-architecture or indexing-policy decisions.
- **Business workflows or quote-flow behaviour:** update `docs/ARCHITECTURE.md` when workflow boundaries change, `docs/TECHNICAL_WORK_LOG.md`, `docs/CHANGELOG.md`, and relevant product or operational documentation.
- **Performance architecture or bundle/loading strategy:** update `docs/ARCHITECTURE.md` when a durable loading boundary changes, `docs/TECHNICAL_WORK_LOG.md`, and `docs/CHANGELOG.md`.
- **Dependencies or build tooling:** update `docs/ARCHITECTURE.md` and/or `docs/DEPLOYMENT.md` when behaviour changes, `docs/TECHNICAL_WORK_LOG.md`, `docs/CHANGELOG.md`, and add an ADR for a durable technology choice.
- **Development workflow or repository tooling:** update `docs/README.md`, `docs/TECHNICAL_WORK_LOG.md`, `docs/CHANGELOG.md`, and add an ADR when the repository-wide process changes.
- **Recovery or operator procedure:** update `docs/RECOVERY_GUIDE.md`, `docs/DEPLOYMENT.md` and/or `docs/ENVIRONMENT.md` as applicable, `docs/TECHNICAL_WORK_LOG.md`, and `docs/CHANGELOG.md`.
- **Material verified manual action in Search Console, Cloudflare, DNS, email infrastructure, or another production control plane:** update the affected operational/current-state document, `docs/TECHNICAL_WORK_LOG.md`, and `docs/CHANGELOG.md`; add an ADR only if the action introduces a durable decision.

## Historical document rules

- `docs/TECHNICAL_WORK_LOG.md` records verified engineering work, validation, scope, and operational actions. Add newest entries first.
- `docs/CHANGELOG.md` records implemented technical changes in concise dated form. It must not describe planned work as shipped.
- `docs/decisions/` preserves durable decisions and their rationale. Accepted ADRs are not silently rewritten after later implementation changes.
- Historical gaps may be backfilled only from authoritative evidence. If evidence is insufficient, record the gap rather than reconstructing details from memory.

## Implementation and PR checklist

Before declaring work complete:

1. Reconcile the implementation/configuration/operational change against the matrix above.
2. Update affected current-state documents and append the technical work log and changelog.
3. Add or supersede an ADR when the work introduces a durable architectural or operational decision.
4. Run repository validation, documentation validation, formatting/lint/type/build checks that apply, `git diff --check`, and the tracked-secret scan.
5. Review the complete diff and confirm no stale, contradictory, speculative, or duplicated documentation remains.

Every implementation PR body should state:

- **Documentation updated:** files changed and why.
- **Verification performed:** checks/outcomes and any manual preview or production verification.
- **Files changed:** complete or accurately categorized list.
- **No stale documentation remains:** an affirmative statement based on review.

Documentation-only typo/formatting corrections, comment-only code changes, and license-only changes do not require artificial historical entries. They must never be used to conceal a meaningful implementation change.