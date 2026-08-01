import { createFileRoute } from "@tanstack/react-router";
import { AboutSection } from "@/components/AboutSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { Navbar } from "@/components/Navbar";
import { ServicesSection } from "@/components/ServicesSection";
import { WhyUsSection } from "@/components/WhyUsSection";
import { BRAND_ASSETS, SITE_NAME, SITE_URL, TAGLINE } from "@/lib/site";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: `${SITE_NAME} | Premium Residential Cleaning` },
      {
        name: "description",
        content:
          "Thoughtful residential cleaning and home care with warmth, respect and exceptional attention to detail.",
      },
      { property: "og:title", content: `${SITE_NAME} | ${TAGLINE}` },
      {
        property: "og:description",
        content: "Premium residential cleaning shaped around your home and your routine.",
      },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:image", content: `${SITE_URL}${BRAND_ASSETS.socialImage}` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/` }],
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
    <div className="min-h-screen bg-background text-foreground">
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
