# Hestiva engineering documentation

This directory is the index and canonical baseline for engineering, deployment, environment, and
recovery knowledge for the existing Hestiva website. It describes the system as it exists; product
requirements remain in [`../HEPS.md`](../HEPS.md).

## Canonical documents

- [`ARCHITECTURE.md`](ARCHITECTURE.md) — current application structure, runtime boundaries, and
  explicitly deferred quotation-system architecture.
- [`DEPLOYMENT.md`](DEPLOYMENT.md) — authoritative Cloudflare production path, verified settings,
  previews, and the Wrangler configuration relationship.
- [`ENVIRONMENT.md`](ENVIRONMENT.md) — variable inventory and handling rules (names only; never
  secret values).
- [`RECOVERY_GUIDE.md`](RECOVERY_GUIDE.md) — practical validation, deployment, configuration, and
  source-control recovery runbook.
- [`TECHNICAL_WORK_LOG.md`](TECHNICAL_WORK_LOG.md) — concise record of engineering work and its
  verification.
- [`CHANGELOG.md`](CHANGELOG.md) — forward-looking technical change history.

## Document boundaries

These documents do not grant permission to change production infrastructure, credentials, data,
or application behavior. Dashboard state is recorded only where it has been operationally
verified. When repository evidence and external configuration cannot establish a fact, the
relevant document labels that uncertainty rather than inferring an answer.

Older focused notes, such as [`phase-1-brand-foundation.md`](phase-1-brand-foundation.md) and
[`hestiva-form-deployment.md`](hestiva-form-deployment.md), remain historical context; the files
listed above are canonical for their stated subjects.
