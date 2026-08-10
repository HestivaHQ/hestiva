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
function syncUnitAccessFields() {
  if (window.location.pathname !== "/quote") return;
  const propertyType = document.querySelector<HTMLSelectElement>("#field-propertyType")?.value || "";
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
    const select = document.createElement("select");
    select.id = id;
    select.className = originalFloor.className;
    select.innerHTML = `<option value="">${placeholder}</option>${values.map((value) => `<option value="${value}">${value}</option>`).join("")}`;
    const key = fieldName(id);
    select.value = quoteValues[key] || "";
    select.addEventListener("change", () => { quoteValues[key] = select.value; });
    label.appendChild(select);
    return label;
  };
  wrapper.append(
    makeSelect("field-unitFloorExact", "Exact unit floor / level", "Select exact floor", ["Ground floor", ...Array.from({ length: 50 }, (_, i) => `Floor ${i + 1}`)]),
    makeSelect("field-buildingAccess", "Access to the unit", "Select access type", ["Elevator available", "Stairs only", "Elevator and stairs", "Not sure"]),
  );
  originalLabel.insertAdjacentElement("afterend", wrapper);
}
function rememberVisibleQuoteFields() {
  document.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('#quote-form input[id^="field-"], #quote-form select[id^="field-"], #quote-form textarea[id^="field-"]').forEach((element) => {
    quoteValues[fieldName(element.id)] = element.value.trim();
  });
  document.querySelectorAll<HTMLInputElement>('#quote-form input[type="checkbox"]').forEach((checkbox) => {
    const label = checkbox.closest("label")?.querySelector("span")?.textContent?.trim();
    if (!label || label.startsWith("I consent")) return;
    if (checkbox.checked) quoteAddons.add(label); else quoteAddons.delete(label);
  });
}
function setButtonState(button: HTMLButtonElement, text: string, disabled: boolean) {
  button.disabled = disabled;
  button.dataset.originalText ||= button.textContent?.trim() || "Send Request";
  button.textContent = text;
}
function quoteValue(name: string, fallback = "") { return quoteValues[name]?.trim() || fallback; }

async function compressQuoteImage(file: File): Promise<File> {
  if (file.type === "image/heic" || file.type === "image/heif" || /\.(heic|heif)$/i.test(file.name)) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1920 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext("2d");
    if (!context) { bitmap.close(); return file; }
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.82));
    if (!blob || blob.size === 0 || blob.size >= file.size) return file;
    return new File([blob], `${file.name.replace(/\.[^.]+$/, "") || "quote-photo"}.jpg`, { type: "image/jpeg", lastModified: file.lastModified });
  } catch { return file; }
}
async function fileToBase64(original: File) {
  const file = await compressQuoteImage(original);
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 0x8000) binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  return { name: file.name, type: file.type || "application/octet-stream", base64: btoa(binary) };
}

