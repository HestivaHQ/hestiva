import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Sparkles } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { createSeoHead } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

const includedServices = [
  "Living and dining areas",
  "Bedrooms and wardrobes",
  "Kitchen surfaces",
  "Bathroom cleaning",
  "Balcony sweeping on request",
  "Vacuuming and mopping",
];

export const Route = createFileRoute("/services/apartment-cleaning")({
  component: ApartmentCleaningPage,
  head: () =>
    createSeoHead({
      title: `Apartment Cleaning | ${SITE_NAME}`,
      description:
        "Detail-led apartment cleaning for studios and multi-bedroom homes, tailored to your space and routine.",
      path: "/services/apartment-cleaning",
    }),
});

function ApartmentCleaningPage() {
  return (
    <div className="min-h-screen bg-[#F8F3E8] text-[#5F4B46]">
      <Navbar />
      <main>
        <section className="relative overflow-hidden border-b border-[#C9A45B]/25 bg-[#EDE2CF] px-6 pb-24 pt-36 md:pb-32 md:pt-44">
          <div
            aria-hidden="true"
            className="absolute -right-28 top-20 h-96 w-96 rounded-full border border-[#C9A45B]/25"
          />
          <div className="relative mx-auto max-w-7xl">
            <nav aria-label="Breadcrumb" className="mb-12 flex items-center gap-2 text-sm">
              <Link
                to="/"
                className="rounded-sm transition-colors hover:text-[#3B0F1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B]"
              >
                Home
              </Link>
              <span aria-hidden="true" className="text-[#C9A45B]">
                /
              </span>
              <Link
                to="/services"
                className="rounded-sm transition-colors hover:text-[#3B0F1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B]"
              >
                Services
              </Link>
              <span aria-hidden="true" className="text-[#C9A45B]">
                /
              </span>
              <span aria-current="page">Apartment Cleaning</span>
            </nav>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-[#9A7132]">
              Residential Cleaning Services
            </p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.08] tracking-[-0.03em] text-[#3B0F1A] sm:text-6xl md:text-7xl">
              Apartment Cleaning
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 md:text-xl">
              Efficient, detail-led care created for apartment living, from compact studios to
              generous multi-bedroom spaces.
            </p>
          </div>
        </section>

        <section className="px-6 py-20 md:py-28" aria-labelledby="included-heading">
          <div className="mx-auto grid max-w-7xl items-stretch gap-8 lg:grid-cols-2 lg:gap-14">
            <div
              role="img"
              aria-label="Apartment cleaning image placeholder"
              className="relative min-h-72 overflow-hidden rounded-2xl border border-[#C9A45B]/30 bg-[#EDE2CF] shadow-[0_18px_50px_rgba(59,15,26,0.08)] lg:min-h-[31rem]"
            >
              <div
                aria-hidden="true"
                className="absolute inset-6 rounded-xl border border-white/70"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-[#9A7132]">
                <Sparkles aria-hidden="true" className="h-8 w-8" strokeWidth={1.25} />
                <span className="text-xs font-semibold uppercase tracking-[0.24em]">
                  Image placeholder
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-center rounded-2xl border border-[#E7DCC9] bg-[#FFFDF8] p-7 shadow-[0_18px_50px_rgba(59,15,26,0.06)] sm:p-10 lg:p-12">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#9A7132]">
                Care for every room
              </p>
              <h2
                id="included-heading"
                className="text-3xl font-semibold text-[#3B0F1A] md:text-4xl"
              >
                What&apos;s Included
              </h2>
              <ul className="mt-7 grid gap-4 sm:grid-cols-2" role="list">
                {includedServices.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-[#6D5B55]">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EDE2CF] text-[#9A7132]">
                      <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-8 border-t border-[#C9A45B]/25 pt-6 text-sm leading-7">
                Our approach makes the most of every visit, leaving smaller spaces feeling open,
                orderly and wonderfully fresh.
              </p>
              <a
                href="/#contact"
                className="mt-9 inline-flex min-h-12 items-center justify-center self-start rounded-md bg-[#3B0F1A] px-7 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5 hover:bg-[#531628] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B] focus-visible:ring-offset-4 focus-visible:ring-offset-[#FFFDF8]"
              >
                Request a Quote
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
