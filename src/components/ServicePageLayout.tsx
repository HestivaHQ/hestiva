import { Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, MapPin, MessageCircle, Phone } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ServiceImage } from "@/components/ServiceImage";
import { serviceBreadcrumbs } from "@/lib/breadcrumbs";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { locationPages } from "@/content/locations";
import type { ServicePage } from "@/content/services";
import { indexablePublicServicePages } from "@/lib/public-service-policy";

const PHONE_NUMBER = "+27684231614";

const trustPoints = [
  "Clear cleaning scope before the booking is confirmed",
  "Thoughtful attention to high-use areas and finishing details",
  "Respectful service for occupied homes and apartments",
  "Straightforward communication from enquiry to completion",
];

const coreServiceAreaNames = new Set(["Sandton", "Randburg", "Rosebank", "Roodepoort", "Midrand"]);
const linkedServiceAreas = locationPages.filter((location) => coreServiceAreaNames.has(location.name));

function buildWhatsAppLink(service: ServicePage) {
  const message = `Hi Homent, I would like a quote for ${service.title}.`;
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

  return indexablePublicServicePages
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

const cardClass =
  "rounded-xl border border-[#E7DCC9] bg-[#FFFDF8] shadow-[0_8px_24px_rgba(59,15,26,0.04)]";

export function ServicePageLayout({ service }: { service: ServicePage }) {
  const breadcrumbs = serviceBreadcrumbs(service.title, `/services/${service.slug}`);
  const relatedServices = getRelatedServices(service);
  const whatsappLink = buildWhatsAppLink(service);

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#5F4B46]">
      <Navbar />
      <main>
        <section className="bg-[#F8F3E8] pb-20 pt-32">
          <div className="mx-auto max-w-7xl px-6">
            <Breadcrumbs
              items={breadcrumbs}
              className="mb-8 text-[#7A6861]"
              linkClassName="transition-colors hover:text-[#9A7132]"
            />

            <Link
              to="/services"
              className="mb-8 inline-flex items-center gap-2 text-sm text-[#7A6861] transition-colors hover:text-[#9A7132]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all services
            </Link>

            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#9A7132]">
                  Homent Residential Cleaning
                </span>
                <h1 className="mt-4 text-4xl font-extrabold leading-tight text-[#3B0F1A] md:text-6xl">
                  {service.title}
                </h1>
                <p className="mt-6 text-lg leading-relaxed text-[#6D5B55]">
                  {service.heroDescription}
                </p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Button variant="hero" size="lg" asChild>
                    <Link to="/quote">Request a Quote</Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-[#C9A45B]/70 bg-[#FFFDF8] text-[#3B0F1A] hover:bg-[#F4EBDD]"
                    >
                      <MessageCircle className="h-4 w-4" /> WhatsApp Homent
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <a
                      href={`tel:${PHONE_NUMBER}`}
                      aria-label="Call Homent"
                      className="border-[#C9A45B]/70 bg-[#FFFDF8] text-[#3B0F1A] hover:bg-[#F4EBDD]"
                    >
                      <Phone className="h-4 w-4" /> Call Us
                    </a>
                  </Button>
                </div>
              </div>
              {service.image && (
                <ServiceImage
                  image={service.image}
                  eager
                  className="block aspect-[3/2] overflow-hidden rounded-2xl border border-[#E7DCC9] bg-[#FFFDF8] shadow-[0_16px_40px_rgba(59,15,26,0.10)]"
                />
              )}
            </div>
          </div>
        </section>

        <section className="bg-[#FFFDF8] py-20">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h2 className="text-3xl font-bold text-[#3B0F1A]">What This Service Includes</h2>
              <p className="mt-4 leading-relaxed text-[#6D5B55]">{service.overview}</p>
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {service.services.map((item) => (
                  <div key={item} className={`${cardClass} flex items-start gap-3 p-4`}>
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#9A7132]" />
                    <span className="text-sm text-[#6D5B55]">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <aside className={`${cardClass} h-fit p-6`}>
              <h2 className="text-xl font-bold text-[#3B0F1A]">A Good Fit When You Need</h2>
              <ul className="mt-4 space-y-3">
                {service.commonProblems.map((problem) => (
                  <li key={problem} className="flex gap-2 text-sm text-[#6D5B55]">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C9A45B]" />
                    {problem}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </section>

        <section className="bg-[#F8F3E8] py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className={`${cardClass} p-6 md:p-8`}>
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#9A7132]">
                    <MapPin className="h-4 w-4" /> Service Areas
                  </div>
                  <h2 className="mt-3 text-2xl font-bold text-[#3B0F1A] md:text-3xl">
                    {service.shortTitle} across Johannesburg and Midrand
                  </h2>
                  <p className="mt-3 max-w-3xl leading-relaxed text-[#6D5B55]">
                    Explore our main service hubs below, or view all approved areas. Exact
                    availability is confirmed using your address, requested date and cleaning scope.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button variant="outline" size="lg" asChild>
                    <Link
                      to="/locations"
                      className="border-[#C9A45B]/70 bg-[#FFFDF8] text-[#3B0F1A] hover:bg-[#F4EBDD]"
                    >
                      View All Areas
                    </Link>
                  </Button>
                  <Button variant="hero" size="lg" asChild>
                    <Link to="/quote">Check Availability</Link>
                  </Button>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {linkedServiceAreas.map((area) => (
                  <Link
                    key={area.slug}
                    to="/locations/$locationSlug"
                    params={{ locationSlug: area.slug }}
                    className="rounded-full border border-[#D9C9AD] bg-[#FFFDF8] px-3 py-1 text-xs text-[#6D5B55] transition-colors hover:border-[#C9A45B] hover:text-[#9A7132]"
                    aria-label={`View Homent cleaning services in ${area.name}`}
                  >
                    Cleaning in {area.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#FFFDF8] py-20">
          <div className="mx-auto grid max-w-7xl items-start gap-12 px-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#9A7132]">
                Why Homent
              </span>
              <h2 className="mt-3 text-3xl font-bold text-[#3B0F1A] md:text-4xl">
                Cleaning planned around your home
              </h2>
              <p className="mt-4 leading-relaxed text-[#6D5B55]">
                Every household is different. We use the property details, condition, priorities and
                selected add-ons in your enquiry to prepare a cleaning scope that is clear and
                practical.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {trustPoints.map((point) => (
                <div key={point} className={`${cardClass} p-5`}>
                  <CheckCircle2 className="h-5 w-5 text-[#9A7132]" />
                  <h3 className="mt-4 font-bold text-[#3B0F1A]">{point}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#F8F3E8] py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#9A7132]">
                Our Process
              </span>
              <h2 className="mt-3 text-3xl font-bold text-[#3B0F1A] md:text-4xl">
                How the Service Is Prepared
              </h2>
            </div>
            <ol className="mt-10 grid gap-4 md:grid-cols-5">
              {service.process.map((step, index) => (
                <li key={step} className={`${cardClass} p-5`}>
                  <span className="text-xs font-bold text-[#9A7132]">STEP {index + 1}</span>
                  <p className="mt-3 text-sm leading-relaxed text-[#6D5B55]">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-[#FFFDF8] py-20">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#9A7132]">
                Questions
              </span>
              <h2 className="mt-3 text-3xl font-bold text-[#3B0F1A] md:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-[#6D5B55]">
                Helpful answers before requesting your personalised quotation.
              </p>
            </div>
            <div className="space-y-4">
              {service.faqs.map((faq) => (
                <div key={faq.question} className={`${cardClass} p-6`}>
                  <h3 className="font-bold text-[#3B0F1A]">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#6D5B55]">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#F8F3E8] py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#9A7132]">
                Related Services
              </span>
              <h2 className="mt-3 text-3xl font-bold text-[#3B0F1A] md:text-4xl">
                Explore More Cleaning Options
              </h2>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedServices.map((relatedService) => (
                <Link
                  key={relatedService.slug}
                  to="/services/$serviceSlug"
                  params={{ serviceSlug: relatedService.slug }}
                  className={`${cardClass} p-5 transition-all hover:-translate-y-0.5 hover:border-[#C9A45B] hover:shadow-[0_12px_28px_rgba(59,15,26,0.08)]`}
                >
                  <h3 className="font-bold text-[#3B0F1A]">{relatedService.shortTitle}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#6D5B55]">
                    {relatedService.heroDescription}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#FFFDF8] py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className={`${cardClass} p-8 md:p-10`}>
              <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
                <div>
                  <h2 className="text-3xl font-bold text-[#3B0F1A]">
                    Ready to request {service.shortTitle.toLowerCase()}?
                  </h2>
                  <p className="mt-3 max-w-2xl text-[#6D5B55]">
                    Tell us about your property, preferred date, home condition and any add-ons. We
                    will review the details and prepare a personalised quotation.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button variant="hero" size="lg" asChild>
                    <Link to="/quote">Request Your Quote</Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <a
                      href="mailto:quotes@homent.co.za"
                      className="border-[#C9A45B]/70 bg-[#FFFDF8] text-[#3B0F1A] hover:bg-[#F4EBDD]"
                    >
                      Email Quotes
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
