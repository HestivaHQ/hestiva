# Townhouse field unlock fix — 2026-08-15

## Problem

After PR #148, selecting `Townhouse` could still leave the React-owned `Balcony or patio` and `Estate or complex` fields unusable.

## Root cause

The legacy quote progression controller still classifies `Townhouse` as an apartment-style exact-floor/access property. When its internal `homeLayoutComplete` check failed, it disabled `field-outdoor`; `setDisabled()` also cleared the selected value. PR #148 could re-enable the React dropdown afterward, but it could not restore the value already erased by the legacy controller. This created the visible behavior where Townhouse Balcony/Patio and Estate/Complex selections would not stick.

## Correction

`QuoteFormStabilityEnhancement` now installs a Townhouse-only compatibility bridge for the two obsolete legacy dependency IDs (`field-unitFloorExact` and `field-buildingAccess`) while the Townhouse property step is mounted. The bridge prevents the legacy progression controller from treating the Townhouse layout as incomplete and therefore stops it from clearing the React-owned outdoor/estate fields.

The Quote Contract v2 mapper already ignores exact-floor/building-access state for Townhouses, so these bridge values are not transported as Townhouse operational facts. Apartments retain their real exact-floor/access controls and behavior unchanged.

## Verification

Run the full exact-head Hestiva PR Check before merge. Production smoke-test Step 1 with `Townhouse`: choose storeys, then select `Balcony or patio` and `Estate or complex` repeatedly and confirm both values persist without apartment exact-floor/access controls appearing.
