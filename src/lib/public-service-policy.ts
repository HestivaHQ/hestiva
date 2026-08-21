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

export function isReclassifiedServiceSlug(slug: string): boolean {
  return (RECLASSIFIED_SERVICE_SLUGS as readonly string[]).includes(slug);
}
