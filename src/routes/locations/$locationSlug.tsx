import { createFileRoute, notFound } from "@tanstack/react-router";
import { LocationPageLayout } from "@/components/LocationPageLayout";
import { getLocationPage, locationPages } from "@/content/locations";
import { canonicalUrl, createSeoHead } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

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

    if (!location) {
      return {};
    }

    const path = `/locations/${location.slug}`;
    const canonical = canonicalUrl(path);
    const seo = createSeoHead({
      title: location.metaTitle,
      description: location.metaDescription,
      path,
    });

    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: SITE_NAME,
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
          item: canonicalUrl("/"),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Areas",
          item: canonicalUrl("/locations"),
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
      ...seo,
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
