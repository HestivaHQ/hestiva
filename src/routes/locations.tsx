import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { ArrowRight, Check, MapPin, MessageCircle, Navigation } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { serviceAreaClusters } from "@/content/service-areas";
import { locationPages } from "@/content/locations";
import { locationBreadcrumbs } from "@/lib/breadcrumbs";
import { createSeoHead } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";
import { createBreadcrumbList, createPageGraph, schemaScripts } from "@/lib/structured-data";

const bookingNotes = [
  "Exact service availability depends on your address.",
  "Some addresses may require additional travel planning.",
  "Estate and complex access details should be provided in advance.",
  "Preferred dates are not confirmed until Homent accepts the booking.",
  "Recurring cleaning availability may differ by area and schedule.",
] as const;

const quoteEmail = "mailto:quotes@hestiva.co.za?subject=Homent%20address%20and%20quote%20request";
const whatsAppUrl =
  "https://wa.me/27684231614?text=Hello%20Homent%2C%20I%27d%20like%20to%20check%20cleaning%20availability%20for%20my%20address.";
const breadcrumbs = locationBreadcrumbs();

export const Route = createFileRoute("/locations")({
  component: LocationsRoute,
  head: ({ match, matches }) => {
    if (matches[matches.length - 1]?.routeId !== match.routeId) return {};

    const title = `Areas We Serve | ${SITE_NAME} Residential Cleaning`;
    const description =
      "Explore Homent residential cleaning service areas across Sandton, Randburg, Rosebank, Roodepoort, Midrand, Waterfall, Kyalami and surrounding approved suburbs.";

    return {
      ...createSeoHead({ title, description, path: "/locations" }),
      scripts: schemaScripts(
        createPageGraph("/locations", title, description),
        createBreadcrumbList(breadcrumbs),
      ),
    };
  },
});

function LocationsRoute() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  return pathname === "/locations" || pathname === "/locations/" ? (
    <LocationsOverview />
  ) : (
    <Outlet />
  );
}

