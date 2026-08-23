import { useEffect } from "react";

const SERVICE = "Post-Event Cleaning";
const EVENT_TYPES = ["Party / Birthday", "Wedding / Reception", "Family gathering", "Corporate event", "Funeral / Memorial", "Other"];
const VENUE_TYPES = ["Home", "Apartment", "Business premises", "Event venue", "Other"];
const GUEST_BANDS = ["1–20", "21–50", "51–100", "101–150", "150+"];
const DISHWASHING = ["None", "Moderate", "Heavy"];
const WASTE_LEVELS = ["Light", "Moderate", "Heavy"];
const OUTDOOR_AREAS = ["Patio", "Balcony", "Braai area", "Garden entertainment area"];
const storedValues: Record<string, string> = {};

const inputClass =
  "mt-2 min-h-12 w-full rounded-xl border border-[#CDBFB1] bg-white px-4 py-3 text-base text-[#342C2A] shadow-sm outline-none transition hover:border-[#A89380] focus:border-[#5A1425] focus:ring-2 focus:ring-[#C9A45B]/45";

function makeOption(value: string, label = value) {
  const node = document.createElement("option");
  node.value = value;
  node.textContent = label;
  return node;
}

function remember(element: HTMLInputElement | HTMLSelectElement) {
  if (element.id) storedValues[element.id] = element.value;
}

function ensureServiceOption() {
  const select = document.querySelector<HTMLSelectElement>("#field-service");
  if (!select || Array.from(select.options).some((item) => item.value === SERVICE)) return;
  const node = makeOption(SERVICE);
  const notSure = Array.from(select.options).find((item) => item.value === "Not sure");
  if (notSure) select.insertBefore(node, notSure);
  else select.appendChild(node);
}

function ensureOneTimeFrequency() {
  const service = document.querySelector<HTMLSelectElement>("#field-service");
  const frequency = document.querySelector<HTMLSelectElement>("#field-frequency");
  if (!service || !frequency || service.value !== SERVICE) return;

  const needsOptions =
    frequency.options.length !== 2 ||
    frequency.options[0]?.value !== "" ||
    frequency.options[1]?.value !== "One-time";
  const needsValue = frequency.value !== "One-time";

  if (needsOptions) {
    frequency.replaceChildren(makeOption("", "Select frequency"), makeOption("One-time"));
  }
  frequency.disabled = false;
  frequency.dataset.optionSignature = `${SERVICE}:`;

  if (needsValue || needsOptions) {
    frequency.value = "One-time";
    frequency.dispatchEvent(new Event("change", { bubbles: true }));
  }
}

function requiredMarker() {
  const marker = document.createElement("span");
  marker.className = "text-[#9B3349]";
  marker.setAttribute("aria-hidden", "true");
  marker.textContent = " *";
  return marker;
}

function makeSelect(id: string, labelText: string, values: string[]) {
  const label = document.createElement("label");
  label.className = "text-sm font-semibold text-[#4A3435]";
  label.htmlFor = id;
  label.append(document.createTextNode(labelText), requiredMarker());

  const select = document.createElement("select");
  select.id = id;
  select.className = inputClass;
  select.appendChild(makeOption("", "Select one"));
  values.forEach((value) => select.appendChild(makeOption(value)));
  select.value = storedValues[id] || "";
  select.addEventListener("change", () => remember(select));
  label.appendChild(select);
  return label;
}

function makeNumber(id: string, labelText: string) {
  const label = document.createElement("label");
  label.className = "text-sm font-semibold text-[#4A3435]";
  label.htmlFor = id;
  label.append(document.createTextNode(labelText), requiredMarker());

  const input = document.createElement("input");
  input.id = id;
  input.type = "number";
  input.min = "1";
  input.step = "1";
  input.inputMode = "numeric";
  input.className = inputClass;
  input.value = storedValues[id] || "";
  input.addEventListener("input", () => remember(input));
  label.appendChild(input);
  return label;
}

function yesNo(id: string, labelText: string) {
  return makeSelect(id, labelText, ["Yes", "No"]);
}

function makeOutdoorAreas() {
  const fieldset = document.createElement("fieldset");
  fieldset.className = "sm:col-span-2 rounded-xl border border-[#E4D9CB] bg-[#FBF7EF] p-4";

  const legend = document.createElement("legend");
  legend.className = "px-1 text-sm font-semibold text-[#4A3435]";
  legend.textContent = "Outdoor event areas requiring cleaning (optional)";
  fieldset.appendChild(legend);

  const hidden = document.createElement("input");
  hidden.type = "hidden";
  hidden.id = "field-postEventOutdoorAreas";
  hidden.value = storedValues[hidden.id] || "";
  fieldset.appendChild(hidden);

  const selected = new Set(hidden.value.split("|").filter(Boolean));
  OUTDOOR_AREAS.forEach((value) => {
    const label = document.createElement("label");
    label.className = "mt-3 flex items-center gap-3 text-sm text-[#4A3435]";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = value;
    checkbox.checked = selected.has(value);
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) selected.add(value);
      else selected.delete(value);
      hidden.value = Array.from(selected).join("|");
      storedValues[hidden.id] = hidden.value;
      hidden.dispatchEvent(new Event("input", { bubbles: true }));
    });
    label.append(checkbox, document.createTextNode(value));
    fieldset.appendChild(label);
  });
  return fieldset;
}

