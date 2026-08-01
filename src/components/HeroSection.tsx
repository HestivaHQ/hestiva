import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

export function HeroSection() {
  return (
    <section className="mt-20 overflow-hidden bg-[#F5F1E8]" aria-labelledby="hero-heading">
      <div className="mx-auto grid min-h-[calc(100svh-5rem)] max-w-[1600px] lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex items-center px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24 xl:px-24"
        >
          <div className="max-w-xl">
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-[#9B7535]">
              Thoughtful residential cleaning
            </p>
            <h1
              id="hero-heading"
              className="text-5xl font-semibold leading-[1.02] tracking-[-0.035em] text-[#3B0F1A] sm:text-6xl xl:text-7xl"
            >
              Grace in Every Detail.
            </h1>
            <p className="mt-7 max-w-lg text-lg leading-relaxed text-[#3B0F1A]/70 sm:text-xl">
              Professional residential cleaning that gives busy households more time to enjoy the
              moments that matter.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#contact"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#3B0F1A] px-6 py-3 text-sm font-semibold text-[#F5F1E8] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#531626] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F1E8]"
              >
                Request Your Quote
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="#services"
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#3B0F1A]/25 px-6 py-3 text-sm font-semibold text-[#3B0F1A] transition-colors duration-300 hover:border-[#C9A45B] hover:bg-[#C9A45B]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F1E8]"
              >
                Explore Services
              </a>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 1.015 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative min-h-[22rem] sm:min-h-[30rem] lg:min-h-full"
        >
          <img
            src={heroBg}
            alt="A bright, beautifully cared-for home interior"
            width={1920}
            height={1080}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
