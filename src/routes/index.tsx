import { createFileRoute } from "@tanstack/react-router";
import { AboutSection } from "@/components/AboutSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { Navbar } from "@/components/Navbar";
import { ServicesSection } from "@/components/ServicesSection";
import { WhyUsSection } from "@/components/WhyUsSection";
import { BRAND_ASSETS, SITE_NAME, SITE_URL } from "@/lib/site";
import { createSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    ...createSeoHead({
      title: `${SITE_NAME} | Premium Residential Cleaning`,
      description:
        "Thoughtful residential cleaning and home care with warmth, respect and exceptional attention to detail.",
      path: "/",
      keywords: [
        "residential cleaning",
        "home cleaning",
        "house cleaning",
        "cleaning services Gauteng",
        "Hestiva",
      ],
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: SITE_NAME,
          image: `${SITE_URL}${BRAND_ASSETS.socialImage}`,
          url: `${SITE_URL}/`,
          areaServed: "Gauteng",
          description: "Premium residential cleaning and home care.",
        }),
      },
    ],
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