function ensurePanel() {
  ensureServiceOption();
  const service = document.querySelector<HTMLSelectElement>("#field-service");
  const existing = document.getElementById("post-event-quote-fields");
  if (!service || service.value !== SERVICE) {
    existing?.remove();
    return;
  }

  ensureOneTimeFrequency();
  if (existing) return;

  const anchor = document.querySelector<HTMLSelectElement>("#field-condition")?.closest("label");
  if (!anchor) return;

  const panel = document.createElement("div");
  panel.id = "post-event-quote-fields";
  panel.className = "sm:col-span-2 mt-2 grid gap-6 rounded-2xl border border-[#E4D9CB] bg-white p-5 sm:grid-cols-2";

  const intro = document.createElement("div");
  intro.className = "sm:col-span-2";
  intro.innerHTML =
    '<h3 class="text-base font-semibold text-[#342C2A]">Post-event details</h3><p class="mt-1 text-sm leading-6 text-[#695E59]">Tell us about the event and the cleanup required so Homent can calculate the workload accurately.</p>';

  panel.append(
    intro,
    makeSelect("field-postEventType", "Event type", EVENT_TYPES),
    makeSelect("field-postEventVenueType", "Venue / property context", VENUE_TYPES),
    makeSelect("field-postEventGuestBand", "Approximate guests", GUEST_BANDS),
    makeNumber("field-postEventBathrooms", "Bathrooms used"),
    yesNo("field-postEventKitchenUsed", "Was the kitchen substantially used for food service?"),
    makeSelect("field-postEventDishwashing", "Dishwashing required", DISHWASHING),
    makeOutdoorAreas(),
    makeSelect("field-postEventWasteLevel", "Waste level", WASTE_LEVELS),
    yesNo("field-postEventSoiling", "Significant ordinary spills or soiling?"),
    yesNo("field-postEventOvernight", "Late-night or overnight cleaning required?"),
    yesNo("field-postEventBulkWaste", "Bulk or off-site waste removal requested?"),
    yesNo("field-postEventSpecialistContamination", "Specialist contamination or bodily-fluid cleanup?"),
    yesNo("field-postEventSpecialistCarpet", "Specialist carpet or upholstery treatment required?"),
    yesNo("field-postEventComplexVenue", "Large or operationally complex venue?"),
  );

  anchor.insertAdjacentElement("afterend", panel);
}

const REQUIRED: Array<[string, string]> = [
  ["field-postEventType", "Please select the event type."],
  ["field-postEventVenueType", "Please select the venue type."],
  ["field-postEventGuestBand", "Please select the approximate guest count."],
  ["field-postEventBathrooms", "Please enter how many bathrooms were used."],
  ["field-postEventKitchenUsed", "Please answer the kitchen-use question."],
  ["field-postEventDishwashing", "Please select the dishwashing level."],
  ["field-postEventWasteLevel", "Please select the waste level."],
  ["field-postEventSoiling", "Please answer the spills or soiling question."],
  ["field-postEventOvernight", "Please answer the late-night or overnight question."],
  ["field-postEventBulkWaste", "Please answer the bulk-waste question."],
  ["field-postEventSpecialistContamination", "Please answer the specialist contamination question."],
  ["field-postEventSpecialistCarpet", "Please answer the carpet or upholstery question."],
  ["field-postEventComplexVenue", "Please answer the complex-venue question."],
];

function clearError(id: string) {
  document.getElementById(`post-event-error-${id}`)?.remove();
  document.getElementById(id)?.removeAttribute("aria-invalid");
}

function validatePanel() {
  const service = document.querySelector<HTMLSelectElement>("#field-service");
  if (service?.value !== SERVICE) return true;

  let valid = true;
  let first: HTMLElement | null = null;
  for (const [id, message] of REQUIRED) {
    const element = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null;
    const bathroomInvalid = id === "field-postEventBathrooms" && element
      ? !Number.isInteger(Number(element.value)) || Number(element.value) < 1
      : false;
    if (!element?.value.trim() || bathroomInvalid) {
      valid = false;
      if (element && !first) first = element;
      if (!element) continue;
      clearError(id);
      element.setAttribute("aria-invalid", "true");
      const error = document.createElement("p");
      error.id = `post-event-error-${id}`;
      error.className = "mt-2 text-sm font-normal text-[#9B3349]";
      error.setAttribute("role", "alert");
      error.textContent = message;
      element.insertAdjacentElement("afterend", error);
    } else {
      clearError(id);
    }
  }
  first?.focus();
  return valid;
}

export function PostEventCleaningEnhancement() {
  useEffect(() => {
    if (window.location.pathname !== "/quote") return;

    const sync = () => ensurePanel();
    sync();
    const quoteForm = document.getElementById("quote-form");
    const observer = new MutationObserver(sync);
    if (quoteForm) observer.observe(quoteForm, { childList: true, subtree: true });

    const onChange = (event: Event) => {
      const target = event.target as HTMLInputElement | HTMLSelectElement | null;
      if (target?.id) remember(target);
      if (target?.id === "field-service") window.setTimeout(sync, 0);
      if (target?.id?.startsWith("field-postEvent")) clearError(target.id);
    };

    const onClick = (event: MouseEvent) => {
      const button = (event.target as HTMLElement | null)?.closest("button");
      if (!button) return;
      const service = document.querySelector<HTMLSelectElement>("#field-service");
      if (service?.value !== SERVICE || !document.getElementById("post-event-quote-fields")) return;
      const text = button.textContent?.trim() || "";
      if (!text.includes("Continue") && !text.includes("Send Request")) return;
      if (!validatePanel()) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };

    document.addEventListener("change", onChange, true);
    document.addEventListener("input", onChange, true);
    document.addEventListener("click", onClick, true);
    return () => {
      observer.disconnect();
      document.removeEventListener("change", onChange, true);
      document.removeEventListener("input", onChange, true);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  return null;
}
