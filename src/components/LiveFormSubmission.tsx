import { useEffect } from "react";
import { submitContactForm } from "@/lib/contact.functions";
import { isSuccessfulSubmissionResult } from "@/lib/submission-result";
import { clearQuoteFiles, getQuoteFiles } from "@/lib/quote/client-upload-store";

const quoteValues: Record<string, string> = {};
const quoteAddons = new Set<string>();

function fieldName(id: string) {
  return id.startsWith("field-") ? id.slice("field-".length) : id;
}

function rememberVisibleQuoteFields() {
  document
    .querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      '#quote-form input[id^="field-"], #quote-form select[id^="field-"], #quote-form textarea[id^="field-"]',
    )
    .forEach((element) => {
      quoteValues[fieldName(element.id)] = element.value.trim();
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

function setButtonState(button: HTMLButtonElement, text: string, disabled: boolean) {
  button.disabled = disabled;
  button.dataset.originalText ||= button.textContent?.trim() || "Send Request";
  button.textContent = text;
}

function quoteValue(name: string, fallback = "") {
  return quoteValues[name]?.trim() || fallback;
}

async function fileToBase64(file: File) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = "";
  const chunkSize = 0x8000;

  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }

  return {
    name: file.name,
    type: file.type || "application/octet-stream",
    base64: btoa(binary),
  };
}

async function sendQuoteForm(button: HTMLButtonElement) {
  rememberVisibleQuoteFields();

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
    ["Unit floor / level", quoteValue("unitFloor")],
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

  const name = quoteValue("fullName");
  const phone = quoteValue("mobile");
  const email = quoteValue("email");
  const propertyAddress = [quoteValue("address"), quoteValue("suburb"), quoteValue("postcode")]
    .filter(Boolean)
    .join(", ");
  const description = details.length
    ? details.map(([label, entry]) => `${label}: ${entry}`).join("\n")
    : "Residential cleaning quotation requested through the Hestiva website.";

  setButtonState(button, "Sending…", true);
  try {
    const files = await Promise.all(getQuoteFiles().map(fileToBase64));
    const result = await submitContactForm({
      data: {
        name,
        phone,
        email,
        service: quoteValue("service", "Residential Cleaning Quote"),
        jobType: quoteValue("propertyType"),
        multipleServices: Array.from(quoteAddons),
        otherService: "",
        propertyAddress: propertyAddress || "Address supplied in quote form",
        description,
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
      if (window.location.pathname === "/quote") rememberVisibleQuoteFields();
    };

    const onClick = (event: MouseEvent) => {
      const button = (event.target as HTMLElement | null)?.closest(
        "button",
      ) as HTMLButtonElement | null;
      if (!button) return;

      if (window.location.pathname === "/quote") {
        rememberVisibleQuoteFields();
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
      document.removeEventListener("input", remember, true);
      document.removeEventListener("change", remember, true);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", onSubmit, true);
    };
  }, []);

  return null;
}
