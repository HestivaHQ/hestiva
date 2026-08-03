import { servicePages } from "@/content/services";

export type LocationPage = {
  slug: string;
  name: string;
  region: string;
  metaTitle: string;
  metaDescription: string;
  heroDescription: string;
  overview: string;
  propertyTypes: string[];
  priorityServices: string[];
  nearbyAreas: string[];
  faqs: Array<{ question: string; answer: string }>;
};

const coreServices = servicePages.slice(0, 8).map((service) => service.shortTitle);

const areas = [
  { slug: "johannesburg", name: "Johannesburg", nearby: ["Randburg", "Roodepoort", "Midrand", "Sandton", "Kempton Park"] },
  { slug: "pretoria", name: "Pretoria", nearby: ["Centurion", "Midrand", "Kempton Park", "Johannesburg", "Sandton"] },
  { slug: "centurion", name: "Centurion", nearby: ["Pretoria", "Midrand", "Johannesburg", "Kempton Park", "Sandton"] },
  { slug: "midrand", name: "Midrand", nearby: ["Centurion", "Johannesburg", "Sandton", "Kempton Park", "Pretoria"] },
  { slug: "kempton-park", name: "Kempton Park", nearby: ["Edenvale", "Boksburg", "Benoni", "Midrand", "Johannesburg"] },
  { slug: "randburg", name: "Randburg", nearby: ["Johannesburg", "Roodepoort", "Sandton", "Midrand", "Kempton Park"] },
  { slug: "roodepoort", name: "Roodepoort", nearby: ["Randburg", "Johannesburg", "Sandton", "Midrand", "Kempton Park"] },
  { slug: "boksburg", name: "Boksburg", nearby: ["Kempton Park", "Benoni", "Edenvale", "Johannesburg", "Germiston"] },
  { slug: "benoni", name: "Benoni", nearby: ["Boksburg", "Kempton Park", "Edenvale", "Germiston", "Johannesburg"] },
  { slug: "edenvale", name: "Edenvale", nearby: ["Kempton Park", "Bedfordview", "Boksburg", "Benoni", "Johannesburg"] },
  { slug: "germiston", name: "Germiston", nearby: ["Boksburg", "Edenvale", "Benoni", "Johannesburg", "Kempton Park"] },
  { slug: "sandton", name: "Sandton", nearby: ["Johannesburg", "Randburg", "Midrand", "Roodepoort", "Kempton Park"] },
] as const;

export const locationPages: LocationPage[] = areas.map((area) => ({
  slug: area.slug,
  name: area.name,
  region: "Gauteng",
  metaTitle: `Residential Cleaning ${area.name} | Hestiva`,
  metaDescription: `Thoughtful residential cleaning in ${area.name} for homes, apartments and busy households. Request a personalised Hestiva cleaning quote.`,
  heroDescription: `Reliable residential cleaning for homes and apartments in ${area.name}, delivered with care, consistency and attention to detail.`,
  overview: `Hestiva provides residential cleaning support in ${area.name} for households that value a clean, comfortable and well-cared-for home. Our service is designed around clear communication, respectful in-home care and a straightforward quote process.`,
  propertyTypes: [
    "Family homes",
    "Apartments",
    "Townhouses",
    "Residential rental properties",
    "Move-in and move-out homes",
  ],
  priorityServices: coreServices,
  nearbyAreas: [...area.nearby],
  faqs: [
    {
      question: `Do you provide home cleaning in ${area.name}?`,
      answer: `Yes. Hestiva accepts residential cleaning enquiries from ${area.name}, subject to scheduling and service availability.`,
    },
    {
      question: `Can I request a personalised cleaning quote for a home in ${area.name}?`,
      answer: "Yes. Complete the online quote request with the property details, preferred service and any add-ons so the enquiry can be reviewed.",
    },
  ],
}));

export function getLocationPage(slug: string) {
  return locationPages.find((location) => location.slug === slug);
}
