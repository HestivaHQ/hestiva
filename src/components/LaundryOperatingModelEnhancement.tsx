import { useEffect } from "react";

const ELIGIBLE_PRIMARY_SERVICES = new Set(["Regular Home Cleaning", "Deep Cleaning"]);

export type StructuredLaundryRequest = {
  facilities?: "WASHER_DRYER" | "WASHER_LINE" | "NO_WASHER";
  laundryLoads?: number;
  ironingLoads?: number;
};

let structuredLaundryRequest: StructuredLaundryRequest = {};

export function getStructuredLaundryRequest(): StructuredLaundryRequest {
  return { ...structuredLaundryRequest };
}

const INPUT_CLASS =
  "mt-2 min-h-12 w-full rounded-xl border border-[#CDBFB1] bg-white px-4 py-3 text-base text-[#342C2A] shadow-sm outline-none transition hover:border-[#A89380] focus:border-[#5A1425] focus:ring-2 focus:ring-[#C9A45B]/45";

function addonCheckbox(labelPrefix: string) {
  return Array.from(
    document.querySelectorAll<HTMLInputElement>('#quote-form input[type="checkbox"]'),
  ).find((checkbox) =>
    checkbox
      .closest("label")
      ?.querySelector("span")
      ?.textContent?.trim()
      .startsWith(labelPrefix),
  );
}

function setAddonLabel(
  checkbox: HTMLInputElement,
  label: HTMLElement,
  previousLabel: string,
  nextLabel: string,
) {
  if (previousLabel === nextLabel) return;
  checkbox.checked = false;
  label.textContent = previousLabel;
  checkbox.dispatchEvent(new Event("change", { bubbles: true }));
  label.textContent = nextLabel;
  checkbox.checked = true;
  checkbox.dispatchEvent(new Event("change", { bubbles: true }));
}

function syncReviewAddon(prefix: string, nextLabel: string) {
  document.querySelectorAll<HTMLElement>("#quote-form dt").forEach((term) => {
    if (term.textContent?.trim() !== "Selected add-ons") return;
    const value = term.parentElement?.querySelector<HTMLElement>("dd");
    if (!value) return;
    const parts = (value.textContent || "")
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => (part.toLowerCase().startsWith(prefix.toLowerCase()) ? nextLabel : part));
    value.textContent = parts.join(", ");
  });
}

function fieldLabel(text: string, control: HTMLElement) {
  const label = document.createElement("label");
  label.className = "block text-sm font-semibold text-[#4A3435]";
  label.append(document.createTextNode(text));
  label.appendChild(control);
  return label;
}

function normalizedLaundryFacilities(value: string): StructuredLaundryRequest["facilities"] {
  if (value === "Washer + tumble dryer") return "WASHER_DRYER";
  if (value === "Washer + line / drying rack") return "WASHER_LINE";
  if (value === "No washing machine") return "NO_WASHER";
  return undefined;
}

