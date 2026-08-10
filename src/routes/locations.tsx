import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { ArrowRight, Check, MapPin, MessageCircle, Navigation } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { createSeoHead } from "@/lib/seo";
import { locationBreadcrumbs } from "@/lib/breadcrumbs";
import { locationPages } from "@/content/locations";
import { SITE_NAME } from "@/lib/site";
import { createBreadcrumbList, createPageGraph, schemaScripts } from "@/lib/structured-data";

const serviceAreas = [
  "Johannesburg",
  "Riverlea",
  "Randburg",
  "Roodepoort",
  "Sandton",
  "Midrand",
  "Centurion",
  "Pretoria",
] as const;

const overviewAreas = [
  ...serviceAreas.map((name) => ({
    name,
    location: locationPages.find((location) => location.name === name),
  })),
  ...locationPages
    .filter((location) => !serviceAreas.some((name) => name === location.name))
    .map((location) => ({ name: location.name, location })),
];

const areaGroups = [
  {
    title: "Johannesburg West",
    areas: ["Riverlea", "Roodepoort", "Surrounding suburbs by confirmation"],
  },
  {
    title: "Johannesburg North",
    areas: ["Randburg", "Sandton", "Surrounding suburbs by confirmation"],
  },
  {
    title: "Midrand and Centurion",
    areas: ["Midrand", "Centurion", "Nearby estates and residential areas by confirmation"],
  },
  {
    title: "Pretoria",
    areas: ["Selected Pretoria suburbs by confirmation"],
  },
] as const;

const bookingNotes = [
  "Exact service availability depends on your address.",
  "Some areas may require additional travel time or cost.",
  "Estate and complex access details should be provided in advance.",
  "Preferred dates are not confirmed until Hestiva accepts the booking.",
  "Recurring cleaning availability may differ by area.",
] as const;

const quoteEmail = "mailto:quotes@hestiva.co.za?subject=Hestiva%20address%20and%20quote%20request";
const whatsAppUrl =
  "https://wa.me/27684231614?text=Hello%20Hestiva%2C%20I%27d%20like%20to%20check%20cleaning%20availability%20for%20my%20address.";

const breadcrumbs = locationBreadcrumbs();

