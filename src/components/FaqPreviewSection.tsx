import { Link } from "@tanstack/react-router";
import { ArrowRight, Plus } from "lucide-react";
import { allFaqs } from "@/content/faqs";

const homepagePriorityFaqIds = [
  "service-areas",
  "request-quote",
  "requested-date-confirmation",
  "deposit",
  "recurring-cleaning",
  "cancel-reschedule",
] as const;

const homepageFaqs = homepagePriorityFaqIds
  .map((id) => allFaqs.find((faq) => faq.id === id))
  .filter((faq): faq is (typeof allFaqs)[number] => Boolean(faq));

export function FaqPreviewSection() {
  return (
    <section className="bg-[#F8F3E8] px-6 py-24" aria-labelledby="faq-preview-heading">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#9A7132]">
            Frequently Asked Questions
          </p>
          <h2
            id="faq-preview-heading"
            className="mt-4 text-4xl font-semibold tracking-tight text-[#3B0F1A] md:text-5xl"
          >
            A few things you may want to know first.
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#5F4B46]">
            Clear answers about quotations, bookings, services and what to expect before your
            Homent Moment.
          </p>
        </div>

        <div className="mt-14 divide-y divide-[#C9A45B]/30 border-y border-[#C9A45B]/30">
          {homepageFaqs.map((faq) => (
            <details key={faq.id} className="group py-1">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left text-lg font-semibold text-[#3B0F1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B] [&::-webkit-details-marker]:hidden">
                <span>{faq.question}</span>
                <Plus
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0 text-[#9A7132] transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
                />
              </summary>
              <p className="max-w-3xl pb-6 pr-10 leading-7 text-[#5F4B46]">{faq.answer}</p>
            </details>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/faq"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-[#3B0F1A]/30 bg-[#FFFDF8] px-7 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#3B0F1A] transition duration-300 hover:-translate-y-0.5 hover:border-[#3B0F1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F8F3E8]"
          >
            View all FAQs
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
