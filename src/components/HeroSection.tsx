import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative mt-20 overflow-hidden bg-[#F8F3E8]">
      <div className="pointer-events-none absolute -left-32 top-24 h-80 w-80 rounded-full bg-[#C9A45B]/10 blur-3xl" />
      <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16 lg:py-20">
        <div className="max-w-2xl">
          <div className="mb-7 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C9A45B]/40 bg-white/60">
              <Sparkles className="h-4 w-4 text-[#9A7132]" aria-hidden="true" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9A7132]">
              Residential Cleaning · Johannesburg & Midrand
            </span>
          </div>

          <h1 className="mb-7 text-4xl font-semibold leading-[1.06] tracking-[-0.035em] text-[#3B0F1A] sm:text-5xl lg:text-[4rem]">
            Professional Home Cleaning, Thoughtfully Done.
          </h1>

          <p className="mb-10 max-w-xl text-lg leading-[1.75] text-[#3B0F1A]/85 sm:text-xl">
            Regular, deep, move-in and move-out cleaning for homes across our Johannesburg and
            Midrand service areas, delivered with care, consistency and attention to detail.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button variant="hero" size="lg" asChild>
              <Link
                to="/quote"
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B0F1A] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F8F3E8]"
              >
                Request Your Quote
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button variant="heroOutline" size="lg" asChild>
              <Link
                to="/services"
                className="border-[#3B0F1A] text-[#3B0F1A] hover:bg-[#3B0F1A] hover:text-[#F8F3E8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B0F1A] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F8F3E8]"
              >
                Explore Services
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-2xl lg:max-w-none">
          <div className="absolute -right-4 -top-4 h-full w-full rounded-[2rem] border border-[#C9A45B]/50 sm:-right-6 sm:-top-6" />
          <div className="relative overflow-hidden rounded-[2rem] bg-[#EDE2CF] shadow-[0_24px_60px_rgba(59,15,26,0.16)]">
            <picture>
              <source
                type="image/webp"
                srcSet="/images/home/hero-homent-living-room-480.webp 480w, /images/home/hero-homent-living-room-768.webp 768w, /images/home/hero-homent-living-room-1200.webp 1200w"
                sizes="(min-width: 1280px) 720px, (min-width: 1024px) 58vw, calc(100vw - 3rem)"
              />
              <img
                src="/images/home/hero-homent-living-room.png"
                alt="Bright, beautifully maintained living room prepared for a family to enjoy"
                width={1920}
                height={1080}
                fetchPriority="high"
                decoding="async"
                className="aspect-[4/3] h-full w-full object-cover lg:aspect-[5/4]"
              />
            </picture>
          </div>
        </div>
      </div>
    </section>
  );
}
