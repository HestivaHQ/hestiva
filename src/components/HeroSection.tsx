import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

export function HeroSection() {
  return (
    <section className="mt-20 bg-[#F5F1E8]" aria-labelledby="hero-heading">
      <div className="mx-auto grid min-h-[calc(100svh-5rem)] max-w-7xl items-center gap-10 px-6 py-12 sm:px-8 sm:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-20 xl:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left"
        >
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.28em] text-[#9B7535]">
            Thoughtful care for your home
          </p>
          <h1
            id="hero-heading"
            className="text-5xl font-semibold leading-[1.04] tracking-[-0.035em] text-[#3B0F1A] sm:text-6xl xl:text-7xl"
          >
            Grace in Every Detail.
          </h1>
          <p className="mx-auto mt-7 max-w-lg text-lg leading-8 text-[#3B0F1A]/70 sm:text-xl lg:mx-0">
            Professional residential cleaning that gives busy households more time to enjoy the
            moments that matter.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <a
              href="#contact"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#3B0F1A] px-6 py-3 text-sm font-semibold text-[#F5F1E8] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#531626] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F1E8]"
            >
              Request Your Quote
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="#services"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#3B0F1A]/25 px-6 py-3 text-sm font-semibold text-[#3B0F1A] transition-colors duration-300 hover:border-[#9B7535] hover:bg-[#C9A45B]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F1E8]"
            >
              Explore Services
            </a>
          </div>
        </motion.div>

        <motion.figure
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.1, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-2xl"
        >
          <div
            className="absolute -bottom-4 -left-4 h-28 w-28 rounded-full bg-[#C9A45B]/15 sm:-bottom-6 sm:-left-6 sm:h-40 sm:w-40"
            aria-hidden="true"
          />
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-[0_24px_70px_rgba(59,15,26,0.14)] sm:aspect-[5/4] lg:aspect-[4/5] xl:aspect-[5/4]">
            <img
              src={heroBg}
              alt="A bright, beautifully cared-for living room ready to be enjoyed"
              width={1920}
              height={1080}
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
        </motion.figure>
      </div>
    </section>
  );
}
