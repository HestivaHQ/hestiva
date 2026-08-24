# Homent Website

Public website for **Homent**, a residential cleaning business serving Johannesburg and Midrand, South Africa.

## Production website

https://www.homent.co.za

## Canonical primary services

- Regular Home Cleaning
- Deep Cleaning
- Move-In Cleaning
- Move-Out Cleaning
- Kitchen Cleaning
- Bathroom Sanitisation
- Bedroom Cleaning
- Living Area Cleaning
- Interior Window Cleaning
- Post-Renovation Cleaning
- Post-Event Cleaning

Apartment is captured as property context rather than a separate primary service. Eco-conscious products are captured as a customer preference. Laundry & Ironing and other approved tasks are add-ons rather than standalone primary bookings.

## Quote and enquiry architecture

The website owns the customer-facing forms and Website Quote Contract mapping. **HestivaOS** is the authoritative operational system for accepted website quote/enquiry intake, quote identity, pricing/workload rules and downstream operations. The website must not duplicate HestivaOS pricing authority.

## Technology

- TanStack Start
- React
- TypeScript
- Vite
- Cloudflare Workers
- Resend
- HestivaOS private integration boundary

## Development

```bash
bun install
bun run dev
```

## Production build

```bash
bun run build
```

Production deployment is handled through the repository's connected Cloudflare Worker/Git integration. See `docs/DEPLOYMENT.md` for the verified deployment model rather than treating this README as an operations runbook.

## Documentation

Engineering documentation lives under `docs/`. Start with:

- `AGENTS.md` — repository-wide engineering and documentation rules.
- `docs/README.md` — canonical documentation map.
- `docs/HOMENT_PUBLIC_CUTOVER.md` — current public identity and legacy Hestiva boundary.
- `docs/ARCHITECTURE.md` — current application/runtime architecture.
- `docs/ENVIRONMENT.md` — environment-variable inventory and handling rules.
- `docs/DEPLOYMENT.md` — production deployment authority and procedures.
- `docs/TECHNICAL_WORK_LOG.md` and `docs/CHANGELOG.md` — verified implementation history.

Historical documents may still use **Hestiva** when describing pre-cutover state. Internal identifiers may also retain Hestiva where technically accurate, especially the HestivaOS integration boundary. Customer-facing website identity is Homent.

## Environment variables and secrets

Variable names and handling requirements are documented in `docs/ENVIRONMENT.md`. Secret values must never be committed to the repository.
