import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const sections = [
  { id: "information-we-collect", label: "Information we collect" },
  { id: "how-we-use-information", label: "How we use it" },
  { id: "sharing", label: "Who receives it" },
  { id: "security", label: "Security" },
  { id: "retention", label: "Retention and deletion" },
  { id: "your-rights", label: "Your POPIA rights" },
  { id: "cookies", label: "Cookies and analytics" },
  { id: "contact", label: "Contact and complaints" },
] as const;

// The generated route tree is refreshed during the build.
// @ts-expect-error The route is new and is not present in the checked-in generated types yet.
export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: `Privacy Policy | ${SITE_NAME} Residential Cleaning` },
      {
        name: "description",
        content:
          "Read how Hestiva collects, uses, protects and deletes personal information for cleaning enquiries, quotations and services.",
      },
      { property: "og:title", content: `Privacy Policy | ${SITE_NAME}` },
      {
        property: "og:description",
        content:
          "How Hestiva handles personal information for residential cleaning enquiries, quotations and services.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/privacy` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/privacy` }],
  }),
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FBF7EF] text-[#342C2A]">
      <Navbar />
      <main>
        <header className="border-b border-[#C9A45B]/20 bg-[#F7F0E3] px-5 pb-16 pt-32 sm:px-6 md:pb-20 md:pt-40">
          <div className="mx-auto max-w-5xl">
            <nav aria-label="Breadcrumb" className="mb-9 flex gap-2 text-sm text-[#6B5E58]">
              <Link
                to="/"
                className="rounded-sm hover:text-[#5A1425] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B]"
              >
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">Privacy Policy</span>
            </nav>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#98732E]">
              Your information
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.035em] text-[#5A1425] sm:text-5xl md:text-6xl">
              Privacy Policy
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#695E59]">
              This policy explains, in plain language, how Hestiva Residential Cleaning handles
              personal information when you ask about, book or receive our services.
            </p>
            <p className="mt-5 text-sm font-medium text-[#695E59]">Last updated: 2 August 2026</p>
          </div>
        </header>

        <div className="mx-auto grid max-w-5xl gap-10 px-5 py-14 sm:px-6 md:py-20 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <nav
              aria-label="Privacy policy contents"
              className="rounded-xl border border-[#C9A45B]/30 bg-white/70 p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8A6729]">
                On this page
              </p>
              <ul className="mt-4 space-y-3 text-sm">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="rounded-sm text-[#5D504B] underline-offset-4 hover:text-[#5A1425] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B]"
                    >
                      {section.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <article className="min-w-0 space-y-12 text-base leading-7 text-[#5D504B]">
            <section aria-labelledby="scope-heading">
              <h2 id="scope-heading" className="text-2xl font-semibold text-[#5A1425] sm:text-3xl">
                Who this policy applies to
              </h2>
              <p className="mt-4">
                Hestiva is responsible for the personal information described here. This policy
                applies to visitors to our website and people who contact us, request a quote, book
                a cleaning service or receive a service from us.
              </p>
              <div className="mt-5 rounded-xl border border-[#C9A45B]/35 bg-[#FFFDF8] p-5">
                <p className="font-semibold text-[#5A1425]">Detail to complete</p>
                <p className="mt-2">
                  Information Officer name and dedicated contact details:{" "}
                  <strong>to be confirmed</strong>. Until then, please use the privacy contact
                  details below.
                </p>
              </div>
            </section>

            <PolicySection id="information-we-collect" title="Information we collect">
              <p>Depending on how you deal with us, we may collect:</p>
              <ul className="mt-4 list-disc space-y-2 pl-6 marker:text-[#9A742E]">
                <li>your name, phone number, email address and preferred way to be contacted;</li>
                <li>
                  the address where cleaning is requested, including suburb or complex details;
                </li>
                <li>
                  property and household information, such as property type, size, rooms, occupants,
                  pets, allergies, cameras, surfaces, cleaning condition and service preferences;
                </li>
                <li>
                  scheduling, parking and access information needed to plan a visit, including gate,
                  reception or key-handover arrangements;
                </li>
                <li>
                  cleaning notes, areas that need attention, fragile areas, restrictions and details
                  about existing damage; and
                </li>
                <li>
                  optional photos of rooms or areas needing attention, if photo upload is
                  implemented. The current quote form does not upload, store or submit selected
                  photos.
                </li>
              </ul>
              <p className="mt-4">
                Please do not send identity documents, alarm codes, key images or detailed
                information about valuables through the quote form, email or WhatsApp. We will ask
                for only the access information needed at the appropriate stage.
              </p>
            </PolicySection>

            <PolicySection id="how-we-use-information" title="Why and how we use information">
              <p>We use personal information only where it is reasonably needed to:</p>
              <ul className="mt-4 list-disc space-y-2 pl-6 marker:text-[#9A742E]">
                <li>respond to enquiries and prepare a personalised quotation;</li>
                <li>communicate with you about your request or service;</li>
                <li>check availability, arrange access and schedule cleaning visits;</li>
                <li>plan and safely deliver the cleaning service you request;</li>
                <li>handle service questions, feedback or complaints;</li>
                <li>keep appropriate business and service records; and</li>
                <li>
                  protect customers, staff, homes and our systems from misuse or security risks.
                </li>
              </ul>
              <p className="mt-4">
                We process this information to take steps you request before providing a service, to
                provide the agreed service, with your consent where appropriate, and where necessary
                for legitimate operational or legal purposes permitted by POPIA.
              </p>
            </PolicySection>

            <PolicySection id="sharing" title="Who may receive information">
              <p>
                We do not sell personal information. Information is shared only when needed for the
                purposes above. This may include Hestiva team members who arrange or perform the
                service, our email provider for sending and receiving messages, and our
                website-hosting service provider for operating and securing the website and quote
                form.
              </p>
              <p className="mt-4">
                We expect service providers handling information for us to use it only for the
                service they provide and to apply suitable safeguards. We may also disclose
                information when required by law or where necessary to protect a person or property.
              </p>
            </PolicySection>

            <PolicySection id="security" title="Information security and sensitive home details">
              <p>
                We use reasonable organisational and technical safeguards appropriate to the
                information we handle. These include limiting access to people who need the
                information for their work, using reputable service providers, and avoiding
                unnecessary collection of sensitive home-access information.
              </p>
              <p className="mt-4">
                Access instructions and information about valuables require special care. Please
                provide only general arrangements during an enquiry. If detailed access information
                is later needed, we will agree on an appropriate way to share it. Tell us promptly
                if access details change or you believe information sent to us may have been
                exposed.
              </p>
              <p className="mt-4">
                No internet or storage system is completely secure. If a security incident affects
                your information, we will assess it and take the steps required under applicable
                law.
              </p>
            </PolicySection>

            <PolicySection id="retention" title="Retention and deletion">
              <p>
                We keep personal information only for as long as it is reasonably needed for the
                enquiry, quotation, scheduling, service delivery, complaint handling, security and
                applicable record-keeping requirements. Retention periods may differ depending on
                the type of record and whether you become a customer.
              </p>
              <p className="mt-4">
                When information is no longer needed, we will delete or de-identify it where
                reasonably practicable, unless we must keep it by law or need it for an unresolved
                dispute. You may ask us to delete information; we will explain if we cannot yet do
                so.
              </p>
            </PolicySection>

            <PolicySection id="your-rights" title="Your rights under POPIA">
              <p>Subject to POPIA, you may:</p>
              <ul className="mt-4 list-disc space-y-2 pl-6 marker:text-[#9A742E]">
                <li>
                  ask whether we hold personal information about you and request access to it;
                </li>
                <li>ask us to correct or update inaccurate, incomplete or outdated information;</li>
                <li>ask us to delete information that we are no longer authorised to keep;</li>
                <li>object to certain processing or ask us to restrict it;</li>
                <li>withdraw consent where our processing depends on consent; and</li>
                <li>complain to us or to South Africa’s Information Regulator.</li>
              </ul>
              <p className="mt-4">
                To protect your information, we may ask for enough information to verify your
                identity before responding. We will consider each request under POPIA and explain
                any lawful reason why we cannot grant all or part of it.
              </p>
            </PolicySection>

            <PolicySection id="cookies" title="Cookies and analytics">
              <p>
                Hestiva does not currently use website analytics or advertising cookies. If this
                changes, we will update this policy and provide any choices or notices that are
                required. Our hosting provider may process basic technical information, such as an
                IP address and request logs, to deliver and secure the website.
              </p>
            </PolicySection>

            <PolicySection id="contact" title="Privacy requests, contact and complaints">
              <p>
                Email us to request access, correction or deletion, to object to processing, or to
                raise a privacy concern. Please use the subject line “Privacy request”.
              </p>
              <address className="mt-5 not-italic rounded-xl border border-[#C9A45B]/35 bg-white/70 p-5">
                <p className="font-semibold text-[#5A1425]">Hestiva Residential Cleaning</p>
                <p className="mt-3">
                  Privacy enquiries:{" "}
                  <a
                    className="font-semibold text-[#5A1425] underline underline-offset-4"
                    href="mailto:info@hestiva.co.za"
                  >
                    info@hestiva.co.za
                  </a>
                </p>
                <p className="mt-3">
                  2962 Dunlin Drive
                  <br />
                  Riverlea
                  <br />
                  Johannesburg
                  <br />
                  2093
                </p>
              </address>
              <p className="mt-5">
                We encourage you to contact us first so we can try to resolve your concern. You also
                have the right to lodge a complaint with South Africa’s Information Regulator. Its
                current complaint channels and forms are available on the Information Regulator’s
                official website.
              </p>
            </PolicySection>

            <section
              aria-labelledby="changes-heading"
              className="border-t border-[#C9A45B]/35 pt-10"
            >
              <h2
                id="changes-heading"
                className="text-2xl font-semibold text-[#5A1425] sm:text-3xl"
              >
                Changes to this policy
              </h2>
              <p className="mt-4">
                We may update this policy when our practices or legal requirements change. The date
                at the top shows when it was last updated.
              </p>
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function PolicySection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-28">
      <h2 id={`${id}-heading`} className="text-2xl font-semibold text-[#5A1425] sm:text-3xl">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
