import { useEffect } from "react";
import { submitContactForm } from "@/lib/contact.functions";
import { isSuccessfulSubmissionResult } from "@/lib/submission-result";
import { clearQuoteFiles, getQuoteFiles } from "@/lib/quote/client-upload-store";

const quoteValues: Record<string, string> = {};
const quoteAddons = new Set<string>();

function fieldName(id: string) {
  return id.startsWith("field-") ? id.slice("field-".length) : id;
}

function propertyNeedsUnitAccess(type: string) {
  return type === "Apartment" || type === "Townhouse";
}

function tomorrowDateValue() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const day = String(tomorrow.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function serviceFrequencyOptions(service: string) {
  if (service === "Move-In Cleaning" || service === "Move-Out Cleaning") return ["One-time"];

  if (
    service === "Regular Home Cleaning" ||
    service === "Apartment Cleaning" ||
    service === "Eco-Friendly Cleaning"
  ) {
    return ["One-time", "Weekly", "Every two weeks", "Monthly", "Custom"];
  }

  if (service === "Deep Cleaning") return ["One-time", "Monthly", "Custom"];

  if (
    service === "Kitchen Cleaning" ||
    service === "Bathroom Sanitisation" ||
    service === "Bedroom Cleaning" ||
    service === "Living Area Cleaning" ||
    service === "Interior Window Cleaning" ||
    service === "Laundry Folding" ||
    service === "Add-on Services" ||
    service === "Not sure"
  ) {
    return ["One-time", "Custom"];
  }

  return [];
}

function replaceSelectOptions(select: HTMLSelectElement, options: string[], placeholder: string) {
  const current = select.value;
  select.replaceChildren();
  const first = document.createElement("option");
  first.value = "";
  first.textContent = placeholder;
  select.appendChild(first);
  for (const value of options) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  }
  select.value = options.includes(current) ? current : "";
}

function syncServiceFrequency() {
  const service = document.querySelector<HTMLSelectElement>("#field-service");
  const frequency = document.querySelector<HTMLSelectElement>("#field-frequency");
  if (!service || !frequency) return;

  const allowed = serviceFrequencyOptions(service.value);
  const signature = `${service.value}:${allowed.join("|")}`;
  if (frequency.dataset.optionSignature !== signature) {
    replaceSelectOptions(
      frequency,
      allowed,
      service.value ? "Select frequency" : "Select service first",
    );
    frequency.dataset.optionSignature = signature;
    quoteValues.frequency = frequency.value;
  }
  frequency.disabled = !service.value;
}

function syncDateRules() {
  const minimum = tomorrowDateValue();
  for (const id of ["field-preferredDate", "field-alternativeDate"]) {
    const input = document.querySelector<HTMLInputElement>(`#${id}`);
    if (!input) continue;
    input.min = minimum;
    if (input.value && input.value < minimum) {
      input.value = "";
      quoteValues[fieldName(id)] = "";
    }
  }
}

function markRequired(id: string) {
  const element = document.querySelector<HTMLElement>(`#${id}`);
  const label = element?.closest("label");
  if (!label || label.querySelector(`[data-required-for="${id}"]`)) return;
  const marker = document.createElement("span");
  marker.dataset.requiredFor = id;
  marker.setAttribute("aria-hidden", "true");
  marker.className = "text-[#9B3349]";
  marker.textContent = " *";
  label.insertBefore(marker, element);
}

function clearInlineError(id: string) {
  document.querySelector(`#quote-error-${id}`)?.remove();
  const element = document.querySelector<HTMLElement>(`#${id}`);
  element?.removeAttribute("aria-invalid");
}

function showInlineError(id: string, message: string) {
  const element = document.querySelector<HTMLElement>(`#${id}`);
  if (!element) return;
  clearInlineError(id);
  element.setAttribute("aria-invalid", "true");
  const error = document.createElement("p");
  error.id = `quote-error-${id}`;
  error.className = "mt-2 text-sm font-normal text-[#9B3349]";
  error.setAttribute("role", "alert");
  error.textContent = message;
  element.insertAdjacentElement("afterend", error);
}

