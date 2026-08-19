# Website enquiry HestivaOS cutover — 2026-08-19

## Status

Implementation slice for the Website-side follow-up to `HestivaHQ/HestivaOS#73` and HestivaOS PR #149.

## Contract

Contact enquiries classified as one of the existing contact enquiry types are now submitted server-to-server to the HestivaOS Website enquiry endpoint before the Website reports successful intake.

- Endpoint: `POST /api/v1/integrations/website/enquiries`
- Schema: `website-enquiry.v1`
- Authentication: existing server-only `HESTIVA_WEBSITE_INTEGRATION_SECRET`
- Base URL: existing `HESTIVA_OS_API_URL`
- Authoritative reference: HestivaOS-returned `ENQ-YYYYMMDD-NNNN`
- No new deployment secret is introduced.

The Website sends the current contact fields as structured data: name, phone, email, enquiry type, suburb/address value, description and preferred contact method, plus a Website-generated UUID `submissionId` and ISO `submittedAt`.

## Retry and acknowledgement behaviour

One UUID and one immutable payload are created per server-side contact submission attempt. If the HestivaOS request experiences a transient network or 5xx failure, the Website retries the same payload once. HestivaOS idempotency therefore returns the same authoritative enquiry on a replay rather than allocating a duplicate reference.

A successful Website intake requires a successful HestivaOS response whose `submissionId` matches the request and whose `enquiryReference` matches the `ENQ-YYYYMMDD-NNNN` contract. Failed or invalid OS ingestion is returned to the public form as a delivery failure and must not be shown as success.

## Correspondence ordering

HestivaOS persistence and authoritative reference allocation happen before the Website sends the Admin and customer contact-enquiry emails. Those emails use the returned `ENQ-...` reference and retain `info@homent.co.za` as sender/reply-to identity.

Once HestivaOS has durably accepted the enquiry, a later email-delivery failure is logged as `contact_enquiry_correspondence_failed` and does not convert the durable enquiry into an ingestion failure. This avoids encouraging a customer retry solely because correspondence failed after authoritative intake already succeeded.

## Scope boundaries

This slice changes only the generic Website contact-enquiry channel. Quote reference authority and the structured quote ingestion flow remain unchanged. It does not change contact-form fields, catalogue decisions, Quote acceptance/decline flows, Customer/Property creation, Work Orders, recurring agreements, Messaging, Finance or Needs Attention.

## Deployment requirement

The production Website must have the same already-established HestivaOS integration configuration used by structured Quote ingestion: `HESTIVA_OS_API_URL` and `HESTIVA_WEBSITE_INTEGRATION_SECRET`. The HestivaOS deployment must include PR #149 before the Website cutover is deployed.
