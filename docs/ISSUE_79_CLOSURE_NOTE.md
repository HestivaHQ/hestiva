# Issue #79 final website terminology note

**Date:** 2026-08-14

The substantive Website-side Issue #79 implementation was completed and documented by PR #139, including structured Website Quote Contract v2 transport, add-on-only Laundry/Ironing semantics, customer-facing service content, production handoff smoke testing, and exact-head validation.

A final closure audit found one remaining presentation-only label in `visualAddOns`: **Extra laundry folding**. The tile now displays **Laundry & ironing** and its image alt text describes Laundry/Ironing support during a home-cleaning visit.

The existing `extra-laundry-folding` asset slug is deliberately retained for file/URL compatibility. This correction changes no quote option, eligibility rule, facility outcome, load quantity, price, HestivaOS transport, authentication, correspondence, environment variable, or deployment behavior.

The canonical customer-facing Laundry page remains the compatibility route `/services/laundry-folding`, presented as **Laundry & Ironing Add-On** and explicitly add-on-only.
