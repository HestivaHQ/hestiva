import {
  buildHestivaOsQuotePayload,
  type HestivaOsPhoto,
  type QuoteFormSnapshot,
} from "@/lib/quote/hestiva-os-contract";

const SERVICE = "Post-Event Cleaning";

const EVENT_TYPE_MAP: Record<string, string> = {
  "Party / Birthday": "PARTY_BIRTHDAY",
  "Wedding / Reception": "WEDDING_RECEPTION",
  "Family gathering": "FAMILY_GATHERING",
  "Corporate event": "CORPORATE_EVENT",
  "Funeral / Memorial": "FUNERAL_MEMORIAL",
  Other: "OTHER",
};

const VENUE_TYPE_MAP: Record<string, string> = {
  Home: "HOME",
  Apartment: "APARTMENT",
  "Business premises": "BUSINESS_PREMISES",
  "Event venue": "EVENT_VENUE",
  Other: "OTHER",
};

const GUEST_BAND_MAP: Record<string, string> = {
  "1–20": "ONE_TO_20",
  "21–50": "FROM_21_TO_50",
  "51–100": "FROM_51_TO_100",
  "101–150": "FROM_101_TO_150",
  "150+": "FROM_150_UP",
};

const DISHWASHING_MAP: Record<string, string> = {
  None: "NONE",
  Moderate: "MODERATE",
  Heavy: "HEAVY",
};

const WASTE_LEVEL_MAP: Record<string, string> = {
  Light: "LIGHT",
  Moderate: "MODERATE",
  Heavy: "HEAVY",
};

const OUTDOOR_AREA_MAP: Record<string, string> = {
  Patio: "PATIO",
  Balcony: "BALCONY",
  "Braai area": "BRAAI_AREA",
  "Garden entertainment area": "GARDEN_ENTERTAINMENT_AREA",
};

function requiredMap(map: Record<string, string>, value: string | undefined, field: string) {
  const mapped = value ? map[value] : undefined;
  if (!mapped) throw new Error(`Unsupported ${field} value.`);
  return mapped;
}

function requiredBoolean(value: string | undefined, field: string) {
  if (value === "Yes") return true;
  if (value === "No") return false;
  throw new Error(`Unsupported ${field} value.`);
}

function postEventFacts(snapshot: QuoteFormSnapshot) {
  const v = snapshot.values;
  const bathrooms = Number(v.postEventBathrooms);
  if (!Number.isInteger(bathrooms) || bathrooms < 1) {
    throw new Error("Post-event bathrooms must be a positive whole number.");
  }

  const outdoorAreas = (v.postEventOutdoorAreas || "")
    .split("|")
    .filter(Boolean)
    .map((value) => requiredMap(OUTDOOR_AREA_MAP, value, "post-event outdoor area"));

  return {
    eventType: requiredMap(EVENT_TYPE_MAP, v.postEventType, "post-event event type"),
    venueType: requiredMap(VENUE_TYPE_MAP, v.postEventVenueType, "post-event venue type"),
    guestBand: requiredMap(GUEST_BAND_MAP, v.postEventGuestBand, "post-event guest band"),
    bathrooms,
    kitchenSubstantiallyUsed: requiredBoolean(v.postEventKitchenUsed, "post-event kitchen use"),
    dishwashing: requiredMap(DISHWASHING_MAP, v.postEventDishwashing, "post-event dishwashing"),
    outdoorAreas,
    wasteLevel: requiredMap(WASTE_LEVEL_MAP, v.postEventWasteLevel, "post-event waste level"),
    significantOrdinarySoiling: requiredBoolean(v.postEventSoiling, "post-event soiling"),
    lateNightOrOvernight: requiredBoolean(v.postEventOvernight, "post-event overnight requirement"),
    bulkWasteRemovalRequested: requiredBoolean(v.postEventBulkWaste, "post-event bulk waste request"),
    specialistContamination: requiredBoolean(
      v.postEventSpecialistContamination,
      "post-event specialist contamination",
    ),
    specialistCarpetOrUpholstery: requiredBoolean(
      v.postEventSpecialistCarpet,
      "post-event specialist carpet or upholstery treatment",
    ),
    complexVenue: requiredBoolean(v.postEventComplexVenue, "post-event complex venue"),
  };
}

export function buildWebsiteQuotePayload(snapshot: QuoteFormSnapshot, photos: HestivaOsPhoto[]) {
  if (snapshot.values.service !== SERVICE) return buildHestivaOsQuotePayload(snapshot, photos);

  const compatibilitySnapshot: QuoteFormSnapshot = {
    ...snapshot,
    values: {
      ...snapshot.values,
      service: "Not sure",
      serviceOther: SERVICE,
      frequency: "One-time",
    },
  };

  const base = buildHestivaOsQuotePayload(compatibilitySnapshot, photos);
  return {
    ...base,
    request: {
      ...base.request,
      primaryService: {
        websiteValue: SERVICE,
        canonicalService: SERVICE,
      },
      frequency: "ONE_TIME",
      postEvent: postEventFacts(snapshot),
    },
  };
}
