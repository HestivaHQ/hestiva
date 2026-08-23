import { useEffect } from "react";

const SERVICE = "Post-Event Cleaning";

const EVENT_TYPES = [
  "Party / Birthday",
  "Wedding / Reception",
  "Family gathering",
  "Corporate event",
  "Funeral / Memorial",
  "Other",
];

const VENUE_TYPES = ["Home", "Apartment", "Business premises", "Event venue", "Other"];
const GUEST_BANDS = ["1–20", "21–50", "51–100", "101–150", "150+"];
const DISHWASHING = ["None", "Moderate", "Heavy"];
const WASTE_LEVELS = ["Light", "Moderate", "Heavy"];
const OUTDOOR_AREAS = ["Patio", "Balcony", "Braai area", "Garden entertainment area"];

const storedValues: Record<string, string> = {};

function rememberValue(element: HTMLInputElement | HTMLSelectElement) {
  storedValues[element.id] = element.value;
}

function option(value: string, label = value) {
  const node = document.createElement("option");
  node.value = value;
  node.textContent = label;
  return node;
}

function ensureServiceOption() {
  const service = document.querySelector<HTMLSelectElement>("#field-service");
  if (!service) return;
  if (!Array.from(service.options).some((item) => item.value === SERVICE)) {
    const notSure = Array.from(service.options).find((item) => item.value === "Not sure");
    const postEvent = option(SERVICE);
    if (notSure) service.insertBefore(postEvent, notSure);
    else service.appendChild(postEvent);
  }
}

function ensureOneTimeFrequency() {
  const service = document.querySelector<HTMLSelectElement>("#field-service");
  const frequency = document.querySelector<HTMLSelectElement>("#field-frequency");
  if (!service || !frequency || service.value !== SERVICE) return;

  if (frequency.options.length !== 2 || frequency.options[1]?.value !== "One-time") {
    frequency.replaceChildren(option("", "Select frequency"), option("One-time"));
  }
  frequency.disabled = false;
  frequency.value = "One-time";
  frequency.dataset.optionSignature = `${SERVICE}:`;
  frequency.dispatchEvent(new Event("change", { bubbles: true }));
}

function labelledSelect(
  id: string,
  labelText: string,
  values: string[],
  placeholder = "Select one",
) {
  const label = document.createElement("label");
  label.className = "text-sm font-semibold text-[#4A3435]";
  label.htmlFor = id;
  label.append(document.createTextNode(labelText));
  const marker = document.createElement("span");
  marker.className = "text-[#9B3349]";
  marker.setAttribute("aria-hidden", "true");
  marker.textContent = " *";
  label.appendChild(marker);

  const select = document.createElement("select");
  select.id = id;
  select.className =
    "mt-2 min-h-12 w-full rounded-xl border border-[#CDBFB1] bg-white px-4 py-3 text-base text-[#342C2A] shadow-sm outline-none transition hover:border-[#A89380] focus:border-[#5A1425] focus:ring-2 focus:ring-[#C9A45B]/45";
  select.appendChild(option("", placeholder));
  values.forEach((value) => select.appendChild(option(value)));
  select.value = storedValues[id] || "";
  select.addEventListener("change", () => rememberValue(select));
  label.appendChild(select);
  return label;
}

function labelledNumber(id: string, labelText: string) {
  const label = document.createElement("label");
  label.className = "text-sm font-semibold text-[#4A3435]";
  label.htmlFor = id;
  label.append(document.createTextNode(labelText));
  const marker = document.createElement("span");
  marker.className = "text-[#9B3349]";
  marker.setAttribute("aria-hidden", "true");
  marker.textContent = " *";
  label.appendChild(marker);

  const input = document.createElement("input");
  input.id = id;
  input.type = "number";
  input.min = "1";
  input.max = "20";
  input.step = "1";
  input.className =
    "mt-2 min-h-12 w-full rounded-xl border border-[#CDBFB1] bg-white px-4 py-3 text-base text-[#342C2A] shadow-sm outline-none transition hover:border-[#A89380] focus:border-[#5A1425] focus:ring-2 focus:ring-[#C9A45B]/45";
  input.value = storedValues[id] || "";
  input.addEventListener("input", () => rememberValue(input));
  label.appendChild(input);
  return label;
}

function yesNo(id: string, labelText: string) {
  return labelledSelect(id, labelText, ["Yes", "No"]);
}

function outdoorAreaCheckboxes() {
  const fieldset = document.createElement("fieldset");
  fieldset.id = "post-event-outdoor-areas";
  fieldset.className = "sm:col-span-2 rounded-xl border border-[#E4D9CB] bg-[#FBF7EF] p-4";
  const legend = document.createElement("legend");
  legend.className = "px-1 text-sm font-semibold text-[#4A3435]";
  legend.textContent = "Outdoor event areas requiring cleaning";
  fieldset.appendChild(legend);

  const current = new Set((storedValues["field-postEventOutdoorAreas"] || "").split("|").filter(Boolean));
  for (const value of OUTDOOR_AREAS) {
    const label = document.createElement("label");
    label.className = "mt-3 flex items-center gap-3 text-sm text-[#4A3435]";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = value;
    input.checked = current.has(value);
    input.addEventListener("change", () => {
      if (input.checked) current.add(value);
      else current.delete(value);
      storedValues["field-postEventOutdoorAreas"] = Array.from(current).join("|");
      hidden.value = storedValues["field-postEventOutdoorAreas"];
      hidden.dispatchEvent(new Event("input", { bubbles: true }));
    });
    label.append(input, document.createTextNode(value));
    fieldset.appendChild(label);
  }

  const hidden = document.createElement("input");
  hidden.type = "hidden";
  hidden.id = "field-postEventOutdoorAreas";
  hidden.value = storedValues[hidden.id] || "";
  fieldset.appendChild(hidden);
  return fieldset;
}