function hasValue(id: string) {
  const element = document.querySelector<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >(`#${id}`);
  return Boolean(element?.value.trim());
}

function validateRequiredFields(fields: Array<[string, string]>) {
  let valid = true;
  let firstMissing: HTMLElement | null = null;

  for (const [id, message] of fields) {
    const element = document.querySelector<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >(`#${id}`);
    if (!element) continue;

    markRequired(id);
    if (!element.value.trim()) {
      showInlineError(id, message);
      valid = false;
      if (!firstMissing && !element.disabled) firstMissing = element;
    } else {
      clearInlineError(id);
    }
  }

  firstMissing?.focus();
  return valid;
}

function syncUnitAccessFields() {
  if (window.location.pathname !== "/quote") return;
  const propertyType =
    document.querySelector<HTMLSelectElement>("#field-propertyType")?.value || "";
  const originalFloor = document.querySelector<HTMLSelectElement>("#field-unitFloor");
  const originalLabel = originalFloor?.closest("label") as HTMLElement | null;
  const panel = document.querySelector<HTMLElement>("#quote-unit-access-fields");

  if (!propertyNeedsUnitAccess(propertyType) || !originalFloor || !originalLabel) {
    if (originalLabel) originalLabel.style.display = "";
    panel?.remove();
    return;
  }

  originalLabel.style.display = "none";
  if (panel) return;

  const wrapper = document.createElement("div");
  wrapper.id = "quote-unit-access-fields";
  wrapper.className = "sm:col-span-2 grid gap-6 sm:grid-cols-2";

  const makeSelect = (id: string, labelText: string, placeholder: string, values: string[]) => {
    const label = document.createElement("label");
    label.className = "text-sm font-semibold text-[#4A3435]";
    label.htmlFor = id;
    label.append(document.createTextNode(labelText));
    const marker = document.createElement("span");
    marker.setAttribute("aria-hidden", "true");
    marker.className = "text-[#9B3349]";
    marker.textContent = " *";
    label.appendChild(marker);

    const select = document.createElement("select");
    select.id = id;
    select.className = originalFloor.className;
    replaceSelectOptions(select, values, placeholder);
    const key = fieldName(id);
    select.value = quoteValues[key] || "";
    select.addEventListener("change", () => {
      quoteValues[key] = select.value;
      clearInlineError(id);
      syncProgressiveFields();
    });
    label.appendChild(select);
    return label;
  };

  wrapper.append(
    makeSelect("field-unitFloorExact", "Exact floor / level", "Select exact floor", [
      "Ground floor",
      ...Array.from({ length: 50 }, (_, index) => `Floor ${index + 1}`),
    ]),
    makeSelect("field-buildingAccess", "How do we get to your unit?", "Select one", [
      "Elevator available",
      "Stairs only",
      "Elevator and stairs",
    ]),
  );
  originalLabel.insertAdjacentElement("afterend", wrapper);
}

function syncEstateAccess() {
  const select = document.querySelector<HTMLSelectElement>("#field-complexAccess");
  const notice = document.querySelector<HTMLElement>("#access-code-day-notice");
  if (!select) {
    notice?.remove();
    return;
  }

  const options = [
    "Access code",
    "Not applicable",
    "Visitor sign-in",
    "Access arranged by resident",
  ];
  const signature = options.join("|");
  if (select.dataset.optionSignature !== signature) {
    const current = select.value;
    replaceSelectOptions(select, options, "Select access method");
    select.value = options.includes(current) ? current : "";
    select.dataset.optionSignature = signature;
    quoteValues.complexAccess = select.value;
  }

  if (select.value === "Access code") {
    if (!notice) {
      const nextNotice = document.createElement("p");
      nextNotice.id = "access-code-day-notice";
      nextNotice.className = "sm:col-span-2 text-sm leading-6 text-[#695E59]";
      nextNotice.textContent =
        "You can send Hestiva the access code on the day of the visit once the booking is confirmed.";
      select.closest("label")?.insertAdjacentElement("afterend", nextNotice);
    }
  } else {
    notice?.remove();
  }
}