const primaryButton =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#5A1425] px-7 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-white shadow-[0_12px_30px_rgba(90,20,37,0.14)] transition hover:-translate-y-0.5 hover:bg-[#711C31] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B] focus-visible:ring-offset-4";
const secondaryButton =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-[#5A1425]/35 bg-white/60 px-7 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-[#5A1425] transition hover:border-[#5A1425] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B] focus-visible:ring-offset-4";

function LocationsOverview() {
  return (
    <div className="min-h-screen bg-[#FCFAF6] text-[#403936]">
      <Navbar />
      <main>
        <section className="relative overflow-hidden border-b border-[#C9A45B]/20 bg-[#F7F0E3] px-6 pb-24 pt-36 md:pb-32 md:pt-44">
          <div
            aria-hidden="true"
            className="absolute -right-36 top-16 h-[30rem] w-[30rem] rounded-full border border-[#C9A45B]/20"
          />
          <div className="relative mx-auto max-w-7xl">
            <Breadcrumbs
              items={breadcrumbs}
              className="mb-12 text-[#695E59]"
              linkClassName="rounded-sm transition-colors hover:text-[#5A1425] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B]"
              separatorClassName="text-[#C9A45B]"
            />
            <p className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#9A742E]">
              <MapPin aria-hidden="true" className="h-4 w-4" /> Areas We Serve
            </p>
            <h1 className="max-w-5xl text-4xl font-semibold leading-[1.08] tracking-[-0.03em] text-[#5A1425] sm:text-6xl md:text-7xl">
              Home cleaning across our Johannesburg and Midrand service corridor.
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-[#695E59] md:text-xl">
              Homent currently serves 66 approved areas across Sandton and Johannesburg North,
              Randburg, Rosebank and central-north Johannesburg, Roodepoort and Johannesburg West,
              plus Midrand, Waterfall and Kyalami.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link to="/quote" className={primaryButton}>
                Request a Quote <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <a href="mailto:info@hestiva.co.za" className={secondaryButton}>
                Contact Homent
              </a>
            </div>
          </div>
        </section>

        <section aria-labelledby="clusters-heading" className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9A742E]">
                Current service footprint
              </p>
              <h2
                id="clusters-heading"
                className="mt-4 text-3xl font-semibold tracking-tight text-[#5A1425] md:text-5xl"
              >
                Choose your area
              </h2>
              <p className="mt-5 leading-7 text-[#695E59]">
                Each suburb below has its own Homent service-area page. Exact availability is still
                confirmed against your address, requested date and cleaning requirements.
              </p>
            </div>

            <div className="mt-14 grid gap-10 lg:grid-cols-2">
              {serviceAreaClusters.map((cluster) => (
                <article
                  key={cluster.name}
                  className="rounded-3xl border border-[#C9A45B]/30 bg-white p-7 shadow-[0_18px_60px_rgba(70,42,33,0.05)] sm:p-9"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F3E8D5] text-[#8A6729]">
                      <Navigation aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-2xl font-semibold text-[#5A1425]">{cluster.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-[#695E59]">
                        {cluster.areas.length} approved service areas
                      </p>
                    </div>
                  </div>

                  <ul className="mt-7 grid gap-x-6 gap-y-3 sm:grid-cols-2" role="list">
                    {cluster.areas.map((area) => {
                      const location = locationPages.find(({ name }) => name === area);
                      if (!location) return null;

                      return (
                        <li key={area} className="flex items-center gap-3 text-[#514946]">
                          <span
                            aria-hidden="true"
                            className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#C9A45B]"
                          />
                          <Link
                            to="/locations/$locationSlug"
                            params={{ locationSlug: location.slug }}
                            className="rounded-sm underline-offset-4 transition-colors hover:text-[#711C31] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B]"
                          >
                            {area}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          aria-labelledby="address-check-heading"
          className="border-y border-[#E6D9C8] bg-white px-6 py-20 md:py-28"
        >
          <div className="mx-auto max-w-5xl rounded-3xl border border-[#C9A45B]/30 bg-[#F7F0E3] px-7 py-14 text-center shadow-[0_18px_60px_rgba(70,42,33,0.06)] sm:px-12 md:py-20">
            <MapPin aria-hidden="true" className="mx-auto h-8 w-8 text-[#9A742E]" />
            <h2
              id="address-check-heading"
              className="mt-5 text-3xl font-semibold tracking-tight text-[#5A1425] md:text-5xl"
            >
              Ready to check your address?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#695E59]">
              Start the quote and enter your address or use your current location. Homent will use
              the property and access details you provide when reviewing the request.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <Link to="/quote" className={primaryButton}>
                Start My Quote <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noreferrer"
                className={secondaryButton}
                aria-label="WhatsApp Homent on 068 423 1614"
              >
                <MessageCircle aria-hidden="true" className="h-4 w-4" /> WhatsApp 068 423 1614
              </a>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="booking-notes-heading"
          className="bg-[#F2E9DC] px-6 py-20 md:py-24"
        >
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9A742E]">
                Before you book
              </p>
              <h2
                id="booking-notes-heading"
                className="mt-4 text-3xl font-semibold tracking-tight text-[#5A1425] md:text-4xl"
              >
                Travel and booking notes
              </h2>
              <p className="mt-5 max-w-lg leading-7 text-[#695E59]">
                A few details help Homent plan the right visit for your home.
              </p>
            </div>
            <ul className="space-y-4" role="list">
              {bookingNotes.map((note) => (
                <li
                  key={note}
                  className="flex gap-4 border-b border-[#C9A45B]/25 pb-4 leading-7 text-[#514946]"
                >
                  <Check aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-[#9A742E]" />
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-[#C9A45B]/25 bg-[#F7F0E3] px-6 py-20 text-center md:py-28">
          <div className="mx-auto max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9A742E]">
              Your home, beautifully cared for
            </p>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-[#5A1425] md:text-5xl">
              Tell us where you are and what your home needs.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#695E59]">
              Complete the quote flow with your property, service, timing and access details so the
              request arrives with the information needed for review.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <Link to="/quote" className={primaryButton}>
                Request Your Quote <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <a href={quoteEmail} className={secondaryButton}>
                Email Quotes
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
