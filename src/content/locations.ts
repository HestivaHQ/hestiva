import { servicePages } from "@/content/services";
import { approvedServiceAreas, serviceAreaClusters } from "@/content/service-areas";

export type LocationVisual = {
  src?: string;
  alt: string;
  credit?: string;
  brief: string;
};

export type LocationPage = {
  slug: string;
  name: string;
  region: string;
  cluster: string;
  metaTitle: string;
  metaDescription: string;
  heroDescription: string;
  overview: string;
  propertyTypes: string[];
  priorityServices: string[];
  nearbyAreas: string[];
  visual: LocationVisual;
  faqs: Array<{ question: string; answer: string }>;
};

const coreServices = servicePages.slice(0, 8).map((service) => service.shortTitle);

const clusterCopy: Record<
  string,
  { hero: string; overview: string; propertyTypes: string[]; visualContext: string }
> = {
  "Sandton / Johannesburg North": {
    hero:
      "Thoughtful residential cleaning with clear access planning, flexible service choices and careful attention to the details of your home.",
    overview:
      "Hestiva supports homes across Johannesburg North with regular, deep, move-in and move-out cleaning shaped around the property, access requirements and selected add-ons.",
    propertyTypes: ["Family homes", "Apartments", "Townhouses", "Estate and complex homes", "Move-in and move-out homes"],
    visualContext: "Johannesburg North residential context with a polished urban or suburban feel",
  },
  Randburg: {
    hero:
      "Reliable home cleaning for busy households, recurring routines and one-off resets across the Randburg service area.",
    overview:
      "Hestiva provides flexible residential cleaning across Randburg and its surrounding suburbs, with the quote process capturing the home layout, service frequency and any details that affect the visit.",
    propertyTypes: ["Family homes", "Apartments", "Townhouses", "Residential rental properties", "Recurring-cleaning households"],
    visualContext: "believable Randburg residential streetscape, apartment or townhouse setting",
  },
  "Rosebank / Central-North Johannesburg": {
    hero:
      "Residential cleaning planned around the way you use your home, with simple booking details and a clear service scope.",
    overview:
      "Hestiva serves households across Rosebank and central-north Johannesburg with practical cleaning options for everyday upkeep, deeper cleaning and moving periods.",
    propertyTypes: ["Apartments", "Family homes", "Townhouses", "Residential rental properties", "Homes preparing for guests or events"],
    visualContext: "central-north Johannesburg residential context with an urban-neighbourhood feel",
  },
  "Roodepoort / Johannesburg West": {
    hero:
      "Practical residential cleaning for homes across Johannesburg West, from recurring upkeep to deeper one-off cleaning.",
    overview:
      "Hestiva supports households across the Roodepoort and Johannesburg West corridor with property-specific cleaning scopes, clear access information and optional add-ons where needed.",
    propertyTypes: ["Family homes", "Townhouses", "Apartments", "Multi-room homes", "Move-in and move-out homes"],
    visualContext: "Johannesburg West residential setting with a familiar suburban-home feel",
  },
  "Midrand / Waterfall / Kyalami": {
    hero:
      "Flexible residential cleaning with access, scheduling and property details captured before the visit.",
    overview:
      "Hestiva provides home cleaning across Midrand, Waterfall and Kyalami for apartments, townhouses, complexes and family homes, with each request scoped through the online quote flow.",
    propertyTypes: ["Apartments", "Townhouses", "Family homes", "Estate and complex homes", "Recurring-cleaning households"],
    visualContext: "Midrand, Waterfall or Kyalami residential context with apartment, townhouse or estate-style cues",
  },
};

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function clusterFor(name: string) {
  return serviceAreaClusters.find((cluster) => cluster.areas.some((area) => area === name));
}

function nearbyAreasFor(name: string) {
  const cluster = clusterFor(name);
  if (!cluster) return [];

  const index = cluster.areas.findIndex((area) => area === name);
  const offsets = [1, -1, 2, -2];

  return offsets
    .map((offset) => cluster.areas[(index + offset + cluster.areas.length) % cluster.areas.length])
    .filter((area) => area !== name)
    .slice(0, 4);
}

export const locationPages: LocationPage[] = approvedServiceAreas.map((name) => {
  const cluster = clusterFor(name);
  if (!cluster) throw new Error(`Missing service-area cluster for ${name}`);

  const copy = clusterCopy[cluster.name];
  if (!copy) throw new Error(`Missing location copy for ${cluster.name}`);

  return {
    slug: slugify(name),
    name,
    region: "Gauteng",
    cluster: cluster.name,
    metaTitle: `Residential Cleaning ${name} | Hestiva`,
    metaDescription: `Residential cleaning in ${name} for homes, apartments and townhouses. Request a Hestiva quote for regular, deep, move-in or move-out cleaning.`,
    heroDescription: `${copy.hero} Hestiva serves ${name} as part of the ${cluster.name} service cluster.`,
    overview: `${copy.overview} For a home in ${name}, the quote form records the property layout, preferred service, access details and any optional extras before the request is reviewed.`,
    propertyTypes: [...copy.propertyTypes],
    priorityServices: coreServices,
    nearbyAreas: [...nearbyAreasFor(name)],
    visual: {
      alt: `Residential setting representing Hestiva cleaning services in ${name}, Gauteng`,
      brief: `Use authentic ${name} or closely relevant ${copy.visualContext}; no fabricated landmark, no identifiable private address and no misleading location claim.`,
    },
    faqs: [
      {
        question: `Does Hestiva provide home cleaning in ${name}?`,
        answer: `Yes. ${name} is one of Hestiva's approved service areas. Exact availability is confirmed against the address, requested date and cleaning requirements.`,
      },
      {
        question: `Which cleaning services can I request in ${name}?`,
        answer:
          "The quote form includes regular home cleaning, deep cleaning, move-in and move-out cleaning, room-focused services and available add-ons. The final scope is confirmed before the booking.",
      },
      {
        question: `Can I include access details and photos for a ${name} quote?`,
        answer:
          "Yes. Where relevant, the quote flow captures floor and building access, estate or complex access, key handover details and optional reference photos.",
      },
    ],
  };
});

export function getLocationPage(slug: string) {
  return locationPages.find((location) => location.slug === slug);
}
