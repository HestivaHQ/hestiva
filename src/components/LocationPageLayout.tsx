import { Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, MapPin } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { servicePages } from "@/content/services";
import type { LocationPage } from "@/content/locations";
import { locationBreadcrumbs } from "@/lib/breadcrumbs";

export function LocationPageLayout({ location }: { location: LocationPage }) {
  const featuredServices = servicePages.slice(0, 6);
  const breadcrumbs = locationBreadcrumbs(location.name, `/locations/${location.slug}`);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <section className="pt-32 pb-20 bg-secondary border-b border-border">
          <div className="max-w-7xl mx-auto px-6">
            <Breadcrumbs
              items={breadcrumbs}
              className="mb-8 text-muted-foreground"
              linkClassName="transition-colors hover:text-primary"
            />
            <Link
              to="/locations"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to service areas
            </Link>
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-primary font-semibold">
                <MapPin className="w-4 h-4" />
                {location.region} Service Area
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold mt-4 text-foreground leading-tight">
                Residential Cleaning in {location.name}
              </h1>
              <p className="text-lg text-muted-foreground mt-6 leading-relaxed">
                {location.heroDescription}
              </p>
              <div className="mt-8">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/quote">Request a Quote</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1.2fr_0.8fr] gap-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                Cleaning Services for {location.name}
              </h2>
              <p className="text-muted-foreground mt-4 leading-relaxed">{location.overview}</p>

              <div className="mt-10 grid sm:grid-cols-2 gap-4">
                {location.priorityServices.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-lg border border-border bg-card p-4"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <aside className="rounded-lg border border-border bg-card p-6 h-fit">
              <h2 className="text-xl font-bold text-foreground">Homes We Support</h2>
              <ul className="mt-4 space-y-3">
                {location.propertyTypes.map((propertyType) => (
                  <li key={propertyType} className="text-sm text-muted-foreground flex gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    {propertyType}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </section>

        <section className="py-20 bg-secondary">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-2xl">
              <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">
                Popular Services
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3">
                Popular Cleaning Services in {location.name}
              </h2>
              <p className="text-muted-foreground mt-4">
                Explore the residential cleaning services available for different homes, routines
                and occasions.
              </p>
            </div>
            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredServices.map((service) => (
                <article key={service.slug} className="rounded-lg border border-border bg-card p-6">
                  <h3 className="font-bold text-foreground">{service.title}</h3>
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                    {service.metaDescription}
                  </p>
                  <Link
                    to="/services/$serviceSlug"
                    params={{ serviceSlug: service.slug }}
                    className="inline-block mt-5 text-sm text-primary font-semibold"
                  >
                    Explore {service.shortTitle}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[0.8fr_1.2fr] gap-12">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">
                Questions
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3">
                {location.name} Cleaning FAQs
              </h2>
              <p className="text-muted-foreground mt-4">
                Helpful answers for households considering Hestiva cleaning services in{" "}
                {location.name}.
              </p>
            </div>
            <div className="space-y-4">
              {location.faqs.map((faq) => (
                <div key={faq.question} className="rounded-lg border border-border bg-card p-6">
                  <h3 className="font-bold text-foreground">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-secondary">
          <div className="max-w-7xl mx-auto px-6 rounded-xl border border-border bg-card p-8 md:p-10">
            <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground">
                  Need home cleaning in {location.name}?
                </h2>
                <p className="text-muted-foreground mt-3 max-w-2xl">
                  Tell Hestiva about your home, preferred service and timing, and we will help you
                  choose the right cleaning option.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {location.nearbyAreas.map((area) => (
                    <span
                      key={area}
                      className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                    >
                      Nearby: {area}
                    </span>
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
