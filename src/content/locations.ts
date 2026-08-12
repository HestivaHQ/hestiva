import { locationProfiles } from "@/content/location-profiles";
import { approvedServiceAreas, serviceAreaClusters } from "@/content/service-areas";
import { servicePages } from "@/content/services";

export type LocationVisual = {
  src?: string;
  alt: string;
  credit?: string;
  sourceUrl?: string;
  license?: string;
  licenseUrl?: string;
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

const commons = {
  sandton: {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Sandton%20Skyline.jpg?width=1400",
    credit: "Wikiguy1101",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Sandton_Skyline.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  morningside: {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Morningside%2C%20Sandton%2C%202196%2C%20South%20Africa%20-%20panoramio.jpg?width=1400",
    credit: "stone wu",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Morningside,_Sandton,_2196,_South_Africa_-_panoramio.jpg",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
  },
  rosebank: {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Rosebank%2C%20Johannesburg%2C%20South%20Africa%20%28Unsplash%29.jpg?width=1400",
    credit: "Mpho Mojapelo",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Rosebank,_Johannesburg,_South_Africa_(Unsplash).jpg",
    license: "CC0 1.0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
  },
  northcliff: {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Northcliff%20%28South%20Africa%29.jpg?width=1400",
    credit: "TapticInfo",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Northcliff_(South_Africa).jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  roodepoort: {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Roodepoort%20Location.jpg?width=1400",
    credit: "Arelebogeng",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Roodepoort_Location.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  littleFalls: {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Little%20Falls%20-%20panoramio.jpg?width=1400",
    credit: "Norwin Lederer",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Little_Falls_-_panoramio.jpg",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
  },
  vornaValley: {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Vorna%20Valley%20Vlei.jpg?width=1400",
    credit: "JustFeline",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Vorna_Valley_Vlei.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  glenAustin: {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Glen%20Austin%20Bird%20Sanctuary%20and%20Bullfrog%20Reserve.jpg?width=1400",
    credit: "Ossewa",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Glen_Austin_Bird_Sanctuary_and_Bullfrog_Reserve.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
} as const;

const imageGroups = {
  sandton: new Set(["Sandton", "Bryanston", "Hyde Park", "Parkmore", "Dainfern"]),
  morningside: new Set([
    "Morningside",
    "Rivonia",
    "Sandown",
    "Fourways",
    "Lonehill",
    "Sunninghill",
    "Paulshof",
    "Douglasdale",
  ]),
  northcliff: new Set([
    "Randburg",
    "Ferndale",
    "Blairgowrie",
    "Linden",
    "Northcliff",
    "Robindale",
    "Bromhof",
    "Boskruin",
    "North Riding",
    "Honeydew",
    "Olivedale",
    "Randpark Ridge",
  ]),
  rosebank: new Set([
    "Rosebank",
    "Parkhurst",
    "Parkwood",
    "Greenside",
    "Emmarentia",
    "Melrose",
    "Saxonwold",
    "Houghton",
    "Parkview",
    "Melville",
    "Illovo",
    "Craighall Park",
    "Westcliff",
  ]),
  littleFalls: new Set([
    "Little Falls",
    "Weltevreden Park",
    "Constantia Kloof",
    "Ruimsig",
    "Strubens Valley",
    "Radiokop",
    "Allen's Nek",
    "Roodekrans",
  ]),
  roodepoort: new Set([
    "Roodepoort",
    "Florida",
    "Florida Park",
    "Helderkruin",
    "Wilro Park",
  ]),
  vornaValley: new Set([
    "Midrand",
    "Waterfall",
    "Kyalami",
    "Halfway Gardens",
    "Halfway House",
    "Carlswald",
    "Noordwyk",
    "Vorna Valley",
    "Barbeque Downs",
    "Crowthorne",
    "Blue Hills",
    "Kyalami Estate",
    "Waterfall Estate",
    "Summerset",
  ]),
  glenAustin: new Set(["Glen Austin"]),
} as const;

function visualFor(name: string) {
  for (const [key, names] of Object.entries(imageGroups)) {
    if (names.has(name)) return commons[key as keyof typeof commons];
  }

  return undefined;
}

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

  const licensedVisual = visualFor(name);

  return {
    slug: slugify(name),
    name,
    region: "Gauteng",
    cluster: cluster.name,
    metaTitle: `Residential Cleaning ${name} | Homent`,
    metaDescription: `Residential cleaning in ${name} with regular, deep, move-in and move-out options. Request a personalised Homent home-cleaning quote.`,
    heroDescription: profile.localAngle,
    overview: `For households in ${name}, Homent scopes the visit around the actual property rather than a one-size-fits-all checklist. ${profile.localAngle} The quote process records the home layout, service frequency or one-off need, access details, household requirements and selected add-ons before the booking is confirmed.`,
    propertyTypes: [...propertyTypes],
    priorityServices: coreServices,
    nearbyAreas: [...nearbyAreasFor(name)],
    visual: {
      ...licensedVisual,
      alt: `${name} and surrounding Johannesburg residential context for Homent's local cleaning service area`,
      brief: `${profile.visualBrief}. Use an authentic or closely relevant residential scene; do not fabricate a landmark, expose an identifiable private address or imply that the pictured property is a Homent customer.`,
    },
    faqs: [
      {
        question: `Does Homent provide home cleaning in ${name}?`,
        answer: `Yes. ${name} is one of Homent's approved service areas. Exact availability is confirmed against the address, requested date and cleaning requirements.`,
      },
      {
        question: `What kind of cleaning can Homent arrange in ${name}?`,
        answer: `${profile.localAngle} Customers can request regular home cleaning, deep cleaning, move-in or move-out cleaning, room-focused services and available add-ons through the quote flow.`,
      },
      {
        question: `What information helps Homent prepare a ${name} cleaning quote?`,
        answer:
          "The quote flow captures the property layout, preferred service, dates, condition, access details and household requirements. Where relevant, you can also provide floor and building access information, key handover details and optional reference photos.",
      },
    ],
  };
});

export function getLocationPage(slug: string) {
  return locationPages.find((location) => location.slug === slug);
}
