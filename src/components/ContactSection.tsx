import { ArrowRight, Mail } from "lucide-react";

export function ContactSection() {
  return (
    <section id="contact" className="py-24" aria-labelledby="contact-heading">
      <div className="mx-auto max-w-5xl px-6">
        <div className="rounded-2xl bg-[#3B0F1A] px-7 py-14 text-center shadow-xl sm:px-12">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C9A45B]">
            Your home, beautifully cared for
          </span>
          <h2
            id="contact-heading"
            className="mx-auto mt-4 max-w-2xl text-4xl font-semibold text-[#F5F1E8] md:text-5xl"
          >
            Ready to make home feel effortless?
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-[#F5F1E8]/75">
            Tell us about your home and the care you need. We will create a thoughtful cleaning plan
            around you.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="mailto:hello@hestiva.co.za?subject=Hestiva%20quote%20request"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#C9A45B] px-6 py-3 font-semibold text-[#3B0F1A] transition-colors hover:bg-[#D8B970] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F1E8]"
            >
              Request a Quote <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="mailto:hello@hestiva.co.za"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#C9A45B]/60 px-6 py-3 font-semibold text-[#F5F1E8] transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B]"
            >
              <Mail className="h-4 w-4" aria-hidden="true" /> Contact Hestiva
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
