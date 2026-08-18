import { Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, MapPin } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { locationVisualLibrary } from "@/content/location-visuals";
import { locationPages, type LocationPage } from "@/content/locations";
import { servicePages } from "@/content/services";
import { locationBreadcrumbs } from "@/lib/breadcrumbs";

const DEAD_LOCATION_IMAGE_IDS = new Set(["3773571"]);

function pexelsSizedSrc(src: string, width: number): string {
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  return url.toString();
}

export function LocationPageLayout({ location }: { location: LocationPage }) {
  const featuredServices = servicePages.slice(0, 6);
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

        <section className="px-6 py-20 md:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-[#5A1425]">
                Cleaning Services for {location.name}
              </h2>
              <p className="mt-4 leading-7 text-[#695E59]">{location.overview}</p>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {location.priorityServices.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-[#E2D3BD] bg-[#FFFDF8] p-4"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#9A7132]" />
                    <span className="text-sm text-[#695E59]">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <aside className="h-fit rounded-3xl border border-[#C9A45B]/30 bg-[#FFFDF8] p-7 shadow-[0_16px_45px_rgba(70,42,33,0.05)]">
              <h2 className="text-xl font-semibold text-[#5A1425]">Homes We Support</h2>
              <ul className="mt-4 space-y-3">
                {location.propertyTypes.map((propertyType) => (
                  <li key={propertyType} className="flex gap-2 text-sm text-[#695E59]">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C9A45B]" />
                    {propertyType}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </section>

        <section className="border-y border-[#E6D9C8] bg-[#FFFDF8] px-6 py-20 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#76531F]">
                Popular Services
              </span>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#5A1425] md:text-4xl">
                Popular Cleaning Services in {location.name}
              </h2>
              <p className="mt-4 text-[#695E59]">
                Explore residential cleaning services for different homes, routines and occasions.
              </p>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredServices.map((service) => (
                <article
                  key={service.slug}
                  className="rounded-2xl border border-[#E2D3BD] bg-[#F8F3E8] p-6"
                >
                  <h3 className="font-semibold text-[#5A1425]">{service.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#695E59]">{service.metaDescription}</p>
                  <Link
                    to="/services/$serviceSlug"
                    params={{ serviceSlug: service.slug }}
                    className="mt-5 inline-block text-sm font-semibold text-[#8A6729] underline-offset-4 hover:underline"
                  >
                    Explore {service.shortTitle}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20 md:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#76531F]">
                Questions
              </span>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#5A1425] md:text-4xl">
                {location.name} Cleaning FAQs
              </h2>
              <p className="mt-4 text-[#695E59]">
                Helpful answers for households considering Homent cleaning services in {location.name}.
              </p>
            </div>
            <div className="space-y-4">
              {location.faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-2xl border border-[#E2D3BD] bg-[#FFFDF8] p-6"
                >
                  <h3 className="font-semibold text-[#5A1425]">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#695E59]">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-[#E6D9C8] bg-[#EDE2CF] px-6 py-20 md:py-24">
          <div className="mx-auto max-w-7xl rounded-3xl border border-[#C9A45B]/30 bg-[#FFFDF8] p-8 shadow-[0_18px_60px_rgba(70,42,33,0.06)] md:p-10">
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight text-[#5A1425]">
                  Need home cleaning in {location.name}?
                </h2>
                <p className="mt-3 max-w-2xl text-[#695E59]">
                  Tell Homent about your home, preferred service and timing, and we will help you choose the right cleaning option.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {nearbyLocations.map((area) => (
                    <Link
                      key={area.slug}
                      to="/locations/$locationSlug"
                      params={{ locationSlug: area.slug }}
                      className="rounded-full border border-[#D9C8AD] bg-[#F8F3E8] px-3 py-1 text-xs text-[#695E59] transition-colors hover:border-[#C9A45B] hover:text-[#5A1425]"
                    >
                      Cleaning in {area.name}
                    </Link>
                  ))}
                </div>
              </div>
              <Button variant="hero" size="lg" asChild>
                <Link to="/quote">Request a Quote</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
