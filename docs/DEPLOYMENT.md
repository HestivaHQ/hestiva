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
| Worker                       | `hestiva`                      |
| Deploy command               | `npx wrangler deploy`          |
| Version command              | `npx wrangler versions upload` |
| Build command                | None                           |
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
`main` (and has a legacy push trigger for one named branch). It contains no deployment step and is
not a production path.

## Wrangler configuration relationship

### Tracked input

The root `wrangler.jsonc` is the tracked source configuration inspected by the Vite/TanStack/Nitro
Cloudflare build. It supplies the Worker name, compatibility settings, `keep_vars`, configured
public variables, and tracked `main`/assets inputs.

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

### Production-build uncertainty

The verified Cloudflare integration has no separate build command and invokes `npx wrangler deploy`.
Repository evidence proves the generated relationship when `bun run build` is run locally, but does
not prove, by itself, precisely how Cloudflare's native integration creates or selects generated
output in a clean production checkout. Do not guess or “fix” either Wrangler file to remove that
operational uncertainty. Before any future deployment-pipeline change, capture a Cloudflare native
deployment log and confirm the build/config discovery sequence.

## Operator guardrails

- Do not run a manual local production deploy as a routine release path.
- Do not commit `.output/`, `.wrangler/`, dashboard values, tokens, or secrets.
- Validate a PR before merging; then monitor the authoritative Cloudflare deployment in its
  dashboard.
- `npx wrangler versions upload` is the verified version command, not a replacement production
  release pipeline.
- Recovery actions are in [`RECOVERY_GUIDE.md`](RECOVERY_GUIDE.md).
