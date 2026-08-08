import { createFileRoute } from "@tanstack/react-router";
import { ServicePageLayout } from "@/components/ServicePageLayout";
import { getServicePage } from "@/content/services";
import { serviceBreadcrumbs } from "@/lib/breadcrumbs";
import { createSeoHead } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";
import {
  createBreadcrumbList,
  createPageGraph,
  createServiceSchema,
  schemaScripts,
} from "@/lib/structured-data";

const apartmentCleaning = (() => {
  const service = getServicePage("apartment-cleaning");
  if (!service) throw new Error("Canonical Apartment Cleaning service content is missing");
  return service;
})();

const breadcrumbs = serviceBreadcrumbs("Apartment Cleaning", "/services/apartment-cleaning");

export const Route = createFileRoute("/services/apartment-cleaning")({
  component: ApartmentCleaningPage,
  head: () => {
    const title = `Apartment Cleaning | ${SITE_NAME}`;
    const description =
      "Detail-led apartment cleaning for studios and multi-bedroom homes, tailored to your space and routine.";
    const path = "/services/apartment-cleaning";
    return {
      ...createSeoHead({ title, description, path }),
      scripts: schemaScripts(
        createPageGraph(path, title, description),
        createServiceSchema(path, "Apartment Cleaning", description),
        createBreadcrumbList(breadcrumbs),
      ),
    };
  },
});

function ApartmentCleaningPage() {
  return <ServicePageLayout service={apartmentCleaning} />;
}