async function sendQuoteForm(button: HTMLButtonElement) {
  rememberVisibleQuoteFields();
  const consent = Array.from(document.querySelectorAll<HTMLInputElement>('#quote-form input[type="checkbox"]')).find((checkbox) => checkbox.closest("label")?.textContent?.includes("I consent"));
  if (!consent?.checked) return;
  const details = [
    ["Property type", quoteValue("propertyType")], ["Suburb", quoteValue("suburb")], ["Postal code", quoteValue("postcode")], ["Address", quoteValue("address")],
    ["GPS latitude", quoteValue("latitude")], ["GPS longitude", quoteValue("longitude")], ["GPS accuracy (metres)", quoteValue("locationAccuracy")], ["GPS map", quoteValue("locationUrl")],
    ["Floor size", quoteValue("floorSize")], ["Bedrooms", quoteValue("bedrooms")], ["Bathrooms", quoteValue("bathrooms")], ["Living areas", quoteValue("livingAreas")], ["Storeys", quoteValue("storeys")],
    ["Unit floor / level", quoteValue("unitFloorExact", quoteValue("unitFloor"))], ["Unit access", quoteValue("buildingAccess")], ["Outdoor area", quoteValue("outdoor")], ["Estate or complex", quoteValue("estate")],
    ["Frequency", quoteValue("frequency")], ["Home condition", quoteValue("condition")], ["Selected add-ons", Array.from(quoteAddons).join(", ")], ["Preferred date", quoteValue("preferredDate")],
    ["Alternative date", quoteValue("alternativeDate")], ["Preferred time", quoteValue("preferredTime")], ["Flexibility", quoteValue("flexibility")], ["Urgency", quoteValue("urgency")],
    ["Recurring notes", quoteValue("recurringNotes")], ["Access", quoteValue("complexAccess")], ["Security instructions", quoteValue("securityInstructions")], ["Parking", quoteValue("parking")],
    ["Key handover", quoteValue("keyHandover")], ["Someone present", quoteValue("present")], ["Pets", quoteValue("pets")], ["Pet type", quoteValue("petType")], ["Pet temperament", quoteValue("petTemperament")],
    ["Off-limits areas", quoteValue("offLimits")], ["Fragile items", quoteValue("fragileItems")], ["Product restrictions", quoteValue("restrictions")], ["Allergies", quoteValue("allergies")],
    ["Areas needing attention", quoteValue("attentionAreas")], ["Existing damage", quoteValue("existingDamage")], ["Renovation dust", quoteValue("renovationDust")], ["Appliance add-ons", quoteValue("applianceAddons")], ["Additional notes", quoteValue("notes")],
  ].filter(([, entry]) => entry);
  const propertyAddress = [quoteValue("address"), quoteValue("suburb"), quoteValue("postcode")].filter(Boolean).join(", ");
  setButtonState(button, "Sending…", true);
  try {
    const files = await Promise.all(getQuoteFiles().map(fileToBase64));
    const result = await submitContactForm({ data: {
      name: quoteValue("fullName"), phone: quoteValue("mobile"), email: quoteValue("email"), service: quoteValue("service", "Residential Cleaning Quote"), jobType: quoteValue("propertyType"),
      multipleServices: Array.from(quoteAddons), otherService: "", propertyAddress: propertyAddress || "Address supplied in quote form",
      description: details.length ? details.map(([label, entry]) => `${label}: ${entry}`).join("\n") : "Residential cleaning quotation requested through the Hestiva website.",
      preferredContact: quoteValue("contactMethod", "Not specified"), urgency: quoteValue("urgency", "Not specified"), files, website: "",
    }});
    if (!isSuccessfulSubmissionResult(result)) throw new Error("Submission was not acknowledged");
    clearQuoteFiles(); setButtonState(button, "Request Sent", true);
    window.alert("Your request has been sent successfully. A confirmation email is on its way.");
  } catch {
    console.error("Quote submission failed"); setButtonState(button, button.dataset.originalText || "Send Request", false);
    window.alert("We could not send your request. Please try again or email quotes@hestiva.co.za.");
  }
}

async function sendContactForm(form: HTMLFormElement, button: HTMLButtonElement) {
  if (!form.reportValidity()) return;
  const data = new FormData(form); setButtonState(button, "Sending…", true);
  try {
    const result = await submitContactForm({ data: {
      name: String(data.get("fullName") || ""), phone: String(data.get("mobile") || ""), email: String(data.get("email") || ""), service: String(data.get("enquiryType") || "General Enquiry"),
      jobType: "", multipleServices: [], otherService: "", propertyAddress: String(data.get("suburb") || "Not provided"), description: String(data.get("message") || "General website enquiry"),
      preferredContact: String(data.get("preferredContact") || "Not specified"), urgency: "Not specified", files: [], website: String(data.get("website") || ""),
    }});
    if (!isSuccessfulSubmissionResult(result)) throw new Error("Submission was not acknowledged");
    setButtonState(button, "Request Sent", true); form.reset(); window.alert("Your request has been sent successfully.");
  } catch {
    console.error("Contact submission failed"); setButtonState(button, button.dataset.originalText || "Send Request", false);
    window.alert("We could not send your request. Please try again or email quotes@hestiva.co.za.");
  }
}

export function LiveFormSubmission() {
  useEffect(() => {
    const remember = () => { if (window.location.pathname === "/quote") { rememberVisibleQuoteFields(); window.setTimeout(syncUnitAccessFields, 0); } };
    const observer = new MutationObserver(syncUnitAccessFields);
    const quoteRoot = document.getElementById("quote-form"); if (quoteRoot) observer.observe(quoteRoot, { childList: true, subtree: true }); syncUnitAccessFields();
    const onClick = (event: MouseEvent) => {
      const button = (event.target as HTMLElement | null)?.closest("button") as HTMLButtonElement | null; if (!button) return;
      if (window.location.pathname === "/quote") { rememberVisibleQuoteFields(); if (button.textContent?.includes("Send Request")) { event.preventDefault(); event.stopPropagation(); void sendQuoteForm(button); } }
    };
    const onSubmit = (event: SubmitEvent) => {
      if (window.location.pathname !== "/contact") return;
      const form = event.target as HTMLFormElement; const button = form.querySelector<HTMLButtonElement>('button[type="submit"]'); if (!button) return;
      event.preventDefault(); event.stopPropagation(); void sendContactForm(form, button);
    };
    document.addEventListener("input", remember, true); document.addEventListener("change", remember, true); document.addEventListener("click", onClick, true); document.addEventListener("submit", onSubmit, true);
    return () => { observer.disconnect(); document.removeEventListener("input", remember, true); document.removeEventListener("change", remember, true); document.removeEventListener("click", onClick, true); document.removeEventListener("submit", onSubmit, true); };
  }, []);
  return null;
}