function syncKeyHandover() {
  const select = document.querySelector<HTMLSelectElement>("#field-keyHandover");
  const existingDetails = document.querySelector<HTMLTextAreaElement>("#field-keyHandoverDetails");
  const existingLabel = existingDetails?.closest("label");

  if (!select) {
    existingLabel?.remove();
    return;
  }

  const options = ["Someone will open", "Concierge or reception", "To be arranged"];
  const signature = options.join("|");
  if (select.dataset.optionSignature !== signature) {
    const current = select.value;
    replaceSelectOptions(select, options, "Select key handover method");
    select.value = options.includes(current) ? current : "";
    select.dataset.optionSignature = signature;
    quoteValues.keyHandover = select.value;
  }

  if (select.value !== "To be arranged") {
    existingLabel?.remove();
    quoteValues.keyHandoverDetails = "";
    return;
  }

  if (existingDetails) return;

  const label = document.createElement("label");
  label.className = "sm:col-span-2 text-sm font-semibold text-[#4A3435]";
  label.htmlFor = "field-keyHandoverDetails";
  label.append(document.createTextNode("Explain the key handover arrangement"));
  const marker = document.createElement("span");
  marker.setAttribute("aria-hidden", "true");
  marker.className = "text-[#9B3349]";
  marker.textContent = " *";
  label.appendChild(marker);

  const textarea = document.createElement("textarea");
  textarea.id = "field-keyHandoverDetails";
  textarea.rows = 3;
  textarea.className =
    "mt-2 min-h-12 w-full resize-y rounded-xl border border-[#CDBFB1] bg-white px-4 py-3 text-base text-[#342C2A] shadow-sm outline-none transition placeholder:text-[#8B7E77] hover:border-[#A8938[...]
  textarea.placeholder = "Tell us how the key or access will be handed over.";
  textarea.value = quoteValues.keyHandoverDetails || "";
  textarea.addEventListener("input", () => {
    quoteValues.keyHandoverDetails = textarea.value.trim();
    clearInlineError(textarea.id);
    syncProgressiveFields();
  });
  label.appendChild(textarea);
  select.closest("label")?.insertAdjacentElement("afterend", label);
}

function syncPresenceOptions() {
  const select = document.querySelector<HTMLSelectElement>("#field-present");
  if (!select) return;
  const options = ["Yes", "No"];
  const signature = options.join("|");
  if (select.dataset.optionSignature === signature) return;
  const current = select.value;
  replaceSelectOptions(select, options, "Select one");
  select.value = options.includes(current) ? current : "";
  select.dataset.optionSignature = signature;
  quoteValues.present = select.value;
}

