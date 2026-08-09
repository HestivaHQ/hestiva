# Technical changelog

This is a forward-looking technical changelog. It begins with the documentation baseline and does
not infer or recreate undocumented historical releases.

## 2026-08-09

### Documentation

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
