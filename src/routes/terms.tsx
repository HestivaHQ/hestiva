import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

const canonicalUrl = "https://www.hestiva.co.za/terms";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: "Terms of Service | Hestiva Residential Cleaning" },
      {
        name: "description",
        content:
          "Read the terms that apply to Hestiva residential cleaning quotations, bookings and services in South Africa.",
      },
      { property: "og:title", content: "Terms of Service | Hestiva Residential Cleaning" },
      {
        property: "og:description",
        content:
          "Terms for requesting quotations, accepting bookings and receiving Hestiva services.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonicalUrl },
    ],
    links: [{ rel: "canonical", href: canonicalUrl }],
  }),
});

const sections = [
  { id: "quotes", label: "Quotations" },
  { id: "bookings", label: "Bookings and scheduling" },
  { id: "customer", label: "Customer responsibilities" },
  { id: "access", label: "Valuables and access" },
  { id: "changes", label: "Changes and payment" },
  { id: "service", label: "Service expectations" },
  { id: "concerns", label: "Concerns and damage" },
  { id: "privacy", label: "Privacy and messages" },
  { id: "legal", label: "Legal information" },
] as const;

const headingClass = "text-2xl font-semibold tracking-tight text-[#5A1425] md:text-3xl";
const paragraphClass = "mt-4 leading-7 text-[#695E59]";
const listClass = "mt-5 list-disc space-y-3 pl-6 leading-7 text-[#695E59] marker:text-[#C9A45B]";

