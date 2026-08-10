import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarCheck,
  HeartHandshake,
  ListChecks,
  MessageCircleMore,
  PawPrint,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { FounderSection } from "@/components/FounderSection";
import { Navbar } from "@/components/Navbar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { createSeoHead } from "@/lib/seo";
import { pageBreadcrumbs } from "@/lib/breadcrumbs";
import { createBreadcrumbList, createPageGraph, schemaScripts } from "@/lib/structured-data";
import { SITE_NAME } from "@/lib/site";

const principles = [
  {
    icon: HeartHandshake,
    title: "Care and respect",
    description: "We treat your home, belongings and routines with thoughtful consideration.",
  },
  {
    icon: CalendarCheck,
    title: "Dependable service",
    description:
      "We plan each visit carefully and aim to provide the same considered care each time.",
  },
  {
    icon: Sparkles,
    title: "Attention to detail",
    description:
      "We notice the finishing touches that help every room feel fresh, calm and complete.",
  },
  {
    icon: MessageCircleMore,
    title: "Clear communication",
    description:
      "We keep arrangements simple, listen closely and make it easy to share your preferences.",
  },
];

const approach = [
  {
    number: "01",
    title: "We listen",
    description:
      "We begin with your space, schedule and priorities, including the details that help you feel comfortable.",
  },
  {
    number: "02",
    title: "We prepare",
    description:
      "We shape the visit around what your home needs and make sure the plan is clear before cleaning begins.",
  },
  {
    number: "03",
    title: "We care for your home",
    description:
      "We follow the agreed plan with close attention, creating a consistently clean and welcoming result.",
  },
];

const households = [
  "Busy professionals",
  "Families",
  "Apartment residents",
  "Townhouse residents",
  "Estate homeowners",
  "Regular or once-off cleaning",
];

const breadcrumbs = pageBreadcrumbs("About", "/about");

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => {
    const title = `About ${SITE_NAME} | Trusted Residential Cleaning`;
    const description =
      "Discover Hestiva's thoughtful approach to dependable residential cleaning, respectful home care and clear communication.";
    const path = "/about";
    return {
      ...createSeoHead({ title, description, path }),
      scripts: schemaScripts(
        createPageGraph(path, title, description),
        createBreadcrumbList(breadcrumbs),
      ),
    };
  },
});

const primaryButton =
  "inline-flex min-h-12 items-center justify-center rounded-md bg-[#3B0F1A] px-7 py-3 text-center text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-[0_12px_30px_rgba(90,20,37,0.14)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#531628] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F8F3E8]";

const secondaryButton =
  "inline-flex min-h-12 items-center justify-center rounded-md border border-[#3B0F1A]/30 bg-[#FFFDF8] px-7 py-3 text-center text-sm font-semibold uppercase tracking-[0.12em] text-[#3B0F1A] transition duration-300 hover:-translate-y-0.5 hover:border-[#3B0F1A] hover:bg-[#FFFDF8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F8F3E8]";

