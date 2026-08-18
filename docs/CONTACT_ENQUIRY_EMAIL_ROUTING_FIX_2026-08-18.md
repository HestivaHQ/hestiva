# Contact Enquiry Email Routing Fix — 2026-08-18

## Production finding

A controlled production contact-form smoke test successfully delivered to both `info@homent.co.za` and the customer test mailbox, but the messages incorrectly used the quote email identity and quote-specific wording.

Observed defects:

- contact messages were sent from `Homent Quotes <quotes@homent.co.za>`;
- customer acknowledgement subject/body said `Quote Request Received`;
- admin notification described the submission as a quote request rather than a general website enquiry.

## Root cause

`submitContactForm()` correctly distinguished contact enquiries from quote submissions for the admin recipient, but both channels always used `buildQuoteEmailPackage()`.

The shared Resend helper also hard-coded the quote sender and reply-to identity for every outbound message.

## Correction

- Added a dedicated contact-enquiry email package with enquiry-specific admin/customer subjects and copy.
- Contact enquiries use `Homent <info@homent.co.za>` as sender and `info@homent.co.za` as reply-to.
- Quote submissions retain `Homent Quotes <quotes@homent.co.za>` and the existing quote templates.
- The shared email service now accepts explicit sender/reply-to values while preserving quote defaults for existing callers.
- Contact enquiries continue to route internally to `info@homent.co.za`; quote submissions continue to route to `quotes@homent.co.za`.

## Verification required

After merge and production deployment, repeat one controlled contact-form smoke test and verify:

1. admin message arrives in `info@homent.co.za`;
2. sender/reply-to identity is `info@homent.co.za`;
3. admin subject/body describe an enquiry, not a quote request;
4. customer acknowledgement describes an enquiry and uses the `info@homent.co.za` identity;
5. quote-form production behavior remains unchanged.
