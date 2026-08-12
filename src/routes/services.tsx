import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { AddOnCarousel } from "@/components/AddOnCarousel";
import { ServiceImage } from "@/components/ServiceImage";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { servicePages } from "@/content/services";
import { createSeoHead } from "@/lib/seo";
import { serviceBreadcrumbs } from "@/lib/breadcrumbs";
import { SITE_NAME } from "@/lib/site";
import { createBreadcrumbList, createPageGraph, schemaScripts } from "@/lib/structured-data";

type CleaningService = {
  slug: string;
  title: string;
  introduction: string;
  included: string[];
  closing: string;
};

const services: CleaningService[] = [
  {
    slug: "regular-home-cleaning",
    title: "Regular Home Cleaning",
    introduction:
      "A considered weekly or fortnightly clean that keeps your home feeling calm, cared for and ready to enjoy.",
    included: [
      "Dusting of reachable surfaces",
      "Vacuuming carpets and rugs",
      "Mopping hard floors",
      "Kitchen surface cleaning",
      "Bathroom cleaning",
      "General tidying",
    ],
    closing:
      "We shape each recurring visit around your priorities, so your home receives reliable care without disrupting your routine.",
  },
  {
    slug: "deep-cleaning",
    title: "Deep Cleaning",
    introduction:
      "A detailed top-to-bottom refresh for homes that need more time, attention and a beautifully thorough finish.",
    included: [
      "Detailed surface and ledge dusting",
      "Skirting board cleaning",
      "Cabinet exterior cleaning",
      "Focused kitchen degreasing",
      "Bathroom descaling",
      "Thorough floor care",
    ],
    closing:
      "Ideal as a seasonal reset or before beginning regular visits, this service brings a renewed sense of ease to every room.",
  },
  {
    slug: "move-in-cleaning",
    title: "Move-In Cleaning",
    introduction:
      "Begin life in your new home with a clean, welcoming canvas prepared before your belongings are unpacked.",
    included: [
      "Inside cupboards and drawers",
      "Kitchen and appliance exteriors",
      "Bathroom sanitisation",
      "Wardrobe interiors",
      "Floor vacuuming and mopping",
      "Reachable surface dusting",
    ],
    closing:
      "We carefully attend to empty spaces so that settling in feels simpler, fresher and distinctly more comfortable.",
  },
  {
    slug: "move-out-cleaning",
    title: "Move-Out Cleaning",
    introduction:
      "A comprehensive final clean designed to leave your previous home polished, presentable and ready for its next chapter.",
    included: [
      "Empty-room dusting",
      "Cupboard and drawer interiors",
      "Kitchen surface degreasing",
      "Bathroom sanitisation",
      "Skirting board cleaning",
      "Complete floor care",
    ],
    closing:
      "With the cleaning thoughtfully handled, you can focus your attention on the move and what comes next.",
  },
  {
    slug: "apartment-cleaning",
    title: "Apartment Cleaning",
    introduction:
      "Efficient, detail-led care created for apartment living, from compact studios to generous multi-bedroom spaces.",
    included: [
      "Living and dining areas",
      "Bedrooms and wardrobes",
      "Kitchen surfaces",
      "Bathroom cleaning",
      "Balcony sweeping on request",
      "Vacuuming and mopping",
    ],
    closing:
      "Our approach makes the most of every visit, leaving smaller spaces feeling open, orderly and wonderfully fresh.",
  },
  {
    slug: "kitchen-cleaning",
    title: "Kitchen Cleaning",
    introduction:
      "Focused attention for the heart of your home, with careful cleaning of the surfaces you use every day.",
    included: [
      "Worktop and splashback cleaning",
      "Sink and tap polishing",
      "Stovetop cleaning",
      "Appliance exterior wiping",
      "Cupboard-front cleaning",
      "Floor vacuuming and mopping",
    ],
    closing:
      "The result is a bright, hygienic kitchen that feels inviting for weekday meals, weekend gatherings and everything between.",
  },
  {
    slug: "bathroom-sanitisation",
    title: "Bathroom Sanitisation",
    introduction:
      "A meticulous clean that brings freshness, shine and a reassuring sense of hygiene to your bathroom.",
    included: [
      "Bath and shower cleaning",
      "Toilet sanitisation",
      "Basin and tap polishing",
      "Mirror cleaning",
      "Tile and surface wiping",
      "Floor cleaning",
    ],
    closing:
      "We pay attention to high-touch details and visible finishes, creating a space that feels serene and cared for.",
  },
  {
    slug: "bedroom-cleaning",
    title: "Bedroom Cleaning",
    introduction:
      "Gentle, precise care for restful rooms, helping each bedroom feel peaceful, ordered and comfortable.",
    included: [
      "Reachable surface dusting",
      "Bed making",
      "Mirror cleaning",
      "Light general tidying",
      "Carpet vacuuming",
      "Hard-floor mopping",
    ],
    closing:
      "Tell us how you prefer your space arranged and we will finish it with quiet attention to the details that matter.",
  },
  {
    slug: "living-area-cleaning",
    title: "Living Area Cleaning",
    introduction:
      "Thoughtful cleaning for the shared spaces where your household relaxes, connects and welcomes guests.",
    included: [
      "Furniture and surface dusting",
      "Cushion straightening",
      "Rug and carpet vacuuming",
      "Hard-floor mopping",
      "Reachable décor dusting",
      "General tidying",
    ],
    closing:
      "We leave your living areas feeling composed and comfortable, while respecting the way your family uses each space.",
  },
  {
    slug: "interior-window-cleaning",
    title: "Interior Window Cleaning",
    introduction:
      "A careful interior service that clears everyday marks and helps natural light shine through your home.",
    included: [
      "Interior glass cleaning",
      "Frame and sill wiping",
      "Finger-mark removal",
      "Reachable door glass",
      "Mirror polishing",
      "Streak-conscious finishing",
    ],
    closing:
      "Available for safely reachable windows, this finishing touch gives rooms a brighter, more polished appearance.",
  },
  {
    slug: "laundry-folding",
    title: "Laundry Folding",
    introduction:
      "A practical helping hand that turns clean, dry laundry into neat, organised stacks ready to be put away.",
    included: [
      "Folding everyday clothing",
      "Pairing socks",
      "Folding towels",
      "Folding bed linen",
      "Sorting by household member",
      "Neat placement in agreed areas",
    ],
    closing:
      "Add folding to your cleaning visit and reclaim valuable time while keeping wardrobes and linen cupboards beautifully ordered.",
  },
  {
    slug: "eco-conscious-cleaning",
    title: "Eco-Friendly Cleaning",
    introduction:
      "A mindful option for households that prefer considered product choices without compromising on attentive care.",
    included: [
      "Preference-led product planning",
      "Reusable cloths where suitable",
      "Measured product use",
      "Low-fragrance options on request",
      "Care for high-touch surfaces",
      "Responsible waste handling",
    ],
    closing:
      "Share your household preferences when requesting a quote, and we will discuss an approach suited to your home.",
  },
  {
    slug: "cleaning-add-ons",
    title: "Add-on Services",
    introduction:
      "Flexible extras let you personalise a visit when particular areas of your home need a little more attention.",
    included: [
      "Inside-fridge cleaning",
      "Inside-oven cleaning",
      "Interior cupboard cleaning",
      "Extra laundry folding",
      "Balcony sweeping",
      "Additional room cleaning",
    ],
    closing:
      "Choose add-ons when requesting your quote and we will allow the right amount of time for a beautifully finished visit.",
  },
];

