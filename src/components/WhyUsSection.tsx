import {
  CalendarCheck,
  CheckCircle2,
  HeartHandshake,
  KeyRound,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const benefits = [
  {
    icon: Sparkles,
    title: "Exceptional detail",
    text: "A considered clean with consistent standards in every room.",
  },
  {
    icon: HeartHandshake,
    title: "Care and respect",
    text: "Your home, belongings and preferences are treated thoughtfully.",
  },
  {
    icon: CalendarCheck,
    title: "Dependable service",
    text: "Clear communication and visits arranged around your routine.",
  },
];

const steps = [
  ["01", "Tell us about your home", "Share your space, priorities and preferred schedule."],
  ["02", "Receive your tailored plan", "We recommend the right service and confirm every detail."],
  [
    "03",
    "Return to a beautifully cared-for home",
    "Our team completes your clean with calm, attentive care.",
  ],
];

export function WhyUsSection() {
  return (
    <>
      <section id="why-us" className="bg-[#FFFDF8] py-24" aria-labelledby="why-heading">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#9A7132]">
              Why Homent
            </span>
            <h2 id="why-heading" className="mt-3 text-4xl font-semibold text-[#3B0F1A] md:text-5xl">
              A higher standard of home cleaning
            </h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {benefits.map((benefit) => (
              <article
                key={benefit.title}
                className="rounded-xl border border-[#E7DCC9] bg-[#FFFDF8] p-7 text-center"
              >
                <benefit.icon className="mx-auto h-7 w-7 text-[#9A7132]" aria-hidden="true" />
                <h3 className="mt-5 text-xl font-semibold text-[#3B0F1A]">{benefit.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#6D5B55]">{benefit.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F8F3E8] py-24" aria-labelledby="process-heading">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#9A7132]">
              How It Works
            </span>
            <h2
              id="process-heading"
              className="mt-3 text-4xl font-semibold text-[#3B0F1A] md:text-5xl"
            >
              Effortless from the first hello
            </h2>
          </div>
          <ol className="mt-14 grid gap-8 md:grid-cols-3">
            {steps.map(([number, title, text]) => (
              <li key={number} className="relative border-t border-[#C9A45B]/30 pt-7">
                <span className="text-sm font-semibold tracking-[0.2em] text-[#9A7132]">
                  {number}
                </span>
                <h3 className="mt-3 text-xl font-semibold text-[#3B0F1A]">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#6D5B55]">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-[#FFFDF8] py-24" aria-labelledby="safety-heading">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#9A7132]">
              Trust &amp; Safety
            </span>
            <h2
              id="safety-heading"
              className="mt-3 text-4xl font-semibold text-[#3B0F1A] md:text-5xl"
            >
              Peace of mind, built into every visit
            </h2>
            <p className="mt-5 leading-relaxed text-[#5F4B46]">
              We understand the trust involved in welcoming someone into your home. Thoughtful
              protocols, respectful conduct and careful quality checks guide every Homent visit.
            </p>
          </div>
          <div className="rounded-2xl border border-[#C9A45B]/30 bg-[#F8F3E8] p-8">
            {[
              "Carefully selected cleaning professionals",
              "Clear arrival and service communication",
              "Respectful key and access handling",
              "Quality standards checked on every visit",
            ].map((item, index) => (
              <div key={item} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                {index === 2 ? (
                  <KeyRound className="h-5 w-5 shrink-0 text-[#9A7132]" />
                ) : index === 0 ? (
                  <ShieldCheck className="h-5 w-5 shrink-0 text-[#9A7132]" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[#9A7132]" />
                )}
                <span className="text-sm text-[#5F4B46]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#3B0F1A] py-24 text-[#F5F1E8]" aria-labelledby="testimonials-heading">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C9A45B]">
            Testimonials
          </span>
          <h2 id="testimonials-heading" className="mt-3 text-4xl font-semibold md:text-5xl">
            Homes cared for beautifully
          </h2>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              "The attention to detail made our whole home feel renewed.",
              "Professional, thoughtful and wonderfully consistent every time.",
              "Homent makes coming home feel like a genuine luxury.",
            ].map((quote) => (
              <figure
                key={quote}
                className="rounded-xl border border-[#C9A45B]/25 bg-white/5 p-7 text-left"
              >
                <blockquote className="leading-relaxed text-[#F5F1E8]/85">“{quote}”</blockquote>
                <figcaption className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A45B]">
                  Homent client
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
