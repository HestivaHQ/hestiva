import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock3, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { createSeoHead } from "@/lib/seo";
import { pageBreadcrumbs } from "@/lib/breadcrumbs";
import { createBreadcrumbList, createPageGraph, schemaScripts } from "@/lib/structured-data";
import { SITE_NAME } from "@/lib/site";

const phoneDisplay = "068 423 1614";
const phoneLink = "tel:+27684231614";
const whatsappLink =
  "https://wa.me/27684231614?text=Hello%20Hestiva%2C%20I%20would%20like%20help%20with%20a%20residential%20cleaning%20enquiry.";

const nextSteps = [
  {
    number: "01",
    title: "Send your request",
    description: "Share a few details about your home and the cleaning support you need.",
  },
  {
    number: "02",
    title: "We review your needs",
    description: "Our team considers your enquiry, location and preferred way to connect.",
  },
  {
    number: "03",
    title: "We contact you with the next steps",
    description: "We will continue the conversation clearly and helpfully.",
  },
];

const breadcrumbs = pageBreadcrumbs("Contact", "/contact");

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => {
    const title = `Contact ${SITE_NAME} | Residential Cleaning Enquiries`;
    const description =
      "Contact Hestiva for a personalised residential cleaning quotation, a general enquiry or help with an existing booking.";
    const path = "/contact";
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
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#3B0F1A] px-7 py-3 text-center text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-[0_12px_30px_rgba(90,20,37,0.14)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#531628] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F8F3E8]";

const secondaryButton =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-[#3B0F1A]/30 bg-[#FFFDF8] px-7 py-3 text-center text-sm font-semibold uppercase tracking-[0.12em] text-[#3B0F1A] transition duration-300 hover:-translate-y-0.5 hover:border-[#3B0F1A] hover:bg-[#FFFDF8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F8F3E8]";

const fieldClass =
  "mt-2 min-h-12 w-full rounded-md border border-[#E7DCC9] bg-white px-4 py-3 text-base text-[#5F4B46] shadow-sm outline-none transition placeholder:text-[#6D5B55] hover:border-[#9A7132] focus:border-[#3B0F1A] focus:ring-2 focus:ring-[#C9A45B]/45";

function ContactPage() {
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
              Contact Hestiva
            </p>
            <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[1.08] tracking-[-0.035em] text-[#3B0F1A] sm:text-6xl md:text-7xl">
              Let&apos;s talk about your home.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#5F4B46] md:text-xl">
              Tell us what type of cleaning you need and we&apos;ll help you take the next step
              toward a cleaner, calmer home.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a href="#enquiry-form" className={primaryButton}>
                Request a Quote
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </a>
              <a href={whatsappLink} className={secondaryButton}>
                <MessageCircle aria-hidden="true" className="h-5 w-5" />
                WhatsApp Hestiva
              </a>
            </div>
          </div>
        </section>

        <section aria-labelledby="contact-options-heading" className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9A7132]">
                Contact options
              </p>
              <h2
                id="contact-options-heading"
                className="mt-4 text-3xl font-semibold tracking-tight text-[#3B0F1A] md:text-5xl"
              >
                Choose the easiest way to reach us.
              </h2>
            </div>
            <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-[#C9A45B]/30 bg-[#C9A45B]/30 sm:grid-cols-2 lg:grid-cols-4">
              <ContactCard icon={Phone} title="Phone and WhatsApp">
                <a
                  href={phoneLink}
                  className="font-semibold text-[#3B0F1A] underline decoration-[#C9A45B] underline-offset-4 transition hover:text-[#531628] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B]"
                >
                  {phoneDisplay}
                </a>
              </ContactCard>
              <ContactCard icon={Mail} title="Quote requests">
                <a
                  href="mailto:quotes@hestiva.co.za"
                  className="break-all font-semibold text-[#3B0F1A] underline decoration-[#C9A45B] underline-offset-4 transition hover:text-[#531628] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B]"
                >
                  quotes@hestiva.co.za
                </a>
              </ContactCard>
              <ContactCard icon={Mail} title="General enquiries">
                <a
                  href="mailto:info@hestiva.co.za"
                  className="break-all font-semibold text-[#3B0F1A] underline decoration-[#C9A45B] underline-offset-4 transition hover:text-[#531628] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B]"
                >
                  info@hestiva.co.za
                </a>
              </ContactCard>
              <ContactCard icon={MapPin} title="Business address">
                <address className="not-italic leading-7 text-[#6D5B55]">
                  2962 Dunlin Drive
                  <br />
                  Riverlea
                  <br />
                  Johannesburg
                  <br />
                  2093
                </address>
                <p className="mt-4 text-sm leading-6 text-[#5F4B46]">
                  This is our business address and is not necessarily a walk-in customer location.
                </p>
              </ContactCard>
            </div>
          </div>
        </section>

        <section
          id="enquiry-form"
          aria-labelledby="form-heading"
          className="bg-[#FFFDF8] px-6 py-20 md:py-28"
        >
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9A7132]">
                Enquiry form
              </p>
              <h2
                id="form-heading"
                className="mt-4 text-3xl font-semibold tracking-tight text-[#3B0F1A] md:text-5xl"
              >
                Tell us how we can help.
              </h2>
              <p id="required-note" className="mt-6 max-w-md leading-7 text-[#5F4B46]">
                Complete the form and we will continue the conversation with you. All fields are
                required.
              </p>
            </div>

            <form
              onSubmit={(event) => event.preventDefault()}
              aria-describedby="required-note form-availability"
              className="rounded-lg border border-[#C9A45B]/30 bg-[#F8F3E8] p-6 shadow-[0_20px_60px_rgba(70,37,29,0.06)] sm:p-10"
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <input
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute -left-[10000px] h-px w-px"
                />
                <FormField label="Full name" name="fullName" autoComplete="name" />
                <FormField label="Mobile number" name="mobile" type="tel" autoComplete="tel" />
                <FormField label="Email address" name="email" type="email" autoComplete="email" />
                <FormField label="Suburb" name="suburb" autoComplete="address-level2" />
                <label className="text-sm font-semibold text-[#5F4B46]">
                  Enquiry type
                  <select name="enquiryType" required defaultValue="" className={fieldClass}>
                    <option value="" disabled>
                      Select an enquiry type
                    </option>
                    <option>Request a Quote</option>
                    <option>General Enquiry</option>
                    <option>Existing Booking</option>
                    <option>Service Area Check</option>
                    <option>Feedback</option>
                  </select>
                </label>
                <label className="text-sm font-semibold text-[#5F4B46]">
                  Preferred contact method
                  <select name="preferredContact" required defaultValue="" className={fieldClass}>
                    <option value="" disabled>
                      Select a contact method
                    </option>
                    <option>Phone</option>
                    <option>WhatsApp</option>
                    <option>Email</option>
                  </select>
                </label>
                <label className="text-sm font-semibold text-[#5F4B46] sm:col-span-2">
                  Message
                  <textarea
                    name="message"
                    required
                    rows={6}
                    className={`${fieldClass} resize-y`}
                    placeholder="Tell us about your home and what you need help with."
                  />
                </label>
              </div>
              <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <button type="submit" className={primaryButton}>
                  <Send aria-hidden="true" className="h-4 w-4" />
                  Send Request
                </button>
                <a href={whatsappLink} className={secondaryButton}>
                  <MessageCircle aria-hidden="true" className="h-5 w-5" />
                  WhatsApp Hestiva
                </a>
              </div>
              <p id="form-availability" className="mt-5 text-sm leading-6 text-[#5F4B46]">
                Online submission is available. You can also send your request by email to
                <a
                  href="mailto:quotes@hestiva.co.za"
                  className="mx-1 font-semibold text-[#3B0F1A] underline decoration-[#C9A45B] underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B]"
                >
                  quotes@hestiva.co.za
                </a>
                or use WhatsApp if you prefer.
              </p>
            </form>
          </div>
        </section>

        <section aria-labelledby="whatsapp-heading" className="px-6 py-20 md:py-24">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 rounded-xl border border-[#C9A45B]/35 bg-[#EDE2CF] p-8 sm:p-12 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9A7132]">
                Optional WhatsApp contact
              </p>
              <h2 id="whatsapp-heading" className="mt-4 text-3xl font-semibold text-[#3B0F1A]">
                Prefer to message us?
              </h2>
              <p className="mt-4 leading-7 text-[#5F4B46]">
                Start a WhatsApp conversation with Hestiva on {phoneDisplay} using our short
                pre-filled message.
              </p>
            </div>
            <a href={whatsappLink} className={`${secondaryButton} shrink-0 bg-[#F8F3E8]`}>
              <MessageCircle aria-hidden="true" className="h-5 w-5" />
              Open WhatsApp
            </a>
          </div>
        </section>

        <section aria-labelledby="next-steps-heading" className="bg-[#EDE2CF] px-6 py-20 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9A7132]">
                What happens next
              </p>
              <h2
                id="next-steps-heading"
                className="mt-4 text-3xl font-semibold tracking-tight text-[#3B0F1A] md:text-5xl"
              >
                A simple, thoughtful process.
              </h2>
            </div>
            <ol className="relative mt-16 grid gap-12 lg:grid-cols-3 lg:gap-14">
              <div
                aria-hidden="true"
                className="absolute left-[16.66%] right-[16.66%] top-6 hidden border-t border-dashed border-[#C9A45B]/60 lg:block"
              />
              {nextSteps.map((step) => (
                <li key={step.number} className="relative text-center">
                  <span className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#C9A45B] bg-[#EDE2CF] text-xs font-semibold tracking-[0.12em] text-[#9A7132]">
                    {step.number}
                  </span>
                  <h3 className="mt-6 text-xl font-semibold text-[#3B0F1A]">{step.title}</h3>
                  <p className="mx-auto mt-3 max-w-sm leading-7 text-[#5F4B46]">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-labelledby="hours-heading" className="px-6 py-16 md:py-20">
          <div className="mx-auto flex max-w-4xl flex-col items-start gap-6 border-y border-[#C9A45B]/30 py-10 sm:flex-row">
            <Clock3 aria-hidden="true" className="h-8 w-8 shrink-0 text-[#9A7132]" />
            <div>
              <h2 id="hours-heading" className="text-2xl font-semibold text-[#3B0F1A]">
                Business hours
              </h2>
              <p className="mt-3 leading-7 text-[#5F4B46]">
                Our team responds during normal business hours. Confirmed service times depend on
                availability and location.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#EDE2CF] px-6 py-20 text-center md:py-28">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-4xl font-semibold tracking-tight text-[#3B0F1A] md:text-6xl">
              We&apos;re ready when you are.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-[#5F4B46]">
              Send your enquiry and we&apos;ll respond with clear, helpful next steps.
            </p>
            <a href="#enquiry-form" className={`${primaryButton} mt-9`}>
              Send Your Enquiry
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function ContactCard({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Phone;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="bg-[#FFFDF8] p-7 sm:p-8">
      <Icon aria-hidden="true" className="h-7 w-7 text-[#9A7132]" strokeWidth={1.5} />
      <h3 className="mt-5 text-sm font-semibold uppercase tracking-[0.12em] text-[#3B0F1A]">
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </article>
  );
}

function FormField({
  label,
  name,
  type = "text",
  autoComplete,
}: {
  label: string;
  name: string;
  type?: "text" | "tel" | "email";
  autoComplete: string;
}) {
  return (
    <label className="text-sm font-semibold text-[#5F4B46]">
      {label}
      <input name={name} type={type} required autoComplete={autoComplete} className={fieldClass} />
    </label>
  );
}
