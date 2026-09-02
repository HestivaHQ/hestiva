import { locationPages } from "@/content/locations";
import { indexablePublicServicePages } from "@/lib/public-service-policy";

export const routeClassifications = [
  "INDEXABLE",
  "NOINDEX_FOLLOW",
  "NOINDEX_NOFOLLOW",
  "NON_HTML_TECHNICAL",
  "NOT_FOUND_OR_INVALID",
] as const;

export type RouteClassification = (typeof routeClassifications)[number];

export const staticIndexablePaths = [
  "/",
  "/about",
  "/services",
  "/locations",
  "/faq",
  "/contact",
  "/quote",
  "/data-deletion",
  "/privacy",
  "/terms",
] as const;

export const dynamicIndexablePaths = [
  ...indexablePublicServicePages.map(({ slug }) => `/services/${slug}` as const),
  ...locationPages.map(({ slug }) => `/locations/${slug}` as const),
];

/** The authoritative set of HTML pages that search engines may index. */
export const indexablePaths = [...staticIndexablePaths, ...dynamicIndexablePaths];

/** Crawlable resources which are deliberately not HTML search results. */
export const technicalPaths = ["/robots.txt", "/sitemap.xml"] as const;
