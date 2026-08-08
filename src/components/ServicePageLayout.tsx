import { Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, MapPin, MessageCircle, Phone } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ServiceImage } from "@/components/ServiceImage";
import { serviceBreadcrumbs } from "@/lib/breadcrumbs";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { locationPages } from "@/content/locations";
import { servicePages, type ServicePage } from "@/content/services";

const PHONE_NUMBER = "+27767816550";

const trustPoints = [
  "Clear cleaning scope before the booking is confirmed",
  "Thoughtful attention to high-use areas and finishing details",
  "Respectful service for occupied homes and apartments",
  "Straightforward communication from enquiry to completion",
];

const linkedServiceAreas = locationPages.filter((location) =>
  [
    "kempton-park",
    "johannesburg",
    "pretoria",
    "centurion",
    "midrand",
    "sandton",
    "roodepoort",
    "randburg",
  ].includes(location.slug),
);

function buildWhatsAppLink(service: ServicePage) {
  const message = `Hi Hestiva, I would like a quote for ${service.title}.`;
  return `https://wa.me/${PHONE_NUMBER.replace("+", "")}?text=${encodeURIComponent(message)}`;
}

function getRelatedServices(service: ServicePage) {
  const serviceWords = new Set(
    [...service.services, ...service.commonProblems, service.title]
      .join(" ")
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((word) => word.length > 4),
  );

  return servicePages
    .filter((item) => item.slug !== service.slug)
    .map((item) => {
      const candidateText = [
        item.title,
        item.metaDescription,
        ...item.services,
        ...item.commonProblems,
      ]
        .join(" ")
        .toLowerCase();
      const score = [...serviceWords].filter((word) => candidateText.includes(word)).length;
      return { item, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(({ item }) => item);
}

export function ServicePageLayout({ service }: { service: ServicePage }) {
  const breadcrumbs = serviceBreadcrumbs(service.title, `/services/${service.slug}`);
  const relatedServices = getRelatedServices(service);
  const whatsappLink = buildWhatsAppLink(service);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <section className="pt-32 pb-20 bg-secondary">
          <div className="max-w-7xl mx-auto px-6">
            <Breadcrumbs
              items={breadcrumbs}
              className="mb-8 text-muted-foreground"
              linkClassName="transition-colors hover:text-primary"
            />

            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all services
            </Link>

            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">
                  Hestiva Residential Cleaning
                </span>
                <h1 className="text-4xl md:text-6xl font-extrabold mt-4 text-foreground leading-tight">
                  {service.title}
                </h1>
                <p className="text-lg text-muted-foreground mt-6 leading-relaxed">
                  {service.heroDescription}
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Button variant="hero" size="lg" asChild>
                    <Link to="/quote">Request a Quote</Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="w-4 h-4" /> WhatsApp Hestiva
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <a href={`tel:${PHONE_NUMBER}`} aria-label="Call Hestiva">
                      <Phone className="w-4 h-4" /> Call Us
                    </a>
                  </Button>
                </div>
              </div>
              {service.image && (
                <ServiceImage
                  image={service.image}
                  eager
                  className="block aspect-[3/2] overflow-hidden rounded-xl border border-border bg-card shadow-lg"
                />
              )}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1.2fr_0.8fr] gap-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground">What This Service Includes</h2>
              <p className="text-muted-foreground mt-4 leading-relaxed">{service.overview}</p>
              <div className="mt-10 grid sm:grid-cols-2 gap-4">
                {service.services.map((item) => (
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
              <h2 className="text-xl font-bold text-foreground">A Good Fit When You Need</h2>
              <ul className="mt-4 space-y-3">
                {service.commonProblems.map((problem) => (
                  <li key={problem} className="text-sm text-muted-foreground flex gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    {problem}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </section>

        <section className="py-16 bg-secondary">
          <div className="max-w-7xl mx-auto px-6">
            <div className="rounded-xl border border-border bg-card p-6 md:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-[0.2em]">
                    <MapPin className="w-4 h-4" /> Service Areas
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-3">
                    {service.shortTitle} across our Gauteng footprint
                  </h2>
                  <p className="text-muted-foreground mt-3 max-w-3xl leading-relaxed">
                    Availability is confirmed using your exact address, travel distance and our
                    schedule.
                  </p>
                </div>
                <Button variant="hero" size="lg" asChild>
                  <Link to="/quote">Check Availability</Link>
                </Button>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {linkedServiceAreas.map((area) => (
                  <Link
                    key={area.slug}
                    to="/locations/$locationSlug"
                    params={{ locationSlug: area.slug }}
                    className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                    aria-label={`View Hestiva cleaning services in ${area.name}`}
                  >
                    {area.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-start">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">
                Why Hestiva
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3">
                Cleaning planned around your home
              </h2>
              <p className="text-muted-foreground mt-4 leading-relaxed">
                Every household is different. We use the property details, condition, priorities and
                selected add-ons in your enquiry to prepare a cleaning scope that is clear and
                practical.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {trustPoints.map((point) => (
                <div key={point} className="rounded-lg border border-border bg-card p-5">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-foreground mt-4">{point}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-secondary">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-2xl">
              <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">
                Our Process
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3">
                How the Service Is Prepared
              </h2>
            </div>
            <ol className="mt-10 grid md:grid-cols-5 gap-4">
              {service.process.map((step, index) => (
                <li key={step} className="rounded-lg border border-border bg-card p-5">
                  <span className="text-xs font-bold text-primary">STEP {index + 1}</span>
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[0.8fr_1.2fr] gap-12">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">
                Questions
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground mt-4">
                Helpful answers before requesting your personalised quotation.
              </p>
            </div>
            <div className="space-y-4">
              {service.faqs.map((faq) => (
                <div key={faq.question} className="rounded-lg border border-border bg-card p-6">
                  <h3 className="font-bold text-foreground">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-secondary">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-2xl">
              <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">
                Related Services
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3">
                Explore More Cleaning Options
              </h2>
            </div>
            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedServices.map((relatedService) => (
                <Link
                  key={relatedService.slug}
                  to="/services/$serviceSlug"
                  params={{ serviceSlug: relatedService.slug }}
                  className="rounded-lg border border-border bg-card p-5 hover:border-primary transition-colors"
                >
                  <h3 className="font-bold text-foreground">{relatedService.shortTitle}</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    {relatedService.heroDescription}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 rounded-xl border border-border bg-card p-8 md:p-10">
            <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground">
                  Ready to request {service.shortTitle.toLowerCase()}?
                </h2>
                <p className="text-muted-foreground mt-3 max-w-2xl">
                  Tell us about your property, preferred date, home condition and any add-ons. We
                  will review the details and prepare a personalised quotation.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/quote">Request Your Quote</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="mailto:quotes@hestiva.co.za">Email Quotes</a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
