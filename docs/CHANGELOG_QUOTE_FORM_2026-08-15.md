# Quote form changelog note — 15 August 2026

- Corrected Townhouse/House storey and apartment unit-floor semantics in `/quote`.
- Removed `Add-on Services` from the Primary service selector while preserving the dedicated add-on step.
- Added mandatory descriptions for Property type `Other`, Primary service `Not sure`, and Frequency `Custom`.
- Removed the bedroom-to-bathroom selector dependency so omitted earlier answers surface normal required-field validation instead of making the later selector effectively unusable.
- Preserved PR #144 structured quote submission ownership and PR #139 fail-closed HestivaOS acknowledgement requirements.
- Recorded that the production quote-send error still requires operational verification of `HESTIVA_OS_API_URL`, `HESTIVA_WEBSITE_INTEGRATION_SECRET`, and HestivaOS endpoint reachability/authentication; the legacy email-only path must not be restored as a workaround.
