import { createFileRoute, notFound } from "@tanstack/react-router";
import { ServicePageLayout } from "@/components/ServicePageLayout";
import { getServicePage, servicePages } from "@/content/services";
import { createSeoHead } from "@/lib/seo";
import { serviceBreadcrumbs } from "@/lib/breadcrumbs";
import {
  createBreadcrumbList,
  createFaqPage,
  createPageGraph,
  createServiceSchema,
  schemaScripts,
} from "@/lib/structured-data";

const RETIRED_STANDALONE_SERVICE_SLUGS = new Set(["laundry-folding"]);

function getPublicServicePage(slug: string) {
  if (RETIRED_STANDALONE_SERVICE_SLUGS.has(slug)) return undefined;
  return getServicePage(slug);
}

export const Route = createFileRoute("/services/$serviceSlug")({
  loader: ({ params }) => {
    const service = getPublicServicePage(params.serviceSlug);

    if (!service) {
      throw notFound();
    }

    return { service };
  },
  head: ({ loaderData, params }) => {
    const service = loaderData?.service ?? getPublicServicePage(params.serviceSlug);

    if (!service) {
      return {};
    }

    const path = `/services/${service.slug}`;
    const seo = createSeoHead({
      title: service.metaTitle,
      description: service.metaDescription,
      path,
    });

    return {
      ...seo,
      scripts: schemaScripts(
        createPageGraph(path, service.metaTitle, service.metaDescription),
        createServiceSchema(path, service.title, service.metaDescription),
        createFaqPage(service.faqs),
        createBreadcrumbList(serviceBreadcrumbs(service.title, path)),
      ),
    };
  },
  component: ServiceRoute,
});

function ServiceRoute() {
  const { service } = Route.useLoaderData();
  return <ServicePageLayout service={service} />;
}

export function getStaticServicePaths() {
  return servicePages
    .filter((service) => !RETIRED_STANDALONE_SERVICE_SLUGS.has(service.slug))
    .map((service) => `/services/${service.slug}`);
}
