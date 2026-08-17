# Quote browser readiness testing — Phase 5

Status: Active CI expansion
Date introduced: 2026-08-17

## Purpose

Phase 5 extends the quote browser-readiness layer into keyboard and focus behavior. It is intended to catch focus traps, unreachable conditional controls, broken validation focus recovery and keyboard-inaccessible final actions without duplicating the existing mouse-driven field matrix.

## Coverage added

Phase 5 verifies on both desktop Chromium and mobile Chromium that:

- first-step focus order follows the visible customer controls from Property type through Current location, Suburb and Address;
- selecting `Other` inserts the mandatory property-description field into the keyboard order immediately after Property type;
- keyboard activation of Continue on an invalid step returns focus to the first invalid field;
- add-on checkboxes can be toggled with Space and dependent Laundry controls become available;
- final consent can be checked with the keyboard and the final structured Send Request action can be activated with Enter;
- the keyboard-triggered final submission is still owned by `StructuredQuoteSubmission` and uses the existing development-only submission seam, so no production HestivaOS call or correspondence occurs.

## Safety boundary

The final keyboard submission journey uses the same development-only structured-submission seam introduced in Phase 3. No production HestivaOS request, production email, quote rate-limit consumption or operational record is created.

Phase 5 does not attempt to replace a full WCAG audit or assistive-technology certification. It provides deterministic browser regression coverage for the quote journey's most important keyboard and focus behaviors.

## Relationship to earlier phases

- Phase 1 protects core property/service/add-on branching.
- Phase 2 protects later-step validation and state persistence.
- Phase 3 protects final submission ownership and customer-visible outcomes.
- Phase 4 protects photo/file selection and final retained-file payload behavior.
- Phase 5 protects keyboard reachability, focus recovery and keyboard-triggered final actions.
