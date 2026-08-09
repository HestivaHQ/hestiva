# Deployment baseline

## Authority

**Cloudflare native Git integration is the sole authoritative production deployment mechanism for
the Hestiva website.** GitHub Actions may validate changes but are CI/validation only. They must not
deploy production unless a future, explicitly approved architecture decision replaces this policy.

Do not add a second production deployment pipeline.

## Verified production path

```text
HestivaHQ/hestiva on GitHub
  -> merge/push to main
  -> Cloudflare native Git integration
  -> bun install
  -> bun run build
  -> npx wrangler deploy
  -> Cloudflare Worker: hestiva
  -> hestiva.co.za (custom production domain)
```

The production branch is `main`. Production changes should arrive through reviewed pull requests;
merging to `main` triggers the authoritative integration. The Cloudflare dashboard, rather than a
GitHub Actions workflow, owns production deployment.

## Verified Cloudflare settings

| Setting                      | Verified value                 |
| ---------------------------- | ------------------------------ |
| Repository                   | `HestivaHQ/hestiva`            |
| Production branch            | `main`                         |
| Dependency install command   | `bun install`                  |
| Worker                       | `hestiva`                      |
| Deploy command               | `npx wrangler deploy`          |
| Version command              | `npx wrangler versions upload` |
| Build command                | `bun run build`                |
| Verified build environment   | Bun 1.2.15; Node.js 24.18.0    |
| Root directory               | `/`                            |
| Non-production branch builds | Enabled                        |
| Build watch paths            | `*`                            |
| Deploy hooks                 | None                           |
| Build cache                  | Disabled                       |
| Runtime placement            | Default                        |
| Compatibility date           | `2025-09-24`                   |
| Compatibility flags          | `nodejs_compat`                |
| Runtime cache                | Disabled                       |
| Static asset binding         | `ASSETS`                       |
| Production domain            | `hestiva.co.za`                |
| Logs / Traces                | Disabled / disabled            |
| Exports / Sampling           | Disabled / disabled            |

Production runtime configuration also contains `RESEND_API_KEY` as an encrypted Secret and
Supabase public/anonymous configuration as runtime variables. Never print or copy dashboard values
into logs or documentation.

The Cloudflare API token has a legacy Maintenance Marshall name. Its name does not change its role;
do not rename, rotate, replace, or delete it as part of documentation work.

## Preview and non-production branches

Cloudflare non-production branch builds are enabled and all paths are watched. A pushed branch can
therefore cause Cloudflare's native integration to build/deploy its non-production result according
to Cloudflare's branch environment behavior. A branch build is not production authority and must
not be described as production. Confirm the branch deployment outcome in Cloudflare before using
it for acceptance testing; the repository does not define a stable preview hostname.

The existing `.github/workflows/hestiva-pr-check.yml` runs validation for pull requests targeting
`main` (and has a legacy push trigger for one named branch). In addition to the existing type,
targeted lint/format, build, and runtime SEO checks, it enforces the Bun lockfile, checks the PR diff
for whitespace errors, scans tracked files for likely private credentials without logging their
values, and validates the generated Worker with Wrangler's non-deploying `--dry-run`. The known
browser-safe Supabase anonymous/publishable variables are explicitly permitted by the secret scan.
The workflow contains no deployment step and is not a production path.

The PR gate also runs `bun run verify:environment`. This is a repository architecture check, not a
runtime credential probe: GitHub receives no production secret. `RESEND_API_KEY` is needed only
when the deployed Worker handles an email submission, so its absence must not block `bun run build`.

## Wrangler configuration relationship

### Tracked input

The root `wrangler.jsonc` is the tracked source configuration inspected by the Vite/TanStack/Nitro
Cloudflare build. It supplies the Worker name, compatibility settings, `keep_vars`, configured
public variables, and tracked `main`/assets inputs.

`keep_vars: true` is intentional: a Wrangler deployment preserves dashboard-managed variables that
are not declared by the tracked configuration, including the encrypted `RESEND_API_KEY` Secret.
The tracked `vars` remain authoritative for the public Supabase values they declare and can overwrite
same-named dashboard variables. Do not add the Resend secret to `vars`, disable `keep_vars`, or infer
from a successful build that the runtime secret exists.

### Generated deployment configuration

Running `bun run build` proves the following local relationship:

1. Vite/TanStack Start builds Cloudflare-module output under ignored `.output/`.
2. Nitro reads the root settings and generates `.output/server/wrangler.json`.
3. During generation Nitro explicitly reports that the root `main` and `assets` fields are
   overridden and ignored for generated output.
4. The generated file changes `main` to `index.mjs`, points static assets to `../public`, declares
   the `ASSETS` binding, and adds generated module rules.
5. It also generates ignored `.wrangler/deploy/config.json`, whose `configPath` selects
   `.output/server/wrangler.json`. Consequently, a subsequent local Wrangler deploy in that built
   workspace resolves the generated configuration.

Both generated locations are gitignored build artifacts and must not be edited or committed. The
root file remains the human-maintained configuration input; after a repository build, the generated
file is the immediate Wrangler deployment configuration for that output.

### Verified clean-checkout build sequence

Cloudflare's native Git integration performs the production sequence from the repository root (`/`):

1. Install dependencies with `bun install`.
2. Generate the framework build output with the required Build command, `bun run build`.
3. Deploy the generated Worker with `npx wrangler deploy`.

This sequence was operationally verified in Cloudflare's build environment with Bun 1.2.15 and
Node.js 24.18.0. A deployment attempted without a Build command failed because Wrangler could not
find `dist/server/server.js`; Cloudflare reported that the framework build needed to generate the
entry point. After the Build command was manually set to `bun run build`, the Cloudflare deployment
completed successfully and the production website remained operational.

The Build command is therefore required. This verified result resolves the earlier uncertainty
about how a clean production checkout generates the entry point before Wrangler deploys it; it does
not change Cloudflare native Git integration's authority or justify editing tracked or generated
Wrangler configuration.

## Operator guardrails

- Do not run a manual local production deploy as a routine release path.
- Do not commit `.output/`, `.wrangler/`, dashboard values, tokens, or secrets.
- Validate a PR before merging; then monitor the authoritative Cloudflare deployment in its
  dashboard.
- `npx wrangler versions upload` is the verified version command, not a replacement production
  release pipeline.
- Recovery actions are in [`RECOVERY_GUIDE.md`](RECOVERY_GUIDE.md).