export function LaundryOperatingModelEnhancement() {
  useEffect(() => {
    if (window.location.pathname !== "/quote") return;

    let syncing = false;
    let laundryFacilities = "";
    let laundryLoads = "1";
    let ironingLoads = "1";

    const removePrimaryLaundry = () => {
      const service = document.querySelector<HTMLSelectElement>("#field-service");
      if (!service) return;
      const stale = Array.from(service.options).find(
        (option) =>
          option.value === "Laundry Folding" || option.textContent?.trim() === "Laundry Folding",
      );
      if (!stale) return;
      if (service.value === stale.value) {
        service.value = "";
        service.dispatchEvent(new Event("change", { bubbles: true }));
      }
      stale.remove();
    };

    const normalizeLaundryCheckbox = () => {
      const checkbox = addonCheckbox("Laundry folding") || addonCheckbox("Laundry");
      const label = checkbox?.closest("label");
      const text = label?.querySelector<HTMLElement>("span");
      if (!checkbox || !label || !text) return null;
      if (!checkbox.checked && text.textContent?.trim() !== "Laundry") text.textContent = "Laundry";
      return { checkbox, label, text };
    };

    const eligible = () =>
      ELIGIBLE_PRIMARY_SERVICES.has(
        document.querySelector<HTMLSelectElement>("#field-service")?.value || "",
      );

    const clearAddon = (checkbox: HTMLInputElement, text: HTMLElement, baseLabel: string) => {
      if (checkbox.checked) {
        checkbox.checked = false;
        checkbox.dispatchEvent(new Event("change", { bubbles: true }));
      }
      text.textContent = baseLabel;
    };

    const render = () => {
      if (syncing) return;
      removePrimaryLaundry();

      const laundry = normalizeLaundryCheckbox();
      const ironingCheckbox = addonCheckbox("Ironing");
      const ironingLabel = ironingCheckbox?.closest("label") || null;
      const ironingText = ironingLabel?.querySelector<HTMLElement>("span") || null;
      const canUseLaundry = eligible();

      if (laundry) {
        laundry.checkbox.disabled = !canUseLaundry;
        laundry.label.classList.toggle("opacity-50", !canUseLaundry);
        laundry.label.title = canUseLaundry
          ? "Laundry is available with this whole-home cleaning service."
          : "Laundry is available only with Regular Home Cleaning or Deep Cleaning.";
        if (!canUseLaundry) clearAddon(laundry.checkbox, laundry.text, "Laundry");
      }

      if (ironingCheckbox && ironingLabel && ironingText) {
        ironingCheckbox.disabled = !canUseLaundry;
        ironingLabel.classList.toggle("opacity-50", !canUseLaundry);
        ironingLabel.title = canUseLaundry
          ? "Ironing is available with this whole-home cleaning service."
          : "Ironing is available only with Regular Home Cleaning or Deep Cleaning.";
        if (!canUseLaundry) clearAddon(ironingCheckbox, ironingText, "Ironing");
      }

      if (!laundry?.checkbox.checked || !canUseLaundry) {
        structuredLaundryRequest = {
          ...structuredLaundryRequest,
          facilities: undefined,
          laundryLoads: undefined,
        };
      }
      if (!ironingCheckbox?.checked || !canUseLaundry) {
        structuredLaundryRequest = {
          ...structuredLaundryRequest,
          ironingLoads: undefined,
        };
      }

      const oldLaundryPanel = document.getElementById("laundry-operating-model-control");
      if (!laundry?.checkbox.checked || !canUseLaundry) {
        oldLaundryPanel?.remove();
      } else if (!oldLaundryPanel) {
        const panel = document.createElement("div");
        panel.id = "laundry-operating-model-control";
        panel.className = "mt-3 rounded-xl border border-[#D8CCC0] bg-[#FBF7EF] p-4";

        const intro = document.createElement("p");
        intro.className = "text-sm leading-6 text-[#695E59]";
        intro.textContent =
          "Laundry is completed at your home using your washing equipment. The available service depends on your drying facilities.";

        const grid = document.createElement("div");
        grid.className = "mt-4 grid gap-4 sm:grid-cols-2";

        const facilities = document.createElement("select");
        facilities.id = "field-laundryFacilities";
        facilities.className = INPUT_CLASS;
        facilities.innerHTML = [
          '<option value="">Select facilities</option>',
          '<option value="Washer + tumble dryer">Washing machine + tumble dryer</option>',
          '<option value="Washer + line / drying rack">Washing machine + washing line / drying rack</option>',
          '<option value="No washing machine">No washing machine</option>',
        ].join("");
        facilities.value = laundryFacilities;

        const loads = document.createElement("input");
        loads.id = "field-laundryLoads";
        loads.type = "number";
        loads.min = "1";
        loads.step = "1";
        loads.inputMode = "numeric";
        loads.className = INPUT_CLASS;
        loads.value = laundryLoads;

        grid.append(
          fieldLabel("Laundry facilities", facilities),
          fieldLabel("Requested standard loads", loads),
        );

        const outcome = document.createElement("p");
        outcome.id = "laundry-operating-model-outcome";
        outcome.className = "mt-4 text-sm font-medium text-[#5A1425]";

        const error = document.createElement("p");
        error.id = "laundry-operating-model-error";
        error.className = "mt-2 hidden text-sm text-[#9B3349]";
        error.setAttribute("role", "alert");

        const updateLaundry = () => {
          laundryFacilities = facilities.value;
          const parsed = Number.parseInt(loads.value, 10);
          laundryLoads = Number.isFinite(parsed) && parsed >= 1 ? String(parsed) : "1";
          loads.value = laundryLoads;
          structuredLaundryRequest = {
            ...structuredLaundryRequest,
            facilities: normalizedLaundryFacilities(laundryFacilities),
            laundryLoads: Number(laundryLoads),
          };

          let nextLabel = "Laundry";
          if (laundryFacilities === "Washer + tumble dryer") {
            nextLabel = `Laundry — Wash, Dry & Fold × ${laundryLoads}`;
            outcome.textContent = `Wash, Dry & Fold — R175 per standard load. Requested laundry: R${175 * Number(laundryLoads)}.`;
            error.classList.add("hidden");
          } else if (laundryFacilities === "Washer + line / drying rack") {
            nextLabel = `Laundry — Wash & Hang × ${laundryLoads}`;
            outcome.textContent = `Wash & Hang — R125 per standard load. Requested laundry: R${125 * Number(laundryLoads)}.`;
            error.classList.add("hidden");
          } else if (laundryFacilities === "No washing machine") {
            outcome.textContent =
              "Laundry is unavailable because Homent does not transport laundry off-site in v1.";
            error.textContent = "Laundry requires a working washing machine at the property.";
            error.classList.remove("hidden");
          } else {
            outcome.textContent =
              "Select your laundry facilities to determine the available service.";
            error.classList.add("hidden");
          }

          const currentLabel = laundry.text.textContent?.trim() || "Laundry";
          if (laundryFacilities !== "No washing machine") {
            syncing = true;
            setAddonLabel(laundry.checkbox, laundry.text, currentLabel, nextLabel);
            syncing = false;
            syncReviewAddon("Laundry", nextLabel);
          }
        };

        facilities.addEventListener("change", updateLaundry);
        loads.addEventListener("change", updateLaundry);
        loads.addEventListener("blur", updateLaundry);
        panel.append(intro, grid, outcome, error);
        laundry.label.insertAdjacentElement("afterend", panel);
        updateLaundry();
      }

      const oldIroningPanel = document.getElementById("ironing-load-quantity-control");
      if (!ironingCheckbox?.checked || !canUseLaundry || !ironingLabel || !ironingText) {
        oldIroningPanel?.remove();
        if (ironingText && !ironingCheckbox?.checked) ironingText.textContent = "Ironing";
      } else if (!oldIroningPanel) {
        const panel = document.createElement("div");
        panel.id = "ironing-load-quantity-control";
        panel.className = "mt-3 rounded-xl border border-[#D8CCC0] bg-[#FBF7EF] p-4";

        const input = document.createElement("input");
        input.id = "field-ironingLoads";
        input.type = "number";
        input.min = "1";
        input.step = "1";
        input.inputMode = "numeric";
        input.className = `${INPUT_CLASS} max-w-40`;
        input.value = ironingLoads;

        const hint = document.createElement("p");
        hint.className = "mt-2 text-xs leading-5 text-[#756963]";
        hint.textContent =
          "R150 per standard load. Customer provides a safe, working iron and ironing board.";

        const apply = () => {
          const parsed = Number.parseInt(input.value, 10);
          ironingLoads = Number.isFinite(parsed) && parsed >= 1 ? String(parsed) : "1";
          input.value = ironingLoads;
          structuredLaundryRequest = {
            ...structuredLaundryRequest,
            ironingLoads: Number(ironingLoads),
          };
          const nextLabel = `Ironing × ${ironingLoads}`;
          const currentLabel = ironingText.textContent?.trim() || "Ironing";
          syncing = true;
          setAddonLabel(ironingCheckbox, ironingText, currentLabel, nextLabel);
          syncing = false;
          syncReviewAddon("Ironing", nextLabel);
        };

        panel.append(fieldLabel("Ironing standard loads", input), hint);
        ironingLabel.insertAdjacentElement("afterend", panel);
        input.addEventListener("change", apply);
        input.addEventListener("blur", apply);
        apply();
      }
    };

    const validateLaundryStep = (event: MouseEvent) => {
      const button = (event.target as HTMLElement | null)?.closest(
        "button",
      ) as HTMLButtonElement | null;
      if (!button || !button.textContent?.includes("Continue")) return;
      const heading = document
        .querySelector<HTMLHeadingElement>("#quote-form h2")
        ?.textContent?.trim();
      if (heading !== "Personalise Your Service") return;
      const laundry = normalizeLaundryCheckbox();
      if (!laundry?.checkbox.checked) return;
      const error = document.getElementById("laundry-operating-model-error");
      if (!laundryFacilities || laundryFacilities === "No washing machine") {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (error) {
          error.textContent = !laundryFacilities
            ? "Please select the laundry facilities at the property."
            : "Laundry cannot be added without a working washing machine at the property.";
          error.classList.remove("hidden");
          error.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    };

    const onChange = () => window.setTimeout(render, 0);
    const observer = new MutationObserver(() => window.setTimeout(render, 0));
    const root = document.getElementById("quote-form");
    if (root) observer.observe(root, { childList: true, subtree: true });
    document.addEventListener("change", onChange, true);
    document.addEventListener("click", validateLaundryStep, true);
    render();

    return () => {
      observer.disconnect();
      document.removeEventListener("change", onChange, true);
      document.removeEventListener("click", validateLaundryStep, true);
      document.getElementById("laundry-operating-model-control")?.remove();
      document.getElementById("ironing-load-quantity-control")?.remove();
      structuredLaundryRequest = {};
    };
  }, []);

  return null;
}
