import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { AddOnCarousel } from "@/components/AddOnCarousel";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ServiceImage } from "@/components/ServiceImage";
import { serviceBreadcrumbs } from "@/lib/breadcrumbs";
import { canonicalPrimaryServicePages } from "@/lib/public-service-policy";
import { createSeoHead } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";
import {
  createBreadcrumbList,
  createPageGraph,
  schemaScripts,
} from "@/lib/structured-data";

const visualServicePages = canonicalPrimaryServicePages.filter((service) => service.image);
const breadcrumbs = serviceBreadcrumbs();

export const Route = createFileRoute("/services")({
  component: ServicesRoute,
  head: ({ match, matches }) => {
    if (matches[matches.length - 1]?.routeId !== match.routeId) return {};

    const title = `Residential Cleaning Services | ${SITE_NAME}`;
    const description =
      "Explore thoughtful home cleaning services tailored to your space, schedule and everyday routine.";

    return {
      ...createSeoHead({
        title,
        description,
        path: "/services",
      }),
      scripts: schemaScripts(
        createPageGraph("/services", title, description),
        createBreadcrumbList(breadcrumbs),
      ),
    };
  },
});

function ServicesRoute() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return pathname === "/services" || pathname === "/services/" ? (
    <ServicesOverview />
  ) : (
    <Outlet />
  );
}

function ServicesOverview() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FBF7EF] text-[#322B2A]">
      <Navbar />

      <main>
        <section className="relative overflow-hidden border-b border-[#C9A45B]/25 bg-[#F7F0E3] px-6 pb-24 pt-36 md:pb-32 md:pt-44">
          <div
            aria-hidden="true"
            className="absolute -right-28 top-20 h-96 w-96 rounded-full border border-[#C9A45B]/25"
          />
          <div
            aria-hidden="true"
            className="absolute -right-12 top-36 h-64 w-64 rounded-full border border-[#C9A45B]/20"
          />

          <div className="relative mx-auto max-w-7xl">
            <Breadcrumbs
              items={breadcrumbs}
              className="mb-12 text-[#695E59]"
              linkClassName="rounded-sm transition-colors hover:text-[#5A1425] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B]"
              separatorClassName="text-[#C9A45B]"
            />

            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-[#9A742E]">
              Residential Cleaning Services
            </p>

            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.08] tracking-[-0.03em] text-[#5A1425] sm:text-6xl md:text-7xl">
              Cleaning tailored to your home.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#695E59] md:text-xl">
              Whether you need dependable weekly cleaning or a one-time deep refresh, Homent offers
              thoughtful residential cleaning designed around your home and your routine.
            </p>

            <Link
              to="/quote"
              className="mt-10 inline-flex min-h-12 items-center justify-center rounded-md bg-[#5A1425] px-7 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-[0_12px_30px_rgba(90,20,37,0.16)] transition hover:-translate-y-0.5 hover:bg-[#711C31] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F7F0E3]"
            >
              Request a Quote
            </Link>
          </div>
        </section>

        <section aria-labelledby="services-heading" className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-16 max-w-2xl text-center md:mb-24">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9A742E]">
                Care for every room
              </p>

              <h2
                id="services-heading"
                className="mt-4 text-3xl font-semibold tracking-tight text-[#5A1425] md:text-5xl"
              >
                A considered clean, down to the details.
              </h2>
            </div>

            <div className="space-y-16 md:space-y-24">
              {visualServicePages.map((service, index) => {
                if (!service.image) return null;
                const imageFirst = index % 2 === 0;

                return (
                  <article
                    key={service.slug}
                    className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-14"
                  >
                    <ServiceImage
                      image={service.image}
                      className={`block aspect-[3/2] min-h-72 overflow-hidden rounded-2xl border border-[#C9A45B]/30 bg-[#EFE4D2] shadow-[0_18px_50px_rgba(70,42,33,0.08)] lg:min-h-[31rem] ${
                        imageFirst ? "lg:order-1" : "lg:order-2"
                      }`}
                    />

                    <div
                      className={`flex flex-col justify-center rounded-2xl border border-[#E6D9C8] bg-white p-7 shadow-[0_18px_50px_rgba(70,42,33,0.06)] sm:p-10 lg:p-12 ${
                        imageFirst ? "lg:order-2" : "lg:order-1"
                      }`}
                    >
                      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#9A742E]">
                        Service {String(index + 1).padStart(2, "0")}
                      </p>

                      <h3 className="text-3xl font-semibold tracking-tight text-[#5A1425] md:text-4xl">
                        <Link
                          to="/services/$serviceSlug"
                          params={{ serviceSlug: service.slug }}
                          className="rounded-sm transition-colors hover:text-[#711C31] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B]"
                        >
                          {service.title}
                        </Link>
                      </h3>

                      <p className="mt-5 leading-7 text-[#695E59]">{service.heroDescription}</p>

                      <h4 className="mt-8 text-sm font-semibold uppercase tracking-[0.16em] text-[#5A1425]">
                        What&apos;s Included
                      </h4>

                      <ul className="mt-5 grid gap-3 sm:grid-cols-2" role="list">
                        {service.services.map((item) => (
                          <li key={item} className="flex gap-3 text-sm leading-6 text-[#514946]">
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F3E8D5] text-[#8A6729]">
                              <Check
                                aria-hidden="true"
                                className="h-3.5 w-3.5"
                                strokeWidth={2}
                              />
                            </span>
                            {item}
                          </li>
                        ))}
                      </ul>

                      <p className="mt-8 border-t border-[#C9A45B]/25 pt-6 text-sm leading-7 text-[#695E59]">
                        {service.overview}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-20 md:mt-28">
              <AddOnCarousel />
            </div>
          </div>
        </section>

        <section className="bg-[#5A1425] px-6 py-20 text-center text-white md:py-24">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D9BC7A]">
              A cleaner home, thoughtfully arranged
            </p>

            <h2 className="mt-5 text-3xl font-semibold tracking-tight md:text-5xl">
              Tell us what would make home feel lighter.
            </h2>

            <p className="mx-auto mt-5 max-w-xl leading-7 text-white/75">
              We will listen to your priorities and recommend a cleaning plan that fits your space
              and schedule.
            </p>

            <Link
              to="/quote"
              className="mt-9 inline-flex min-h-12 items-center justify-center rounded-md bg-[#C9A45B] px-7 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#3B0F1A] transition hover:-translate-y-0.5 hover:bg-[#D8B970] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#5A1425]"
            >
              Request a Quote
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
