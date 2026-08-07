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
  "Thoughtful residential cleaning and home care with warmth, respect and exceptional attention to detail.";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    ...createSeoHead({
      title: `${SITE_NAME} | Premium Residential Cleaning`,
      description,
      path: "/",
      keywords: [
        "residential cleaning",
        "home cleaning",
        "house cleaning",
        "cleaning services Gauteng",
        "Hestiva",
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
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
