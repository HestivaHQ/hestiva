# Services quote CTA routing

Status: IMPLEMENTED

Both customer-facing **Request a Quote** calls to action on the Services overview now route directly to `/quote` through TanStack Router.

The previous `/#contact` targets were stale and no longer matched the current quotation journey. This change affects navigation only; service content, pricing, booking rules, quote processing, and HestivaOS integration are unchanged.
