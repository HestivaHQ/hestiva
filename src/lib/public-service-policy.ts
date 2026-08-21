import { postRenovationService } from "@/content/post-renovation-service";
import { servicePages, type ServicePage } from "@/content/services";

export const CANONICAL_PRIMARY_SERVICE_SLUGS = [
  "regular-home-cleaning",
  "deep-cleaning",
  "move-in-cleaning",
  "move-out-cleaning",
  "kitchen-cleaning",
  "bathroom-sanitisation",
  "bedroom-cleaning",
  "living-area-cleaning",
  "interior-window-cleaning",
  "post-renovation-cleaning",
] as const;

export const RECLASSIFIED_SERVICE_SLUGS = [
  "apartment-cleaning",
  "eco-conscious-cleaning",
] as const;

const reclassifiedServiceSlugs = new Set<string>(RECLASSIFIED_SERVICE_SLUGS);
const canonicalPrimaryServiceSlugs = new Set<string>(CANONICAL_PRIMARY_SERVICE_SLUGS);

export function isReclassifiedServiceSlug(slug: string): boolean {
  return reclassifiedServiceSlugs.has(slug);
}

export function isCanonicalPrimaryServiceSlug(slug: string): boolean {
  return canonicalPrimaryServiceSlugs.has(slug);
}

/**
 * Public service pages that are intentionally indexable and safe to link to.
 *
 * `servicePages` is the historical content registry and contains legacy concepts
 * such as Apartment and Eco-Conscious Cleaning. Public navigation must consume
 * this collection instead of iterating the mixed registry directly.
 */
export const indexablePublicServicePages: ServicePage[] = [
  ...servicePages.filter((service) => !isReclassifiedServiceSlug(service.slug)),
  postRenovationService,
];

/** Canonical primary services only; excludes add-on/explanatory service pages. */
export const canonicalPrimaryServicePages = indexablePublicServicePages.filter((service) =>
  isCanonicalPrimaryServiceSlug(service.slug),
);

/** Legacy/reclassified pages remain resolvable for compatibility but are not indexable. */
export const reclassifiedServicePages = servicePages.filter((service) =>
  isReclassifiedServiceSlug(service.slug),
);

export function getPublicServicePage(slug: string): ServicePage | undefined {
  return indexablePublicServicePages.find((service) => service.slug === slug);
}

export function getResolvableServicePage(slug: string): ServicePage | undefined {
  return (
    getPublicServicePage(slug) ?? reclassifiedServicePages.find((service) => service.slug === slug)
  );
}
