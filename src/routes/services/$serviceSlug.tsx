import { createFileRoute, notFound } from "@tanstack/react-router";
import { ServicePageLayout } from "@/components/ServicePageLayout";
import { postRenovationService } from "@/content/post-renovation-service";
import { getServicePage, servicePages } from "@/content/services";
import { createSeoHead } from "@/lib/seo";
import { serviceBreadcrumbs } from "@/lib/breadcrumbs";
import { isReclassifiedServiceSlug } from "@/lib/public-service-policy";
import {
  createBreadcrumbList,
  createFaqPage,
  createPageGraph,
  createServiceSchema,
  schemaScripts,
} from "@/lib/structured-data";

function getPublicServicePage(slug: string) {
  return slug === postRenovationService.slug ? postRenovationService : getServicePage(slug);
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
    const reclassified = isReclassifiedServiceSlug(service.slug);
    const seo = createSeoHead({
      title: service.metaTitle,
      description: service.metaDescription,
      path,
      robots: reclassified ? { index: false, follow: true } : undefined,
    });

    return {
      ...seo,
      scripts: reclassified
        ? schemaScripts(
            createPageGraph(path, service.metaTitle, service.metaDescription),
            createBreadcrumbList(serviceBreadcrumbs(service.title, path)),
          )
        : schemaScripts(
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
  return [
    ...servicePages.map((service) => `/services/${service.slug}`),
    `/services/${postRenovationService.slug}`,
  ];
}
