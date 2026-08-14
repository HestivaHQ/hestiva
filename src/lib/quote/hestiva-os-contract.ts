export const HESTIVA_OS_QUOTE_SCHEMA_VERSION = "2.0" as const;
export const HESTIVA_OS_QUOTE_SOURCE = "HESTIVA_WEBSITE" as const;

export type QuoteFormSnapshot = {
  submissionId: string;
  submittedAt: string;
  values: Record<string, string>;
  addOns: string[];
  laundry?: {
    facilities?: "WASHER_DRYER" | "WASHER_LINE" | "NO_WASHER";
    laundryLoads?: number;
    ironingLoads?: number;
  };
};

export type StructuredQuoteFile = {
  clientPhotoId: string;
  name: string;
  type: string;
  base64: string;
};

export type HestivaOsPhoto = {
  clientPhotoId: string;
  fileName: string;
  contentType: string;
  byteSize: number;
  sha256: string;
  transfer: { kind: "UPLOAD"; dataBase64: string };
};

const PRIMARY_SERVICE_MAP: Record<string, string | null> = {
  "Regular Home Cleaning": "Regular Home Cleaning",
  "Deep Cleaning": "Deep Cleaning",
  "Move-In Cleaning": "Move-In Cleaning",
  "Move-Out Cleaning": "Move-Out Cleaning",
  "Apartment Cleaning": "Apartment Cleaning",
  "Kitchen Cleaning": "Kitchen Cleaning",
  "Bathroom Sanitisation": "Bathroom Sanitisation",
  "Bedroom Cleaning": "Bedroom Cleaning",
  "Living Area Cleaning": "Living Area Cleaning",
  "Interior Window Cleaning": "Interior Window Cleaning",
  "Eco-Friendly Cleaning": "Eco-Conscious Cleaning",
  "Post-Renovation Cleaning": "Post-Renovation Cleaning",
  "Add-on Services": null,
  "Not sure": null,
};

const ADD_ON_SERVICE_MAP: Record<string, string> = {
  "Inside oven": "Inside Oven Cleaning",
  "Inside fridge": "Inside Fridge Cleaning",
  "Inside cupboards": "Interior Cupboard Cleaning",
  "Interior windows": "Interior Window Cleaning",
  "Bed making": "Bed Making",
  "Linen change": "Linen Change",
  "Balcony / Patio Cleaning": "Balcony / Patio Cleaning",
  "Garage sweep": "Garage Sweeping",
  "Extra bathroom": "Extra Bathroom Cleaning",
  "Extra refrigerator": "Extra Refrigerator",
  "Pet-hair treatment": "Pet-Hair Treatment",
};

const FREQUENCY_MAP: Record<string, string> = {
  "One-time": "ONE_TIME",
  Weekly: "WEEKLY",
  "Every two weeks": "EVERY_TWO_WEEKS",
  Monthly: "MONTHLY",
  Custom: "CUSTOM",
};

const CONDITION_MAP: Record<string, string> = {
  "Light upkeep": "LIGHT_UPKEEP",
  "Standard lived-in condition": "STANDARD",
  "Needs extra attention": "EXTRA_ATTENTION",
  "Heavy build-up": "HEAVY_BUILDUP",
  "Recently renovated": "RECENTLY_RENOVATED",
  "Vacant property": "VACANT",
  "Move-in or move-out condition": "MOVE_IN_OUT",
};

function requiredMap(map: Record<string, string>, value: string, field: string) {
  const mapped = map[value];
  if (!mapped) throw new Error(`Unsupported ${field} value.`);
  return mapped;
}

