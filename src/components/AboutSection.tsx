import { motion } from "framer-motion";
import { Heart, Home, Sparkles } from "lucide-react";

export function AboutSection() {
  return (
    <section id="about" className="bg-[#F8F3E8] py-24" aria-labelledby="about-heading">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#9A7132]">
            About Hestiva
          </span>
          <h2
            id="about-heading"
            className="mt-3 text-4xl font-semibold leading-tight text-[#3B0F1A] md:text-5xl"
          >
            The quiet luxury of a beautifully cared-for home
          </h2>
          <p className="mt-6 leading-relaxed text-[#5F4B46]">
            Hestiva was created for people who value their time, their space and the comfort of a
            home cared for with intention. We bring warmth, discretion and exacting attention to the
            everyday ritual of cleaning.
          </p>
          <p className="mt-4 leading-relaxed text-[#5F4B46]">
            Our promise is simple: dependable home care that feels personal, considered and
            consistently exceptional.
          </p>
        </motion.div>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {[
            { icon: Heart, label: "Care in every detail" },
            { icon: Home, label: "Respect for your space" },
            { icon: Sparkles, label: "Standards you can feel" },
          ].map((value) => (
            <div
              key={value.label}
              className="flex items-center gap-4 rounded-xl border border-[#E7DCC9] bg-[#FFFDF8] p-5"
            >
              <value.icon className="h-5 w-5 shrink-0 text-[#9A7132]" aria-hidden="true" />
              <span className="font-medium text-[#3B0F1A]">{value.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
