# Townhouse field unlock fix — 2026-08-15

## Problem

After PR #148, selecting `Townhouse` could still leave the React-owned `Balcony or patio` and `Estate or complex` fields unusable.

## Root cause

The legacy quote progression controller still classifies `Townhouse` as an apartment-style exact-floor/access property. When its internal `homeLayoutComplete` check failed, it disabled `field-outdoor`; `setDisabled()` also cleared the selected value. PR #148 could re-enable the React dropdown afterward, but it could not restore the value already erased by the legacy controller.

PR #149 attempted to shield the React form with hidden compatibility values for `field-unitFloorExact` and `field-buildingAccess`. Production verification showed that fix was incomplete. The bridge was appended to the end of the form and applied on a delayed stability pass. `LiveFormSubmission.syncUnitAccessFields()` could therefore inject real, empty apartment-style controls first, and its zero-delay legacy synchronisation could still resolve those empty controls and clear the Townhouse outdoor/estate values before the bridge became authoritative.

## Corrected compatibility behaviour

`QuoteFormStabilityEnhancement` now:

- applies the Townhouse bridge synchronously on the property `change` event, before the legacy controller's queued zero-delay synchronisation;
- prepends the compatibility values so DOM lookup resolves them before any later legacy-injected duplicate IDs;
- removes the obsolete visible apartment-style exact-floor/access panel whenever Townhouse is selected;
- continues to leave Apartment exact-floor/access behaviour unchanged;
- leaves Quote Contract v2 transport unchanged, where Townhouse is storey-based and exact-floor/building-access bridge values are ignored.

This is intentionally scoped to browser compatibility with the still-present legacy controller. It does not change the authoritative HestivaOS Contract v2 property model or submission ownership.

## Verification

Run the full exact-head Hestiva PR Check before merge. After deployment, production-smoke Step 1 with `Townhouse`: choose storeys, then select each `Balcony or patio` option and each `Estate or complex` option and confirm selections persist without apartment exact-floor/access controls appearing. Also switch from Townhouse to Apartment and confirm the Apartment exact-floor/access controls still appear and remain required.
