# Hestiva website decision records

This directory contains append-only Architecture Decision Records (ADRs) for durable website
engineering and operational decisions.

## Rules

- Accepted ADRs preserve the decision and rationale that existed when they were accepted.
- Do not rewrite an accepted ADR to make historical reasoning match later implementation.
- When a durable decision changes, create a new ADR that explicitly supersedes the earlier record
  and update this index.
- Use ADRs for architectural, security, deployment, indexing/information-architecture, or
  repository-governance choices that future maintainers need to understand.
- Routine implementation details belong in the technical work log and changelog instead of
  receiving an ADR.

## Index

| ADR                                                        | Status   | Decision                                                                                      |
| ---------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------- |
| [ADR-0001](ADR-0001-repository-documentation-policy.md) | Accepted | Documentation is part of the website repository Definition of Done and is enforced by CI. |
