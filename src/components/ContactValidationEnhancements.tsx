import { useEffect } from "react";
import { isValidEmailAddress, isValidPhoneNumber } from "@/lib/contact-validation";

const PHONE_MESSAGE =
  "Enter a valid mobile number, for example 082 123 4567 or +27 82 123 4567.";
const EMAIL_MESSAGE = "Enter a valid email address.";

function setNativeValidity(input: HTMLInputElement | null, valid: boolean, message: string) {
  if (!input) return;
  input.setCustomValidity(valid || !input.value.trim() ? "" : message);
  input.setAttribute("aria-invalid", valid || !input.value.trim() ? "false" : "true");
}

function validateContactInputs(phone: HTMLInputElement | null, email: HTMLInputElement | null) {
  const phoneValid = Boolean(phone?.value.trim()) && isValidPhoneNumber(phone?.value ?? "");
  const emailValid = Boolean(email?.value.trim()) && isValidEmailAddress(email?.value ?? "");
  setNativeValidity(phone, phoneValid, PHONE_MESSAGE);
  setNativeValidity(email, emailValid, EMAIL_MESSAGE);
  return { phoneValid, emailValid };
}

function clearQuoteInlineError(id: string) {
  document.querySelector(`#contact-validation-error-${id}`)?.remove();
  document.querySelector<HTMLElement>(`#${id}`)?.removeAttribute("aria-invalid");
}

function showQuoteInlineError(id: string, message: string) {
  const input = document.querySelector<HTMLInputElement>(`#${id}`);
  if (!input) return;
  clearQuoteInlineError(id);
  input.setAttribute("aria-invalid", "true");
  const error = document.createElement("p");
  error.id = `contact-validation-error-${id}`;
  error.className = "mt-2 text-sm font-normal text-[#9B3349]";
  error.setAttribute("role", "alert");
  error.textContent = message;
  input.insertAdjacentElement("afterend", error);
}

function validateQuoteDetailsStep() {
  const title = document.querySelector<HTMLHeadingElement>("#quote-form h2")?.textContent?.trim();
  if (title !== "Your Details") return true;

  const phone = document.querySelector<HTMLInputElement>("#field-mobile");
  const email = document.querySelector<HTMLInputElement>("#field-email");
  let valid = true;

  if (phone?.value.trim() && !isValidPhoneNumber(phone.value)) {
    showQuoteInlineError("field-mobile", PHONE_MESSAGE);
    valid = false;
  } else {
    clearQuoteInlineError("field-mobile");
  }

  if (email?.value.trim() && !isValidEmailAddress(email.value)) {
    showQuoteInlineError("field-email", EMAIL_MESSAGE);
    valid = false;
  } else {
    clearQuoteInlineError("field-email");
  }

  if (!valid) (phone?.getAttribute("aria-invalid") === "true" ? phone : email)?.focus();
  return valid;
}

function configureInputs() {
  const quotePhone = document.querySelector<HTMLInputElement>("#field-mobile");
  const quoteEmail = document.querySelector<HTMLInputElement>("#field-email");
  if (quotePhone) quotePhone.maxLength = 30;
  if (quoteEmail) quoteEmail.maxLength = 254;

  const contactPhone = document.querySelector<HTMLInputElement>('form input[name="mobile"]');
  const contactEmail = document.querySelector<HTMLInputElement>('form input[name="email"]');
  if (contactPhone) contactPhone.maxLength = 30;
  if (contactEmail) contactEmail.maxLength = 254;
  if (contactPhone || contactEmail) validateContactInputs(contactPhone, contactEmail);
}

export function ContactValidationEnhancements() {
  useEffect(() => {
    configureInputs();

    const observer = new MutationObserver(configureInputs);
    observer.observe(document.body, { childList: true, subtree: true });

    const onInput = (event: Event) => {
      const input = event.target as HTMLInputElement | null;
      if (!input) return;

      if (input.id === "field-mobile") {
        clearQuoteInlineError(input.id);
        return;
      }
      if (input.id === "field-email") {
        clearQuoteInlineError(input.id);
        return;
      }

      if (input.name === "mobile" || input.name === "email") {
        const form = input.closest("form");
        validateContactInputs(
          form?.querySelector<HTMLInputElement>('input[name="mobile"]') ?? null,
          form?.querySelector<HTMLInputElement>('input[name="email"]') ?? null,
        );
      }
    };

    const onClick = (event: MouseEvent) => {
      if (window.location.pathname !== "/quote") return;
      const button = (event.target as HTMLElement | null)?.closest("button");
      if (!button?.textContent?.includes("Continue")) return;
      if (!validateQuoteDetailsStep()) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    document.addEventListener("input", onInput, true);
    document.addEventListener("change", onInput, true);
    document.addEventListener("click", onClick, true);
    return () => {
      observer.disconnect();
      document.removeEventListener("input", onInput, true);
      document.removeEventListener("change", onInput, true);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  return null;
}
