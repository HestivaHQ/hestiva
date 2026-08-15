# Homent website engineering documentation

This directory is the maintained engineering and operational record for the Homent website. It describes verified repository and production state. Product and engineering requirements remain in [`../HEPS.md`](../HEPS.md), except that pre-cutover Hestiva-specific public-brand instructions in HEPS are superseded by the verified Homent cutover record in [`HOMENT_PUBLIC_CUTOVER.md`](HOMENT_PUBLIC_CUTOVER.md) and the repository-wide current-identity rule in [`../AGENTS.md`](../AGENTS.md).

## Documentation policy

Documentation is part of the Definition of Done. The repository-wide rules and exact change-to-document matrix are in [`../AGENTS.md`](../AGENTS.md); [ADR-0001](decisions/ADR-0001-repository-documentation-policy.md) records the decision.

Every meaningful implementation/configuration change must update the verified current-state documentation it affects and append `TECHNICAL_WORK_LOG.md` and `CHANGELOG.md`. Material verified manual production/control-plane actions must also be recorded when they change operational state. ADRs preserve durable decisions and are superseded by later ADRs rather than rewritten.

Pull requests targeting `main` run `scripts/validate_documentation.py` against the PR base and head as part of `.github/workflows/hestiva-pr-check.yml`. The validator rejects meaningful implementation/configuration changes when nothing under `docs/` changed. Passing that minimum gate does not prove documentation accuracy or completeness; authors and reviewers must still apply the full matrix in `AGENTS.md`.

The manual `.github/workflows/hestiva-performance-check.yml` workflow provides repeatable production Lighthouse collection for the homepage, Services page, and Quote page. It performs three runs per URL using `lighthouserc.cjs` and retains the filesystem reports as a GitHub Actions artifact. It is diagnostic only and does not currently enforce score thresholds or block pull requests.

Historical gaps may be backfilled only from authoritative evidence such as merged pull requests, repository state, deployment evidence, or explicitly verified operator actions. Do not reconstruct missing history from assumption.

## Canonical documents

- [`HOMENT_PUBLIC_CUTOVER.md`](HOMENT_PUBLIC_CUTOVER.md) — current customer-facing Homent identity, domain/email cutover state, and preserved historical/internal Hestiva boundaries.
- [`ARCHITECTURE.md`](ARCHITECTURE.md) — current application structure, runtime boundaries, and explicitly deferred quotation-system architecture.
- [`DEPLOYMENT.md`](DEPLOYMENT.md) — authoritative Cloudflare production path, verified settings, previews, and the Wrangler configuration relationship.
- [`ENVIRONMENT.md`](ENVIRONMENT.md) — variable inventory and handling rules (names only; never secret values).
- [`RECOVERY_GUIDE.md`](RECOVERY_GUIDE.md) — practical validation, deployment, configuration, and source-control recovery runbook.
- [`PERFORMANCE_AUDIT.md`](PERFORMANCE_AUDIT.md) — verified performance findings, production-build baseline, and measurement strategy.
- [`TECHNICAL_WORK_LOG.md`](TECHNICAL_WORK_LOG.md) — append-only verified engineering and operational work record.
- [`CHANGELOG.md`](CHANGELOG.md) — concise dated record of implemented technical changes.
- [`Decision records`](decisions/README.md) — append-only ADR index for durable architecture, security, deployment, indexing/information-architecture, and repository-governance decisions.

## Document boundaries

These documents do not grant permission to change production infrastructure, credentials, data, or application behavior. Dashboard state is recorded only where it has been operationally verified. When repository evidence and external configuration cannot establish a fact, the relevant document labels that uncertainty rather than inferring an answer.

Older focused notes, such as [`phase-1-brand-foundation.md`](phase-1-brand-foundation.md) and [`hestiva-form-deployment.md`](hestiva-form-deployment.md), remain historical context; the files listed above are canonical for their stated subjects.
