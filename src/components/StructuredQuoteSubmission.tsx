import { useEffect } from "react";
import { getStructuredLaundryRequest } from "@/components/LaundryOperatingModelEnhancement";
import { submitStructuredQuoteForm } from "@/lib/quote/structured-submission.functions";
import { clearQuoteFiles, getQuoteFiles } from "@/lib/quote/client-upload-store";
import type { QuoteFormSnapshot, StructuredQuoteFile } from "@/lib/quote/hestiva-os-contract";

const values: Record<string, string> = {};
const addOns = new Set<string>();
const photoIds = new Map<string, string>();
let pendingSubmission: { snapshot: QuoteFormSnapshot; files: StructuredQuoteFile[] } | undefined;
let inFlight = false;

function fieldName(id: string) {
  return id.startsWith("field-") ? id.slice("field-".length) : id;
}

function rememberVisibleState() {
  document
    .querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      '#quote-form input[id^="field-"], #quote-form select[id^="field-"], #quote-form textarea[id^="field-"]',
    )
    .forEach((element) => {
      values[fieldName(element.id)] = element.value.trim();
    });

  const visibleAddOnCheckboxes = Array.from(
    document.querySelectorAll<HTMLInputElement>('#quote-form input[type="checkbox"]'),
  ).filter((checkbox) => {
    const label = checkbox.closest("label")?.querySelector("span")?.textContent?.trim();
    return Boolean(label && !label.startsWith("I consent"));
  });

  if (visibleAddOnCheckboxes.length) {
    addOns.clear();
    visibleAddOnCheckboxes.forEach((checkbox) => {
      if (!checkbox.checked) return;
      const label = checkbox.closest("label")?.querySelector("span")?.textContent?.trim();
      if (label) addOns.add(label);
    });
  }
}

function consentConfirmed() {
  const consent = Array.from(
    document.querySelectorAll<HTMLInputElement>('#quote-form input[type="checkbox"]'),
  ).find((checkbox) => checkbox.closest("label")?.textContent?.includes("I consent"));

  document.querySelector("#quote-error-consent")?.remove();
  if (consent?.checked) {
    consent.removeAttribute("aria-invalid");
    return true;
  }

  if (consent) {
    consent.setAttribute("aria-invalid", "true");
    const error = document.createElement("p");
    error.id = "quote-error-consent";
    error.className = "mt-2 text-sm font-normal text-[#9B3349]";
    error.setAttribute("role", "alert");
    error.textContent = "Please confirm that Homent may contact you.";
    consent.closest("label")?.insertAdjacentElement("afterend", error);
    consent.focus();
  }
  return false;
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

async function fileToStructuredFile(original: File, index: number): Promise<StructuredQuoteFile> {
  const file = await compressQuoteImage(original);
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  const key = `${index}:${file.name}:${file.size}:${file.lastModified}`;
  let clientPhotoId = photoIds.get(key);
  if (!clientPhotoId) {
    clientPhotoId = crypto.randomUUID();
    photoIds.set(key, clientPhotoId);
  }
  return {
    clientPhotoId,
    name: file.name,
    type: file.type || "application/octet-stream",
    base64: btoa(binary),
  };
}

async function getPendingSubmission() {
  if (pendingSubmission) return pendingSubmission;
  rememberVisibleState();
  const snapshot: QuoteFormSnapshot = {
    submissionId: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
    values: { ...values },
    addOns: Array.from(addOns),
    laundry: getStructuredLaundryRequest(),
  };
  const files = await Promise.all(
    getQuoteFiles().map((file, index) => fileToStructuredFile(file, index)),
  );
  pendingSubmission = { snapshot, files };
  return pendingSubmission;
}

function setButtonState(button: HTMLButtonElement, text: string, disabled: boolean) {
  button.dataset.originalText ||= button.textContent?.trim() || "Send Request";
  button.disabled = disabled;
  button.textContent = text;
}

function submissionFailureMessage(category: string | undefined) {
  switch (category) {
    case "validation":
      return "Some quote details could not be processed. Please review your selections and try again. Error code: Q-VALIDATION.";
    case "rate_limit":
      return "Too many quote requests have been attempted from this connection. Please wait about 15 minutes before trying again. Error code: Q-RATE-LIMIT.";
    case "delivery":
      return "Your quote details were prepared, but we could not reach the quotation system. Please try again shortly. Error code: Q-DELIVERY.";
    case "origin":
    case "bot":
      return "We could not verify this quote request. Please refresh the page and try again. Error code: Q-SECURITY.";
    case "unexpected":
      return "A technical error occurred while preparing your quote. Please try again shortly. Error code: Q-UNEXPECTED.";
    default:
      return "We could not send your request. Please try again or email quotes@homent.co.za. Error code: Q-UNKNOWN.";
  }
}

async function sendStructuredQuote(button: HTMLButtonElement) {
  if (inFlight || !consentConfirmed()) return;
  inFlight = true;
  setButtonState(button, "Sending…", true);

  try {
    const submission = await getPendingSubmission();
    const result = await submitStructuredQuoteForm({
      data: {
        snapshot: submission.snapshot,
        files: submission.files,
        website: "",
      },
    });
    if (!result || result.success !== true) {
      console.error("Structured quote submission failed", result);
      setButtonState(button, button.dataset.originalText || "Send Request", false);
      window.alert(submissionFailureMessage(result?.category));
      return;
    }

    pendingSubmission = undefined;
    photoIds.clear();
    clearQuoteFiles();
    setButtonState(button, "Request Sent", true);
    const correspondenceDelivered =
      "correspondenceDelivered" in result ? result.correspondenceDelivered !== false : true;
    window.alert(
      correspondenceDelivered
        ? `Your request has been sent successfully. Reference: ${result.quoteReference}. A confirmation email is on its way.`
        : `Your request has been sent successfully. Reference: ${result.quoteReference}. We received your request, but the confirmation email could not be delivered automatically.`,
    );
  } catch {
    setButtonState(button, button.dataset.originalText || "Send Request", false);
    window.alert(
      "A browser or network error interrupted the request before it could be confirmed. Please try again. Error code: Q-CLIENT.",
    );
  } finally {
    inFlight = false;
  }
}

export function StructuredQuoteSubmission() {
  useEffect(() => {
    if (window.location.pathname !== "/quote") return;

    const remember = () => rememberVisibleState();
    const onClick = (event: MouseEvent) => {
      rememberVisibleState();
      const button = (event.target as HTMLElement | null)?.closest(
        "button",
      ) as HTMLButtonElement | null;
      if (!button?.textContent?.includes("Send Request")) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      void sendStructuredQuote(button);
    };

    document.addEventListener("input", remember, true);
    document.addEventListener("change", remember, true);
    document.addEventListener("click", onClick, true);
    rememberVisibleState();

    return () => {
      document.removeEventListener("input", remember, true);
      document.removeEventListener("change", remember, true);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  return null;
}