function syncRequiredChoiceField(
  field: "restrictions" | "allergies",
  labelText: string,
  detailsLabel: string,
) {
  const original = document.querySelector<HTMLTextAreaElement>(`#field-${field}`);
  const originalLabel = original?.closest("label") as HTMLElement | null;
  const existingWrapper = document.querySelector<HTMLElement>(`#quote-${field}-choice`);

  if (!original || !originalLabel) {
    existingWrapper?.remove();
    return;
  }

  originalLabel.style.display = "none";
  if (existingWrapper) return;

  const wrapper = document.createElement("div");
  wrapper.id = `quote-${field}-choice`;
  wrapper.className = "text-sm font-semibold text-[#4A3435]";

  const label = document.createElement("label");
  label.htmlFor = `field-${field}Choice`;
  label.append(document.createTextNode(labelText));
  const marker = document.createElement("span");
  marker.setAttribute("aria-hidden", "true");
  marker.className = "text-[#9B3349]";
  marker.textContent = " *";
  label.appendChild(marker);
  wrapper.appendChild(label);

  const select = document.createElement("select");
  select.id = `field-${field}Choice`;
  select.className = original.className.replace("resize-y", "");
  replaceSelectOptions(select, ["None", "Yes — add details"], "Select an option");
  select.value = quoteValues[`${field}Choice`] || "";
  wrapper.appendChild(select);

  const details = document.createElement("textarea");
  details.id = `field-${field}Details`;
  details.rows = 3;
  details.className = original.className;
  details.placeholder = detailsLabel;
  details.value = quoteValues[`${field}Details`] || "";
  details.style.display = select.value === "Yes — add details" ? "block" : "none";
  wrapper.appendChild(details);

  const updateValue = () => {
    quoteValues[`${field}Choice`] = select.value;
    quoteValues[`${field}Details`] = details.value.trim();
    details.style.display = select.value === "Yes — add details" ? "block" : "none";
    if (select.value === "None") quoteValues[field] = "None";
    else if (select.value === "Yes — add details") quoteValues[field] = details.value.trim();
    else quoteValues[field] = "";
    clearInlineError(select.id);
    if (details.value.trim()) clearInlineError(details.id);
    syncProgressiveFields();
  };

  select.addEventListener("change", updateValue);
  details.addEventListener("input", updateValue);
  originalLabel.insertAdjacentElement("afterend", wrapper);
  updateValue();
}

function syncPhotoLimitCopy() {
  document.querySelectorAll<HTMLParagraphElement>("#quote-form p").forEach((paragraph) => {
    if (paragraph.textContent?.includes("Attach up to 3 clear photos")) {
      paragraph.textContent = paragraph.textContent.replace("Attach up to 3", "Attach up to 10");
    }
  });
}

function setDisabled(id: string, disabled: boolean) {
  const element = document.querySelector<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLButtonElement
  >(`#${id}`);
  if (!element) return;

  element.disabled = disabled;
  if (disabled && "value" in element && element.value) {
    element.value = "";
    quoteValues[fieldName(id)] = "";
    clearInlineError(id);
  }
}

