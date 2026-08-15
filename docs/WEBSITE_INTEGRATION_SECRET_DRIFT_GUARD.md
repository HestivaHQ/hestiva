# Website Integration Secret Drift Guard

## Incident

On 2026-08-15, production Website Quote submissions reached HestivaOS but were rejected with HTTP 401. The integration recovered immediately after the Cloudflare `HESTIVA_WEBSITE_INTEGRATION_SECRET` was reset to the canonical Railway value. The Website and HestivaOS application code did not require an authentication-contract change.

## Safeguards

- Railway is the operational source of truth for `HESTIVA_WEBSITE_INTEGRATION_SECRET`.
- Any secret rotation must set Railway first, copy the exact same value into Cloudflare, and then allow both runtimes to redeploy/restart.
- HestivaOS exposes authenticated `GET /api/v1/integrations/website/health` using the same Bearer verifier as Quote ingestion.
- The Website performs a lightweight health check when `/quote` loads. It sends no Quote or customer data.
- If that initial check is unhealthy, Send Request performs one fresh health re-check before any Quote submission. Only a confirmed second failure blocks submission with `Q-INTEGRATION-HEALTH`.
- Both sides compute the same 12-character SHA-256 secret fingerprint for diagnostics. The actual secret is never logged, returned to the browser, or written to source control.

## Why this stays small

No new credential, database table, background job, queue, monitoring service, or customer-facing workflow was added. Healthy quote journeys add one authenticated GET health request on quote-page load. The existing structured Quote POST remains the authoritative submission path and still requires HestivaOS acknowledgement with a real `quoteReference`.

## Operational rule

After any integration-secret or deployment change, do not declare the Website → HestivaOS integration healthy until the authenticated health endpoint returns HTTP 200. A 401 is a credential/configuration problem first; do not change Quote business logic to work around it.
