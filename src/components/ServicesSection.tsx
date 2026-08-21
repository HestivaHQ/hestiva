import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bath,
  BedDouble,
  CookingPot,
  Home,
  PackageOpen,
  Shirt,
  Sparkles,
  SprayCan,
  Square,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { indexablePublicServicePages } from "@/lib/public-service-policy";

const serviceIcons = {
  "regular-home-cleaning": Home,
  "deep-cleaning": Sparkles,
  "move-in-cleaning": PackageOpen,
  "move-out-cleaning": PackageOpen,
  "kitchen-cleaning": CookingPot,
  "bathroom-sanitisation": Bath,
  "bedroom-cleaning": BedDouble,
  "living-area-cleaning": Home,
  "interior-window-cleaning": Square,
  "post-renovation-cleaning": Sparkles,
  "laundry-folding": Shirt,
  "cleaning-add-ons": SprayCan,
} as const;

const services = indexablePublicServicePages
  .map((service) => {
    const icon = serviceIcons[service.slug as keyof typeof serviceIcons];
    if (!icon) return null;

    return {
      title: service.title,
      description: service.heroDescription,
      icon,
      slug: service.slug,
    };
  })
  .filter((service): service is NonNullable<typeof service> => service !== null);

export function ServicesSection() {
  return (
    <section
      id="services"
      className="bg-[#F8F3E8] py-24 sm:py-28 lg:py-32"
      aria-labelledby="services-heading"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center lg:mb-20">
          <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9A7132]">
            Care for Every Home
          </span>
          <h2
            id="services-heading"
            className="mt-4 text-4xl font-semibold tracking-[-0.025em] text-[#3B0F1A] sm:text-5xl"
          >
            Cleaning shaped around your life.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#5F4B46]">
            From dependable weekly care to a detailed home refresh, choose the service that suits
            your space, routine and priorities.
          </p>
        </div>

        <div className="grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {services.map((service) => (
            <Link
              key={service.title}
              to="/services/$serviceSlug"
              params={{ serviceSlug: service.slug }}
              className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B0F1A] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F8F3E8]"
              aria-label={`Learn more about ${service.title}`}
            >
              <article className="h-full rounded-2xl border border-[#E7DCC9] bg-[#FFFDF8] p-7 shadow-[0_8px_24px_rgba(59,15,26,0.04)] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#C9A45B]/60 group-hover:shadow-[0_14px_32px_rgba(59,15,26,0.08)] sm:p-8">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-[#C9A45B]/30 bg-[#F8F3E8]">
                  <service.icon className="h-5 w-5 text-[#9A7132]" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold tracking-[-0.01em] text-[#3B0F1A]">
                  {service.title}
                </h3>
                <p className="mt-3 text-[0.95rem] leading-7 text-[#6D5B55]">{service.description}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#9A7132]">
                  Learn more
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </article>
            </Link>
          ))}
        </div>

        <div className="mt-12 flex justify-center lg:mt-14">
          <Button variant="heroOutline" size="lg" asChild>
            <Link
              to="/services"
              className="border-[#3B0F1A] text-[#3B0F1A] hover:bg-[#3B0F1A] hover:text-[#F8F3E8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B0F1A] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F8F3E8]"
            >
              View All Services
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
