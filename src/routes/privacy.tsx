import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { createSeoHead } from "@/lib/seo";
import { createPageGraph, schemaScripts } from "@/lib/structured-data";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => {
    const title = "Privacy Policy | Hestiva Residential Cleaning";
    const description =
      "Learn how Hestiva Residential Cleaning collects, uses, protects and manages personal information in line with POPIA.";
    const path = "/privacy";
    return {
      ...createSeoHead({ title, description, path }),
      scripts: schemaScripts(createPageGraph(path, title, description)),
    };
  },
});

const sections = [
  { id: "information", label: "Information we collect" },
  { id: "purposes", label: "Why we collect it" },
  { id: "providers", label: "Service providers" },
  { id: "security", label: "Security" },
  { id: "retention", label: "Retention and deletion" },
  { id: "rights", label: "Your POPIA rights" },
  { id: "cookies", label: "Website information" },
  { id: "contact", label: "Contact and complaints" },
] as const;

const headingClass = "text-2xl font-semibold tracking-tight text-[#5A1425] md:text-3xl";
const paragraphClass = "mt-4 leading-7 text-[#695E59]";

function PrivacyPage() {
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
              <span aria-current="page">Privacy Policy</span>
            </nav>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9A742E]">
              Your privacy matters
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#5A1425] sm:text-5xl md:text-6xl">
              Privacy Policy
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#695E59]">
              This policy explains how Hestiva Residential Cleaning (“Hestiva”, “we”, “us” or “our”)
              handles personal information in accordance with South Africa’s Protection of Personal
              Information Act, 2013 (“POPIA”).
            </p>
            <p className="mt-4 text-sm font-medium text-[#5A1425]">Last updated: 2 August 2026</p>
          </div>
        </header>

        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-[15rem_minmax(0,1fr)] lg:py-24">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <nav
              aria-label="Privacy Policy sections"
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
            <section aria-labelledby="responsible-heading">
              <h2 id="responsible-heading" className={headingClass}>
                Who is responsible for your information
              </h2>
              <p className={paragraphClass}>
                Hestiva Residential Cleaning is the responsible party for the personal information
                described in this policy. Our business address is 2962 Dunlin Drive, Riverlea,
                Johannesburg, 2093. Information Officer details: <strong>To be confirmed.</strong>
              </p>
            </section>

            <section
              id="information"
              aria-labelledby="information-heading"
              className="scroll-mt-28"
            >
              <h2 id="information-heading" className={headingClass}>
                Information we collect
              </h2>
              <p className={paragraphClass}>
                We collect information you provide when asking a question, requesting a quotation,
                arranging a visit or receiving a service. Depending on your interaction, this may
                include:
              </p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  "Contact details, including your name, mobile number, email address and preferred contact method.",
                  "The service address, suburb and any estate, complex, parking or arrival details.",
                  "Property and household information, such as property type, size, rooms, storeys, occupants, pets, cameras, fragile items, allergies, restrictions and areas that are off limits.",
                  "Cleaning requirements, including the requested service, frequency, home condition, add-ons, priority areas, existing damage and special notes.",
                  "Scheduling information, including preferred dates, times, flexibility and urgency.",
                  "Access information, such as gate or complex arrangements, key handover preferences, security instructions and whether someone will be present.",
                  "Information about valuables only where you choose to tell us so that appropriate care or restrictions can be followed.",
                  "Your communications with us and records relating to quotations and service delivery.",
                ].map((item) => (
                  <li
                    key={item}
                    className="rounded-xl border border-[#E0D4C7] bg-white/70 p-4 leading-7 text-[#695E59]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <p className={paragraphClass}>
                Hestiva does not currently collect property photos through the website. If an
                optional photo-upload feature is introduced, photos will only be collected when you
                choose to provide them to help us understand the property or cleaning required. We
                will update this policy and the relevant form before using that feature.
              </p>
              <p className={paragraphClass}>
                Please provide only information that is relevant to the quotation or service, and
                obtain permission before giving us another person’s personal information.
              </p>
            </section>

            <section id="purposes" aria-labelledby="purposes-heading" className="scroll-mt-28">
              <h2 id="purposes-heading" className={headingClass}>
                Why we collect and use information
              </h2>
              <p className={paragraphClass}>
                We process personal information only for relevant business purposes, including to:
              </p>
              <ul className="mt-5 list-disc space-y-3 pl-6 leading-7 text-[#695E59] marker:text-[#C9A45B]">
                <li>respond to enquiries and prepare, discuss and manage quotations;</li>
                <li>schedule, confirm, change and coordinate cleaning visits;</li>
                <li>
                  plan and deliver the requested service safely and according to household
                  requirements;
                </li>
                <li>
                  communicate about access, staff arrival, service updates and follow-up matters;
                </li>
                <li>
                  protect customers, households, staff, property and Hestiva’s legitimate interests;
                </li>
                <li>
                  maintain appropriate business and service records and meet legal obligations; and
                </li>
                <li>investigate and resolve questions, concerns or complaints.</li>
              </ul>
              <p className={paragraphClass}>
                We rely on the justification appropriate to the circumstances, such as taking steps
                at your request before entering into an agreement, performing our agreement with
                you, meeting a legal obligation, pursuing a legitimate interest, or your consent
                where consent is required. You may withdraw consent for future processing where we
                rely on consent, without affecting processing already completed lawfully.
              </p>
            </section>

            <section id="providers" aria-labelledby="providers-heading" className="scroll-mt-28">
              <h2 id="providers-heading" className={headingClass}>
                Email, hosting and other service providers
              </h2>
              <p className={paragraphClass}>
                We may share information with staff and service providers only where reasonably
                necessary for the purposes above. This may include an email provider that transmits
                and stores enquiry messages and a hosting provider that operates the website and
                related infrastructure. Provider names: <strong>To be confirmed.</strong>
              </p>
              <p className={paragraphClass}>
                We require service providers to handle information for authorised purposes and with
                appropriate safeguards. We do not sell personal information. If a provider processes
                information outside South Africa, we will use an appropriate POPIA-compliant basis
                and safeguards for the transfer.
              </p>
            </section>

            <section id="security" aria-labelledby="security-heading" className="scroll-mt-28">
              <h2 id="security-heading" className={headingClass}>
                Information security and sensitive home details
              </h2>
              <p className={paragraphClass}>
                We use reasonable technical and organisational safeguards appropriate to the
                information and risks involved. These include limiting information access to people
                who need it for their work, using reputable providers, and reviewing access when it
                is no longer required. No internet transmission or storage method is completely
                secure, but we take reasonable steps to prevent loss, misuse, unauthorised access,
                disclosure, alteration or destruction.
              </p>
              <div className="mt-6 rounded-xl border-l-4 border-[#C9A45B] bg-[#F7F0E3] p-5">
                <h3 className="font-semibold text-[#5A1425]">Access instructions and valuables</h3>
                <p className="mt-2 leading-7 text-[#695E59]">
                  Please do not send alarm codes, safe combinations, key locations or detailed
                  valuables information through WhatsApp or an unprotected website form. Arrange a
                  safer handover method with Hestiva. We use access instructions only to enter and
                  secure the property for an agreed service, disclose them only to authorised people
                  who need them, and retain them no longer than necessary.
                </p>
              </div>
              <p className={paragraphClass}>
                If we have reasonable grounds to believe your personal information has been accessed
                or acquired by an unauthorised person, we will follow POPIA’s applicable assessment
                and notification requirements.
              </p>
            </section>

            <section id="retention" aria-labelledby="retention-heading" className="scroll-mt-28">
              <h2 id="retention-heading" className={headingClass}>
                Retention and deletion
              </h2>
              <p className={paragraphClass}>
                We keep personal information only for as long as needed for the purpose for which it
                was collected, for an agreed service, or as required or permitted by law. Retention
                periods may differ for enquiries, quotations, service records, communications and
                records needed for legal or dispute purposes. Exact retention schedule:{" "}
                <strong>To be confirmed.</strong>
              </p>
              <p className={paragraphClass}>
                When information is no longer required, we will delete or destroy it, or de-identify
                it so that it cannot reasonably identify you. You may ask us to delete information;
                we will do so where POPIA permits and no lawful reason requires its continued
                retention.
              </p>
            </section>

            <section id="rights" aria-labelledby="rights-heading" className="scroll-mt-28">
              <h2 id="rights-heading" className={headingClass}>
                Your rights under POPIA
              </h2>
              <p className={paragraphClass}>
                Subject to POPIA and any lawful limitations, you may:
              </p>
              <ul className="mt-5 list-disc space-y-3 pl-6 leading-7 text-[#695E59] marker:text-[#C9A45B]">
                <li>
                  ask whether we hold personal information about you and request access to it;
                </li>
                <li>
                  request correction or deletion of inaccurate, irrelevant, excessive, outdated,
                  incomplete, misleading or unlawfully obtained information;
                </li>
                <li>object to processing in the circumstances allowed by POPIA;</li>
                <li>withdraw consent where processing depends on your consent;</li>
                <li>
                  request the destruction or deletion of information we are no longer authorised to
                  retain; and
                </li>
                <li>complain to Hestiva or the Information Regulator.</li>
              </ul>
              <p className={paragraphClass}>
                For an access, correction, objection or deletion request, email{" "}
                <a
                  className="font-semibold text-[#5A1425] underline underline-offset-4"
                  href="mailto:info@hestiva.co.za"
                >
                  info@hestiva.co.za
                </a>
                . Please describe your request clearly. We may need to verify your identity before
                acting and will explain if POPIA permits or requires us to refuse or limit a
                request.
              </p>
            </section>

            <section id="cookies" aria-labelledby="cookies-heading" className="scroll-mt-28">
              <h2 id="cookies-heading" className={headingClass}>
                Cookies and technical website information
              </h2>
              <p className={paragraphClass}>
                Hestiva does not currently use advertising or analytics cookies on this website, and
                the public pages do not currently set cookies for visitors. The hosting
                infrastructure may automatically process limited technical information needed to
                deliver, secure and troubleshoot the website, such as IP address, browser and device
                type, requested page, date and time, referring page and error or security logs.
                Hosting log details and retention: <strong>To be confirmed.</strong>
              </p>
              <p className={paragraphClass}>
                If website cookie or analytics practices change, we will update this policy and,
                where required, provide an appropriate notice or choice before non-essential cookies
                are used.
              </p>
            </section>

            <section id="contact" aria-labelledby="contact-heading" className="scroll-mt-28">
              <h2 id="contact-heading" className={headingClass}>
                Privacy enquiries and complaints
              </h2>
              <p className={paragraphClass}>
                Please contact us first so that we can understand and try to resolve your concern.
                Send privacy enquiries, rights requests or complaints to{" "}
                <a
                  className="font-semibold text-[#5A1425] underline underline-offset-4"
                  href="mailto:info@hestiva.co.za"
                >
                  info@hestiva.co.za
                </a>
                , or write to:
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
              <p className={paragraphClass}>
                Include enough detail for us to investigate, but do not email passwords, alarm codes
                or unnecessary sensitive information. We will acknowledge and address the complaint
                as reasonably practicable. If you remain dissatisfied, you may lodge a complaint
                with South Africa’s Information Regulator. The Regulator’s current contact and
                complaint channels should be obtained from its official website.
              </p>
            </section>

            <section aria-labelledby="changes-heading">
              <h2 id="changes-heading" className={headingClass}>
                Changes to this policy
              </h2>
              <p className={paragraphClass}>
                We may update this policy when our services, website practices or legal obligations
                change. The current version and its update date will be published on this page.
              </p>
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