function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FBF7EF] text-[#322B2A]">
      <Navbar />
      <main>
        <header className="border-b border-[#C9A45B]/25 bg-[#F7F0E3] px-6 pb-20 pt-32 md:pb-24 md:pt-40">
          <div className="mx-auto max-w-6xl">
            <nav aria-label="Breadcrumb" className="mb-10 flex gap-2 text-sm text-[#695E59]">
              <Link
                to="/"
                className="rounded-sm hover:text-[#5A1425] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B]"
              >
                Home
              </Link>
              <span aria-hidden="true" className="text-[#C9A45B]">
                /
              </span>
              <span aria-current="page">Terms of Service</span>
            </nav>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9A742E]">
              Clear service expectations
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#5A1425] sm:text-5xl md:text-6xl">
              Terms of Service
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#695E59]">
              These terms explain the conditions that apply when a customer requests a quotation,
              accepts a booking and receives residential cleaning services from Hestiva Residential
              Cleaning (“Hestiva”, “we”, “us” or “our”).
            </p>
            <p className="mt-4 text-sm font-medium text-[#5A1425]">Last updated: 3 August 2026</p>
          </div>
        </header>

        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-[15rem_minmax(0,1fr)] lg:py-24">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <nav
              aria-label="Terms of Service sections"
              className="rounded-xl border border-[#C9A45B]/30 bg-white/70 p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9A742E]">
                On this page
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="block rounded px-2 py-1.5 text-[#695E59] hover:bg-[#F7F0E3] hover:text-[#5A1425] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B]"
                    >
                      {section.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <article className="min-w-0 space-y-14">
            <section aria-labelledby="application-heading">
              <h2 id="application-heading" className={headingClass}>
                About these terms
              </h2>
              <p className={paragraphClass}>
                By accepting a booking, the customer agrees to these terms together with the
                accepted quotation and any service details Hestiva confirms in writing. If those
                documents conflict, Hestiva and the customer should clarify the applicable term in
                writing before the service begins.
              </p>
              <div className="mt-6 rounded-xl border-l-4 border-[#C9A45B] bg-[#F7F0E3] p-5 leading-7 text-[#695E59]">
                <strong className="text-[#5A1425]">Important:</strong> These terms should receive
                professional legal review before final launch. Items marked “To be confirmed” are
                unresolved business policies and must be settled and communicated before they are
                relied upon.
              </div>
            </section>

            <section id="quotes" aria-labelledby="quotes-heading" className="scroll-mt-28">
              <h2 id="quotes-heading" className={headingClass}>
                Quotations and supplied information
              </h2>
              <p className={paragraphClass}>
                Quotations are based on the information the customer supplies about the property,
                its condition, the requested work and any relevant circumstances. A quotation may
                change if an inspection or the service visit shows that the property condition,
                size, access requirements or scope differs materially from that information.
              </p>
              <p className={paragraphClass}>
                Hestiva will explain a proposed change and obtain the customer’s approval before
                performing work outside the accepted scope. A quotation request does not require
                either party to proceed. Quote enquiries may be sent to{" "}
                <a
                  href="mailto:quotes@hestiva.co.za"
                  className="font-semibold text-[#5A1425] underline underline-offset-4"
                >
                  quotes@hestiva.co.za
                </a>
                .
              </p>
            </section>

            <section id="bookings" aria-labelledby="bookings-heading" className="scroll-mt-28">
              <h2 id="bookings-heading" className={headingClass}>
                Bookings, dates and times
              </h2>
              <p className={paragraphClass}>
                A booking is not confirmed until Hestiva expressly accepts it. A requested or
                preferred date and time is a request only and remains subject to availability.
                Hestiva will communicate the accepted service details through the contact channel
                agreed with the customer.
              </p>
              <p className={paragraphClass}>
                Customers should not treat an automated form acknowledgement, quotation request or
                unanswered message as confirmation of a booking.
              </p>
            </section>

            <section id="customer" aria-labelledby="customer-heading" className="scroll-mt-28">
              <h2 id="customer-heading" className={headingClass}>
                Customer responsibilities
              </h2>
              <p className={paragraphClass}>The customer is responsible for:</p>
              <ul className={listClass}>
                <li>
                  providing accurate, complete and current property, scope, contact and access
                  information;
                </li>
                <li>
                  identifying fragile, delicate, damaged or specialist surfaces and items before
                  work starts;
                </li>
                <li>clearly identifying restricted or off-limits areas;</li>
                <li>
                  telling Hestiva about pets and making suitable arrangements to keep people and
                  animals safe during the service; and
                </li>
                <li>
                  disclosing allergies, product sensitivities or cleaning-product restrictions
                  relevant to the household or service.
                </li>
              </ul>
              <p className={paragraphClass}>
                The customer should promptly correct information that becomes inaccurate. Hestiva
                may pause or adjust the proposed service where missing or inaccurate information
                creates a safety concern or materially changes the work required.
              </p>
            </section>

            <section id="access" aria-labelledby="access-heading" className="scroll-mt-28">
              <h2 id="access-heading" className={headingClass}>
                Valuables and property access
              </h2>
              <p className={paragraphClass}>
                Confirmed customers must complete Hestiva’s valuables and home-access declaration
                before service where Hestiva requests it. The declaration should identify valuables
                requiring special handling or exclusion, existing damage, entry arrangements and
                instructions for securing the property. Declaration format and handover process:{" "}
                <strong>To be confirmed.</strong>
              </p>
              <p className={paragraphClass}>
                The customer must arrange safe, lawful and timely entry at the agreed location. If
                Hestiva is delayed or cannot enter because access information, keys, permissions or
                an authorised person are unavailable, Hestiva will contact the customer and try to
                agree a practical next step. The policy on charges or other consequences for access
                delays or failed access is <strong>To be confirmed.</strong>
              </p>
              <p className={paragraphClass}>
                Do not send alarm codes, safe combinations or detailed key locations through
                ordinary email, WhatsApp or a public website form. Contact Hestiva to arrange an
                appropriate handover method.
              </p>
            </section>

            <section id="changes" aria-labelledby="changes-heading" className="scroll-mt-28">
              <h2 id="changes-heading" className={headingClass}>
                Cancellations, rescheduling, additional work and payment
              </h2>
              <h3 className="mt-6 text-lg font-semibold text-[#5A1425]">
                Cancellations and rescheduling
              </h3>
              <p className={paragraphClass}>
                Contact Hestiva as soon as reasonably possible if a booking needs to be cancelled or
                rescheduled. Hestiva will confirm whether the requested change can be accommodated.
                Notice periods, cancellation or rescheduling charges, and any related refund policy:{" "}
                <strong>To be confirmed.</strong> No notice period, fee or refund entitlement is
                stated in these terms.
              </p>
              <h3 className="mt-7 text-lg font-semibold text-[#5A1425]">Additional work</h3>
              <p className={paragraphClass}>
                Work outside the accepted quotation or confirmed scope will not be performed unless
                the customer first approves the additional work and any associated price or schedule
                change. Approval should be recorded in writing where reasonably practicable.
              </p>
              <h3 className="mt-7 text-lg font-semibold text-[#5A1425]">Payment</h3>
              <p className={paragraphClass}>
                The customer must pay the price accepted for the confirmed service, together with
                any approved additional work. Available payment methods, whether a deposit is
                required, payment timing, invoicing arrangements and overdue-payment procedures:{" "}
                <strong>To be confirmed.</strong> Hestiva will communicate the applicable payment
                terms for acceptance before relying on them; these terms do not set a payment
                deadline or deposit percentage.
              </p>
            </section>

            <section id="service" aria-labelledby="service-heading" className="scroll-mt-28">
              <h2 id="service-heading" className={headingClass}>
                Service limitations and reasonable expectations
              </h2>
              <p className={paragraphClass}>
                Hestiva will provide the accepted residential cleaning service with reasonable care
                and skill. Results depend on factors such as a surface’s age and condition, existing
                staining or damage, safe access, available time and the agreed scope. Cleaning may
                reduce rather than completely remove long-standing stains, discolouration, odours,
                mould, mineral deposits or wear.
              </p>
              <p className={paragraphClass}>
                Hestiva may decline or stop a task that is unsafe, unlawful, outside the agreed
                service, requires specialist treatment or risks damage. Nothing in these terms is a
                promise of a particular result or a guarantee, and nothing excludes rights or
                remedies that cannot lawfully be excluded under South African law.
              </p>
            </section>

            <section id="concerns" aria-labelledby="concerns-heading" className="scroll-mt-28">
              <h2 id="concerns-heading" className={headingClass}>
                Service concerns, complaints and damage reporting
              </h2>
              <p className={paragraphClass}>
                Please report a service concern or complaint promptly to{" "}
                <a
                  href="mailto:info@hestiva.co.za"
                  className="font-semibold text-[#5A1425] underline underline-offset-4"
                >
                  info@hestiva.co.za
                </a>
                , explaining what happened and providing relevant details. Hestiva will review the
                concern, may ask reasonable follow-up questions and will communicate its response.
                Complaint response timeframes and any service-remediation policy:{" "}
                <strong>To be confirmed.</strong>
              </p>
              <p className={paragraphClass}>
                Suspected loss or damage should be reported as soon as it is discovered, with a
                description, the affected item or area, and available supporting photographs or
                records. The damage-assessment and resolution procedure is{" "}
                <strong>To be confirmed.</strong> Reporting does not by itself determine cause,
                responsibility or a remedy; Hestiva will consider the available information and
                applicable law.
              </p>
            </section>

            <section id="privacy" aria-labelledby="privacy-heading" className="scroll-mt-28">
              <h2 id="privacy-heading" className={headingClass}>
                Privacy, email and WhatsApp communications
              </h2>
              <p className={paragraphClass}>
                Hestiva handles personal information to respond to enquiries, prepare quotations,
                administer bookings and provide services. More information appears in our{" "}
                <Link
                  to="/privacy"
                  className="font-semibold text-[#5A1425] underline underline-offset-4"
                >
                  Privacy Policy
                </Link>
                . Customers should provide only relevant information and must not send unnecessary
                sensitive access or valuables details over insecure channels.
              </p>
              <p className={paragraphClass}>
                Hestiva may use the email address, phone number or WhatsApp details a customer
                provides for quotation, booking, access and service-related communications. Email
                and WhatsApp delivery may be delayed, intercepted or unavailable; urgent matters
                should be followed up through another available contact method. Customers must tell
                Hestiva if their contact details or authorised contact person changes.
              </p>
            </section>

            <section id="legal" aria-labelledby="legal-heading" className="scroll-mt-28">
              <h2 id="legal-heading" className={headingClass}>
                Changes, governing law and contact details
              </h2>
              <p className={paragraphClass}>
                Hestiva may update these terms to reflect service, business or legal changes. The
                current version and its update date will be published on this page. Changes will not
                retrospectively replace terms already accepted for a confirmed booking unless the
                customer and Hestiva agree or the law requires otherwise.
              </p>
              <p className={paragraphClass}>
                These terms and Hestiva’s services are governed by the laws of the Republic of South
                Africa. Any dispute will be handled by a court or other forum with jurisdiction
                under South African law.
              </p>
              <p className={paragraphClass}>
                General enquiries may be sent to{" "}
                <a
                  href="mailto:info@hestiva.co.za"
                  className="font-semibold text-[#5A1425] underline underline-offset-4"
                >
                  info@hestiva.co.za
                </a>
                . Quote enquiries may be sent to{" "}
                <a
                  href="mailto:quotes@hestiva.co.za"
                  className="font-semibold text-[#5A1425] underline underline-offset-4"
                >
                  quotes@hestiva.co.za
                </a>
                .
              </p>
              <address className="mt-5 not-italic leading-7 text-[#322B2A]">
                Hestiva Residential Cleaning
                <br />
                2962 Dunlin Drive
                <br />
                Riverlea
                <br />
                Johannesburg
                <br />
                2093
              </address>
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
