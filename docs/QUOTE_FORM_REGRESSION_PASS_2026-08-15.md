# Quote form regression pass — 2026-08-15

## Scope

This pass follows the merged Website Quote Contract v2 and the earlier quote progression fixes. It addresses production-visible regressions without changing the synchronous `StructuredQuoteSubmission` ownership established by PR #144.

## Root causes confirmed

1. The lazy legacy quote controller still chained disabled states after the React quote form had become authoritative for visible validation. On Townhouse this made `Balcony or patio` and `Estate or complex` effectively unusable because the legacy controller still considered Townhouse an Apartment-style unit-access property.
2. The Laundry/Ironing enhancer determined eligibility from `#field-service`. That field is unmounted when the customer reaches the add-on step, so the enhancer incorrectly treated an already selected Regular Home Cleaning or Deep Cleaning service as ineligible and disabled Laundry/Ironing.
3. The Laundry/Ironing enhancer cleared its structured quantity/facility state whenever the add-on controls were not mounted. This could erase a valid selected Laundry/Ironing request before final submission.
4. Product Restrictions and Allergies are legacy-injected DOM controls. Their injected wrappers can outlive the Access and Household Details React step and appear on the following step.
5. Quote intake and quote correspondence were coupled too tightly. HestivaOS acknowledgement already creates the authoritative Quote and reference; a later Resend failure could nevertheless make the website report that the request itself was not sent, encouraging duplicate retries.

## Current behavior after this pass

- React step validation remains authoritative. A stability layer restores fields that the legacy controller tries to silently disable and removes orphaned Product Restrictions/Allergies wrappers after the Access and Household Details step unmounts.
- Townhouse uses storeys and no longer blocks Balcony/Patio or Estate/Complex choices behind apartment-only exact-floor/access assumptions.
- Laundry and Ironing remain commercially eligible only with Regular Home Cleaning and Deep Cleaning, but that eligibility now survives the step transition because the selected primary service is remembered while the service field is unmounted.
- Selected Laundry facilities, laundry-load quantity and ironing-load quantity persist through later quote steps and are still available to the structured Contract v2 submission owner at final submission.
- Bedroom Cleaning and Living Area Cleaning expose One-time, Weekly, Every two weeks, Monthly and Custom frequencies. The companion HestivaOS Contract v2 change accepts that broadened v2 frequency policy while historical v1 remains unchanged.
- Once HestivaOS acknowledges a request with an authoritative `quoteReference`, an email-provider failure no longer changes the customer-facing intake result to “not sent”. The server logs correspondence failure separately and the customer receives a success message that does not falsely promise the confirmation email.
- HestivaOS configuration/authentication/network/contract failures before authoritative acknowledgement continue to fail closed.

## Production verification required

After the Website and companion HestivaOS PRs are merged and deployed, run a real production quote through at least:

- Townhouse with Balcony or Patio and Estate/Complex populated.
- Regular Home Cleaning with Laundry and Ironing quantities.
- Bedroom Cleaning or Living Area Cleaning using a newly allowed recurring frequency.
- Product Restrictions/Allergies followed by the Photos and Notes step to confirm no injected controls carry over.
- Final submission confirming a real `Q-...` HestivaOS reference.
