import { Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, MapPin } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { locationVisualLibrary } from "@/content/location-visuals";
import { locationPages, type LocationPage } from "@/content/locations";
import { locationBreadcrumbs } from "@/lib/breadcrumbs";
import { canonicalPrimaryServicePages } from "@/lib/public-service-policy";

const DEAD_LOCATION_IMAGE_IDS = new Set(["3773571"]);

function pexelsSizedSrc(src: string, width: number): string {
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  return url.toString();
}

export function LocationPageLayout({ location }: { location: LocationPage }) {
  const featuredServices = canonicalPrimaryServicePages.slice(0, 6);
  const breadcrumbs = locationBreadcrumbs(location.name, `/locations/${location.slug}`);
  const gallery = (locationVisualLibrary[location.name] ?? []).filter(
    (image) => ![...DEAD_LOCATION_IMAGE_IDS].some((photoId) => image.src.includes(`/photos/${photoId}/`)),
  );
  const primaryImage = gallery[0];
  const supportingImages = gallery.slice(1, 3);
  const nearbyLocations = location.nearbyAreas
    .map((areaName) => locationPages.find((item) => item.name === areaName))
    .filter((item): item is LocationPage => Boolean(item));

  return (
    <div className="min-h-screen bg-[#F8F3E8] text-[#5F4B46]">
      <Navbar />
      <main>
        <section className="border-b border-[#C9A45B]/25 bg-[#EDE2CF] px-6 pb-20 pt-32 md:pb-24 md:pt-36">
          <div className="mx-auto max-w-7xl">
            <Breadcrumbs
              items={breadcrumbs}
              className="mb-8 text-[#6D5B55]"
              linkClassName="transition-colors hover:text-[#5A1425]"
              separatorClassName="text-[#C9A45B]"
            />
            <Link
              to="/locations"
              className="mb-8 inline-flex items-center gap-2 text-sm text-[#6D5B55] transition-colors hover:text-[#5A1425]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to service areas
            </Link>

            <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
              <div className="max-w-3xl">
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#76531F]">
                  <MapPin className="h-4 w-4" />
                  {location.region} Service Area
                </span>
                <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.03em] text-[#5A1425] md:text-6xl">
                  Residential Cleaning in {location.name}
                </h1>
                <p className="mt-6 text-lg leading-8 text-[#695E59]">{location.heroDescription}</p>
                <div className="mt-8">
                  <Button variant="hero" size="lg" asChild>
                    <Link to="/quote">Request a Quote</Link>
                  </Button>
                </div>
              </div>

              {primaryImage && (
                <figure className="overflow-hidden rounded-3xl border border-[#C9A45B]/30 bg-[#FFFDF8] shadow-[0_20px_60px_rgba(70,42,33,0.09)]">
                  <img
                    src={pexelsSizedSrc(primaryImage.src, 960)}
                    srcSet={`${pexelsSizedSrc(primaryImage.src, 480)} 480w, ${pexelsSizedSrc(primaryImage.src, 720)} 720w, ${pexelsSizedSrc(primaryImage.src, 960)} 960w, ${pexelsSizedSrc(primaryImage.src, 1280)} 1280w`}
                    sizes="(min-width: 1024px) 48vw, calc(100vw - 3rem)"
                    alt={primaryImage.alt}
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    className="aspect-[4/3] w-full object-cover"
                  />
                </figure>
              )}
            </div>
          </div>
        </section>

        {supportingImages.length > 0 && (
          <section aria-labelledby="local-gallery-heading" className="bg-[#FFFDF8] px-6 py-14 md:py-18">
            <div className="mx-auto max-w-7xl">
              <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#76531F]">
                    Residential interiors
                  </p>
                  <h2
                    id="local-gallery-heading"
                    className="mt-3 text-3xl font-semibold tracking-tight text-[#5A1425]"
                  >
                    Homes, beautifully cared for
                  </h2>
                </div>
                <p className="max-w-xl text-sm leading-6 text-[#695E59]">
                  Clean, well-kept residential interiors that reflect the kinds of home spaces Homent is designed to care for.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {supportingImages.map((image) => (
                  <figure
                    key={image.src}
                    className="overflow-hidden rounded-2xl border border-[#E2D3BD] bg-[#F8F3E8]"
                  >
                    <img
                      src={pexelsSizedSrc(image.src, 720)}
                      srcSet={`${pexelsSizedSrc(image.src, 480)} 480w, ${pexelsSizedSrc(image.src, 720)} 720w, ${pexelsSizedSrc(image.src, 960)} 960w`}
                      sizes="(min-width: 640px) 50vw, calc(100vw - 3rem)"
                      alt={image.alt}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[4/3] h-full w-full object-cover transition duration-300 hover:scale-[1.02]"
                    />
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="bg-[#F8F3E8] px-6 py-20 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#76531F]">
                  Services available
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#5A1425] md:text-4xl">
                  Cleaning options for homes in {location.name}
                </h2>
                <p className="mt-5 max-w-xl leading-7 text-[#695E59]">
                  Choose a cleaning service and tell us about your property. We confirm exact
                  availability and scope from your address and quote request.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {featuredServices.map((service) => (
                  <Link
                    key={service.slug}
                    to="/services/$serviceSlug"
                    params={{ serviceSlug: service.slug }}
                    className="rounded-2xl border border-[#E2D3BD] bg-[#FFFDF8] p-5 transition hover:-translate-y-0.5 hover:border-[#C9A45B] hover:shadow-[0_12px_28px_rgba(59,15,26,0.07)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B]"
                  >
                    <h3 className="font-semibold text-[#5A1425]">{service.shortTitle}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#695E59]">{service.heroDescription}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#FFFDF8] px-6 py-20 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#76531F]">
                  Local planning
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#5A1425] md:text-4xl">
                  A cleaning visit planned around your address
                </h2>
                <p className="mt-5 leading-7 text-[#695E59]">
                  Service availability can vary by address, requested date and cleaning scope. Send
                  your property details through the quote form and Homent will confirm the plan before
                  a booking is finalised.
                </p>
              </div>
              <div className="rounded-2xl border border-[#E2D3BD] bg-[#F8F3E8] p-7">
                <h3 className="text-lg font-semibold text-[#5A1425]">What helps us quote accurately</h3>
                <ul className="mt-5 space-y-3">
                  {[
                    "Your full service address",
                    "Property type and approximate size",
                    "The cleaning service you need",
                    "Preferred date and frequency",
                    "Any add-ons or areas needing extra attention",
                  ].map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-6 text-[#695E59]">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#9A7132]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {nearbyLocations.length > 0 && (
          <section className="bg-[#F8F3E8] px-6 py-20 md:py-24">
            <div className="mx-auto max-w-7xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#76531F]">
                Nearby areas
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#5A1425] md:text-4xl">
                Explore cleaning services nearby
              </h2>
              <div className="mt-8 flex flex-wrap gap-3">
                {nearbyLocations.map((area) => (
                  <Link
                    key={area.slug}
                    to="/locations/$locationSlug"
                    params={{ locationSlug: area.slug }}
                    className="rounded-full border border-[#D9C9AD] bg-[#FFFDF8] px-4 py-2 text-sm text-[#695E59] transition hover:border-[#C9A45B] hover:text-[#5A1425] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B]"
                  >
                    {area.name}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="bg-[#5A1425] px-6 py-20 text-center text-white md:py-24">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D9BC7A]">
              Request a personalised quote
            </p>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight md:text-5xl">
              Tell us about your home in {location.name}.
            </h2>
            <p className="mx-auto mt-5 max-w-xl leading-7 text-white/75">
              Share the property, cleaning scope and preferred date. We will confirm availability
              and prepare your quotation.
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/quote" className="mt-9">
                Request a Quote
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
