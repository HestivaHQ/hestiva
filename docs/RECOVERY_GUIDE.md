# Recovery guide

## Principles

- Cloudflare native Git integration is the production deployment authority.
- Prefer a reviewed corrective/revert commit on `main` so Git history and deployed state converge.
- Never solve an incident by committing a secret, generated `.output`/`.wrangler` files, or an
  unreviewed configuration change.
- Cloudflare observability is currently disabled. Use the native deployment status/log available
  for the deployment attempt and reproduce validation locally; do not claim runtime telemetry that
  is not enabled.
- Preserve evidence: affected commit, deployment/version identifier, timestamps, symptoms, and
  validation output. Do not record credential values or customer form content.

## Failed Cloudflare deployment

1. In Cloudflare, confirm the failed deployment belongs to the `hestiva` Worker, identify the
   source commit/branch, and read the deployment output.
2. Confirm the GitHub commit actually exists on `main`; do not retry an unintended branch as
   production.
3. From a clean checkout of that commit, run the validation commands in “Pre-merge validation”
   below. Inspect root `wrangler.jsonc`; after a build, inspect only the structure (not values) of
   generated `.output/server/wrangler.json` and `.wrangler/deploy/config.json`.
4. Correct the repository cause on a branch, open a PR, validate it, and merge the correction to
   `main`. Let native Git integration redeploy.
5. If the failure is transient and the same commit is known good, use the Cloudflare dashboard's
   existing retry/redeploy capability for that native deployment. Do not introduce or routinely
   use a parallel CLI/GitHub deployment path.

## Bad production deployment

1. Confirm scope on `hestiva.co.za` and associate it with a specific deployed `main` commit/version.
2. If immediate restoration is needed and Cloudflare presents an existing known-good Worker
   version/rollback action, select that known-good version in Cloudflare and verify the domain. Do
   not modify variables, routes, or credentials as part of a code rollback.
3. Restore source history as well: create a branch from current `main`, run `git revert <bad-commit>`
   (or revert the merge commit with the appropriate parent), validate, and merge the reviewed
   revert. Native Git integration then deploys the reconciled `main` state.
4. If the old commit is safe to redeploy without reverting intervening work, reapply it through a
   reviewed commit/PR rather than force-pushing `main`.
5. Verify representative SSR routes, static assets, `/sitemap.xml`, and—only with approved test
   addresses—a contact/quote email flow.

The verified `npx wrangler versions upload` command can upload a version, but it does not make an
ad-hoc CLI flow authoritative. Use Cloudflare's existing version/rollback UI where available and
keep `main` reconciled with production.

## Git and `main` recovery

1. Protect evidence by fetching and recording `git rev-parse main` and the intended known-good SHA.
2. Do not force-push or rewrite `main` as the normal response.
3. Revert the faulty commit(s) on a recovery branch, validate, and use a Ready for Review PR against
   `main`.
4. If a commit is merely missing, cherry-pick it onto a branch and follow the same PR path.
5. After merge, confirm Cloudflare associated the deployment with the expected new `main` SHA.

## Missing environment variable

1. Identify the missing **name** from the server error/build output; never log its value.
2. Check [`ENVIRONMENT.md`](ENVIRONMENT.md) for exposure and requirement. The active production
   email path requires `RESEND_API_KEY`; the configured Supabase variables are not consumed by
   current source.
3. An authorized Cloudflare operator should restore the value in the correct production or preview
   environment using the existing variable type. `RESEND_API_KEY` must be an encrypted Secret.
4. Redeploy/retry through Cloudflare native Git integration as supported, then exercise only the
   affected feature. Do not move a secret into tracked `wrangler.jsonc`, `.env`, or a `VITE_` name.

For `RESEND_API_KEY`, a successful build and healthy page loads do not prove configuration: the key
is checked only when the server sends email. The site remains browsable and users can fill forms,
but submission fails before a Resend request is made. The surfaced server error contains “Email
service not configured”; deployment/runtime logs may contain the error name but must never be made
to print the value. Because general Cloudflare observability is disabled, reproduce with a
controlled submission and use the native deployment/request diagnostics available to the authorized
operator.

If variables disappeared after deployment, confirm the deployed root/generated Wrangler structure
still carries `keep_vars: true`, then inspect the correct Cloudflare environment. Restore the
encrypted Secret in Cloudflare rather than adding it to tracked `vars` or GitHub Actions. A build
failure before requests are served is not caused by this runtime-only key; inspect the build command,
Worker entry generation, and build output first.

## Resend configuration failure

Symptoms include “Email service not configured,” an HTTP error from the email provider, or a
network error while contact/quote submission fails.

1. Confirm `RESEND_API_KEY` exists as an encrypted Secret in the affected Cloudflare environment;
   do not reveal it.
2. Confirm the existing Resend account/domain permits the source address used by the application
   and that the provider is operational. Do not change sender/recipient configuration during
   diagnosis without approval.
3. If the secret is absent, restore the authorized existing value. Token rotation/replacement is a
   separate credential incident/change, not a default recovery step.
4. Retry/redeploy the native deployment if needed and submit a controlled test using approved
   addresses. Confirm both administrative and customer messages, because the current server path
   sends both.
5. If unresolved, preserve status/error metadata with secrets and message content redacted and
   escalate to the authorized Resend/Cloudflare operators.

## Public form throttling during testing or incidents

Contact and Quote use separate best-effort five-submissions-per-15-minutes buckets within each
Cloudflare Worker isolate. Both buckets are derived only from `CF-Connecting-IP`, with channel
separation applied on the server before the existing isolate-salted hash is calculated.

If one public form rejects repeated valid test submissions while the other still works:

1. Treat rate limiting as a possible cause before changing Resend credentials or form validation.
2. Confirm which flow was exercised: Contact activity should consume only the `contact` bucket and
   residential Quote activity only the `quote` bucket.
3. Do not disable or increase the production throttle merely to complete QA. Allow the 15-minute
   window to reset or use an approved separate test path/IP when operationally appropriate.
4. If Contact activity exhausts Quote capacity, or Quote activity exhausts Contact capacity, treat
   that as a regression in the server-side channel classification and repair it through a reviewed
   PR.
5. Remember that the current buckets are isolate-local, not globally consistent. Do not infer a
   distributed Cloudflare rate-limit guarantee from a successful or failed single-isolate test.

## Supabase configuration failure

No current application source uses Supabase. First prove the symptom originates from an actual
Supabase consumer rather than assuming configured variables imply runtime use.

1. Identify the consuming commit/process and exact variable name.
2. Compare the affected environment's public project URL/identifier and publishable/anonymous
   variable presence with approved configuration, without copying values into an issue.
3. Restore only missing existing public runtime configuration through the authorized environment
   control. Do not substitute a service-role key or change migrations/RLS as incident guesswork.
4. If a future source change introduced the dependency without updating documentation and
   validation, revert that source change through the normal PR path.
5. Database, migration, authorization, or RLS recovery requires its own approved runbook/change;
   this website baseline does not claim those procedures.

## Pre-merge validation

Run from a clean branch using the existing installed dependencies:

```bash
bunx tsc --noEmit
bun run lint
bunx prettier --check .
bun run verify:environment
bun run build
bun run verify:seo
git diff --check
```

If validation fails, do not merge. Reproduce the failing command, correct only the scoped cause,
rerun that check and then the full set. The GitHub workflow is validation only and must not be
changed into a production deploy workaround.