function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8F3E8] text-[#5F4B46]">
      <Navbar />
      <main>
        <section className="relative overflow-hidden border-b border-[#C9A45B]/20 bg-[#EDE2CF] px-6 pb-24 pt-36 md:pb-32 md:pt-44">
          <div
            aria-hidden="true"
            className="absolute -right-32 top-10 h-[30rem] w-[30rem] rounded-full border border-[#C9A45B]/20"
          />
          <div
            aria-hidden="true"
            className="absolute -right-12 top-32 h-72 w-72 rounded-full bg-[#C9A45B]/[0.07]"
          />
          <div className="relative mx-auto max-w-7xl">
            <Breadcrumbs
              items={breadcrumbs}
              className="mb-12 text-[#5F4B46]"
              linkClassName="rounded-sm transition-colors hover:text-[#3B0F1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B]"
              separatorClassName="text-[#C9A45B]"
            />
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9A7132]">
              About Hestiva
            </p>
            <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[1.08] tracking-[-0.035em] text-[#3B0F1A] sm:text-6xl md:text-7xl">
              Thoughtful care for the place you call home.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#5F4B46] md:text-xl">
              Hestiva provides dependable residential cleaning with respect, consistency and close
              attention to the details that make a home feel cared for.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a href="/#contact" className={primaryButton}>
                Request a Quote
              </a>
              <Link to="/services" className={secondaryButton}>
                Explore Our Services
              </Link>
            </div>
          </div>
        </section>

        <section aria-labelledby="purpose-heading" className="px-6 py-20 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
            <p className="pt-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#9A7132]">
              Our purpose
            </p>
            <div>
              <h2
                id="purpose-heading"
                className="max-w-3xl text-3xl font-semibold tracking-tight text-[#3B0F1A] md:text-5xl"
              >
                A cleaner home should make life feel lighter.
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5F4B46]">
                Hestiva helps busy households enjoy a cleaner, calmer home without sacrificing the
                trust, comfort or consistency that matters in a personal space. We take time to
                understand what feels right for your household, then care for it with a steady,
                thoughtful approach.
              </p>
            </div>
          </div>
        </section>

        <FounderSection />

        <section aria-labelledby="principles-heading" className="bg-[#FFFDF8] px-6 py-20 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9A7132]">
                What matters to us
              </p>
              <h2
                id="principles-heading"
                className="mt-4 text-3xl font-semibold tracking-tight text-[#3B0F1A] md:text-5xl"
              >
                Why homeowners choose Hestiva
              </h2>
            </div>
            <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {principles.map(({ icon: Icon, title, description }) => (
                <article key={title} className="border-t border-[#C9A45B]/45 pt-7">
                  <Icon aria-hidden="true" className="h-7 w-7 text-[#9A7132]" strokeWidth={1.5} />
                  <h3 className="mt-5 text-xl font-semibold text-[#3B0F1A]">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#5F4B46]">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="approach-heading" className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9A7132]">
                Our approach
              </p>
              <h2
                id="approach-heading"
                className="mt-4 text-3xl font-semibold tracking-tight text-[#3B0F1A] md:text-5xl"
              >
                Considered from the very first conversation.
              </h2>
            </div>
            <ol className="relative mt-16 grid gap-12 lg:grid-cols-3 lg:gap-14">
              <div
                aria-hidden="true"
                className="absolute left-[16.66%] right-[16.66%] top-6 hidden border-t border-dashed border-[#C9A45B]/60 lg:block"
              />
              {approach.map((step) => (
                <li key={step.title} className="relative text-center">
                  <span className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#C9A45B] bg-[#F8F3E8] text-xs font-semibold tracking-[0.12em] text-[#9A7132]">
                    {step.number}
                  </span>
                  <h3 className="mt-6 text-2xl font-semibold text-[#3B0F1A]">{step.title}</h3>
                  <p className="mx-auto mt-3 max-w-sm leading-7 text-[#5F4B46]">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-labelledby="trust-heading" className="bg-[#EDE2CF] px-6 py-20 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
            <div>
              <ShieldCheck
                aria-hidden="true"
                className="h-9 w-9 text-[#9A7132]"
                strokeWidth={1.4}
              />
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.28em] text-[#9A7132]">
                Trust in the home
              </p>
              <h2
                id="trust-heading"
                className="mt-4 text-3xl font-semibold tracking-tight text-[#3B0F1A] md:text-5xl"
              >
                Your comfort guides every visit.
              </h2>
              <p className="mt-6 max-w-xl leading-7 text-[#5F4B46]">
                Inviting someone into your home is personal. That is why we make space for clear
                instructions and open, professional communication before care begins.
              </p>
            </div>
            <div className="divide-y divide-[#C9A45B]/30 border-y border-[#C9A45B]/30">
              <div className="grid gap-6 py-7 sm:grid-cols-2">
                <TrustPoint title="Personal space">
                  We respect your privacy, daily routines and the boundaries you set for your home.
                </TrustPoint>
                <TrustPoint title="Access instructions">
                  Tell us how and when your home should be accessed, and where we should arrive.
                </TrustPoint>
              </div>
              <div className="grid gap-6 py-7 sm:grid-cols-2">
                <TrustPoint title="Pets and preferences" icon={<PawPrint />}>
                  Share details about pets and any household preferences so the visit feels settled.
                </TrustPoint>
                <TrustPoint title="Fragile and private areas">
                  Point out fragile items and any restricted spaces that should not be entered or
                  cleaned.
                </TrustPoint>
              </div>
              <div className="grid gap-6 py-7 sm:grid-cols-2">
                <TrustPoint title="Professional communication">
                  We welcome clear notes, questions and feedback about your cleaning arrangements.
                </TrustPoint>
                <TrustPoint title="Confirmed-client details" icon={<ListChecks />}>
                  A future home-access and valuables declaration will help confirmed clients record
                  important instructions in one place.
                </TrustPoint>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="serve-heading" className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-end lg:gap-24">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9A7132]">
                  Who we serve
                </p>
                <h2
                  id="serve-heading"
                  className="mt-4 text-3xl font-semibold tracking-tight text-[#3B0F1A] md:text-5xl"
                >
                  Home care shaped around real life.
                </h2>
              </div>
              <p className="max-w-xl text-lg leading-8 text-[#5F4B46]">
                From compact apartments to family homes, we adapt the conversation to your space,
                household and preferred rhythm of care.
              </p>
            </div>
            <ul className="mt-12 grid gap-x-10 border-y border-[#C9A45B]/30 py-3 sm:grid-cols-2 lg:grid-cols-3">
              {households.map((household) => (
                <li
                  key={household}
                  className="flex items-center gap-3 border-b border-[#C9A45B]/20 py-5 text-[#6D5B55] last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0 lg:[&:nth-last-child(-n+3)]:border-b-0"
                >
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#9A7132]" />
                  {household}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-[#C9A45B]/20 bg-[#EDE2CF] px-6 py-20 text-center md:py-28">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9A7132]">
              Let&apos;s begin
            </p>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-[#3B0F1A] md:text-5xl">
              Ready for a home that feels beautifully cared for?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-[#5F4B46]">
              Tell us about your home and we&apos;ll prepare a personalised cleaning quotation.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <a href="/#contact" className={primaryButton}>
                Request Your Quote
              </a>
              <a href="https://wa.me/27684231614" className={secondaryButton}>
                WhatsApp 068 423 1614
              </a>
            </div>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 text-sm text-[#5F4B46] sm:flex-row sm:gap-6">
              <a
                href="mailto:quotes@hestiva.co.za"
                className="rounded-sm underline decoration-[#C9A45B] underline-offset-4 hover:text-[#3B0F1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B]"
              >
                quotes@hestiva.co.za
              </a>
              <span aria-hidden="true" className="hidden text-[#C9A45B] sm:inline">
                •
              </span>
              <a
                href="tel:+27684231614"
                className="rounded-sm underline decoration-[#C9A45B] underline-offset-4 hover:text-[#3B0F1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B]"
              >
                068 423 1614
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function TrustPoint({
  title,
  children,
  icon,
}: {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactElement;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        {icon ? (
          <span className="text-[#9A7132] [&>svg]:h-5 [&>svg]:w-5" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        <h3 className="font-semibold text-[#3B0F1A]">{title}</h3>
      </div>
      <p className="mt-2 text-sm leading-6 text-[#5F4B46]">{children}</p>
    </div>
  );
}
