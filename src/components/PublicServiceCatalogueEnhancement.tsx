/**
 * Retained temporarily as a no-op because the root route still imports this component.
 *
 * Public service catalogue reconciliation is now server-rendered by `/services`
 * from `indexablePublicServicePages`; client-side DOM mutation must not alter it.
 */
export function PublicServiceCatalogueEnhancement() {
  return null;
}
