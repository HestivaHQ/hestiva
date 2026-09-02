import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { pageBreadcrumbs } from "@/lib/breadcrumbs";
import { createSeoHead } from "@/lib/seo";
import { createBreadcrumbList, createPageGraph, schemaScripts } from "@/lib/structured-data";

const breadcrumbs = pageBreadcrumbs("Data Deletion Instructions", "/data-deletion");

export const Route = createFileRoute("/data-deletion")({
  component: DataDeletionPage,
  head: () => {
    const title = "Data Deletion Instructions | Homent";
    const description =
      "Learn how to ask Homent to delete personal information associated with Messenger, WhatsApp or a customer record.";
    const path = "/data-deletion";
    return {
      ...createSeoHead({ title, description, path }),
      scripts: schemaScripts(
        createPageGraph(path, title, description),
        createBreadcrumbList(breadcrumbs),
      ),
    };
  },
});

const headingClass = "text-2xl font-semibold tracking-tight text-[#5A1425] md:text-3xl";
const paragraphClass = "mt-4 leading-7 text-[#695E59]";
const emailLinkClass = "font-semibold text-[#5A1425] underline underline-offset-4";

function DataDeletionPage() {
  return (
    <div className="min-h-screen bg-[#FBF7EF] text-[#322B2A]">
      <Navbar />
      <main>
        <header className="border-b border-[#C9A45B]/25 bg-[#F7F0E3] px-6 pb-20 pt-32 md:pb-24 md:pt-40">
          <div className="mx-auto max-w-6xl">
            <Breadcrumbs items={breadcrumbs} className="mb-12 text-[#5F4B46]" />
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9A742E]">
              Your privacy choices
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.035em] text-[#5A1425] sm:text-5xl md:text-6xl">
              Data Deletion Instructions
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#695E59]">
              Hestiva (Pty) Ltd, trading as Homent, is responsible for the personal information
              described on this page. Follow these steps to request deletion of information held by
              Homent.
            </p>
          </div>
        </header>

        <article className="mx-auto max-w-4xl space-y-14 px-6 py-16 lg:py-24">
          <section>
            <h2 className={headingClass}>How to request deletion</h2>
            <p className={paragraphClass}>
              Email your request to{" "}
              <a className={emailLinkClass} href="mailto:info@homent.co.za">
                info@homent.co.za
              </a>
              . State that you are requesting deletion of your personal information and identify
              whether your request relates to Facebook Messenger, WhatsApp or another Homent
              customer record.
            </p>
            <p className={paragraphClass}>
              Provide only enough information for us to locate the relevant record, such as your
              name and the email address or phone number used to contact Homent. Do not send us a
              password, access token or unnecessary sensitive information.
            </p>
          </section>

          <section>
            <h2 className={headingClass}>Facebook Messenger</h2>
            <p className={paragraphClass}>
              If you interacted with Homent through Facebook Messenger, you may request deletion of
              personal information and conversation data held by Homent, subject to lawful retention
              requirements.
            </p>
          </section>

          <section>
            <h2 className={headingClass}>WhatsApp</h2>
            <p className={paragraphClass}>
              If you interacted with Homent through WhatsApp, you may request deletion of personal
              information and conversation data held by Homent, subject to lawful retention
              requirements.
            </p>
          </section>

          <section>
            <h2 className={headingClass}>Verification and completion</h2>
            <p className={paragraphClass}>
              We may need to verify your identity before acting on your request. Some records may
              need to be retained where applicable law or another legitimate legal obligation
              requires it.
            </p>
            <p className={paragraphClass}>
              Where deletion applies, Homent will delete, destroy or de-identify personal
              information that is no longer required, consistent with our{" "}
              <Link to="/privacy" className={emailLinkClass}>
                Privacy Policy
              </Link>
              .
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
