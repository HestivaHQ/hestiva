import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { createSeoHead } from "@/lib/seo";
import { serviceBreadcrumbs } from "@/lib/breadcrumbs";
import { SITE_NAME } from "@/lib/site";
import { createBreadcrumbList, createPageGraph, createServiceSchema, schemaScripts } from "@/lib/structured-data";

const path = "/services/post-renovation-cleaning";
const title = `Post-Renovation Cleaning Johannesburg & Midrand | ${SITE_NAME}`;
const description =
  "Assessment-led post-renovation residential cleaning in Johannesburg and Midrand. Scope and pricing are confirmed after reviewing the property and renovation residue.";
const breadcrumbs = serviceBreadcrumbs("Post-Renovation Cleaning", path);

export const Route = createFileRoute("/services/post-renovation-cleaning")({
  component: PostRenovationCleaningPage,
  head: () => ({
    ...createSeoHead({ title, description, path }),
    scripts: schemaScripts(
      createPageGraph(path, title, description),
      createServiceSchema(path, "Post-Renovation Cleaning", description),
      createBreadcrumbList(breadcrumbs),
    ),
  }),
});

function PostRenovationCleaningPage() {
  return (
    <div className="min-h-screen bg-[#FBF7EF] text-[#322B2A]">
      <Navbar />
      <main className="px-6 pb-24 pt-36 md:pt-44">
        <div className="mx-auto max-w-5xl">
          <Breadcrumbs items={breadcrumbs} className="mb-10 text-[#695E59]" />
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9A742E]">Residential Cleaning Service</p>
          <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-[-0.03em] text-[#5A1425] md:text-7xl">Post-Renovation Cleaning</h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-[#695E59]">
            A detailed residential clean after renovation work, planned around the actual condition of the property and the residue left by the completed work.
          </p>

          <section className="mt-14 grid gap-8 rounded-2xl border border-[#E6D9C8] bg-white p-8 shadow-[0_18px_50px_rgba(70,42,33,0.06)] md:p-12">
            <div>
              <h2 className="text-3xl font-semibold text-[#5A1425]">Assessment and quotation required</h2>
              <p className="mt-4 leading-7 text-[#695E59]">
                Post-renovation cleaning remains a primary Homent service, but it is not automatically priced by area. We review the property, completed renovation work, dust and residue, access and requested scope before confirming the quotation.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-[#5A1425]">Typical scope considerations</h2>
              <ul className="mt-5 grid gap-3 text-[#514946] sm:grid-cols-2">
                <li>Fine dust on reachable surfaces and fittings</li>
                <li>Floors and suitable hard surfaces</li>
                <li>Kitchen and bathroom surfaces</li>
                <li>Reachable interior glass where agreed</li>
                <li>Property size and affected rooms</li>
                <li>Residue requiring assessment before work begins</li>
              </ul>
            </div>
            <p className="leading-7 text-[#695E59]">
              Specialist construction, hazardous-material, high-access or exterior work is not implied by this service and must not be assumed to be included in a residential cleaning quotation.
            </p>
            <Link to="/quote" className="inline-flex min-h-12 w-fit items-center justify-center rounded-md bg-[#5A1425] px-7 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#711C31] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B]">
              Request an assessment quote
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
