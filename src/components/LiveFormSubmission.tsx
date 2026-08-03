import { useEffect } from "react";
import { submitContactForm } from "@/lib/contact.functions";

function value(id: string) {
  const element = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;
  return element?.value?.trim() ?? "";
}

function setButtonState(button: HTMLButtonElement, text: string, disabled: boolean) {
  button.disabled = disabled;
  button.dataset.originalText ||= button.textContent ?? "Send Request";
  button.textContent = text;
}

async function sendQuoteForm(button: HTMLButtonElement) {
  const consent = document.querySelector<HTMLInputElement>('input[type="checkbox"]:checked');
  if (!consent) return;

  const details = [
    ["Property type", value("field-propertyType")],
    ["Suburb", value("field-suburb")],
    ["Address", value("field-address")],
    ["Floor size", value("field-floorSize")],
    ["Bedrooms", value("field-bedrooms")],
    ["Bathrooms", value("field-bathrooms")],
    ["Living areas", value("field-livingAreas")],
    ["Storeys", value("field-storeys")],
    ["Outdoor area", value("field-outdoor")],
    ["Estate or complex", value("field-estate")],
    ["Frequency", value("field-frequency")],
    ["Home condition", value("field-condition")],
    ["Preferred date", value("field-preferredDate")],
    ["Alternative date", value("field-alternativeDate")],
    ["Preferred time", value("field-preferredTime")],
    ["Flexibility", value("field-flexibility")],
    ["Urgency", value("field-urgency")],
    ["Recurring notes", value("field-recurringNotes")],
    ["Access", value("field-complexAccess")],
    ["Security instructions", value("field-securityInstructions")],
    ["Parking", value("field-parking")],
    ["Key handover", value("field-keyHandover")],
    ["Someone present", value("field-present")],
    ["Pets", value("field-pets")],
    ["Pet type", value("field-petType")],
    ["Pet temperament", value("field-petTemperament")],
    ["Cameras", value("field-cameras")],
    ["Off-limits areas", value("field-offLimits")],
    ["Fragile items", value("field-fragileItems")],
    ["Product restrictions", value("field-restrictions")],
    ["Allergies", value("field-allergies")],
    ["Areas needing attention", value("field-attentionAreas")],
    ["Existing damage", value("field-existingDamage")],
    ["Renovation dust", value("field-renovationDust")],
    ["Appliance add-ons", value("field-applianceAddons")],
    ["Additional notes", value("field-notes")],
  ].filter(([, entry]) => entry);

  setButtonState(button, "Sending…", true);
  try {
    await submitContactForm({
      data: {
        name: value("field-fullName"),
        phone: value("field-mobile"),
        email: value("field-email"),
        service: value("field-service") || "Residential Cleaning Quote",
        jobType: value("field-propertyType"),
        multipleServices: [],
        otherService: "",
        propertyAddress: [value("field-address"), value("field-suburb")].filter(Boolean).join(", "),
        description: details.map(([label, entry]) => `${label}: ${entry}`).join("\n"),
        preferredContact: value("field-contactMethod") || "Not specified",
        urgency: value("field-urgency") || "Not specified",
        quoteReference: "",
        files: [],
        website: "",
        elapsedMs: 5000,
      },
    });
    setButtonState(button, "Request Sent", true);
    window.alert("Your request has been sent successfully. A confirmation email is on its way.");
  } catch (error) {
    console.error("Quote submission failed", error);
    setButtonState(button, button.dataset.originalText || "Send Request", false);
    window.alert("We could not send your request. Please try again or email quotes@hestiva.co.za.");
  }
}

async function sendContactForm(form: HTMLFormElement, button: HTMLButtonElement) {
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  setButtonState(button, "Sending…", true);
  try {
    await submitContactForm({
      data: {
        name: String(data.get("fullName") || ""),
        phone: String(data.get("mobile") || ""),
        email: String(data.get("email") || ""),
        service: String(data.get("enquiryType") || "General Enquiry"),
        jobType: "",
        multipleServices: [],
        otherService: "",
        propertyAddress: String(data.get("suburb") || "Not provided"),
        description: String(data.get("message") || ""),
        preferredContact: String(data.get("preferredContact") || "Not specified"),
        urgency: "Not specified",
        quoteReference: "",
        files: [],
        website: "",
        elapsedMs: 5000,
      },
    });
    setButtonState(button, "Request Sent", true);
    form.reset();
    window.alert("Your request has been sent successfully.");
  } catch (error) {
    console.error("Contact submission failed", error);
    setButtonState(button, button.dataset.originalText || "Send Request", false);
    window.alert("We could not send your request. Please try again or email quotes@hestiva.co.za.");
  }
}

export function LiveFormSubmission() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const button = (event.target as HTMLElement | null)?.closest("button") as HTMLButtonElement | null;
      if (!button || button.textContent?.trim() !== "Send Request") return;

      if (window.location.pathname === "/quote") {
        event.preventDefault();
        event.stopPropagation();
        void sendQuoteForm(button);
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

    document.addEventListener("click", onClick, true);
    document.addEventListener("submit", onSubmit, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", onSubmit, true);
    };
  }, []);

  return null;
}
