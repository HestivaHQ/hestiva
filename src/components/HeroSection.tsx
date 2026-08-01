import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

export function HeroSection() {
  return (
    <section className="relative mt-20 flex min-h-[calc(100vh-5rem)] items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Beautifully cared-for home interior"
          width={1920}
          height={1080}
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#3B0F1A]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#3B0F1A] via-[#3B0F1A]/85 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-4 h-4 text-[#C9A45B]" />
            <span className="text-xs uppercase tracking-[0.3em] text-[#C9A45B] font-semibold">
              Grace in Every Detail.
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold leading-[0.95] tracking-[0.06em] mb-8 text-[#F5F1E8]">
            HESTIVA
            <span className="block mt-4 text-2xl sm:text-3xl md:text-4xl tracking-[0.18em] text-[#C9A45B]">
              Residential Cleaning & Home Care
            </span>
          </h1>

          <p className="text-lg md:text-2xl text-[#F5F1E8]/85 max-w-2xl mb-12 leading-relaxed">
            Thoughtful residential cleaning for homes that deserve warmth, respect and exceptional
            attention to detail. We care for every space as though it were our own.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="hero" size="lg" asChild>
              <a href="#contact">
                Request a Quote
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
            <Button variant="heroOutline" size="lg" asChild>
              <a href="#services">Explore Services</a>
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-[#C9A45B]/30 pt-8">
            {[
              { value: "Care", label: "Your home treated with respect" },
              { value: "Trust", label: "Reliable and accountable service" },
              { value: "Excellence", label: "High standards in every detail" },
            ].map((stat) => (
              <div key={stat.value}>
                <div className="text-xl font-semibold text-[#C9A45B]">{stat.value}</div>
                <div className="text-xs text-[#F5F1E8]/70 uppercase tracking-wider mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
