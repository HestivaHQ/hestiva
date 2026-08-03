# Hestiva form deployment

This deployment includes the live Hestiva form submission wiring already present on `main`:

- `src/components/LiveFormSubmission.tsx`
- `src/routes/__root.tsx`
- `src/lib/contact.functions.ts`
- `src/lib/quote/email-service.ts`

The quote and contact forms submit through the existing server function and send via Resend using `quotes@hestiva.co.za`.
