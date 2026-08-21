import { useEffect } from "react";

const CANONICAL_PRIMARY_SERVICES = [
  "Regular Home Cleaning",
  "Deep Cleaning",
  "Move-In Cleaning",
  "Move-Out Cleaning",
  "Kitchen Cleaning",
  "Bathroom Sanitisation",
  "Bedroom Cleaning",
  "Living Area Cleaning",
  "Interior Window Cleaning",
  "Post-Renovation Cleaning",
  "Not sure",
] as const;

const SERVICE_SIGNATURE = CANONICAL_PRIMARY_SERVICES.join("|");

function syncCanonicalPrimaryServices() {
  if (window.location.pathname !== "/quote") return;

  const select = document.querySelector<HTMLSelectElement>("#field-service");
  if (!select || select.dataset.canonicalServiceSignature === SERVICE_SIGNATURE) return;

  const current = select.value;
  const placeholder = select.options[0]?.textContent?.trim() || "Select an option";
  select.replaceChildren();

  const first = document.createElement("option");
  first.value = "";
  first.textContent = placeholder;
  select.appendChild(first);

  for (const service of CANONICAL_PRIMARY_SERVICES) {
    const option = document.createElement("option");
    option.value = service;
    option.textContent = service;
    select.appendChild(option);
  }

  select.value = CANONICAL_PRIMARY_SERVICES.includes(
    current as (typeof CANONICAL_PRIMARY_SERVICES)[number],
  )
    ? current
    : "";
  select.dataset.canonicalServiceSignature = SERVICE_SIGNATURE;

  if (select.value !== current) {
    select.dispatchEvent(new Event("change", { bubbles: true }));
  }
}

export function CanonicalServiceModelEnhancement() {
  useEffect(() => {
    if (window.location.pathname !== "/quote") return;

    const root = document.getElementById("quote-form");
    const observer = new MutationObserver(syncCanonicalPrimaryServices);
    if (root) observer.observe(root, { childList: true, subtree: true });

    syncCanonicalPrimaryServices();
    return () => observer.disconnect();
  }, []);

  return null;
}
