import { useEffect } from "react";

const LAUNDRY_ELIGIBLE_SERVICES = new Set(["Regular Home Cleaning", "Deep Cleaning"]);
const EXPANDED_RECURRING_SERVICES = new Set(["Bedroom Cleaning", "Living Area Cleaning"]);
const EXPANDED_FREQUENCIES = ["One-time", "Weekly", "Every two weeks", "Monthly", "Custom"];
const TOWNHOUSE_BRIDGE_IDS = ["field-unitFloorExact", "field-buildingAccess"] as const;

function findAddonCheckbox(prefix: string) {
  return Array.from(
    document.querySelectorAll<HTMLInputElement>('#quote-form input[type="checkbox"]'),
  ).find((checkbox) =>
    checkbox.closest("label")?.querySelector("span")?.textContent?.trim().startsWith(prefix),
  );
}

function ensureFrequencyOptions(service: string) {
  if (!EXPANDED_RECURRING_SERVICES.has(service)) return;
  const frequency = document.querySelector<HTMLSelectElement>("#field-frequency");
  if (!frequency) return;

  const current = frequency.value;
  const existing = Array.from(frequency.options)
    .map((option) => option.value)
    .filter(Boolean);
  if (
    existing.length === EXPANDED_FREQUENCIES.length &&
    EXPANDED_FREQUENCIES.every((value, index) => existing[index] === value)
  ) {
    return;
  }

  frequency.replaceChildren();
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Select frequency";
  frequency.appendChild(placeholder);
  for (const value of EXPANDED_FREQUENCIES) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    frequency.appendChild(option);
  }
  frequency.value = EXPANDED_FREQUENCIES.includes(current) ? current : "";
  frequency.disabled = false;
}

function removeOrphanedSafetyControls() {
  const heading = document.querySelector<HTMLHeadingElement>("#quote-form h2")?.textContent?.trim();
  if (heading === "Access and Household Details") return;
  document.getElementById("quote-restrictions-choice")?.remove();
  document.getElementById("quote-allergies-choice")?.remove();
}

function removeTownhouseLegacyBridge() {
  for (const id of TOWNHOUSE_BRIDGE_IDS) {
    document.querySelector(`[data-townhouse-legacy-bridge="${id}"]`)?.remove();
  }
}

function ensureTownhouseLegacyBridge() {
  const propertyType = document.querySelector<HTMLSelectElement>("#field-propertyType")?.value || "";
  if (propertyType !== "Townhouse") {
    removeTownhouseLegacyBridge();
    return;
  }

  const form = document.getElementById("quote-form");
  if (!form) return;

  // The legacy controller can inject apartment-style controls before its progressive
  // check runs. Remove that visible panel for Townhouses; Contract v2 uses storeys.
  document.getElementById("quote-unit-access-fields")?.remove();

  const values: Record<(typeof TOWNHOUSE_BRIDGE_IDS)[number], string> = {
    "field-unitFloorExact": "Townhouse storey model",
    "field-buildingAccess": "Townhouse storey model",
  };

  for (const id of [...TOWNHOUSE_BRIDGE_IDS].reverse()) {
    const existingBridge = document.querySelector<HTMLInputElement>(
      `[data-townhouse-legacy-bridge="${id}"]`,
    );
    if (existingBridge) {
      existingBridge.value = values[id];
      continue;
    }

    const input = document.createElement("input");
    input.type = "hidden";
    input.id = id;
    input.value = values[id];
    input.dataset.townhouseLegacyBridge = id;

    // Prepend so document.querySelector/getElementById resolves this compatibility
    // value before any apartment-style control the lazy legacy controller may inject.
    form.prepend(input);
  }
}

export function QuoteFormStabilityEnhancement() {
  useEffect(() => {
    if (window.location.pathname !== "/quote") return;

    let lastPrimaryService = "";
    let scheduled = false;

    const apply = () => {
      scheduled = false;
      const visibleService = document.querySelector<HTMLSelectElement>("#field-service")?.value || "";
      if (visibleService) lastPrimaryService = visibleService;

      // Contract v2 and the React form model Townhouses by storeys. The lazy legacy
      // controller still classifies Townhouse as apartment-style unit access and will
      // clear Balcony/Patio and Estate/Complex values unless its obsolete dependency
      // appears complete. These hidden bridge values are ignored by the v2 mapper for
      // Townhouses; they exist only to stop that legacy controller from erasing React state.
      ensureTownhouseLegacyBridge();

      // React owns step validation. Legacy enhancement code must not silently lock later fields.
      for (const id of ["field-outdoor", "field-estate", "field-frequency", "field-condition"]) {
        const element = document.getElementById(id) as HTMLSelectElement | null;
        if (element?.disabled) element.disabled = false;
      }

      ensureFrequencyOptions(lastPrimaryService);
      removeOrphanedSafetyControls();

      const canUseLaundry = LAUNDRY_ELIGIBLE_SERVICES.has(lastPrimaryService);
      const laundry = findAddonCheckbox("Laundry");
      const ironing = findAddonCheckbox("Ironing");
      for (const checkbox of [laundry, ironing]) {
        if (!checkbox) continue;
        if (checkbox.disabled !== !canUseLaundry) checkbox.disabled = !canUseLaundry;
        const label = checkbox.closest("label");
        label?.classList.toggle("opacity-50", !canUseLaundry);
      }
    };

    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      window.setTimeout(apply, 1);
    };

    const applyBeforeLegacyTimer = () => {
      // LiveFormSubmission records the change and schedules its legacy synchronisation
      // with setTimeout(..., 0). Apply synchronously here so Townhouse bridge values are
      // already first in DOM order before that timer can clear outdoor/estate selections.
      apply();
      schedule();
    };

    const root = document.getElementById("quote-form");
    const observer = new MutationObserver(schedule);
    if (root) {
      observer.observe(root, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["disabled"],
      });
    }
    document.addEventListener("input", schedule, true);
    document.addEventListener("change", applyBeforeLegacyTimer, true);
    schedule();

    return () => {
      observer.disconnect();
      document.removeEventListener("input", schedule, true);
      document.removeEventListener("change", applyBeforeLegacyTimer, true);
      removeTownhouseLegacyBridge();
    };
  }, []);

  return null;
}
