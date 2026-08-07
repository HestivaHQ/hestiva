import { createFileRoute, notFound } from "@tanstack/react-router";
import { ServicePageLayout } from "@/components/ServicePageLayout";
import { getServicePage, servicePages } from "@/content/services";
import { createSeoHead } from "@/lib/seo";
import {
  createBreadcrumbList,
  createFaqPage,
  createPageGraph,
  createServiceSchema,
  schemaScripts,
} from "@/lib/structured-data";

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
        createBreadcrumbList([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.title, path },
        ]),
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
  return servicePages.map((service) => `/services/${service.slug}`);
}
