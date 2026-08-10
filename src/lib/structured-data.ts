import { BRAND_ASSETS, SITE_NAME, SITE_URL, siteConfig } from "@/lib/site";
import { canonicalUrl } from "@/lib/seo";
import type { BreadcrumbItem } from "@/lib/breadcrumbs";

export const SCHEMA_CONTEXT = "https://schema.org" as const;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const BUSINESS_ID = `${SITE_URL}/#business`;
const HOMEPAGE_TITLE = `Home Cleaning Johannesburg & Midrand | ${SITE_NAME}`;

type JsonLd = Record<string, unknown>;
type Faq = { question: string; answer: string };

export function schemaScripts(...schemas: JsonLd[]) {
  return schemas.map((schema) => ({
    type: "application/ld+json",
    children: JSON.stringify(schema),
  }));
}

export function createHomepageGraph(description: string): JsonLd {
  return {
    "@context": SCHEMA_CONTEXT,
    "@graph": [
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: SITE_NAME,
        url: canonicalUrl("/"),
        publisher: { "@id": BUSINESS_ID },
      },
      {
        "@type": "HomeAndConstructionBusiness",
        "@id": BUSINESS_ID,
        name: SITE_NAME,
        url: canonicalUrl("/"),
        logo: canonicalUrl(BRAND_ASSETS.logoPrimary),
        image: canonicalUrl(BRAND_ASSETS.socialImage),
        description,
        ...(siteConfig.business.email ? { email: siteConfig.business.email } : {}),
        ...(siteConfig.business.phone ? { telephone: siteConfig.business.phone } : {}),
        ...(siteConfig.business.address ? { address: siteConfig.business.address } : {}),
        areaServed: siteConfig.business.serviceAreas.map((name) => ({
          "@type": "Place",
          name,
        })),
      },
      createWebPage("/", HOMEPAGE_TITLE, description),
    ],
  };
}

export function createWebPage(path: string, name: string, description: string): JsonLd {
  const url = canonicalUrl(path);
  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    name,
    description,
    url,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": BUSINESS_ID },
  };
}

export function createBreadcrumbList(items: BreadcrumbItem[]): JsonLd {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: items.map(({ label, path }, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: label,
      item: canonicalUrl(path),
    })),
  };
}

export function createFaqPage(faqs: Faq[]): JsonLd {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "FAQPage",
    mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}

export function createPageGraph(path: string, name: string, description: string): JsonLd {
  return { "@context": SCHEMA_CONTEXT, ...createWebPage(path, name, description) };
}

export function createServiceSchema(path: string, name: string, description: string): JsonLd {
  const url = canonicalUrl(path);
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "Service",
    "@id": `${url}#service`,
    name,
    serviceType: name,
    description,
    url,
    provider: { "@id": BUSINESS_ID },
  };
}
