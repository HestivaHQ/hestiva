# ADR-0009: Website quote authority handoff

- **Status:** Accepted
- **Date:** 2026-08-14

## Context

The website previously treated residential quote submission as an email-delivery workflow. HestivaOS now provides the versioned structured quote boundary required for non-lossy operational intake, including the Laundry and Ironing fields approved in Issue #79.

## Decision

Residential quote submission first sends the versioned structured request to HestivaOS. HestivaOS owns the durable quote identity and returns the quote reference used by subsequent website correspondence.

The website preserves one stable submission identity, timestamp and customer-photo identities across retry so a later retry cannot create a second commercial request after an earlier authoritative acceptance.

Laundry facilities and Laundry/Ironing quantities remain structured fields through this handoff rather than being reconstructed from customer-facing labels.

Ordinary contact enquiries remain independent of this quote handoff.

## Consequences

Quote email becomes correspondence after authoritative intake rather than the system of record for residential quote creation. Failure to obtain an authoritative acknowledgement does not produce a false success confirmation.

The website continues to own customer-facing collection and presentation. HestivaOS owns durable quote state, authoritative pricing and later operational handoff.

## Review triggers

Review this ADR when the quote schema version, retry identity, photo-transfer contract, authority boundary or ordering of quote correspondence changes.
