# Technical work log

This lightweight log records verified engineering work without reconstructing undocumented
history. Add newest entries first. Link a pull request/commit when available and describe validation
without including secrets or customer data.

## 2026-08-09 — Accepted temporary Undici tooling risk and added upstream watch

**Purpose:** Record the verified, non-runtime Undici exposure while upstream remediation is blocked,
and detect a clean remediation without changing dependencies automatically.

**Work recorded:**

- recorded the five OSV advisories affecting the Nitro tooling path and the fixed Undici floor;
- recorded that browser, deployed Worker, and emitted Nitro request-runtime output inspection found
  no affected Undici instance;
- documented that compatible Miniflare 4, `env-runner`, and Nitro 3 remediation routes were
  exhausted and accepted **TEMPORARY ACCEPTED TOOLING RISK PENDING UPSTREAM FIX**;
- added a daily, read-only npm registry metadata watch for a current-Nitro or newer-Nitro-3 clean
  path, with a 14-day JSON report artifact and an Actions job summary; and
- required any future dependency change to use a separate reviewed PR and a post-change OSV scan.

**Scope:** No override or dependency change was introduced. No application source, production
configuration, secrets, deployment workflow, or deployment authority changed. The vulnerability is
not resolved.

## 2026-08-09 — Verified Cloudflare production build configuration

**Purpose:** Replace the unresolved clean-checkout build assumption with the operationally verified
Cloudflare production sequence.

**Work recorded:**

- confirmed that the native Git integration for `HestivaHQ/hestiva` installs dependencies with
  `bun install` from the repository root (`/`) on the `main` production branch;
- recorded the required Build command as `bun run build`, followed by the existing deploy command
  `npx wrangler deploy` and version command `npx wrangler versions upload`;
- documented the failed deployment without the Build command, where Wrangler could not find
  `dist/server/server.js` and Cloudflare reported that the framework build needed to generate the
  entry point;
- recorded that manually configuring `bun run build` resolved the failure, the deployment completed
  successfully, and the production website remained operational; and
- captured the verified build-environment versions: Bun 1.2.15 and Node.js 24.18.0.

**Scope:** Documentation only. No application source, behavior, dependencies, Cloudflare
configuration, credentials, secrets, or production deployment mechanism changed.

## 2026-08-09 — Architecture, deployment, and environment baseline

**Purpose:** Establish canonical operational documentation before production quotation-system
development.

**Work recorded:**

- documented the current TanStack Start/React/TypeScript SSR application and Cloudflare Worker
  boundary;
- inventoried active and configured environment-variable names without adding values;
- recorded Cloudflare native Git integration as the sole production deployment authority and
  captured the supplied verified dashboard settings;
- built the repository to verify that Nitro derives ignored `.output/server/wrangler.json` and
  `.wrangler/deploy/config.json` from the tracked root configuration, while overriding generated
  entry-point/asset fields;
- established recovery guidance and a forward-only technical changelog; and
- explicitly separated the current email-based quote flow from future quotation-system
  architecture.

**Scope:** Documentation only. No application source, behavior, production configuration,
dependencies, credentials, database objects, or deployment pipeline changed.
