import { createFileRoute } from "@tanstack/react-router";
import { AboutSection } from "@/components/AboutSection";
import { ContactSection } from "@/components/ContactSection";
import { FaqPreviewSection } from "@/components/FaqPreviewSection";
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

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    ...createSeoHead({
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
    }),
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
        <FaqPreviewSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
