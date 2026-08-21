import { createFileRoute } from "@tanstack/react-router";
import { ServicePageLayout } from "@/components/ServicePageLayout";
import { getServicePage } from "@/content/services";
import { serviceBreadcrumbs } from "@/lib/breadcrumbs";
import { createSeoHead } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";
import {
  createBreadcrumbList,
  createPageGraph,
  schemaScripts,
} from "@/lib/structured-data";

const apartmentCleaning = (() => {
  const service = getServicePage("apartment-cleaning");
  if (!service) throw new Error("Apartment cleaning context content is missing");
  return service;
})();

const breadcrumbs = serviceBreadcrumbs("Apartment Cleaning", "/services/apartment-cleaning");

export const Route = createFileRoute("/services/apartment-cleaning")({
  component: ApartmentCleaningPage,
  head: () => {
    const title = `Apartment Cleaning Options | ${SITE_NAME}`;
    const description =
      "Apartment is treated as property context when requesting Homent cleaning. Choose the cleaning service you need and identify the property as an apartment during quoting.";
    const path = "/services/apartment-cleaning";
    return {
      ...createSeoHead({
        title,
        description,
        path,
        robots: { index: false, follow: true },
      }),
      scripts: schemaScripts(
        createPageGraph(path, title, description),
        createBreadcrumbList(breadcrumbs),
      ),
    };
  },
});

function ApartmentCleaningPage() {
  return <ServicePageLayout service={apartmentCleaning} />;
}
