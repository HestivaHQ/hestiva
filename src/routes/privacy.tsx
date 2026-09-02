import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { createSeoHead } from "@/lib/seo";
import { pageBreadcrumbs } from "@/lib/breadcrumbs";
import { createBreadcrumbList, createPageGraph, schemaScripts } from "@/lib/structured-data";

const breadcrumbs = pageBreadcrumbs("Privacy Policy", "/privacy");

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => {
    const title = "Privacy Policy | Homent Residential Cleaning";
    const description = "Learn how Homent Residential Cleaning collects, uses, protects and manages personal information in line with POPIA.";
    const path = "/privacy";
    return { ...createSeoHead({ title, description, path }), scripts: schemaScripts(createPageGraph(path, title, description), createBreadcrumbList(breadcrumbs)) };
  },
});

const headingClass = "text-2xl font-semibold tracking-tight text-[#5A1425] md:text-3xl";
const paragraphClass = "mt-4 leading-7 text-[#695E59]";

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FBF7EF] text-[#322B2A]">
      <Navbar />
      <main>
        <header className="border-b border-[#C9A45B]/25 bg-[#F7F0E3] px-6 pb-20 pt-32 md:pb-24 md:pt-40">
          <div className="mx-auto max-w-6xl">
            <Breadcrumbs items={breadcrumbs} className="mb-12 text-[#5F4B46]" />
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9A742E]">Your privacy matters</p>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.035em] text-[#5A1425] sm:text-5xl md:text-6xl">Privacy Policy</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#695E59]">This policy explains how Hestiva (Pty) Ltd, trading as Homent (“Homent”, “we”, “us” or “our”), handles personal information in accordance with South Africa’s Protection of Personal Information Act, 2013 (“POPIA”).</p>
            <p className="mt-4 text-sm font-medium text-[#5A1425]">Last updated: 24 August 2026</p>
          </div>
        </header>
        <article className="mx-auto max-w-4xl space-y-14 px-6 py-16 lg:py-24">
          <section><h2 className={headingClass}>Responsible party and Information Officer</h2><p className={paragraphClass}><strong>Hestiva (Pty) Ltd</strong>, Registration No. <strong>2026/635515/07</strong>, trading as Homent, is the responsible party for personal information described in this policy.</p><p className={paragraphClass}>Our Information Officer is <strong>Smangaliso Nkosi</strong>. POPIA access, correction, deletion, objection and other privacy requests should be sent to <a className="font-semibold text-[#5A1425] underline underline-offset-4" href="mailto:info@homent.co.za">info@homent.co.za</a>.</p></section>
          <section><h2 className={headingClass}>Information we collect and why</h2><p className={paragraphClass}>We collect information reasonably needed to answer enquiries, prepare quotations, arrange and deliver cleaning services, communicate with customers, protect customers and staff, resolve concerns and meet legal obligations. This may include contact details, service address, property and household information, cleaning requirements, scheduling details, access arrangements and communications with us.</p><p className={paragraphClass}>Please provide only information relevant to the quotation or service and obtain permission before giving us another person’s personal information.</p></section>
          <section><h2 className={headingClass}>Service providers and international processing</h2><p className={paragraphClass}>Homent uses <strong>Cloudflare</strong> for website hosting and related infrastructure and <strong>Resend</strong> for transactional email delivery. We may also use other staff or service providers where reasonably necessary to operate the business and deliver services.</p><p className={paragraphClass}>Providers receive only information reasonably necessary for their authorised purpose. We do not sell personal information. Where a provider processes information outside South Africa, Homent will use an appropriate basis and safeguards required by POPIA.</p></section>
          <section><h2 className={headingClass}>Security and access information</h2><p className={paragraphClass}>We use reasonable technical and organisational safeguards appropriate to the information and risks involved, including restricting access to people who need information for their work and using reputable service providers.</p><p className={paragraphClass}>Temporary property-access information is used only for the agreed service, shared only with authorised people who need it, and deleted when it is no longer reasonably necessary.</p></section>
          <section><h2 className={headingClass}>Retention and deletion</h2><p className={paragraphClass}>General or unsuccessful enquiries are normally retained for up to 12 months. Quotation, customer and service communications are normally retained for up to 3 years after the last interaction or service. Financial, tax and other records that law requires us to retain are kept for the applicable statutory period.</p><p className={paragraphClass}>Temporary access instructions are deleted as soon as reasonably possible after they are no longer needed. Technical and security logs are retained only as reasonably necessary for operational and security purposes and may also be subject to the applicable infrastructure provider’s retention practices. When information is no longer required, we delete, destroy or de-identify it where appropriate.</p></section>
          <section><h2 className={headingClass}>Your POPIA rights</h2><p className={paragraphClass}>Subject to POPIA and lawful limitations, you may ask whether we hold personal information about you, request access or correction, request deletion where applicable, object to qualifying processing, withdraw consent where processing depends on consent, and complain to Homent or the Information Regulator.</p><p className={paragraphClass}>Send POPIA requests to <a className="font-semibold text-[#5A1425] underline underline-offset-4" href="mailto:info@homent.co.za">info@homent.co.za</a>. We may need to verify your identity before acting on a request. See our <Link to="/data-deletion" className="font-semibold text-[#5A1425] underline underline-offset-4">Data Deletion Instructions</Link> for the information to include with a deletion request.</p></section>
          <section><h2 className={headingClass}>Cookies and technical website information</h2><p className={paragraphClass}>Homent does not currently use advertising or analytics cookies on its public website. Hosting infrastructure may automatically process limited technical information needed to deliver, secure and troubleshoot the website, such as IP address, browser or device information, requested pages, timestamps and security or error logs.</p><p className={paragraphClass}>If our cookie or analytics practices materially change, we will update this policy and provide any notice or choice required by law.</p></section>
          <section><h2 className={headingClass}>Privacy enquiries and complaints</h2><p className={paragraphClass}>For POPIA requests or privacy complaints, contact Smangaliso Nkosi at <a className="font-semibold text-[#5A1425] underline underline-offset-4" href="mailto:info@homent.co.za">info@homent.co.za</a>. General enquiries may also be sent to <a className="font-semibold text-[#5A1425] underline underline-offset-4" href="mailto:info@homent.co.za">info@homent.co.za</a>.</p></section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
