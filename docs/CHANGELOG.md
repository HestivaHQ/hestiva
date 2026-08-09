# Technical changelog

This is a forward-looking technical changelog. It begins with the documentation baseline and does
not infer or recreate undocumented historical releases.

## 2026-08-09

### Documentation

- Hardened public contact/quote submissions with strict bounded server validation, same-origin
  checks, server-generated references, a supplemental honeypot, an isolate-scoped throttle, a
  ten-second provider timeout, sanitized failures, privacy-safe logs, and focused tests. Recorded
  the Durable Object and Turnstile prerequisites without adding infrastructure or keys.

- Recorded the verified `undici@7.28.0` Nitro tooling exposure, exhausted upstream remediation
  routes, operational constraints, non-blocking deployment decision, and temporary accepted-risk
  disposition without describing the vulnerability as resolved.
- Added a daily read-only upstream remediation watch that reports clean current-Nitro and newer
  Nitro 3 paths from authoritative npm metadata; future remediation remains a separate reviewed PR
  requiring a post-change OSV scan.

- Recorded the operationally verified Cloudflare clean-checkout production sequence:
  `bun install`, the required `bun run build`, and `npx wrangler deploy`.
- Documented that omitting the Build command caused Wrangler to fail on the missing
  `dist/server/server.js` entry point, and that configuring `bun run build` resolved the deployment.
- Captured Bun 1.2.15 and Node.js 24.18.0 as the versions shown by the verified Cloudflare build
  environment.
- Established the canonical engineering-document index.
- Documented the implemented application architecture and the boundary between the current quote
  email flow and any future production quotation system.
- Recorded the verified Cloudflare native Git production deployment path and settings, including
  its sole-authority decision and the root/generated Wrangler relationship.
- Added a names-only environment inventory and handling rules for the server-only Resend secret and
  configured public Supabase variables.
- Added an operational recovery guide and lightweight technical work log.

No application behavior, infrastructure, runtime configuration, dependencies, or secrets changed.