function syncProgressiveFields() {
  const propertyType =
    quoteValues.propertyType ||
    document.querySelector<HTMLSelectElement>("#field-propertyType")?.value ||
    "";
  const floorSize =
    quoteValues.floorSize ||
    document.querySelector<HTMLSelectElement>("#field-floorSize")?.value ||
    "";
  const bedrooms =
    quoteValues.bedrooms ||
    document.querySelector<HTMLSelectElement>("#field-bedrooms")?.value ||
    "";
  const bathrooms =
    quoteValues.bathrooms ||
    document.querySelector<HTMLSelectElement>("#field-bathrooms")?.value ||
    "";
  const livingAreas =
    quoteValues.livingAreas ||
    document.querySelector<HTMLSelectElement>("#field-livingAreas")?.value ||
    "";
  const storeys =
    quoteValues.storeys ||
    document.querySelector<HTMLSelectElement>("#field-storeys")?.value ||
    "";
  const exactFloor =
    quoteValues.unitFloorExact ||
    document.querySelector<HTMLSelectElement>("#field-unitFloorExact")?.value ||
    "";
  const unitAccess =
    quoteValues.buildingAccess ||
    document.querySelector<HTMLSelectElement>("#field-buildingAccess")?.value ||
    "";

  setDisabled("field-floorSize", !propertyType);
  setDisabled("field-bedrooms", !floorSize);
  setDisabled("field-bathrooms", !bedrooms);
  setDisabled("field-livingAreas", !bathrooms);

  const needsUnitAccess = propertyNeedsUnitAccess(propertyType);
  const needsStoreys = Boolean(document.querySelector<HTMLSelectElement>("#field-storeys"));
  setDisabled("field-storeys", !livingAreas);
  setDisabled("field-unitFloorExact", !livingAreas);
  setDisabled("field-buildingAccess", !exactFloor);

  const homeLayoutComplete = needsUnitAccess
    ? Boolean(livingAreas && exactFloor && unitAccess)
    : needsStoreys
      ? Boolean(livingAreas && storeys)
      : Boolean(livingAreas);

  setDisabled("field-outdoor", !homeLayoutComplete);
  setDisabled("field-estate", !hasValue("field-outdoor"));

  setDisabled("field-frequency", !quoteValues.service);
  setDisabled("field-condition", !quoteValues.frequency);

  setDisabled("field-preferredTime", !quoteValues.preferredDate);
  setDisabled("field-flexibility", !quoteValues.preferredTime);
  setDisabled("field-urgency", !quoteValues.flexibility);

  const handoverReady =
    quoteValues.keyHandover !== "To be arranged" || Boolean(quoteValues.keyHandoverDetails);
  setDisabled("field-keyHandover", !quoteValues.complexAccess);
  setDisabled("field-present", !quoteValues.keyHandover || !handoverReady);
  setDisabled("field-pets", !quoteValues.present);
  setDisabled("field-petType", !quoteValues.pets?.startsWith("Yes"));
  setDisabled("field-petTemperament", !quoteValues.petType);

  const petsComplete = quoteValues.pets?.startsWith("Yes")
    ? Boolean(quoteValues.petType && quoteValues.petTemperament)
    : Boolean(quoteValues.pets);
  setDisabled("field-restrictionsChoice", !petsComplete);

  const restrictionsComplete =
    quoteValues.restrictionsChoice === "None" ||
    (quoteValues.restrictionsChoice === "Yes — add details" &&
      Boolean(quoteValues.restrictionsDetails));
  setDisabled("field-allergiesChoice", !restrictionsComplete);
}

function syncQuoteEnhancements() {
  if (window.location.pathname !== "/quote") return;
  syncUnitAccessFields();
  syncServiceFrequency();
  syncDateRules();
  syncEstateAccess();
  syncKeyHandover();
  syncPresenceOptions();
  syncRequiredChoiceField(
    "restrictions",
    "Product restrictions",
    "Tell us which products or ingredients should not be used.",
  );
  syncRequiredChoiceField(
    "allergies",
    "Allergies or sensitivities",
    "Tell us about the allergy or sensitivity.",
  );
  syncPhotoLimitCopy();
  syncProgressiveFields();
}

function rememberVisibleQuoteFields() {
  document
    .querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      '#quote-form input[id^="field-"], #quote-form select[id^="field-"], #quote-form textarea[id^="field-"]',
    )
    .forEach((element) => {
      quoteValues[fieldName(element.id)] = element.value.trim();
      if (element.value.trim()) clearInlineError(element.id);
    });

  document
    .querySelectorAll<HTMLInputElement>('#quote-form input[type="checkbox"]')
    .forEach((checkbox) => {
      const label = checkbox.closest("label")?.querySelector("span")?.textContent?.trim();
      if (!label || label.startsWith("I consent")) return;
      if (checkbox.checked) quoteAddons.add(label);
      else quoteAddons.delete(label);
    });
}

function currentStepTitle() {
  return document.querySelector<HTMLHeadingElement>("#quote-form h2")?.textContent?.trim() || "";
}

