import { useEffect } from "react";

const SERVICE = "Post-Renovation Cleaning";
const OPTIONS = ["One-time", "Custom"];

function ensureFrequencyOptions() {
  const service = document.querySelector<HTMLSelectElement>("#field-service");
  const frequency = document.querySelector<HTMLSelectElement>("#field-frequency");
  if (!service || !frequency || service.value !== SERVICE) return;

  const currentValues = Array.from(frequency.options)
    .map((option) => option.value)
    .filter(Boolean);
  if (currentValues.length === OPTIONS.length && OPTIONS.every((value) => currentValues.includes(value))) {
    frequency.disabled = false;
    return;
  }

  const current = frequency.value;
  frequency.replaceChildren();

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Select frequency";
  frequency.appendChild(placeholder);

  for (const value of OPTIONS) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    frequency.appendChild(option);
  }

  frequency.value = OPTIONS.includes(current) ? current : "";
  frequency.disabled = false;

  // LiveFormSubmission currently computes an empty option signature for this newly-added service.
  // Preserve that expected signature so its MutationObserver does not immediately erase this repair.
  frequency.dataset.optionSignature = `${SERVICE}:`;
}

export function PostRenovationFrequencyEnhancement() {
  useEffect(() => {
    if (window.location.pathname !== "/quote") return;

    ensureFrequencyOptions();
    const quoteForm = document.getElementById("quote-form");
    const observer = new MutationObserver(() => ensureFrequencyOptions());
    if (quoteForm) observer.observe(quoteForm, { childList: true, subtree: true, attributes: true });

    const onChange = (event: Event) => {
      if ((event.target as HTMLElement | null)?.id === "field-service") {
        window.setTimeout(ensureFrequencyOptions, 0);
      }
    };

    document.addEventListener("change", onChange, true);
    return () => {
      observer.disconnect();
      document.removeEventListener("change", onChange, true);
    };
  }, []);

  return null;
}