function ensurePostEventPanel() {
  ensureServiceOption();
  const service = document.querySelector<HTMLSelectElement>("#field-service");
  const existing = document.getElementById("post-event-quote-fields");
  if (!service || service.value !== SERVICE) {
    existing?.remove();
    return;
  }

  ensureOneTimeFrequency();
  if (existing) return;

  const condition = document.querySelector<HTMLSelectElement>("#field-condition");
  const anchor = condition?.closest("label");
  if (!anchor) return;

  const panel = document.createElement("div");
  panel.id = "post-event-quote-fields";
  panel.className = "sm:col-span-2 mt-2 grid gap-6 rounded-2xl border border-[#E4D9CB] bg-white p-5 sm:grid-cols-2";

  const heading = document.createElement("div");
  heading.className = "sm:col-span-2";
  heading.innerHTML =
    '<h3 class="text-base font-semibold text-[#342C2A]">Post-event details</h3><p class="mt-1 text-sm leading-6 text-[#695E59]">Tell us about the event and the cleanup required so Homent can calculate the workload accurately.</p>';
  panel.appendChild(heading);

  panel.append(
    labelledSelect("field-postEventType", "Event type", EVENT_TYPES),
    labelledSelect("field-postEventVenueType", "Venue / property context", VENUE_TYPES),
    labelledSelect("field-postEventGuestBand", "Approximate guests", GUEST_BANDS),
    labelledNumber("field-postEventBathrooms", "Bathrooms used"),
    yesNo("field-postEventKitchenUsed", "Was the kitchen substantially used for food service?"),
    labelledSelect("field-postEventDishwashing", "Dishwashing required", DISHWASHING),
    outdoorAreaCheckboxes(),
    labelledSelect("field-postEventWasteLevel", "Waste level", WASTE_LEVELS),
    yesNo("field-postEventSoiling", "Significant ordinary spills or soiling?"),
    yesNo("field-postEventOvernight", "Late-night or overnight cleaning required?"),
    yesNo("field-postEventBulkWaste", "Bulk or off-site waste removal requested?"),
    yesNo("field-postEventSpecialistContamination", "Specialist contamination or bodily-fluid cleanup?"),
    yesNo("field-postEventSpecialistCarpet", "Specialist carpet or upholstery treatment required?"),
    yesNo("field-postEventComplexVenue", "Large or operationally complex venue?"),
  );

  anchor.insertAdjacentElement("afterend", panel);
}

const REQUIRED_FIELDS: Array<[string, string]> = [
  ["field-postEventType", "Please select the event type."],
  ["field-postEventVenueType", "Please select the venue type."],
  ["field-postEventGuestBand", "Please select the approximate guest count."],
  ["field-postEventBathrooms", "Please enter how many bathrooms were used."],
  ["field-postEventKitchenUsed", "Please tell us whether the kitchen was substantially used."],
  ["field-postEventDishwashing", "Please select the dishwashing level."],
  ["field-postEventWasteLevel", "Please select the waste level."],
  ["field-postEventSoiling", "Please tell us whether there are significant spills or soiling."],
  ["field-postEventOvernight", "Please tell us whether late-night or overnight cleaning is required."],
  ["field-postEventBulkWaste", "Please tell us whether bulk waste removal is requested."],
  ["field-postEventSpecialistContamination", "Please answer the specialist contamination question."],
  ["field-postEventSpecialistCarpet", "Please answer the specialist carpet/upholstery question."],
  ["field-postEventComplexVenue", "Please tell us whether this is a complex venue."],
];

function clearError(id: string) {
  document.getElementById(`post-event-error-${id}`)?.remove();
  document.getElementById(id)?.removeAttribute("aria-invalid");
}

function validatePostEventFields() {
  const service = document.querySelector<HTMLSelectElement>("#field-service");
  if (service?.value !== SERVICE) return true;

  let first: HTMLElement | null = null;
  let valid = true;
  for (const [id, message] of REQUIRED_FIELDS) {
    const element = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null;
    if (!element || !element.value.trim()) {
      valid = false;
      if (element && !first) first = element;
      if (element) {
        clearError(id);
        element.setAttribute("aria-invalid", "true");
        const error = document.createElement("p");
        error.id = `post-event-error-${id}`;
        error.className = "mt-2 text-sm font-normal text-[#9B3349]";
        error.setAttribute("role", "alert");
        error.textContent = message;
        element.insertAdjacentElement("afterend", error);
      }
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

    const sync = () => ensurePostEventPanel();
    sync();
    const observer = new MutationObserver(sync);
    const quoteForm = document.getElementById("quote-form");
    if (quoteForm) observer.observe(quoteForm, { childList: true, subtree: true });

    const onChange = (event: Event) => {
      const target = event.target as HTMLInputElement | HTMLSelectElement | null;
      if (target?.id) rememberValue(target);
      if (target?.id === "field-service") window.setTimeout(sync, 0);
      if (target?.id?.startsWith("field-postEvent")) clearError(target.id);
    };

    const onClick = (event: MouseEvent) => {
      const button = (event.target as HTMLElement | null)?.closest("button");
      if (!button) return;
      const service = document.querySelector<HTMLSelectElement>("#field-service");
      if (service?.value !== SERVICE) return;
      const panel = document.getElementById("post-event-quote-fields");
      if (!panel) return;
      const text = button.textContent?.trim() || "";
      if (!text.includes("Continue") && !text.includes("Send Request")) return;
      if (!validatePostEventFields()) {
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
