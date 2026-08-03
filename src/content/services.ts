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
};

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
  metaTitle: `${title} in Gauteng | Hestiva`,
  metaDescription: `${description} Request a personalised residential cleaning quote from Hestiva.`,
  heroDescription: description,
  overview: `${title} is delivered with a clear checklist, careful attention to the home and a scope confirmed before the booking. Hestiva focuses on practical residential cleaning without promising services or equipment outside the agreed quotation.`,
  services,
  commonProblems,
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
      answer: "Yes. Pricing is prepared from the property details, condition, requested scope and selected add-ons supplied through the quote form.",
    },
    {
      question: "Can I add extra tasks to the booking?",
      answer: "Yes. Available add-ons can be selected during the quote request. Any task outside the confirmed scope should be approved before the booking.",
    },
  ],
});

export const servicePages: ServicePage[] = [
  createService("regular-home-cleaning", "Regular Home Cleaning", "Regular Cleaning", "Routine residential cleaning for lived-in homes that need consistent care and attention to everyday surfaces.", ["Dusting accessible surfaces", "Vacuuming and floor cleaning", "Kitchen surface cleaning", "Bathroom cleaning", "Bedroom and living-area tidying", "General finishing touches"], ["Everyday dust and footprints", "Busy household schedules", "Frequently used kitchens and bathrooms", "Inconsistent upkeep", "Limited time for routine cleaning"]),
  createService("deep-cleaning", "Deep Cleaning", "Deep Cleaning", "A more detailed residential clean for homes that need additional time, focused attention and broader surface cleaning.", ["Detailed room-by-room cleaning", "Build-up removal on suitable surfaces", "Expanded kitchen and bathroom attention", "Skirting and reachable detail areas", "Interior window cleaning when selected", "Selected add-ons as quoted"], ["Accumulated dust and grime", "Long gaps between cleans", "Hard-to-reach detail areas", "Kitchen or bathroom build-up", "Preparation for a fresh cleaning routine"]),
  createService("move-in-cleaning", "Move-In Cleaning", "Move-In Cleaning", "Residential cleaning for an empty or mostly empty home before occupants settle in.", ["Cleaning accessible cupboards and surfaces", "Kitchen and bathroom cleaning", "Floors throughout the home", "Bedroom and living-area cleaning", "Interior windows when selected", "Final pre-occupancy finishing"], ["Dust from an empty property", "Residue left by previous occupants", "Cupboards needing attention", "Floors requiring a fresh clean", "Preparing the home before unpacking"]),
  createService("move-out-cleaning", "Move-Out Cleaning", "Move-Out Cleaning", "Residential cleaning for a vacated home, based on the property condition and the agreed handover scope.", ["Empty-room cleaning", "Kitchen and bathroom cleaning", "Accessible cupboard cleaning", "Floors and general surfaces", "Selected appliance interiors as add-ons", "Handover-focused finishing"], ["Cleaning after furniture removal", "Dust and marks in empty rooms", "Kitchen residue", "Bathroom build-up", "Preparing a property for handover"]),
  createService("kitchen-cleaning", "Kitchen Cleaning", "Kitchen Cleaning", "Focused cleaning for the kitchen’s everyday surfaces, fittings and selected appliance interiors.", ["Worktops and splashbacks", "Sink and tap cleaning", "Cupboard exterior cleaning", "Floor cleaning", "Stovetop exterior cleaning", "Oven or fridge interiors when selected"], ["Grease on suitable surfaces", "Food residue", "Marked cupboard fronts", "Busy cooking areas", "Appliance interiors needing an add-on clean"]),
  createService("bathroom-sanitisation", "Bathroom Sanitisation", "Bathroom Cleaning", "Focused residential bathroom cleaning for fixtures, surfaces and frequently touched areas.", ["Toilet, basin and bath cleaning", "Shower surface cleaning", "Mirror and fixture cleaning", "Reachable tile and surface cleaning", "Floor cleaning", "Frequently touched area attention"], ["Soap residue", "Water marks", "Frequently used fixtures", "Bathroom odours", "General surface build-up"]),
  createService("bedroom-cleaning", "Bedroom Cleaning", "Bedroom Cleaning", "Careful cleaning of bedrooms and their accessible everyday surfaces.", ["Dusting accessible furniture", "Vacuuming or floor cleaning", "Mirror cleaning", "General surface care", "Bed making when selected", "Linen changing when selected"], ["Dust on furniture", "Floors needing attention", "Untidy presentation", "Busy family bedrooms", "Bed-making or linen-change needs"]),
  createService("living-area-cleaning", "Living Area Cleaning", "Living Area Cleaning", "Residential cleaning for lounges, dining areas and other shared living spaces.", ["Dusting accessible surfaces", "Vacuuming rugs and floors", "Hard-floor cleaning", "General tidying", "Reachable décor surface care", "Presentation-focused finishing"], ["High-traffic dust", "Footprints and everyday debris", "Shared spaces needing regular care", "Pet hair on accessible surfaces", "Untidy room presentation"]),
  createService("interior-window-cleaning", "Interior Window Cleaning", "Interior Windows", "Interior glass cleaning for safely reachable windows, mirrors and selected glass surfaces.", ["Interior window glass", "Reachable frames and sills", "Mirrors", "Selected glass doors", "Spot and mark removal", "Streak-conscious finishing"], ["Fingerprints", "Dusty sills", "Indoor glass marks", "Smudged mirrors", "Dull-looking reachable glass"]),
  createService("laundry-folding", "Laundry Folding", "Laundry Folding", "An optional household add-on for neatly folding clean, dry laundry supplied by the customer.", ["Folding clean dry clothing", "Grouping similar items", "Neat placement in an agreed area", "Towel folding", "Linen folding", "Basic organisation as agreed"], ["Backlogged clean laundry", "Limited folding time", "Household linen needing organisation", "Busy family schedules", "Clothing awaiting neat placement"]),
  createService("apartment-cleaning", "Apartment Cleaning", "Apartment Cleaning", "Residential cleaning shaped for apartments, flats and compact homes.", ["Kitchen and bathroom cleaning", "Bedroom and living-area cleaning", "Floor care", "Accessible surface dusting", "Balcony or patio when selected", "Apartment-specific add-ons"], ["Compact high-use spaces", "Limited household time", "Balcony dust", "Shared living areas", "Routine apartment upkeep"]),
  createService("eco-conscious-cleaning", "Eco-Conscious Cleaning", "Eco-Conscious Cleaning", "A cleaning option that considers product choice and practical household preferences where suitable products are available.", ["Preference review before service", "Thoughtful product selection", "Measured product use", "Room ventilation where practical", "Surface-appropriate cleaning", "Clear communication about limitations"], ["Sensitivity to strong fragrances", "Preference for considered product use", "Households seeking lower-impact choices", "Surface-specific product concerns", "Need for advance product discussion"]),
  createService("cleaning-add-ons", "Cleaning Add-On Services", "Add-On Services", "Optional tasks that can be included with a residential cleaning quotation when selected in advance.", ["Inside oven", "Inside fridge", "Laundry folding", "Bed making", "Linen change", "Balcony or patio", "Interior windows", "Extra bathroom or refrigerator"], ["Tasks outside the standard clean", "Appliance interiors", "Additional rooms or fixtures", "Laundry and linen support", "Extra time needed for specific areas"]),
];

export function getServicePage(slug: string) {
  return servicePages.find((service) => service.slug === slug);
}
