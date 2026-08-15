import { useEffect } from "react";

const progressiveFieldIds = [
  "field-floorSize",
  "field-bedrooms",
  "field-bathrooms",
  "field-livingAreas",
  "field-storeys",
  "field-unitFloorExact",
  "field-buildingAccess",
  "field-outdoor",
  "field-estate",
  "field-frequency",
  "field-condition",
  "field-preferredTime",
  "field-flexibility",
  "field-urgency",
  "field-keyHandover",
  "field-present",
  "field-pets",
  "field-petType",
  "field-petTemperament",
  "field-restrictionsChoice",
  "field-allergiesChoice",
] as const;

function restoreSelectableFields() {
  if (window.location.pathname !== "/quote") return;
  for (const id of progressiveFieldIds) {
    const element = document.getElementById(id) as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement
      | null;
    if (element?.disabled) element.disabled = false;
  }
}

export function QuoteProgressionPolicy() {
  useEffect(() => {
    if (window.location.pathname !== "/quote") return;

    let timeout: number | undefined;
    const restoreAfterEnhancements = () => {
      if (timeout !== undefined) window.clearTimeout(timeout);
      timeout = window.setTimeout(restoreSelectableFields, 0);
    };

    const quoteRoot = document.getElementById("quote-form");
    const observer = new MutationObserver(restoreAfterEnhancements);
    if (quoteRoot) observer.observe(quoteRoot, { childList: true, subtree: true });

    document.addEventListener("input", restoreAfterEnhancements, false);
    document.addEventListener("change", restoreAfterEnhancements, false);
    restoreAfterEnhancements();

    return () => {
      observer.disconnect();
      if (timeout !== undefined) window.clearTimeout(timeout);
      document.removeEventListener("input", restoreAfterEnhancements, false);
      document.removeEventListener("change", restoreAfterEnhancements, false);
    };
  }, []);

  return null;
}
