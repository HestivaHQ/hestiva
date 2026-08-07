import { createFileRoute, notFound } from "@tanstack/react-router";
import { LocationPageLayout } from "@/components/LocationPageLayout";
import { getLocationPage, locationPages } from "@/content/locations";
import { createSeoHead } from "@/lib/seo";
import { locationBreadcrumbs } from "@/lib/breadcrumbs";
import {
  createBreadcrumbList,
  createFaqPage,
  createPageGraph,
  schemaScripts,
} from "@/lib/structured-data";

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
    const seo = createSeoHead({
      title: location.metaTitle,
      description: location.metaDescription,
      path,
    });

    return {
      ...seo,
      scripts: schemaScripts(
        createPageGraph(path, location.metaTitle, location.metaDescription),
        createFaqPage(location.faqs),
        createBreadcrumbList(locationBreadcrumbs(location.name, path)),
      ),
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