function validateQuoteStep() {
  const step = currentStepTitle();

  if (step === "Your Home") {
    const required: Array<[string, string]> = [
      ["field-propertyType", "Please select the property type."],
      ["field-suburb", "Please enter the suburb."],
      ["field-address", "Please enter the full service address."],
      ["field-floorSize", "Please select the approximate floor size."],
      ["field-bedrooms", "Please select the number of bedrooms."],
      ["field-bathrooms", "Please select the number of bathrooms."],
      ["field-livingAreas", "Please select the number of living areas."],
    ];

    if (propertyNeedsUnitAccess(quoteValues.propertyType)) {
      required.push(
        ["field-unitFloorExact", "Please select the exact floor or level."],
        ["field-buildingAccess", "Please tell us how we get to your unit."],
      );
    } else if (document.querySelector("#field-storeys")) {
      required.push(["field-storeys", "Please select the number of storeys."]);
    }

    required.push(
      ["field-outdoor", "Please select the balcony or patio option."],
      ["field-estate", "Please tell us whether the property is in an estate or complex."],
    );

    return validateRequiredFields(required);
  }

  if (step === "Cleaning Requirements") {
    return validateRequiredFields([
      ["field-service", "Please select the primary cleaning service."],
      ["field-frequency", "Please select how often you need this service."],
      ["field-condition", "Please select the current home condition."],
    ]);
  }

  if (step === "Preferred Visit") {
    let valid = validateRequiredFields([
      ["field-preferredDate", "Please select a preferred date."],
      ["field-preferredTime", "Please select a preferred time."],
      ["field-flexibility", "Please select your date flexibility."],
      ["field-urgency", "Please select how urgent the cleaning is."],
    ]);

    const minimum = tomorrowDateValue();
    for (const id of ["field-preferredDate", "field-alternativeDate"]) {
      const input = document.querySelector<HTMLInputElement>(`#${id}`);
      if (input?.value && input.value < minimum) {
        showInlineError(id, "Please choose a date from tomorrow onwards.");
        valid = false;
      }
    }
    return valid;
  }

  if (step === "Access and Household Details") {
    const required: Array<[string, string]> = [
      ["field-complexAccess", "Please select how access to the estate or complex will work."],
      ["field-keyHandover", "Please select the key handover method."],
    ];

    if (quoteValues.keyHandover === "To be arranged") {
      required.push([
        "field-keyHandoverDetails",
        "Please explain how the key handover will be arranged.",
      ]);
    }

    required.push(
      ["field-present", "Please tell us whether someone will be present."],
      ["field-pets", "Please select the pets option."],
    );

    if (quoteValues.pets?.startsWith("Yes")) {
      required.push(
        ["field-petType", "Please select the type of pet."],
        ["field-petTemperament", "Please select the pet temperament."],
      );
    }

    required.push(
      ["field-restrictionsChoice", "Please select a product restrictions option."],
      ["field-allergiesChoice", "Please select an allergies or sensitivities option."],
    );

    let valid = validateRequiredFields(required);

    if (
      quoteValues.restrictionsChoice === "Yes — add details" &&
      !quoteValues.restrictionsDetails
    ) {
      showInlineError("field-restrictionsDetails", "Please add the product restriction details.");
      valid = false;
    }

    if (quoteValues.allergiesChoice === "Yes — add details" && !quoteValues.allergiesDetails) {
      showInlineError("field-allergiesDetails", "Please add the allergy or sensitivity details.");
      valid = false;
    }

    return valid;
  }

  if (step === "Your Details") {
    return validateRequiredFields([
      ["field-fullName", "Please enter your full name."],
      ["field-mobile", "Please enter your mobile number."],
      ["field-email", "Please enter your email address."],
      ["field-contactMethod", "Please select your preferred contact method."],
    ]);
  }

  return true;
}

function setButtonState(button: HTMLButtonElement, text: string, disabled: boolean) {
  button.disabled = disabled;
  button.dataset.originalText ||= button.textContent?.trim() || "Send Request";
  button.textContent = text;
}

function quoteValue(name: string, fallback = "") {
  return quoteValues[name]?.trim() || fallback;
}

async function compressQuoteImage(file: File): Promise<File> {
  if (
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    /\.(heic|heif)$/i.test(file.name)
  ) {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1920 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext("2d");
    if (!context) {
      bitmap.close();
      return file;
    }
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.82),
    );
    if (!blob || blob.size === 0 || blob.size >= file.size) return file;
    return new File([blob], `${file.name.replace(/\.[^.]+$/, "") || "quote-photo"}.jpg`, {
      type: "image/jpeg",
      lastModified: file.lastModified,
    });
  } catch {
    return file;
  }
}