function optionalText(value: string | undefined) {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

function mapPropertyType(value: string) {
  return requiredMap(
    {
      Apartment: "APARTMENT",
      Townhouse: "TOWNHOUSE",
      House: "HOUSE",
      Duplex: "DUPLEX",
      Other: "OTHER",
    },
    value,
    "property type",
  );
}

function mapFloorSize(value: string) {
  return requiredMap(
    {
      "Under 40 m²": "UNDER_40",
      "40–59 m²": "FROM_40_TO_59",
      "60–79 m²": "FROM_60_TO_79",
      "80–99 m²": "FROM_80_TO_99",
      "100–129 m²": "FROM_100_TO_129",
      "130–169 m²": "FROM_130_TO_169",
      "170–219 m²": "FROM_170_TO_219",
      "220–299 m²": "FROM_220_TO_299",
      "300+ m²": "FROM_300_UP",
      "Not sure": "UNKNOWN",
    },
    value,
    "floor size",
  );
}

function mapBedrooms(value: string) {
  return requiredMap(
    {
      Studio: "STUDIO",
      "1": "ONE",
      "2": "TWO",
      "3": "THREE",
      "4": "FOUR",
      "5+": "FIVE_PLUS",
      Other: "OTHER",
    },
    value,
    "bedrooms",
  );
}

function mapCount(value: string, field: string, fourPlus = false) {
  return requiredMap(
    {
      "1": "ONE",
      "2": "TWO",
      "3": "THREE",
      "4": fourPlus ? "FOUR_PLUS" : "FOUR",
      "4+": "FOUR_PLUS",
      "5+": "FIVE_PLUS",
    },
    value,
    field,
  );
}

function mapStoreys(value: string | undefined) {
  if (!value) return undefined;
  return requiredMap(
    {
      "1 storey": "ONE",
      "2 storeys": "TWO",
      "3 storeys": "THREE",
      "4+ storeys": "FOUR_PLUS",
      "Not sure": "UNKNOWN",
    },
    value,
    "storeys",
  );
}

function mapExactFloor(value: string | undefined) {
  if (!value) return undefined;
  if (value === "Ground floor") return 0;
  const match = /^Floor (\d+)$/.exec(value);
  if (!match) throw new Error("Unsupported exact floor value.");
  return Number(match[1]);
}

function mapAddOns(labels: string[]) {
  return labels.flatMap((rawLabel) => {
    if (rawLabel.startsWith("Laundry") || rawLabel.startsWith("Ironing")) return [];
    const quantityMatch = /\s*[×x]\s*(\d+)\s*$/.exec(rawLabel);
    const quantity = quantityMatch ? Number(quantityMatch[1]) : 1;
    const websiteValue = quantityMatch
      ? rawLabel.slice(0, quantityMatch.index).trim()
      : rawLabel.trim();
    const canonicalService = ADD_ON_SERVICE_MAP[websiteValue];
    if (!canonicalService) throw new Error(`Unsupported add-on value: ${websiteValue}`);
    return [{ websiteValue, canonicalService, quantity }];
  });
}

function mapPreferredContact(value: string) {
  return requiredMap(
    { Phone: "PHONE", "Phone Call": "PHONE", WhatsApp: "WHATSAPP", Email: "EMAIL" },
    value,
    "preferred contact",
  );
}

function normalizeSouthAfricanMobile(value: string) {
  const compact = value.replace(/[\s()-]/g, "");
  if (/^\+27\d{9}$/.test(compact)) return compact;
  if (/^0\d{9}$/.test(compact)) return `+27${compact.slice(1)}`;
  throw new Error("Mobile number must be a South African number that can be normalized to E.164.");
}

function numeric(value: string | undefined) {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function mapLaundry(snapshot: QuoteFormSnapshot) {
  const laundry = snapshot.laundry;
  if (!laundry) return undefined;
  if (laundry.laundryLoads === undefined && laundry.ironingLoads === undefined) return undefined;
  return {
    ...(laundry.facilities ? { facilities: laundry.facilities } : {}),
    ...(laundry.laundryLoads !== undefined ? { laundryLoads: laundry.laundryLoads } : {}),
    ...(laundry.ironingLoads !== undefined ? { ironingLoads: laundry.ironingLoads } : {}),
  };
}

export function buildHestivaOsQuotePayload(snapshot: QuoteFormSnapshot, photos: HestivaOsPhoto[]) {
  const v = snapshot.values;
  const service = v.service?.trim();
  if (!service || !(service in PRIMARY_SERVICE_MAP))
    throw new Error("Unsupported primary service.");
  const latitude = numeric(v.latitude);
  const longitude = numeric(v.longitude);
  const accuracyMetres = numeric(v.locationAccuracy);
  const needsUnitAccess = v.propertyType === "Apartment" || v.propertyType === "Townhouse";

  return {
    schemaVersion: HESTIVA_OS_QUOTE_SCHEMA_VERSION,
    submissionId: snapshot.submissionId,
    source: HESTIVA_OS_QUOTE_SOURCE,
    submittedAt: snapshot.submittedAt,
    customer: {
      fullName: v.fullName,
      email: v.email,
      mobile: normalizeSouthAfricanMobile(v.mobile),
      preferredContact: mapPreferredContact(v.contactMethod),
    },
    property: {
      propertyType: mapPropertyType(v.propertyType),
      addressLine1: v.address,
      suburb: v.suburb,
      ...(optionalText(v.postcode) ? { postalCode: v.postcode.trim() } : {}),
      country: "South Africa" as const,
      ...(latitude !== undefined && longitude !== undefined
        ? {
            location: {
              latitude,
              longitude,
              ...(accuracyMetres !== undefined ? { accuracyMetres } : {}),
            },
          }
        : {}),
      floorSize: mapFloorSize(v.floorSize),
      bedrooms: mapBedrooms(v.bedrooms),
      bathrooms: mapCount(v.bathrooms, "bathrooms"),
      livingAreas: mapCount(v.livingAreas, "living areas", true),
      ...(mapStoreys(v.storeys) ? { storeys: mapStoreys(v.storeys) } : {}),
      outdoorArea: requiredMap(
        { None: "NONE", Balcony: "BALCONY", Patio: "PATIO", Both: "BOTH" },
        v.outdoor,
        "outdoor area",
      ),
      estateClassification: requiredMap(
        {
          No: "NONE",
          "Yes — estate": "ESTATE",
          "Yes — complex": "COMPLEX",
          "Yes — gated community": "GATED_COMMUNITY",
        },
        v.estate,
        "estate classification",
      ),
      ...(needsUnitAccess ? { exactFloor: mapExactFloor(v.unitFloorExact) } : {}),
      ...(needsUnitAccess
        ? {
            buildingAccess: requiredMap(
              {
                "Elevator available": "ELEVATOR",
                "Stairs only": "STAIRS",
                "Elevator and stairs": "ELEVATOR_AND_STAIRS",
              },
              v.buildingAccess,
              "building access",
            ),
          }
        : {}),
    },
    request: {
      primaryService: {
        websiteValue: service,
        canonicalService: PRIMARY_SERVICE_MAP[service],
      },
      frequency: requiredMap(FREQUENCY_MAP, v.frequency, "frequency"),
      ...(v.frequency === "Custom" && optionalText(v.recurringNotes)
        ? { customFrequencyNote: v.recurringNotes.trim() }
        : {}),
      homeCondition: requiredMap(CONDITION_MAP, v.condition, "home condition"),
      addOns: mapAddOns(snapshot.addOns),
      ...(v.ecoFriendlyProducts === "Yes"
        ? { ecoFriendlyProducts: true }
        : v.ecoFriendlyProducts === "No"
          ? { ecoFriendlyProducts: false }
          : {}),
      ...(mapLaundry(snapshot) ? { laundry: mapLaundry(snapshot) } : {}),
    },
    visit: {
      preferredDate: v.preferredDate,
      ...(optionalText(v.alternativeDate) ? { alternativeDate: v.alternativeDate.trim() } : {}),
      preferredTime: requiredMap(
        { Morning: "MORNING", Midday: "MIDDAY", Afternoon: "AFTERNOON", Flexible: "FLEXIBLE" },
        v.preferredTime,
        "preferred time",
      ),
      flexibility: v.flexibility,
      urgency: v.urgency,
      ...(optionalText(v.recurringNotes) ? { recurringNotes: v.recurringNotes.trim() } : {}),
    },
    access: {
      complexAccess: requiredMap(
        {
          "Access code": "ACCESS_CODE",
          "Not applicable": "NOT_APPLICABLE",
          "Visitor sign-in": "VISITOR_SIGN_IN",
          "Access arranged by resident": "RESIDENT_ARRANGED",
        },
        v.complexAccess,
        "complex access",
      ),
      ...(optionalText(v.securityInstructions)
        ? { securityInstructions: v.securityInstructions.trim() }
        : {}),
      ...(optionalText(v.parking) ? { parking: v.parking.trim() } : {}),
      keyHandover: requiredMap(
        {
          "Someone will open": "SOMEONE_WILL_OPEN",
          "Concierge or reception": "CONCIERGE_RECEPTION",
          "To be arranged": "TO_BE_ARRANGED",
        },
        v.keyHandover,
        "key handover",
      ),
      ...(optionalText(v.keyHandoverDetails)
        ? { keyHandoverDetails: v.keyHandoverDetails.trim() }
        : {}),
      someonePresent: v.present === "Yes",
    },
    household: {
      hasPets: v.pets?.startsWith("Yes") ?? false,
      ...(v.pets?.startsWith("Yes") && optionalText(v.petType)
        ? { petType: v.petType.trim() }
        : {}),
      ...(v.pets?.startsWith("Yes") && optionalText(v.petTemperament)
        ? { petTemperament: v.petTemperament.trim() }
        : {}),
    },
    safety: {
      ...(optionalText(v.offLimits) ? { offLimitsAreas: v.offLimits.trim() } : {}),
      ...(optionalText(v.fragileItems) ? { fragileItems: v.fragileItems.trim() } : {}),
      ...(optionalText(v.restrictions) ? { productRestrictions: v.restrictions.trim() } : {}),
      ...(optionalText(v.allergies) ? { allergiesOrSensitivities: v.allergies.trim() } : {}),
      ...(optionalText(v.existingDamage) ? { existingDamage: v.existingDamage.trim() } : {}),
    },
    notes: {
      ...(optionalText(v.attentionAreas) ? { attentionAreas: v.attentionAreas.trim() } : {}),
      ...(optionalText(v.renovationDust) ? { renovationDust: v.renovationDust.trim() } : {}),
      ...(optionalText(v.applianceAddons) ? { applianceNotes: v.applianceAddons.trim() } : {}),
      ...(optionalText(v.notes) ? { additionalNotes: v.notes.trim() } : {}),
    },
    photos,
  };
}
