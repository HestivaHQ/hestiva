# Slice 5M floor-size bands

## Status

Implemented website vocabulary for the coordinated Website ↔ HestivaOS quote contract.

## Approved customer-facing bands

The quote form uses the following approximate floor-size choices:

- Under 40 m²
- 40–59 m²
- 60–79 m²
- 80–99 m²
- 100–129 m²
- 130–169 m²
- 170–219 m²
- 220–299 m²
- 300+ m²
- Not sure

These replace the earlier broad `Under 80 m² / 80–150 m² / 151–250 m² / Over 250 m²` choices. The finer bands are intended to better represent the mix of compact apartments, townhouses and larger homes in Hestiva's target service corridor and to provide a usable input for the authoritative HestivaOS pricing engine.

`Not sure` remains a first-class customer choice. The website does not attempt to infer a property's floor area itself. Any later address-assisted estimation is an internal HestivaOS concern and must not add a confusing customer-facing step.

## Integration rule

The website display labels must map deterministically to the HestivaOS contract values defined for this Slice 5M change. The website must not continue sending any superseded broad floor-size value once the structured integration boundary is enabled.
