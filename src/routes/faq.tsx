import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Plus } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { faqCategories } from "@/content/faqs";
import { pageBreadcrumbs } from "@/lib/breadcrumbs";
import { createSeoHead } from "@/lib/seo";
import { createBreadcrumbList, createPageGraph, schemaScripts } from "@/lib/structured-data";

const breadcrumbs = pageBreadcrumbs("Frequently Asked Questions", "/faq");

export const Route = createFileRoute("/faq")({
  component: FaqPage,
  head: () => {
    const title = "Home Cleaning FAQs Johannesburg & Midrand | Homent";
    const description =
      "Answers to common Homent questions about residential cleaning services, quotations, bookings, access, cancellations, payments and service concerns.";
    const path = "/faq";
    return {
      ...createSeoHead({
        title,
        description,
        path,
        keywords: [
          "home cleaning FAQ Johannesburg",
          "cleaning service questions Johannesburg",
          "residential cleaning booking questions",
          "Homent FAQ",
        ],
      }),
      scripts: schemaScripts(
        createPageGraph(path, title, description),
        createBreadcrumbList(breadcrumbs),
      ),
    };
  },
});

function FaqPage() {
  return (
    <div className="min-h-screen bg-[#FBF7EF] text-[#322B2A]">
      <Navbar />
      <main>
        <header className="relative overflow-hidden border-b border-[#C9A45B]/25 bg-[#F7F0E3] px-6 pb-24 pt-36 md:pb-32 md:pt-44">
          <div aria-hidden="true" className="absolute -right-28 top-16 h-96 w-96 rounded-full border border-[#C9A45B]/20" />
          <div className="relative mx-auto max-w-7xl">
            <Breadcrumbs items={breadcrumbs} className="mb-12 text-[#5F4B46]" linkClassName="rounded-sm transition-colors hover:text-[#3B0F1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B]" separatorClassName="text-[#C9A45B]" />
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9A7132]">Homent FAQs</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[1.08] tracking-[-0.035em] text-[#3B0F1A] sm:text-6xl md:text-7xl">Questions, answered clearly.</h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-[#5F4B46] md:text-xl">Practical answers about choosing a service, requesting a quote, preparing your home, managing a booking and what to do after a clean.</p>
          </div>
        </header>
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <nav aria-label="FAQ categories" className="mb-20 rounded-2xl border border-[#E7DCC9] bg-[#FFFDF8] p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9A7132]">Browse by topic</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {faqCategories.map((category, index) => (
                <a key={category.title} href={`#faq-category-${index + 1}`} className="rounded-full border border-[#C9A45B]/35 bg-[#F8F3E8] px-4 py-2 text-sm font-semibold text-[#3B0F1A] transition hover:border-[#9A7132] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B]">{category.title}</a>
              ))}
            </div>
          </nav>
          <div className="space-y-20">
            {faqCategories.map((category, categoryIndex) => (
              <section key={category.title} id={`faq-category-${categoryIndex + 1}`} aria-labelledby={`faq-category-heading-${categoryIndex + 1}`} className="scroll-mt-28">
                <div className="grid gap-8 lg:grid-cols-[0.34fr_0.66fr] lg:gap-16">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9A7132]">{String(categoryIndex + 1).padStart(2, "0")}</p>
                    <h2 id={`faq-category-heading-${categoryIndex + 1}`} className="mt-3 text-3xl font-semibold tracking-tight text-[#3B0F1A] md:text-4xl">{category.title}</h2>
                    <p className="mt-4 max-w-md leading-7 text-[#6D5B55]">{category.description}</p>
                  </div>
                  <div className="divide-y divide-[#C9A45B]/30 border-y border-[#C9A45B]/30">
                    {category.items.map((faq) => (
                      <details key={faq.id} className="group py-1">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left text-lg font-semibold text-[#3B0F1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B] [&::-webkit-details-marker]:hidden">
                          <span>{faq.question}</span>
                          <Plus aria-hidden="true" className="h-5 w-5 shrink-0 text-[#9A7132] transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none" />
                        </summary>
                        <p className="max-w-3xl pb-6 pr-10 leading-7 text-[#5F4B46]">{faq.answer}</p>
                      </details>
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
        <section className="border-t border-[#C9A45B]/20 bg-[#3B0F1A] px-6 py-20 text-center text-[#F5F1E8] md:py-24">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#C9A45B]">Still have a question?</p>
            <h2 className="mt-4 text-3xl font-semibold md:text-5xl">Tell us what you need to know.</h2>
            <p className="mx-auto mt-5 max-w-2xl leading-7 text-[#F5F1E8]/75">If your situation is not covered here, contact Homent or tell us about your home in a quote request and we will respond with the information relevant to your service.</p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link to="/quote" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#C9A45B] px-7 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#3B0F1A] transition hover:bg-[#D8B970] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F1E8]">Request a Quote<ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
              <Link to="/contact" className="inline-flex min-h-12 items-center justify-center rounded-md border border-[#C9A45B]/60 px-7 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#F5F1E8] transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B]">Contact Homent</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