async function fileToBase64(original: File) {
  const file = await compressQuoteImage(original);
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  return { name: file.name, type: file.type || "application/octet-stream", base64: btoa(binary) };
}

async function sendQuoteForm(button: HTMLButtonElement) {
  rememberVisibleQuoteFields();
  if (!validateQuoteStep()) return;

  const consent = Array.from(
    document.querySelectorAll<HTMLInputElement>('#quote-form input[type="checkbox"]'),
  ).find((checkbox) => checkbox.closest("label")?.textContent?.includes("I consent"));
  if (!consent?.checked) return;

  const details = [
    ["Property type", quoteValue("propertyType")],
    ["Suburb", quoteValue("suburb")],
    ["Postal code", quoteValue("postcode")],
    ["Address", quoteValue("address")],
    ["GPS latitude", quoteValue("latitude")],
    ["GPS longitude", quoteValue("longitude")],
    ["GPS accuracy (metres)", quoteValue("locationAccuracy")],
    ["GPS map", quoteValue("locationUrl")],
    ["Floor size", quoteValue("floorSize")],
    ["Bedrooms", quoteValue("bedrooms")],
    ["Bathrooms", quoteValue("bathrooms")],
    ["Living areas", quoteValue("livingAreas")],
    ["Storeys", quoteValue("storeys")],
    ["Unit floor / level", quoteValue("unitFloorExact", quoteValue("unitFloor"))],
    ["Unit access", quoteValue("buildingAccess")],
    ["Outdoor area", quoteValue("outdoor")],
    ["Estate or complex", quoteValue("estate")],
    ["Frequency", quoteValue("frequency")],
    ["Home condition", quoteValue("condition")],
    ["Selected add-ons", Array.from(quoteAddons).join(", ")],
    ["Preferred date", quoteValue("preferredDate")],
    ["Alternative date", quoteValue("alternativeDate")],
    ["Preferred time", quoteValue("preferredTime")],
    ["Flexibility", quoteValue("flexibility")],
    ["Urgency", quoteValue("urgency")],
    ["Recurring notes", quoteValue("recurringNotes")],
    ["Access", quoteValue("complexAccess")],
    ["Security instructions", quoteValue("securityInstructions")],
    ["Parking", quoteValue("parking")],
    ["Key handover", quoteValue("keyHandover")],
    ["Key handover arrangement", quoteValue("keyHandoverDetails")],
    ["Someone present", quoteValue("present")],
    ["Pets", quoteValue("pets")],
    ["Pet type", quoteValue("petType")],
    ["Pet temperament", quoteValue("petTemperament")],
    ["Off-limits areas", quoteValue("offLimits")],
    ["Fragile items", quoteValue("fragileItems")],
    ["Product restrictions", quoteValue("restrictions")],
    ["Allergies", quoteValue("allergies")],
    ["Areas needing attention", quoteValue("attentionAreas")],
    ["Existing damage", quoteValue("existingDamage")],
    ["Renovation dust", quoteValue("renovationDust")],
    ["Appliance add-ons", quoteValue("applianceAddons")],
    ["Additional notes", quoteValue("notes")],
  ].filter(([, entry]) => entry);

  const propertyAddress = [quoteValue("address"), quoteValue("suburb"), quoteValue("postcode")]
    .filter(Boolean)
    .join(", ");
  setButtonState(button, "Sending…", true);

  try {
    const files = await Promise.all(getQuoteFiles().map(fileToBase64));
    const result = await submitContactForm({
      data: {
        name: quoteValue("fullName"),
        phone: quoteValue("mobile"),
        email: quoteValue("email"),
        service: quoteValue("service", "Residential Cleaning Quote"),
        jobType: quoteValue("propertyType"),
        multipleServices: Array.from(quoteAddons),
        otherService: "",
        propertyAddress: propertyAddress || "Address supplied in quote form",
        description: details.length
          ? details.map(([label, entry]) => `${label}: ${entry}`).join("\n")
          : "Residential cleaning quotation requested through the Hestiva website.",
        preferredContact: quoteValue("contactMethod", "Not specified"),
        urgency: quoteValue("urgency", "Not specified"),
        files,
        website: "",
      },
    });
    if (!isSuccessfulSubmissionResult(result)) throw new Error("Submission was not acknowledged");
    clearQuoteFiles();
    setButtonState(button, "Request Sent", true);
    window.alert("Your request has been sent successfully. A confirmation email is on its way.");
  } catch {
    console.error("Quote submission failed");
    setButtonState(button, button.dataset.originalText || "Send Request", false);
    window.alert("We could not send your request. Please try again or email quotes@hestiva.co.za.");
  }
}

