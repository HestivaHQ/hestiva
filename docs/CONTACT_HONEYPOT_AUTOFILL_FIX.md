# Contact honeypot autofill false-positive fix

Date: 2026-08-12

## Production evidence

A legitimate Homent Contact form submission was rejected in production with the explicit anti-spam failure category. Server inspection confirmed that this category can only be produced by the supplemental honeypot check on the off-screen `website` field.

The Contact page exposes that trap as an off-screen text input named `website`. Browser profile/password-manager autofill can interpret that semantic name as profile website data and populate the field even though the visitor never interacts with it. The server then correctly rejects the non-empty honeypot value, creating a false positive.

## Focused correction

`ContactHoneypotGuard` is route-gated to `/contact`. On mount it clears only the initial browser-autofilled value, makes the trap read-only to prevent subsequent browser profile autofill, and adds common password-manager ignore hints. The existing field name, server schema, honeypot assertion, same-origin validation, per-channel rate limit, bounded validation and Resend delivery path remain unchanged.

The trap is not removed. Scripted automation can still assign a value directly to the input and will continue to be rejected by the existing server-side honeypot assertion. The change is specifically intended to prevent browser/profile autofill from manufacturing a honeypot value for a legitimate visitor.

## Verification requirement

The full repository PR gate must pass before merge. After deployment, one legitimate Contact submission must be tested in production. Success is verified only when the request passes the anti-spam stage and reaches the normal Homent Contact delivery path.
