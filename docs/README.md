# Hestiva engineering documentation

This directory is the maintained engineering and operational record for the Hestiva website. It describes verified repository and production state; product requirements remain in [`../HEPS.md`](../HEPS.md).

## Documentation policy

Documentation is part of the Definition of Done. The repository-wide rules and exact change-to-document matrix are in [`../AGENTS.md`](../AGENTS.md); [ADR-0001](decisions/ADR-0001-repository-documentation-policy.md) records the decision.

Every meaningful implementation/configuration change must update the verified current-state documentation it affects and append `TECHNICAL_WORK_LOG.md` and `CHANGELOG.md`. Material verified manual production/control-plane actions must also be recorded when they change operational state. ADRs preserve durable decisions and are superseded by later ADRs rather than rewritten.

Pull requests targeting `main` run `scripts/validate_documentation.py` against the PR base and head as part of `.github/workflows/hestiva-pr-check.yml`. The validator rejects meaningful implementation/configuration changes when nothing under `docs/` changed. Passing that minimum gate does not prove documentation accuracy or completeness; authors and reviewers must still apply the full matrix in `AGENTS.md`.

Historical gaps may be backfilled only from authoritative evidence such as merged pull requests, repository state, deployment evidence, or explicitly verified operator actions. Do not reconstruct missing history from assumption.

## Canonical documents

- [`ARCHITECTURE.md`](ARCHITECTURE.md) — current application structure, runtime boundaries, and explicitly deferred quotation-system architecture.
- [`DEPLOYMENT.md`](DEPLOYMENT.md) — authoritative Cloudflare production path, verified settings, previews, and the Wrangler configuration relationship.
- [`ENVIRONMENT.md`](ENVIRONMENT.md) — variable inventory and handling rules (names only; never secret values).
- [`RECOVERY_GUIDE.md`](RECOVERY_GUIDE.md) — practical validation, deployment, configuration, and source-control recovery runbook.
- [`TECHNICAL_WORK_LOG.md`](TECHNICAL_WORK_LOG.md) — append-only verified engineering and operational work record.
- [`CHANGELOG.md`](CHANGELOG.md) — concise dated record of implemented technical changes.
- [`Decision records`](decisions/README.md) — append-only ADR index for durable architecture, security, deployment, indexing/information-architecture, and repository-governance decisions.

## Document boundaries

These documents do not grant permission to change production infrastructure, credentials, data, or application behavior. Dashboard state is recorded only where it has been operationally verified. When repository evidence and external configuration cannot establish a fact, the relevant document labels that uncertainty rather than inferring an answer.

Older focused notes, such as [`phase-1-brand-foundation.md`](phase-1-brand-foundation.md) and [`hestiva-form-deployment.md`](hestiva-form-deployment.md), remain historical context; the files listed above are canonical for their stated subjects.
