import { Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, MapPin, MessageCircle, Phone } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { locationPages } from "@/content/locations";
import { servicePages, type ServicePage } from "@/content/services";

const trustPoints = [
  "Clear scope of work before the job starts",
  "Practical sequencing across connected trades",
  "Neat workmanship with attention to preparation",
  "Residential and commercial maintenance support",
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
    "boksburg",
  ].includes(location.slug),
);

function buildWhatsAppLink(service: ServicePage) {
  const message = `Hi Maintenance Marshall, I need help with ${service.title}.`;
  return `https://wa.me/27767816550?text=${encodeURIComponent(message)}`;
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
  const serviceHighlights = service.services.slice(0, 4);
  const relatedServices = getRelatedServices(service);
  const whatsappLink = buildWhatsAppLink(service);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <section className="pt-32 pb-20 bg-secondary">
          <div className="max-w-7xl mx-auto px-6">
            <nav
              aria-label="Breadcrumb"
              className="mb-8 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
            >
              <Link to="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link to="/services" className="hover:text-primary transition-colors">
                Services
              </Link>
              <span>/</span>
              <span className="text-foreground">{service.shortTitle}</span>
            </nav>

            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all services
            </Link>
            <div className="max-w-3xl">
              <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">
                Maintenance Marshall Services
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold mt-4 text-foreground leading-tight">
                {service.title}
              </h1>
              <p className="text-lg text-muted-foreground mt-6 leading-relaxed">
                {service.heroDescription}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg" asChild>
                  <a href="tel:+27767816550" aria-label="Call Maintenance Marshall on 076 781 6550">
                    <Phone className="w-4 h-4" />
                    Call 076 781 6550
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp Us
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="/quote">Request a Quote</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1.2fr_0.8fr] gap-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Service Overview</h2>
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
              <h2 className="text-xl font-bold text-foreground">Common Problems We Help With</h2>
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
                    <MapPin className="w-4 h-4" />
                    Service Areas
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-3">
                    {service.shortTitle} support across Gauteng
                  </h2>
                  <p className="text-muted-foreground mt-3 max-w-3xl leading-relaxed">
                    Maintenance Marshall assists residential, commercial and rental properties
                    across key Gauteng areas.
                  </p>
                </div>
                <Button variant="hero" size="lg" asChild>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    Send Job Details
                  </a>
                </Button>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {linkedServiceAreas.map((area) => (
                  <Link
                    key={area.slug}
                    to="/locations/$locationSlug"
                    params={{ locationSlug: area.slug }}
                    className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                    aria-label={`View Maintenance Marshall services in ${area.name}`}
                  >
                    {area.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-secondary">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-start">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">
                Why Clients Choose Us
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3">
                Maintenance planned around the full repair sequence
              </h2>
              <p className="text-muted-foreground mt-4 leading-relaxed">
                Many property problems are connected. A leak can affect ceilings and paintwork, a
                drain issue can affect paving, and poor preparation can shorten the life of a
                repair. Maintenance Marshall looks at the full sequence so the work is planned
                clearly and completed in the correct order.
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

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-2xl">
              <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">
                Our Process
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3">
                How We Approach This Work
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

        <section className="py-20 bg-secondary">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[0.8fr_1.2fr] gap-12">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">
                Questions
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground mt-4">
                Practical answers for clients comparing maintenance contractors in Gauteng.
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

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-2xl">
              <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">
                Related Services
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3">
                Other Maintenance Services
              </h2>
              <p className="text-muted-foreground mt-4">
                Many property problems connect across more than one trade. These related services
                help clients find the full repair sequence.
              </p>
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

        <section className="py-20 bg-secondary">
          <div className="max-w-7xl mx-auto px-6 rounded-xl border border-border bg-card p-8 md:p-10">
            <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground">
                  Need help with {service.shortTitle.toLowerCase()}?
                </h2>
                <p className="text-muted-foreground mt-3 max-w-2xl">
                  Send Maintenance Marshall the details, photos and location of the work needed. We
                  will help you turn the problem into a practical scope of work.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {serviceHighlights.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="hero" size="lg" asChild>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    WhatsApp Details
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="/quote">Request a Quote</a>
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
