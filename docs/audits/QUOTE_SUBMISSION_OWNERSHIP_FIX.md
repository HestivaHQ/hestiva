# Quote submission ownership fix

Status: IMPLEMENTED

## Scope

The `/quote` route keeps `LiveFormSubmission` for progressive quote-form DOM enhancements and ordinary contact behaviour, but final residential quote submission is owned by `StructuredQuoteSubmission`.

`StructuredQuoteSubmission` is mounted synchronously on `/quote` before the lazy legacy form controller. This guarantees that its capture-phase `Send Request` handler is registered first and can stop the legacy quote submission handler from running for the same customer action.

## Reason

Both controllers previously loaded lazily and both could register capture-phase handlers for `Send Request`. Lazy module resolution order was therefore an unsafe submission-ownership boundary and could allow the legacy email-oriented path to race the structured HestivaOS submission path.

## Behaviour preserved

This change does not alter quote fields, pricing authority, HestivaOS Contract v2 payload semantics, rate limiting, email delivery order, customer-facing validation, or the Website → HestivaOS API route. It only makes final quote-submission ownership deterministic while preserving the legacy controller's non-submission quote enhancements.
