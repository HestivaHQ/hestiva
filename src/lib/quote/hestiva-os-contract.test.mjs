import { describe, expect, test } from "bun:test";
import { buildHestivaOsQuotePayload } from "./hestiva-os-contract.ts";

function snapshot(overrides = {}) {
  return {
    submissionId: "11111111-1111-4111-8111-111111111111",
    submittedAt: "2026-08-14T00:00:00.000Z",
    values: {
      fullName: "Test Customer",
      email: "customer@example.com",
      mobile: "0821234567",
      contactMethod: "WhatsApp",
      propertyType: "House",
      address: "1 Test Street",
      suburb: "Johannesburg",
      postcode: "2000",
      floorSize: "80–99 m²",
      bedrooms: "3",
      bathrooms: "2",
      livingAreas: "2",
      storeys: "1 storey",
      outdoor: "None",
      estate: "No",
      service: "Regular Home Cleaning",
      frequency: "One-time",
      condition: "Standard lived-in condition",
      ecoFriendlyProducts: "No",
      preferredDate: "2026-08-20",
      alternativeDate: "2026-08-21",
      preferredTime: "Morning",
      flexibility: "Flexible by one day",
      urgency: "Flexible",
      complexAccess: "Not applicable",
      keyHandover: "Someone will open",
      present: "Yes",
      pets: "No",
      ...(overrides.values || {}),
    },
    addOns: [],
    ...overrides,
  };
}

describe("HestivaOS Quote Contract v2 mapper", () => {
  test("keeps Laundry and Ironing quantities first-class and excludes display labels from generic add-ons", () => {
    const payload = buildHestivaOsQuotePayload(
      snapshot({
        addOns: ["Laundry — Wash, Dry & Fold × 2", "Ironing × 1", "Inside oven"],
        laundry: { facilities: "WASHER_DRYER", laundryLoads: 2, ironingLoads: 1 },
      }),
      [],
    );

    expect(payload.schemaVersion).toBe("2.0");
    expect(payload.customer.mobile).toBe("+27821234567");
    expect(payload.request.laundry).toEqual({
      facilities: "WASHER_DRYER",
      laundryLoads: 2,
      ironingLoads: 1,
    });
    expect(payload.request.addOns).toEqual([
      { websiteValue: "Inside oven", canonicalService: "Inside Oven Cleaning", quantity: 1 },
    ]);
  });

  test("preserves the no-washer outcome for authoritative fail-closed validation", () => {
    const payload = buildHestivaOsQuotePayload(
      snapshot({
        addOns: ["Laundry"],
        laundry: { facilities: "NO_WASHER", laundryLoads: 1 },
      }),
      [],
    );

    expect(payload.request.laundry).toEqual({ facilities: "NO_WASHER", laundryLoads: 1 });
    expect(payload.request.addOns).toEqual([]);
  });

  test("keeps Ironing valid as a structured add-on without inventing laundry facilities", () => {
    const payload = buildHestivaOsQuotePayload(
      snapshot({ addOns: ["Ironing × 2"], laundry: { ironingLoads: 2 } }),
      [],
    );

    expect(payload.request.laundry).toEqual({ ironingLoads: 2 });
    expect(payload.request.addOns).toEqual([]);
  });

  test("does not reintroduce Laundry Folding as a primary service", () => {
    expect(() =>
      buildHestivaOsQuotePayload(
        snapshot({ values: { ...snapshot().values, service: "Laundry Folding" } }),
        [],
      ),
    ).toThrow("Unsupported primary service");
  });

  test("uses the dedicated custom-frequency explanation in the structured contract", () => {
    const payload = buildHestivaOsQuotePayload(
      snapshot({
        values: {
          ...snapshot().values,
          frequency: "Custom",
          customFrequency: "Every third Saturday morning",
          recurringNotes: "Please call before arriving.",
        },
      }),
      [],
    );

    expect(payload.request.frequency).toBe("CUSTOM");
    expect(payload.request.customFrequencyNote).toBe("Every third Saturday morning");
    expect(payload.visit.recurringNotes).toBe("Please call before arriving.");
  });

  test("preserves Other property and Not sure service explanations for HestivaOS review", () => {
    const payload = buildHestivaOsQuotePayload(
      snapshot({
        values: {
          ...snapshot().values,
          propertyType: "Other",
          propertyTypeOther: "Converted loft above a workshop",
          service: "Not sure",
          serviceOther: "Mainly floors, kitchen and two bathrooms",
          frequency: "One-time",
          notes: "Please use the side entrance.",
        },
      }),
      [],
    );

    expect(payload.request.primaryService).toEqual({
      websiteValue: "Not sure",
      canonicalService: null,
    });
    expect(payload.notes.additionalNotes).toContain(
      "Property type details: Converted loft above a workshop",
    );
    expect(payload.notes.additionalNotes).toContain(
      "Requested service details: Mainly floors, kitchen and two bathrooms",
    );
    expect(payload.notes.additionalNotes).toContain("Please use the side entrance.");
  });

  test("treats Townhouse as a storey-based home instead of requiring apartment floor access", () => {
    const payload = buildHestivaOsQuotePayload(
      snapshot({
        values: {
          ...snapshot().values,
          propertyType: "Townhouse",
          storeys: "3+ storeys",
          unitFloorExact: "",
          buildingAccess: "",
        },
      }),
      [],
    );

    expect(payload.property.storeys).toBe("UNKNOWN");
    expect(payload.property).not.toHaveProperty("exactFloor");
    expect(payload.property).not.toHaveProperty("buildingAccess");
    expect(payload.notes.additionalNotes).toContain("Storeys selected: 3+ storeys");
  });
});
