export const HESTIVA_OS_QUOTE_SCHEMA_VERSION = "2.0" as const;
export const HESTIVA_OS_QUOTE_SOURCE = "HESTIVA_WEBSITE" as const;

export type QuoteFormSnapshot = {
  submissionId: string;
  values: Record<string, string>;
  addOns: string[];
  laundry?: {
    facilities?: "WASHER_DRYER" | "WASHER_LINE" | "NO_WASHER";
    laundryLoads?: number;
    ironingLoads?: number;
  };
};