const serviceOverviewBySlug = new Map(services.map((service) => [service.slug, service]));

const overviewServicePages = servicePages.filter((service) => service.image);

const breadcrumbs = serviceBreadcrumbs();

export const Route = createFileRoute("/services")({
  component: ServicesRoute,
  head: ({ match, matches }) => {
    if (matches[matches.length - 1]?.routeId !== match.routeId) return {};

    const title = `Residential Cleaning Services | ${SITE_NAME}`;
    const description =
      "Explore thoughtful home cleaning services tailored to your space, schedule and everyday routine.";
    return {
      ...createSeoHead({ title, description, path: "/services" }),
      scripts: schemaScripts(
        createPageGraph("/services", title, description),
        createBreadcrumbList(breadcrumbs),
      ),
    };
  },
});

function ServicesRoute() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  return pathname === "/services" || pathname === "/services/" ? <ServicesOverview /> : <Outlet />;
}

function ServicesOverview() {
  return (
    <div className="min-h-screen bg-[#FBF7EF] text-[#322B2A]">
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
            <a
              href="/#contact"
              className="mt-10 inline-flex min-h-12 items-center justify-center rounded-md bg-[#5A1425] px-7 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-[0_12px_30px_rgba(90,20,37,0.16)] transition hover:-translate-y-0.5 hover:bg-[#711C31] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F7F0E3]"
            >
              Request a Quote
            </a>
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
              {overviewServicePages.map((canonicalService, index) => {
                const service = serviceOverviewBySlug.get(canonicalService.slug);
                if (!service || !canonicalService.image) return null;
                const imageFirst = index % 2 === 0;
                return (
                  <article
                    key={service.title}
                    className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-14"
                  >
                    <ServiceImage
                      image={canonicalService.image}
                      className={`block aspect-[3/2] min-h-72 overflow-hidden rounded-2xl border border-[#C9A45B]/30 bg-[#EFE4D2] shadow-[0_18px_50px_rgba(70,42,33,0.08)] lg:min-h-[31rem] ${imageFirst ? "lg:order-1" : "lg:order-2"}`}
                    />

                    <div
                      className={`flex flex-col justify-center rounded-2xl border border-[#E6D9C8] bg-white p-7 shadow-[0_18px_50px_rgba(70,42,33,0.06)] sm:p-10 lg:p-12 ${imageFirst ? "lg:order-2" : "lg:order-1"}`}
                    >
                      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#9A742E]">
                        Service {String(index + 1).padStart(2, "0")}
                      </p>
                      <h3 className="text-3xl font-semibold tracking-tight text-[#5A1425] md:text-4xl">
                        <Link
                          to="/services/$serviceSlug"
                          params={{ serviceSlug: canonicalService.slug }}
                          className="rounded-sm transition-colors hover:text-[#711C31] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B]"
                        >
                          {service.title}
                        </Link>
                      </h3>
                      <p className="mt-5 leading-7 text-[#695E59]">{service.introduction}</p>
                      <h4 className="mt-8 text-sm font-semibold uppercase tracking-[0.16em] text-[#5A1425]">
                        What&apos;s Included
                      </h4>
                      <ul className="mt-5 grid gap-3 sm:grid-cols-2" role="list">
                        {service.included.map((item) => (
                          <li key={item} className="flex gap-3 text-sm leading-6 text-[#514946]">
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F3E8D5] text-[#8A6729]">
                              <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />
                            </span>
                            {item}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-8 border-t border-[#C9A45B]/25 pt-6 text-sm leading-7 text-[#695E59]">
                        {service.closing}
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
            <a
              href="/#contact"
              className="mt-9 inline-flex min-h-12 items-center justify-center rounded-md bg-[#C9A45B] px-7 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#3B0F1A] transition hover:-translate-y-0.5 hover:bg-[#D8B970] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#5A1425]"
            >
              Request a Quote
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
