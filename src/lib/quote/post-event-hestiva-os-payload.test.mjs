import { describe, expect, test } from "bun:test";
import { buildWebsiteQuotePayload } from "./post-event-hestiva-os-payload.ts";

function snapshot(overrides = {}) {
  return {
    submissionId: "11111111-1111-4111-8111-111111111111",
    submittedAt: "2026-08-23T12:00:00.000Z",
    values: {
      fullName: "Test Customer",
      email: "customer@example.com",
      mobile: "0821234567",
      contactMethod: "WhatsApp",
      propertyType: "House",
      address: "1 Test Street",
      suburb: "Johannesburg",
      postcode: "2000",
      floorSize: "100–129 m²",
      bedrooms: "3",
      bathrooms: "2",
      livingAreas: "2",
      storeys: "1 storey",
      outdoor: "Patio",
      estate: "No",
      service: "Post-Event Cleaning",
      frequency: "One-time",
      condition: "Standard lived-in condition",
      ecoFriendlyProducts: "No",
      preferredDate: "2026-08-25",
      alternativeDate: "",
      preferredTime: "Morning",
      flexibility: "Flexible",
      urgency: "Flexible",
      complexAccess: "Not applicable",
      keyHandover: "Someone will open",
      present: "Yes",
      pets: "No",
      postEventType: "Party / Birthday",
      postEventVenueType: "Home",
      postEventGuestBand: "51–100",
      postEventBathrooms: "2",
      postEventKitchenUsed: "Yes",
      postEventDishwashing: "Moderate",
      postEventOutdoorAreas: "Patio|Braai area",
      postEventWasteLevel: "Moderate",
      postEventSoiling: "No",
      postEventOvernight: "No",
      postEventBulkWaste: "No",
      postEventSpecialistContamination: "No",
      postEventSpecialistCarpet: "No",
      postEventComplexVenue: "No",
      ...(overrides.values || {}),
    },
    addOns: [],
    ...overrides,
  };
}

describe("Post-Event Website Quote mapper", () => {
  test("maps the approved Website v2 Post-Event facts without changing transport identity", () => {
    const payload = buildWebsiteQuotePayload(snapshot(), []);

    expect(payload.schemaVersion).toBe("2.0");
    expect(payload.source).toBe("HESTIVA_WEBSITE");
    expect(payload.request.primaryService).toEqual({
      websiteValue: "Post-Event Cleaning",
      canonicalService: "Post-Event Cleaning",
    });
    expect(payload.request.frequency).toBe("ONE_TIME");
    expect(payload.request.postEvent).toEqual({
      eventType: "PARTY_BIRTHDAY",
      venueType: "HOME",
      guestBand: "FROM_51_TO_100",
      bathrooms: 2,
      kitchenSubstantiallyUsed: true,
      dishwashing: "MODERATE",
      outdoorAreas: ["PATIO", "BRAAI_AREA"],
      wasteLevel: "MODERATE",
      significantOrdinarySoiling: false,
      lateNightOrOvernight: false,
      bulkWasteRemovalRequested: false,
      specialistContamination: false,
      specialistCarpetOrUpholstery: false,
      complexVenue: false,
    });
  });

  test("keeps existing non-Post-Event quote mapping unchanged", () => {
    const regular = snapshot({
      values: {
        ...snapshot().values,
        service: "Regular Home Cleaning",
      },
    });
    const payload = buildWebsiteQuotePayload(regular, []);
    expect(payload.request.primaryService).toEqual({
      websiteValue: "Regular Home Cleaning",
      canonicalService: "Regular Home Cleaning",
    });
    expect(payload.request).not.toHaveProperty("postEvent");
  });

  test("fails closed on incomplete Post-Event structured facts", () => {
    expect(() =>
      buildWebsiteQuotePayload(
        snapshot({ values: { ...snapshot().values, postEventGuestBand: "" } }),
        [],
      ),
    ).toThrow("Unsupported post-event guest band value");
  });
});
