import { createServerFn } from "@tanstack/react-start";

const reverseGeocodeCache = new Map<string, ReverseGeocodeResult>();
let lastReverseGeocodeAt = 0;

export type ReverseGeocodeResult = {
  success: true;
  address: string;
  suburb: string;
  postcode: string;
  displayName: string;
};

type ReverseGeocodeInput = {
  latitude: number;
  longitude: number;
};

type NominatimResponse = {
  display_name?: string;
  address?: {
    house_number?: string;
    road?: string;
    pedestrian?: string;
    footway?: string;
    suburb?: string;
    neighbourhood?: string;
    quarter?: string;
    residential?: string;
    city_district?: string;
    city?: string;
    town?: string;
    village?: string;
    postcode?: string;
  };
};

function validateCoordinates(data: unknown): ReverseGeocodeInput {
  if (!data || typeof data !== "object") throw new Error("Invalid location");
  const latitude = Number((data as Record<string, unknown>).latitude);
  const longitude = Number((data as Record<string, unknown>).longitude);

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    throw new Error("Invalid location");
  }

  return { latitude, longitude };
}

function firstValue(...values: Array<string | undefined>) {
  return values.find((value) => value && value.trim())?.trim() ?? "";
}

async function respectPublicServiceLimit() {
  const elapsed = Date.now() - lastReverseGeocodeAt;
  if (elapsed < 1_100) await new Promise((resolve) => setTimeout(resolve, 1_100 - elapsed));
  lastReverseGeocodeAt = Date.now();
}

export const reverseGeocodeLocation = createServerFn({ method: "POST" })
  .validator((data: unknown) => validateCoordinates(data))
  .handler(async ({ data }) => {
    const cacheKey = `${data.latitude.toFixed(5)},${data.longitude.toFixed(5)}`;
    const cached = reverseGeocodeCache.get(cacheKey);
    if (cached) return cached;

    await respectPublicServiceLimit();

    const params = new URLSearchParams({
      format: "jsonv2",
      lat: String(data.latitude),
      lon: String(data.longitude),
      zoom: "18",
      addressdetails: "1",
      layer: "address",
    });

    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params}`, {
      headers: {
        Accept: "application/json",
        "Accept-Language": "en-ZA,en;q=0.9",
        "User-Agent": "HomentWebsite/1.0 (https://www.homent.co.za; info@homent.co.za)",
      },
    });

    if (!response.ok) throw new Error("Reverse geocoding unavailable");

    const payload = (await response.json()) as NominatimResponse;
    const parts = payload.address ?? {};
    const road = firstValue(parts.road, parts.pedestrian, parts.footway);
    const streetAddress = [parts.house_number, road].filter(Boolean).join(" ").trim();
    const suburb = firstValue(
      parts.suburb,
      parts.neighbourhood,
      parts.quarter,
      parts.residential,
      parts.city_district,
      parts.town,
      parts.village,
      parts.city,
    );
    const displayName = payload.display_name?.trim() ?? "";
    const result: ReverseGeocodeResult = {
      success: true,
      address: streetAddress || displayName,
      suburb,
      postcode: parts.postcode?.trim() ?? "",
      displayName,
    };

    reverseGeocodeCache.set(cacheKey, result);
    return result;
  });