async function sendContactForm(form: HTMLFormElement, button: HTMLButtonElement) {
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  setButtonState(button, "Sending…", true);
  try {
    const result = await submitContactForm({
      data: {
        name: String(data.get("fullName") || ""),
        phone: String(data.get("mobile") || ""),
        email: String(data.get("email") || ""),
        service: String(data.get("enquiryType") || "General Enquiry"),
        jobType: "",
        multipleServices: [],
        otherService: "",
        propertyAddress: String(data.get("suburb") || "Not provided"),
        description: String(data.get("message") || "General website enquiry"),
        preferredContact: String(data.get("preferredContact") || "Not specified"),
        urgency: "Not specified",
        files: [],
        website: String(data.get("website") || ""),
      },
    });
    if (!isSuccessfulSubmissionResult(result)) throw new Error("Submission was not acknowledged");
    setButtonState(button, "Request Sent", true);
    form.reset();
    window.alert("Your request has been sent successfully.");
  } catch {
    console.error("Contact submission failed");
    setButtonState(button, button.dataset.originalText || "Send Request", false);
    window.alert("We could not send your request. Please try again or email quotes@hestiva.co.za.");
  }
}

export function LiveFormSubmission() {
  useEffect(() => {
    const remember = () => {
      if (window.location.pathname === "/quote") {
        rememberVisibleQuoteFields();
        window.setTimeout(syncQuoteEnhancements, 0);
      }
    };

    const observer = new MutationObserver(syncQuoteEnhancements);
    const quoteRoot = document.getElementById("quote-form");
    if (quoteRoot) observer.observe(quoteRoot, { childList: true, subtree: true });
    syncQuoteEnhancements();

    const onClick = (event: MouseEvent) => {
      const button = (event.target as HTMLElement | null)?.closest(
        "button",
      ) as HTMLButtonElement | null;
      if (!button) return;

      if (window.location.pathname === "/quote") {
        rememberVisibleQuoteFields();
        syncQuoteEnhancements();

        if (button.textContent?.includes("Continue") && !validateQuoteStep()) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }

        if (button.textContent?.includes("Send Request")) {
          event.preventDefault();
          event.stopPropagation();
          void sendQuoteForm(button);
        }
      }
    };

    const onSubmit = (event: SubmitEvent) => {
      if (window.location.pathname !== "/contact") return;
      const form = event.target as HTMLFormElement;
      const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
      if (!button) return;
      event.preventDefault();
      event.stopPropagation();
      void sendContactForm(form, button);
    };

    document.addEventListener("input", remember, true);
    document.addEventListener("change", remember, true);
    document.addEventListener("click", onClick, true);
    document.addEventListener("submit", onSubmit, true);
    return () => {
      observer.disconnect();
      document.removeEventListener("input", remember, true);
      document.removeEventListener("change", remember, true);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", onSubmit, true);
    };
  }, []);
  return null;
}
