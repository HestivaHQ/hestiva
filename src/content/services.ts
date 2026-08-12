export type ServicePage = {
  slug: string;
  title: string;
  shortTitle: string;
  metaTitle: string;
  metaDescription: string;
  heroDescription: string;
  overview: string;
  services: string[];
  commonProblems: string[];
  process: string[];
  faqs: Array<{ question: string; answer: string }>;
  image?: ServiceImageData;
};

export type ServiceImageData = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

const serviceImageAltText: Record<string, string> = {
  "regular-home-cleaning": "Professional cleaner carrying out routine home cleaning",
  "deep-cleaning": "Professional cleaner performing detailed deep cleaning",
  "move-in-cleaning": "Homent cleaners preparing an empty home for move-in",
  "move-out-cleaning": "Homent cleaners cleaning an empty home after move-out",
  "kitchen-cleaning": "Professional cleaner wiping a residential kitchen counter",
  "bathroom-sanitisation": "Professional bathroom sanitisation in a modern bathroom",
  "bedroom-cleaning": "Professional cleaner cleaning a bedside surface",
  "living-area-cleaning": "Professional cleaner vacuuming a modern living room",
  "interior-window-cleaning": "Professional cleaner washing the inside of a residential window",
  "laundry-folding": "Professional cleaner folding clean household laundry",
  "apartment-cleaning": "Homent cleaner working in a modern apartment",
  "eco-conscious-cleaning": "Homent cleaner using eco-conscious cleaning products",
};

export const visualAddOns = [
  [
    "inside-fridge-cleaning",
    "Inside-fridge cleaning",
    "Professional cleaner wiping the inside of a refrigerator",
  ],
  [
    "inside-oven-cleaning",
    "Inside-oven cleaning",
    "Professional cleaner wiping the inside of an oven",
  ],
  [
    "interior-cupboard-cleaning",
    "Interior cupboard cleaning",
    "Professional cleaner wiping an interior kitchen cupboard",
  ],
  [
    "extra-laundry-folding",
    "Extra laundry folding",
    "Professional cleaner folding additional household laundry",
  ],
  ["balcony-sweeping", "Balcony sweeping", "Professional cleaner sweeping a residential balcony"],
  [
    "additional-room-cleaning",
    "Additional room cleaning",
    "Professional cleaner preparing an additional bedroom",
  ],
].map(([slug, name, alt]) => ({
  slug,
  name,
  image: {
    src: `/images/add-ons/${slug}.png`,
    alt,
    width: 1536,
    height: 1024,
  },
}));

const createService = (
  slug: string,
  title: string,
  shortTitle: string,
  description: string,
  services: string[],
  commonProblems: string[],
): ServicePage => ({
  slug,
  title,
  shortTitle,
  metaTitle: `${title} Johannesburg & Midrand | Homent`,
  metaDescription: `${description} Serving Johannesburg and Midrand.`,
  heroDescription: description,
  overview: `${title} is delivered with a clear checklist, careful attention to the home and a scope confirmed before the booking. Homent focuses on practical residential cleaning without promising services or equipment outside the agreed quotation.`,
  services,
  commonProblems,
  image: serviceImageAltText[slug]
    ? {
        src: `/images/services/${slug}.png`,
        alt: serviceImageAltText[slug],
        width: ["apartment-cleaning", "kitchen-cleaning"].includes(slug) ? 1535 : 1536,
        height: 1024,
      }
    : undefined,
  process: [
    "Review the household, requested service and any selected add-ons.",
    "Confirm the scope, access arrangements and areas requiring extra attention.",
    "Clean the agreed rooms and surfaces using a structured checklist.",
    "Complete finishing touches and review the serviced areas.",
    "Confirm completion and note any items that may need a separate quotation.",
  ],
  faqs: [
    {
      question: `Can I request a personalised quote for ${shortTitle.toLowerCase()}?`,
      answer:
        "Yes. Pricing is prepared from the property details, condition, requested scope and selected add-ons supplied through the quote form.",
    },
    {
      question: "Can I add extra tasks to the booking?",
      answer:
        "Yes. Available add-ons can be selected during the quote request. Any task outside the confirmed scope should be approved before the booking.",
    },
  ],
});

