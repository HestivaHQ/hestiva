import { createFileRoute } from "@tanstack/react-router";
import { AboutSection } from "@/components/AboutSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { Navbar } from "@/components/Navbar";
import { ServicesSection } from "@/components/ServicesSection";
import { WhyUsSection } from "@/components/WhyUsSection";
import { SITE_NAME } from "@/lib/site";
import { createSeoHead } from "@/lib/seo";
import { createHomepageGraph, schemaScripts } from "@/lib/structured-data";

const description =
  "Professional residential cleaning across Johannesburg and Midrand, including regular, deep, move-in and move-out cleaning tailored to your home.";

const homepageSeo = createSeoHead({
  title: `Home Cleaning Johannesburg & Midrand | ${SITE_NAME}`,
  description,
  path: "/",
  keywords: [
    "home cleaning Johannesburg",
    "residential cleaning Johannesburg",
    "house cleaning Johannesburg",
    "home cleaning Midrand",
    "cleaning services Sandton",
    "Homent",
  ],
});

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    ...homepageSeo,
    links: [
      ...homepageSeo.links,
      {
        rel: "preload",
        as: "image",
        href: "/images/home/hero-homent-living-room-1200.webp",
        type: "image/webp",
        imageSrcSet:
          "/images/home/hero-homent-living-room-480.webp 480w, /images/home/hero-homent-living-room-768.webp 768w, /images/home/hero-homent-living-room-1200.webp 1200w",
        imageSizes: "(min-width: 1280px) 720px, (min-width: 1024px) 58vw, calc(100vw - 3rem)",
        fetchPriority: "high",
      },
    ],
    scripts: schemaScripts(createHomepageGraph(description)),
  }),
});

function Index() {
  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#5F4B46]">
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <WhyUsSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
