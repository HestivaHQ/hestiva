# ADR-0001: Repository documentation policy

- **Status:** Accepted
- **Date:** 2026-08-11

## Context

The Hestiva website repository already contained canonical architecture, deployment, environment, recovery, technical work-log, and changelog documents. However, documentation updates were not a repository-wide completion requirement and the pull-request gate did not detect implementation changes with no documentation companion change. As a result, substantial verified work merged after the original documentation baseline without corresponding historical entries.

HestivaOS already uses a stricter model in which documentation is part of the Definition of Done, historical records are preserved, durable decisions use append-only ADRs, and CI rejects meaningful implementation changes when no documentation file changed.

## Decision

The Hestiva website adopts the same core governance model, scaled to this repository.

- Root `AGENTS.md` defines the mandatory documentation principles, update matrix, historical-record rules, and implementation/PR checklist.
- `docs/TECHNICAL_WORK_LOG.md` and `docs/CHANGELOG.md` are mandatory companions to meaningful implementation/configuration changes and material verified operational changes.
- A new `docs/decisions/` ADR system records durable architectural and operational decisions. Accepted ADRs are preserved and superseded by later ADRs rather than silently rewritten.
- `scripts/validate_documentation.py` is added as a minimum CI consistency gate. It fails when meaningful implementation/configuration files change with no `docs/` companion change, while ignoring documentation-only, comment-only, and license-only edits.
- The pull-request workflow runs the validator against the PR base and head.
- Manual production/control-plane actions that materially alter operational state are documentation work even when no code changes; they must be recorded when verified.

The automated validator checks only that a documentation companion change exists. It cannot prove that the selected documents are correct, complete, or truthful; authors and reviewers remain responsible for applying the full `AGENTS.md` matrix.

## Consequences

- Future website implementation PRs carry documentation and verification evidence in the same change.
- The work log and changelog remain auditable historical records instead of being reconstructed later from memory.
- Durable architecture/operational decisions gain explicit rationale and supersession history.
- CI catches completely missing documentation but does not replace human review.
- Existing historical gaps are backfilled only from authoritative repository evidence; unverifiable details are not invented.
