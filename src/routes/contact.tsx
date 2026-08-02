import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock3, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SITE_NAME, SITE_URL } from "@/lib/site";

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

// The generated route tree is refreshed during the build.
// @ts-expect-error The route is new and is not present in the checked-in generated types yet.
export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: `Contact ${SITE_NAME} | Residential Cleaning Enquiries` },
      {
        name: "description",
        content:
          "Contact Hestiva for a personalised residential cleaning quotation, a general enquiry or help with an existing booking.",
      },
      { property: "og:title", content: `Contact ${SITE_NAME} | Residential Cleaning` },
      {
        property: "og:description",
        content:
          "Tell Hestiva what type of home cleaning you need and receive clear, helpful next steps.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/contact` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/contact` }],
  }),
});

const primaryButton =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#5A1425] px-7 py-3 text-center text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-[0_12px_30px_rgba(90,20,37,0.14)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#711C31] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B] focus-visible:ring-offset-4 focus-visible:ring-offset-[#FBF7EF]";

const secondaryButton =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-[#5A1425]/30 bg-white/60 px-7 py-3 text-center text-sm font-semibold uppercase tracking-[0.12em] text-[#5A1425] transition duration-300 hover:-translate-y-0.5 hover:border-[#5A1425] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B] focus-visible:ring-offset-4 focus-visible:ring-offset-[#FBF7EF]";

const fieldClass =
  "mt-2 min-h-12 w-full rounded-md border border-[#B9AA9E] bg-white px-4 py-3 text-base text-[#322B2A] shadow-sm outline-none transition placeholder:text-[#8A7D76] hover:border-[#8F7A69] focus:border-[#5A1425] focus:ring-2 focus:ring-[#C9A45B]/45";

function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FBF7EF] text-[#322B2A]">
      <Navbar />
      <main>
        <section className="relative overflow-hidden border-b border-[#C9A45B]/20 bg-[#F7F0E3] px-6 pb-24 pt-36 md:pb-32 md:pt-44">
          <div
            aria-hidden="true"
            className="absolute -right-32 top-10 h-[30rem] w-[30rem] rounded-full border border-[#C9A45B]/20"
          />
          <div
            aria-hidden="true"
            className="absolute -right-12 top-32 h-72 w-72 rounded-full bg-[#C9A45B]/[0.07]"
          />
          <div className="relative mx-auto max-w-7xl">
            <nav aria-label="Breadcrumb" className="mb-12 flex gap-2 text-sm text-[#695E59]">
              <Link
                to="/"
                className="rounded-sm transition-colors hover:text-[#5A1425] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B]"
              >
                Home
              </Link>
              <span aria-hidden="true" className="text-[#C9A45B]">
                /
              </span>
              <span aria-current="page">Contact</span>
            </nav>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9A742E]">
              Contact Hestiva
            </p>
            <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[1.08] tracking-[-0.035em] text-[#5A1425] sm:text-6xl md:text-7xl">
              Let&apos;s talk about your home.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#695E59] md:text-xl">
              Tell us what type of cleaning you need and we&apos;ll help you take the next step
              toward a cleaner, calmer home.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a href="/quote" className={primaryButton}>
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
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9A742E]">
                Contact options
              </p>
              <h2
                id="contact-options-heading"
                className="mt-4 text-3xl font-semibold tracking-tight text-[#5A1425] md:text-5xl"
              >
                Choose the easiest way to reach us.
              </h2>
            </div>
            <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-[#C9A45B]/30 bg-[#C9A45B]/30 sm:grid-cols-2 lg:grid-cols-4">
              <ContactCard icon={Phone} title="Phone and WhatsApp">
                <a
                  href={phoneLink}
                  className="font-semibold text-[#5A1425] underline decoration-[#C9A45B] underline-offset-4 transition hover:text-[#711C31] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B]"
                >
                  {phoneDisplay}
                </a>
              </ContactCard>
              <ContactCard icon={Mail} title="Quote requests">
                <a
                  href="mailto:quotes@hestiva.co.za"
                  className="break-all font-semibold text-[#5A1425] underline decoration-[#C9A45B] underline-offset-4 transition hover:text-[#711C31] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B]"
                >
                  quotes@hestiva.co.za
                </a>
              </ContactCard>
              <ContactCard icon={Mail} title="General enquiries">
                <a
                  href="mailto:info@hestiva.co.za"
                  className="break-all font-semibold text-[#5A1425] underline decoration-[#C9A45B] underline-offset-4 transition hover:text-[#711C31] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B]"
                >
                  info@hestiva.co.za
                </a>
              </ContactCard>
              <ContactCard icon={MapPin} title="Business address">
                <address className="not-italic leading-7 text-[#4F4642]">
                  2962 Dunlin Drive
                  <br />
                  Riverlea
                  <br />
                  Johannesburg
                  <br />
                  2093
                </address>
                <p className="mt-4 text-sm leading-6 text-[#695E59]">
                  This is our business address and is not necessarily a walk-in customer location.
                </p>
              </ContactCard>
            </div>
          </div>
        </section>

        <section
          id="enquiry-form"
          aria-labelledby="form-heading"
          className="bg-white/70 px-6 py-20 md:py-28"
        >
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9A742E]">
                Enquiry form
              </p>
              <h2
                id="form-heading"
                className="mt-4 text-3xl font-semibold tracking-tight text-[#5A1425] md:text-5xl"
              >
                Tell us how we can help.
              </h2>
              <p id="required-note" className="mt-6 max-w-md leading-7 text-[#695E59]">
                Complete the form and we will continue the conversation with you. All fields are
                required.
              </p>
            </div>

            <form
              onSubmit={(event) => event.preventDefault()}
              aria-describedby="required-note form-availability"
              className="rounded-lg border border-[#C9A45B]/30 bg-[#FBF7EF] p-6 shadow-[0_20px_60px_rgba(70,37,29,0.06)] sm:p-10"
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <FormField label="Full name" name="fullName" autoComplete="name" />
                <FormField label="Mobile number" name="mobile" type="tel" autoComplete="tel" />
                <FormField label="Email address" name="email" type="email" autoComplete="email" />
                <FormField label="Suburb" name="suburb" autoComplete="address-level2" />
                <label className="text-sm font-semibold text-[#4A3435]">
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
                <label className="text-sm font-semibold text-[#4A3435]">
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
                <label className="text-sm font-semibold text-[#4A3435] sm:col-span-2">
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
              <p id="form-availability" className="mt-5 text-sm leading-6 text-[#695E59]">
                Online submission is not yet available. To send your request now, please email
                <a
                  href="mailto:quotes@hestiva.co.za"
                  className="mx-1 font-semibold text-[#5A1425] underline decoration-[#C9A45B] underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B]"
                >
                  quotes@hestiva.co.za
                </a>
                or use WhatsApp.
              </p>
            </form>
          </div>
        </section>

        <section aria-labelledby="whatsapp-heading" className="px-6 py-20 md:py-24">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 rounded-xl border border-[#C9A45B]/35 bg-[#F3EBDD] p-8 sm:p-12 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9A742E]">
                Optional WhatsApp contact
              </p>
              <h2 id="whatsapp-heading" className="mt-4 text-3xl font-semibold text-[#5A1425]">
                Prefer to message us?
              </h2>
              <p className="mt-4 leading-7 text-[#695E59]">
                Start a WhatsApp conversation with Hestiva on {phoneDisplay} using our short
                pre-filled message.
              </p>
            </div>
            <a href={whatsappLink} className={`${secondaryButton} shrink-0 bg-[#FBF7EF]`}>
              <MessageCircle aria-hidden="true" className="h-5 w-5" />
              Open WhatsApp
            </a>
          </div>
        </section>

        <section aria-labelledby="next-steps-heading" className="bg-[#F7F0E3] px-6 py-20 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9A742E]">
                What happens next
              </p>
              <h2
                id="next-steps-heading"
                className="mt-4 text-3xl font-semibold tracking-tight text-[#5A1425] md:text-5xl"
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
                  <span className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#C9A45B] bg-[#F7F0E3] text-xs font-semibold tracking-[0.12em] text-[#8A6729]">
                    {step.number}
                  </span>
                  <h3 className="mt-6 text-xl font-semibold text-[#5A1425]">{step.title}</h3>
                  <p className="mx-auto mt-3 max-w-sm leading-7 text-[#695E59]">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-labelledby="hours-heading" className="px-6 py-16 md:py-20">
          <div className="mx-auto flex max-w-4xl flex-col items-start gap-6 border-y border-[#C9A45B]/30 py-10 sm:flex-row">
            <Clock3 aria-hidden="true" className="h-8 w-8 shrink-0 text-[#9A742E]" />
            <div>
              <h2 id="hours-heading" className="text-2xl font-semibold text-[#5A1425]">
                Business hours
              </h2>
              <p className="mt-3 leading-7 text-[#695E59]">
                Our team responds during normal business hours. Confirmed service times depend on
                availability and location.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#F3EBDD] px-6 py-20 text-center md:py-28">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-4xl font-semibold tracking-tight text-[#5A1425] md:text-6xl">
              We&apos;re ready when you are.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-[#695E59]">
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
    <article className="bg-[#FFFCF7] p-7 sm:p-8">
      <Icon aria-hidden="true" className="h-7 w-7 text-[#9A742E]" strokeWidth={1.5} />
      <h3 className="mt-5 text-sm font-semibold uppercase tracking-[0.12em] text-[#5A1425]">
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
    <label className="text-sm font-semibold text-[#4A3435]">
      {label}
      <input name={name} type={type} required autoComplete={autoComplete} className={fieldClass} />
    </label>
  );
}
