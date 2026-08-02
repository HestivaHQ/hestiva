# Hestiva quote email setup

The quote form sends mail from the Cloudflare Worker through Resend. It requires these **server-side** environment variables:

- `RESEND_API_KEY`: a Resend API key permitted to send from the verified Hestiva domain.
- `HESTIVA_QUOTE_FROM_EMAIL`: the complete approved sender identity, for example `Hestiva Quotes <quotes@hestiva.co.za>`, but only after that exact domain and address are approved in Resend.

No Hestiva sender has been confirmed in this repository. Do not set an invented sender or add either value to `wrangler.jsonc`, a `VITE_*` variable, or client code.

## Cloudflare and Resend configuration after merging

1. In Resend, add `hestiva.co.za` under **Domains**.
2. Add every DNS record Resend supplies (DKIM and SPF records, plus any requested verification record) to the `hestiva.co.za` DNS zone in Cloudflare. Use the exact names and values Resend displays. Keep email-authentication DNS records as **DNS only** where Cloudflare offers a proxy setting.
3. Wait until Resend reports the domain as **Verified**. Confirm with the Hestiva domain owner which sender mailbox/address is approved for website quotes.
4. Create a restricted Resend sending API key for the production Worker.
5. From this repository, add the API key as an encrypted Worker secret:

   ```bash
   bunx wrangler secret put RESEND_API_KEY
   ```

6. Add the approved sender identity as an encrypted Worker secret (do not include the placeholder shown above unless it has been approved):

   ```bash
   bunx wrangler secret put HESTIVA_QUOTE_FROM_EMAIL
   ```

7. Deploy through the existing Cloudflare Worker pipeline. Submit a test quote from the deployed form and confirm in Resend's delivery logs that it was delivered to `quotes@hestiva.co.za`, that the From identity matches the approved value, and that Reply-To is the test customer's email.

For local development, put both values in the gitignored `.dev.vars` file. Never prefix them with `VITE_`; only server-side code may read them.