export const servicePages: ServicePage[] = [
  createService(
    "regular-home-cleaning",
    "Regular Home Cleaning",
    "Regular Cleaning",
    "Routine residential cleaning for lived-in homes that need consistent care and attention to everyday surfaces.",
    [
      "Dusting accessible surfaces",
      "Vacuuming and floor cleaning",
      "Kitchen surface cleaning",
      "Bathroom cleaning",
      "Bedroom and living-area tidying",
      "General finishing touches",
    ],
    [
      "Everyday dust and footprints",
      "Busy household schedules",
      "Frequently used kitchens and bathrooms",
      "Inconsistent upkeep",
      "Limited time for routine cleaning",
    ],
  ),
  createService(
    "deep-cleaning",
    "Deep Cleaning",
    "Deep Cleaning",
    "A more detailed residential clean for homes that need additional time, focused attention and broader surface cleaning.",
    [
      "Detailed room-by-room cleaning",
      "Build-up removal on suitable surfaces",
      "Expanded kitchen and bathroom attention",
      "Skirting and reachable detail areas",
      "Interior window cleaning when selected",
      "Selected add-ons as quoted",
    ],
    [
      "Accumulated dust and grime",
      "Long gaps between cleans",
      "Hard-to-reach detail areas",
      "Kitchen or bathroom build-up",
      "Preparation for a fresh cleaning routine",
    ],
  ),
  createService(
    "move-in-cleaning",
    "Move-In Cleaning",
    "Move-In Cleaning",
    "Residential cleaning for an empty or mostly empty home before occupants settle in.",
    [
      "Cleaning accessible cupboards and surfaces",
      "Kitchen and bathroom cleaning",
      "Floors throughout the home",
      "Bedroom and living-area cleaning",
      "Interior windows when selected",
      "Final pre-occupancy finishing",
    ],
    [
      "Dust from an empty property",
      "Residue left by previous occupants",
      "Cupboards that need cleaning before unpacking",
      "Bathrooms requiring a fresh start",
      "Floors needing attention before furniture arrives",
    ],
  ),
  createService(
    "move-out-cleaning",
    "Move-Out Cleaning",
    "Move-Out Cleaning",
    "Detailed residential cleaning for an empty or mostly empty property at the end of a move.",
    [
      "Empty-room cleaning",
      "Kitchen and bathroom cleaning",
      "Accessible cupboard interiors",
      "Floors throughout the property",
      "Interior windows when selected",
      "Selected move-out add-ons",
    ],
    [
      "Final cleaning after furniture removal",
      "Dust and marks revealed during a move",
      "Kitchen and bathroom build-up",
      "Cupboards requiring an empty-property clean",
      "Preparing the property for handover",
    ],
  ),
  createService(
    "kitchen-cleaning",
    "Kitchen Cleaning",
    "Kitchen Cleaning",
    "Focused residential kitchen cleaning for everyday surfaces, fixtures and suitable areas included in the confirmed scope.",
    [
      "Worktop and splashback cleaning",
      "Sink and tap cleaning",
      "Stovetop cleaning",
      "Appliance exterior wiping",
      "Cupboard-front cleaning",
      "Kitchen floor cleaning",
    ],
    [
      "Grease and cooking residue",
      "Frequently touched cupboard fronts",
      "Food preparation marks",
      "Sink and tap build-up",
      "Busy family kitchens",
    ],
  ),
  createService(
    "bathroom-sanitisation",
    "Bathroom Sanitisation",
    "Bathroom Cleaning",
    "Detailed residential bathroom cleaning and sanitisation focused on suitable fixtures, surfaces and high-touch areas.",
    [
      "Bath and shower cleaning",
      "Toilet sanitisation",
      "Basin and tap cleaning",
      "Mirror cleaning",
      "Tile and surface wiping",
      "Bathroom floor cleaning",
    ],
    [
      "Soap residue and water marks",
      "Frequently touched fixtures",
      "Bathroom surface build-up",
      "Mirrors needing a polished finish",
      "High-use family bathrooms",
    ],
  ),
  createService(
    "bedroom-cleaning",
    "Bedroom Cleaning",
    "Bedroom Cleaning",
    "Residential bedroom cleaning for restful spaces that need dusting, floor care, bed making and light tidying.",
    [
      "Reachable surface dusting",
      "Bed making",
      "Mirror cleaning",
      "Light general tidying",
      "Carpet vacuuming",
      "Hard-floor mopping",
    ],
    [
      "Dust on bedside and reachable surfaces",
      "Untidy everyday spaces",
      "Carpets and floors needing routine care",
      "Mirrors with everyday marks",
      "Bedrooms needing a regular reset",
    ],
  ),
  createService(
    "living-area-cleaning",
    "Living Area Cleaning",
    "Living Area Cleaning",
    "Residential cleaning for lounges, dining areas and shared living spaces used by the household and guests.",
    [
      "Furniture and surface dusting",
      "Cushion straightening",
      "Rug and carpet vacuuming",
      "Hard-floor mopping",
      "Reachable decor dusting",
      "General tidying",
    ],
    [
      "Dust on frequently used surfaces",
      "Foot traffic through shared spaces",
      "Rugs and floors needing routine care",
      "Everyday household clutter",
      "Living areas being prepared for guests",
    ],
  ),
  createService(
    "interior-window-cleaning",
    "Interior Window Cleaning",
    "Interior Window Cleaning",
    "Interior cleaning for safely reachable residential windows, glass doors, frames and sills included in the quotation.",
    [
      "Interior glass cleaning",
      "Frame and sill wiping",
      "Finger-mark removal",
      "Reachable door glass",
      "Suitable interior glass panels",
      "Streak-conscious finishing",
    ],
    [
      "Fingerprints and everyday marks",
      "Dust on frames and sills",
      "Interior glass reducing the feeling of brightness",
      "Reachable glass doors needing attention",
      "Finishing details during a deeper clean",
    ],
  ),
  createService(
    "laundry-folding",
    "Laundry Folding",
    "Laundry Folding",
    "Household laundry folding that can be added to a cleaning visit for clean, dry clothing, towels and suitable linen.",
    [
      "Folding everyday clothing",
      "Pairing socks",
      "Folding towels",
      "Folding bed linen",
      "Sorting by household member when requested",
      "Neat placement in an agreed area",
    ],
    [
      "Clean laundry waiting to be folded",
      "Busy household routines",
      "Towels and linen needing organisation",
      "Large folding loads",
      "Limited time for household finishing tasks",
    ],
  ),
  createService(
    "apartment-cleaning",
    "Apartment Cleaning",
    "Apartment Cleaning",
    "Residential apartment cleaning for studios and multi-bedroom units, with building access and floor details captured during quoting.",
    [
      "Living and dining-area cleaning",
      "Bedroom cleaning",
      "Kitchen surface cleaning",
      "Bathroom cleaning",
      "Balcony sweeping when selected",
      "Vacuuming and mopping",
    ],
    [
      "Compact high-use spaces",
      "Apartment kitchens and bathrooms",
      "Building access arrangements",
      "Upper-floor units",
      "Recurring cleaning for busy residents",
    ],
  ),
  createService(
    "eco-conscious-cleaning",
    "Eco-Conscious Cleaning",
    "Eco-Conscious Cleaning",
    "Residential cleaning with product preferences, restrictions and sensitivities recorded during quoting.",
    [
      "Preference-led product planning",
      "Reusable cloths where suitable",
      "Measured product use",
      "Low-fragrance options when available and agreed",
      "Care for high-touch surfaces",
      "Household restrictions recorded before the visit",
    ],
    [
      "Household product preferences",
      "Fragrance sensitivities",
      "Specified product restrictions",
      "Homes seeking a considered cleaning approach",
      "Need for requirements to be recorded before arrival",
    ],
  ),
  createService(
    "cleaning-add-ons",
    "Cleaning Add-On Services",
    "Add-On Services",
    "Optional tasks that can be included with a residential cleaning quotation when selected in advance.",
    [
      "Inside oven",
      "Inside fridge",
      "Laundry folding",
      "Bed making",
      "Linen change",
      "Balcony or patio",
      "Interior windows",
      "Extra bathroom or refrigerator",
    ],
    [
      "Tasks outside the standard clean",
      "Appliance interiors",
      "Additional rooms or fixtures",
      "Laundry and linen support",
      "Extra time needed for specific areas",
    ],
  ),
];

export function getServicePage(slug: string) {
  return servicePages.find((service) => service.slug === slug);
}