export const Route = createFileRoute("/locations")({
  component: LocationsRoute,
  head: ({ match, matches }) => {
    if (matches[matches.length - 1]?.routeId !== match.routeId) return {};

    const title = `Areas We Serve | ${SITE_NAME} Residential Cleaning`;
    const description =
      "Check Hestiva residential cleaning availability across selected Johannesburg, Midrand, Centurion and Pretoria areas.";

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
          <div
            aria-hidden="true"
            className="absolute -right-12 top-40 h-72 w-72 rounded-full border border-[#C9A45B]/25"
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
              Thoughtful home cleaning across Johannesburg and nearby areas.
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-[#695E59] md:text-xl">
              Hestiva serves households across selected parts of Johannesburg and surrounding areas,
              with each booking confirmed according to travel distance, availability and service
              requirements.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a href={quoteEmail} className={primaryButton}>
                Request a Quote <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </a>
              <a href="mailto:info@hestiva.co.za" className={secondaryButton}>
                Contact Hestiva
              </a>
            </div>
          </div>
        </section>

        <section aria-labelledby="footprint-heading" className="px-6 py-20 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9A742E]">
                Current service area
              </p>
              <h2
                id="footprint-heading"
                className="mt-4 text-3xl font-semibold tracking-tight text-[#5A1425] md:text-5xl"
              >
                Our current service footprint
              </h2>
              <p className="mt-6 max-w-xl leading-7 text-[#695E59]">
                These are the main areas within our current footprint, rather than a promise of full
                coverage in every suburb. We confirm availability using your exact address, travel
                distance and our schedule.
              </p>
            </div>
            <ul
              className="grid gap-x-8 gap-y-1 border-y border-[#C9A45B]/30 py-4 sm:grid-cols-2"
              role="list"
            >
              {overviewAreas.map(({ name, location }) => (
                <li
                  key={name}
                  className="flex items-center gap-4 border-b border-[#E6D9C8] py-5 text-lg font-medium text-[#514946] last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F3E8D5] text-[#8A6729]">
                    <MapPin aria-hidden="true" className="h-4 w-4" />
                  </span>
                  {location ? (
                    <Link
                      to="/locations/$locationSlug"
                      params={{ locationSlug: location.slug }}
                      className="rounded-sm transition-colors hover:text-[#711C31] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B]"
                    >
                      {name}
                    </Link>
                  ) : (
                    name
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          aria-labelledby="groups-heading"
          className="border-y border-[#E6D9C8] bg-white px-6 py-20 md:py-28"
        >
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9A742E]">
                Area groups
              </p>
              <h2
                id="groups-heading"
                className="mt-4 text-3xl font-semibold tracking-tight text-[#5A1425] md:text-5xl"
              >
                Where our teams currently travel
              </h2>
              <p className="mt-5 leading-7 text-[#695E59]">
                Use these groups as a guide. Nearby residential areas are considered individually
                when you request a quotation.
              </p>
            </div>
            <div className="mt-14 grid gap-x-12 gap-y-10 md:grid-cols-2">
              {areaGroups.map((group) => (
                <article key={group.title} className="border-t border-[#C9A45B]/50 pt-7">
                  <div className="flex items-start gap-4">
                    <Navigation
                      aria-hidden="true"
                      className="mt-1 h-5 w-5 shrink-0 text-[#9A742E]"
                    />
                    <div>
                      <h3 className="text-2xl font-semibold text-[#5A1425]">{group.title}</h3>
                      <ul className="mt-5 space-y-3" role="list">
                        {group.areas.map((area) => {
                          const location = locationPages.find(({ name }) => name === area);
                          return (
                            <li key={area} className="flex gap-3 leading-7 text-[#695E59]">
                              <span
                                aria-hidden="true"
                                className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C9A45B]"
                              />
                              {location ? (
                                <Link
                                  to="/locations/$locationSlug"
                                  params={{ locationSlug: location.slug }}
                                  className="underline-offset-4 hover:underline"
                                >
                                  {area}
                                </Link>
                              ) : (
                                area
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="address-check-heading" className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-5xl rounded-3xl border border-[#C9A45B]/30 bg-[#F7F0E3] px-7 py-14 text-center shadow-[0_18px_60px_rgba(70,42,33,0.06)] sm:px-12 md:py-20">
            <MapPin aria-hidden="true" className="mx-auto h-8 w-8 text-[#9A742E]" />
            <h2
              id="address-check-heading"
              className="mt-5 text-3xl font-semibold tracking-tight text-[#5A1425] md:text-5xl"
            >
              Not sure whether we cover your area?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#695E59]">
              Send us your suburb or full address and we’ll confirm availability before preparing
              your quotation.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <a href={quoteEmail} className={primaryButton}>
                Check My Address <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </a>
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noreferrer"
                className={secondaryButton}
                aria-label="WhatsApp Hestiva on 068 423 1614"
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
                A few helpful details allow us to plan the right time and travel for your home.
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

        <section
          aria-labelledby="closing-heading"
          className="border-t border-[#C9A45B]/25 bg-[#F7F0E3] px-6 py-20 text-center md:py-28"
        >
          <div className="mx-auto max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9A742E]">
              Your home, beautifully cared for
            </p>
            <h2
              id="closing-heading"
              className="mt-5 text-3xl font-semibold tracking-tight text-[#5A1425] md:text-5xl"
            >
              Ready to check availability for your home?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#695E59]">
              Tell us where you are and what type of cleaning you need, and we’ll confirm whether we
              can assist.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <a href={quoteEmail} className={primaryButton}>
                Request Your Quote <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </a>
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noreferrer"
                className={secondaryButton}
                aria-label="WhatsApp Hestiva on 068 423 1614"
              >
                <MessageCircle aria-hidden="true" className="h-4 w-4" /> WhatsApp 068 423 1614
              </a>
            </div>
            <div className="mt-12 flex flex-col items-center justify-center gap-x-8 gap-y-3 border-t border-[#C9A45B]/30 pt-8 text-sm text-[#695E59] sm:flex-row sm:flex-wrap">
              <a
                href="tel:+27684231614"
                className="rounded-sm hover:text-[#5A1425] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B]"
              >
                Phone: 068 423 1614
              </a>
              <a
                href="mailto:quotes@hestiva.co.za"
                className="rounded-sm hover:text-[#5A1425] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B]"
              >
                Quotes: quotes@hestiva.co.za
              </a>
              <a
                href="mailto:info@hestiva.co.za"
                className="rounded-sm hover:text-[#5A1425] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B]"
              >
                General enquiries: info@hestiva.co.za
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
