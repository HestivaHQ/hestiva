import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { createSeoHead } from "@/lib/seo";
import { pageBreadcrumbs } from "@/lib/breadcrumbs";
import { createBreadcrumbList, createPageGraph, schemaScripts } from "@/lib/structured-data";

const breadcrumbs = pageBreadcrumbs("Terms of Service", "/terms");

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => {
    const title = "Terms of Service | Homent Residential Cleaning";
    const description = "Read the terms that apply to Homent residential cleaning quotations, bookings and services in South Africa.";
    const path = "/terms";
    return { ...createSeoHead({ title, description, path }), scripts: schemaScripts(createPageGraph(path, title, description), createBreadcrumbList(breadcrumbs)) };
  },
});

const headingClass = "text-2xl font-semibold tracking-tight text-[#5A1425] md:text-3xl";
const paragraphClass = "mt-4 leading-7 text-[#695E59]";

function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FBF7EF] text-[#322B2A]">
      <Navbar />
      <main>
        <header className="border-b border-[#C9A45B]/25 bg-[#F7F0E3] px-6 pb-20 pt-32 md:pb-24 md:pt-40">
          <div className="mx-auto max-w-6xl">
            <Breadcrumbs items={breadcrumbs} className="mb-12 text-[#5F4B46]" />
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9A742E]">Clear service expectations</p>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.035em] text-[#5A1425] sm:text-5xl md:text-6xl">Terms of Service</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#695E59]">These terms apply when a customer requests a quotation, accepts a booking and receives residential cleaning services from Homent Residential Cleaning.</p>
            <p className="mt-4 text-sm font-medium text-[#5A1425]">Last updated: 10 August 2026</p>
          </div>
        </header>
        <article className="mx-auto max-w-4xl space-y-14 px-6 py-16 lg:py-24">
          <section><h2 className={headingClass}>Quotations and bookings</h2><p className={paragraphClass}>Quotations are based on the information supplied about the property, condition, requested work and relevant circumstances. A quotation may change if the actual condition, size, access requirements or scope differs materially. Homent will explain and obtain approval before performing chargeable work outside the accepted scope.</p><p className={paragraphClass}>A requested date or automated acknowledgement is not a confirmed booking. A booking is confirmed only when Homent expressly accepts it and communicates the applicable service details.</p></section>
          <section><h2 className={headingClass}>Customer responsibilities</h2><p className={paragraphClass}>Customers must provide accurate property, scope, contact and access information; identify fragile, damaged or specialist surfaces; disclose relevant pets, allergies or product restrictions; identify off-limits areas; and promptly correct information that becomes inaccurate.</p><p className={paragraphClass}>Customers should secure cash, jewellery, important documents and unusually valuable or fragile items where reasonably possible.</p></section>
          <section><h2 className={headingClass}>Access and failed access</h2><p className={paragraphClass}>Customers must arrange safe, lawful and timely access.</p><p className={paragraphClass}>If Homent cannot gain access at the agreed time, we will make a reasonable attempt to contact the customer and allow a reasonable short waiting period. If access remains unavailable, the visit may be treated as a late cancellation. Staff will not bypass security or enter unlawfully.</p></section>
          <section><h2 className={headingClass}>Cancellations and rescheduling</h2><p className={paragraphClass}>Customers should give at least <strong>24 hours’ notice</strong> to cancel or reschedule a confirmed booking. Homent may waive consequences where circumstances reasonably justify it.</p><p className={paragraphClass}>For less than 24 hours’ notice, a no-show or failed access, Homent may charge a reasonable cancellation or attendance fee only where that fee was disclosed to the customer before the booking was accepted. Any applicable refund or rescheduling arrangement will be communicated with the booking terms.</p></section>
          <section><h2 className={headingClass}>Payment and additional work</h2><p className={paragraphClass}>The applicable price, payment deadline, payment method and any required deposit will be stated in the quotation or booking confirmation before acceptance. Homent does not apply a universal deposit percentage under these website terms.</p><p className={paragraphClass}>Work outside the accepted quotation or confirmed scope will not be charged unless the customer first approves the additional work and associated price or schedule change.</p></section>
          <section><h2 className={headingClass}>Service expectations</h2><p className={paragraphClass}>Homent will provide the accepted cleaning service with reasonable care and skill. Results depend on factors including surface age and condition, existing staining or damage, safe access, available time and agreed scope. Homent may decline or stop work that is unsafe, unlawful, outside the agreed service, requires specialist treatment or risks damage.</p></section>
          <section><h2 className={headingClass}>Complaints and remediation</h2><p className={paragraphClass}>Customers should report service concerns as soon as reasonably possible, preferably within <strong>48 hours</strong> of the service, with enough information for Homent to investigate. Homent will acknowledge the concern and aims to provide a substantive response within <strong>5 business days</strong>.</p><p className={paragraphClass}>Where a cleaning-quality concern is substantiated, Homent may first offer a reasonable remedy, including returning to correct the affected work where appropriate.</p></section>
          <section><h2 className={headingClass}>Loss or damage</h2><p className={paragraphClass}>Suspected loss or damage should be reported as soon as it is discovered, preferably within <strong>48 hours</strong>, with photographs or other relevant information where available. Homent will investigate before determining cause, responsibility or an appropriate remedy. Nothing in these terms excludes or limits rights or remedies that cannot lawfully be excluded under South African law.</p></section>
          <section><h2 className={headingClass}>Privacy and communications</h2><p className={paragraphClass}>Homent handles personal information for enquiries, quotations, bookings and service delivery as explained in our <Link to="/privacy" className="font-semibold text-[#5A1425] underline underline-offset-4">Privacy Policy</Link>.</p></section>
          <section><h2 className={headingClass}>Governing law and contact</h2><p className={paragraphClass}>These terms and Homent’s services are governed by the laws of the Republic of South Africa. Nothing in these terms removes statutory consumer rights that apply to a customer.</p><p className={paragraphClass}>General enquiries may be sent to <a className="font-semibold text-[#5A1425] underline underline-offset-4" href="mailto:info@hestiva.co.za">info@hestiva.co.za</a>. POPIA requests should be sent to <a className="font-semibold text-[#5A1425] underline underline-offset-4" href="mailto:snkosi@hestiva.co.za">snkosi@hestiva.co.za</a>.</p></section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
