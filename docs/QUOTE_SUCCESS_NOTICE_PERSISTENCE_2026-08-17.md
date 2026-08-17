# Quote success notice persistence

## Status

Implemented as a focused customer-facing UX correction following the controlled production quote smoke test on 2026-08-17.

## Problem observed in production

The branded quote success notice contained the authoritative quote reference but automatically disappeared after eight seconds. During the production smoke test this made it easy for the customer to lose the reference before recording it.

## Decision

Successful quote notices on `/quote` remain visible until the customer explicitly closes the notification.

Error notices retain their existing 12-second automatic dismissal behavior.

## Scope

- No quote submission transport changes.
- No HestivaOS contract or persistence changes.
- No pricing, validation, authentication, rate-limit, email, or reference-generation changes.
- The existing accessible `Close notification` control remains the explicit dismissal mechanism.

## Regression coverage

The browser suite verifies that a branded quote success notice is still visible after the former eight-second timeout boundary and disappears only after the customer activates `Close notification`.
