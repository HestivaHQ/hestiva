import { locationProfiles } from "@/content/location-profiles";
import { approvedServiceAreas, serviceAreaClusters } from "@/content/service-areas";
import { servicePages } from "@/content/services";

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

const clusterPropertyTypes: Record<string, string[]> = {
  "Sandton / Johannesburg North": [
    "Family homes",
    "Apartments",
    "Townhouses",
    "Estate and complex homes",
    "Move-in and move-out homes",
  ],
  Randburg: [
    "Family homes",
    "Apartments",
    "Townhouses",
    "Residential rental properties",
    "Recurring-cleaning households",
  ],
  "Rosebank / Central-North Johannesburg": [
    "Apartments",
    "Family homes",
    "Townhouses",
    "Residential rental properties",
    "Homes preparing for guests or events",
  ],
  "Roodepoort / Johannesburg West": [
    "Family homes",
    "Townhouses",
    "Apartments",
    "Multi-room homes",
    "Move-in and move-out homes",
  ],
  "Midrand / Waterfall / Kyalami": [
    "Apartments",
    "Townhouses",
    "Family homes",
    "Estate and complex homes",
    "Recurring-cleaning households",
  ],
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

  const profile = locationProfiles[name];
  if (!profile) throw new Error(`Missing unique location profile for ${name}`);

  const propertyTypes = clusterPropertyTypes[cluster.name];
  if (!propertyTypes) throw new Error(`Missing property types for ${cluster.name}`);

  return {
    slug: slugify(name),
    name,
    region: "Gauteng",
    cluster: cluster.name,
    metaTitle: `Residential Cleaning ${name} | Hestiva`,
    metaDescription: `Residential cleaning in ${name} with regular, deep, move-in and move-out options. Request a personalised Hestiva home-cleaning quote.`,
    heroDescription: profile.localAngle,
    overview: `For households in ${name}, Hestiva scopes the visit around the actual property rather than a one-size-fits-all checklist. ${profile.localAngle} The quote process records the home layout, service frequency or one-off need, access details, household requirements and selected add-ons before the booking is confirmed.`,
    propertyTypes: [...propertyTypes],
    priorityServices: coreServices,
    nearbyAreas: [...nearbyAreasFor(name)],
    visual: {
      alt: `Residential setting representing Hestiva cleaning services in ${name}, Gauteng`,
      brief: `${profile.visualBrief}. Use an authentic or closely relevant residential scene; do not fabricate a landmark, expose an identifiable private address or imply that the pictured property is a Hestiva customer.`,
    },
    faqs: [
      {
        question: `Does Hestiva provide home cleaning in ${name}?`,
        answer: `Yes. ${name} is one of Hestiva's approved service areas. Exact availability is confirmed against the address, requested date and cleaning requirements.`,
      },
      {
        question: `What kind of cleaning can Hestiva arrange in ${name}?`,
        answer: `${profile.localAngle} Customers can request regular home cleaning, deep cleaning, move-in or move-out cleaning, room-focused services and available add-ons through the quote flow.`,
      },
      {
        question: `What information helps Hestiva prepare a ${name} cleaning quote?`,
        answer:
          "The quote flow captures the property layout, preferred service, dates, condition, access details and household requirements. Where relevant, you can also provide floor and building access information, key handover details and optional reference photos.",
      },
    ],
  };
});

export function getLocationPage(slug: string) {
  return locationPages.find((location) => location.slug === slug);
}
