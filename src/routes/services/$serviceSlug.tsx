import { createFileRoute, notFound } from "@tanstack/react-router";
import { ServicePageLayout } from "@/components/ServicePageLayout";
import { getServicePage, servicePages } from "@/content/services";

const SITE_URL = "https://hestiva.co.za";

export const Route = createFileRoute("/services/$serviceSlug")({
  loader: ({ params }) => {
    const service = getServicePage(params.serviceSlug);

    if (!service) {
      throw notFound();
    }

    return { service };
  },
  head: ({ loaderData, params }) => {
    const service = loaderData?.service ?? getServicePage(params.serviceSlug);
    const canonical = `${SITE_URL}/services/${params.serviceSlug}`;

    if (!service) {
      return {};
    }

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: service.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    };

    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.title,
      description: service.metaDescription,
      url: canonical,
      provider: {
        "@type": "LocalBusiness",
        name: "Hestiva",
        email: "quotes@hestiva.co.za",
        url: SITE_URL,
        address: {
          "@type": "PostalAddress",
          addressRegion: "Gauteng",
          addressCountry: "ZA",
        },
      },
      areaServed: {
        "@type": "AdministrativeArea",
        name: "Gauteng",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: `${service.title} services`,
        itemListElement: service.services.map((item) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: item,
          },
        })),
      },
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Services",
          item: `${SITE_URL}/services`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: service.title,
          item: canonical,
        },
      ],
    };

    return {
      meta: [
        { title: service.metaTitle },
        { name: "description", content: service.metaDescription },
        { property: "og:title", content: service.metaTitle },
        { property: "og:description", content: service.metaDescription },
        { property: "og:type", content: "website" },
        { property: "og:url", content: canonical },
        { name: "twitter:title", content: service.metaTitle },
        { name: "twitter:description", content: service.metaDescription },
      ],
      links: [{ rel: "canonical", href: canonical }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(serviceSchema),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(faqSchema),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(breadcrumbSchema),
        },
      ],
    };
  },
  component: ServiceRoute,
});

function ServiceRoute() {
  const { service } = Route.useLoaderData();
  return <ServicePageLayout service={service} />;
}

export function getStaticServicePaths() {
  return servicePages.map((service) => `/services/${service.slug}`);
}
