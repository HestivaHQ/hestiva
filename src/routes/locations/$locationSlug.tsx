import { createFileRoute, notFound } from "@tanstack/react-router";
import { LocationPageLayout } from "@/components/LocationPageLayout";
import { getLocationPage, locationPages } from "@/content/locations";

const SITE_URL = "https://hestiva.co.za";

export const Route = createFileRoute("/locations/$locationSlug")({
  loader: ({ params }) => {
    const location = getLocationPage(params.locationSlug);

    if (!location) {
      throw notFound();
    }

    return { location };
  },
  head: ({ loaderData, params }) => {
    const location = loaderData?.location ?? getLocationPage(params.locationSlug);
    const canonical = `${SITE_URL}/locations/${params.locationSlug}`;

    if (!location) {
      return {};
    }

    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Hestiva",
      email: "quotes@hestiva.co.za",
      url: canonical,
      address: {
        "@type": "PostalAddress",
        addressRegion: "Gauteng",
        addressCountry: "ZA",
      },
      areaServed: {
        "@type": "City",
        name: location.name,
        containedInPlace: {
          "@type": "AdministrativeArea",
          name: location.region,
        },
      },
      makesOffer: location.priorityServices.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: `${service} in ${location.name}`,
          areaServed: location.name,
        },
      })),
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: location.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
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
          name: "Areas",
          item: `${SITE_URL}/locations`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: `Residential Cleaning in ${location.name}`,
          item: canonical,
        },
      ],
    };

    return {
      meta: [
        { title: location.metaTitle },
        { name: "description", content: location.metaDescription },
        { property: "og:title", content: location.metaTitle },
        { property: "og:description", content: location.metaDescription },
        { property: "og:type", content: "website" },
        { property: "og:url", content: canonical },
        { name: "twitter:title", content: location.metaTitle },
        { name: "twitter:description", content: location.metaDescription },
      ],
      links: [{ rel: "canonical", href: canonical }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(localBusinessSchema),
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
  component: LocationRoute,
});

function LocationRoute() {
  const { location } = Route.useLoaderData();
  return <LocationPageLayout location={location} />;
}

export function getStaticLocationPaths() {
  return locationPages.map((location) => `/locations/${location.slug}`);
}
