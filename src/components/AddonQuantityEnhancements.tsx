import { useEffect } from "react";

type QuantityRule = {
  label: string;
  controlId: string;
  fieldId: string;
  controlLabel: string;
};

const QUANTITY_RULES: QuantityRule[] = [
  {
    label: "Extra refrigerator",
    controlId: "extra-refrigerator-quantity-control",
    fieldId: "field-extraRefrigeratorQuantity",
    controlLabel: "Extra refrigerator quantity",
  },
  {
    label: "Balcony / Patio Cleaning",
    controlId: "balcony-patio-cleaning-quantity-control",
    fieldId: "field-balconyPatioCleaningQuantity",
    controlLabel: "Balcony / Patio Cleaning quantity",
  },
];

function addonCheckbox(rule: QuantityRule) {
  return Array.from(
    document.querySelectorAll<HTMLInputElement>('#quote-form input[type="checkbox"]'),
  ).find((checkbox) =>
    checkbox.closest("label")?.querySelector("span")?.textContent?.trim().startsWith(rule.label),
  );
}

function syncReviewQuantity(rule: QuantityRule, quantity: string) {
  document.querySelectorAll<HTMLElement>("#quote-form dt").forEach((term) => {
    if (term.textContent?.trim() !== "Selected add-ons") return;
    const value = term.parentElement?.querySelector<HTMLElement>("dd");
    if (!value) return;
    const current = value.textContent || "";
    const escapedLabel = rule.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const next = current.replace(
      new RegExp(`${escapedLabel}(?: × \\d+)?`),
      `${rule.label} × ${quantity}`,
    );
    if (next !== current) value.textContent = next;
  });
}

export function AddonQuantityEnhancements() {
  useEffect(() => {
    let syncing = false;
    const quantities = new Map(QUANTITY_RULES.map((rule) => [rule.label, "1"]));

    const synchronizeAddonSet = (
      checkbox: HTMLInputElement,
      label: HTMLElement,
      previousLabel: string,
      nextLabel: string,
    ) => {
      syncing = true;
      checkbox.checked = false;
      label.textContent = previousLabel;
      checkbox.dispatchEvent(new Event("change", { bubbles: true }));
      label.textContent = nextLabel;
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event("change", { bubbles: true }));
      syncing = false;
    };

    const renderRule = (rule: QuantityRule) => {
      const quantity = quantities.get(rule.label) || "1";
      const checkbox = addonCheckbox(rule);
      const existing = document.getElementById(rule.controlId);

      if (!checkbox) {
        existing?.remove();
        syncReviewQuantity(rule, quantity);
        return;
      }

      const label = checkbox.closest("label");
      const labelText = label?.querySelector<HTMLElement>("span");
      if (!label || !labelText) return;

      if (!checkbox.checked) {
        existing?.remove();
        if (labelText.textContent !== rule.label) labelText.textContent = rule.label;
        quantities.set(rule.label, "1");
        return;
      }

      const selectedLabel = `${rule.label} × ${quantity}`;

      if (existing) {
        if (labelText.textContent?.trim() !== selectedLabel) labelText.textContent = selectedLabel;
        syncReviewQuantity(rule, quantity);
        return;
      }

      const wrapper = document.createElement("div");
      wrapper.id = rule.controlId;
      wrapper.className = "mt-3 rounded-xl border border-[#D8CCC0] bg-[#FBF7EF] p-4";

      const quantityLabel = document.createElement("label");
      quantityLabel.htmlFor = rule.fieldId;
      quantityLabel.className = "text-sm font-semibold text-[#4A3435]";
      quantityLabel.textContent = rule.controlLabel;

      const input = document.createElement("input");
      input.id = rule.fieldId;
      input.type = "number";
      input.min = "1";
      input.step = "1";
      input.value = quantity;
      input.inputMode = "numeric";
      input.className =
        "mt-2 min-h-12 w-32 rounded-xl border border-[#CDBFB1] bg-white px-4 py-3 text-base text-[#342C2A] shadow-sm outline-none transition hover:border-[#A89380] focus:border-[#5A1425] focus:ring-2 focus:ring-[#C9A45B]/45";

      const hint = document.createElement("p");
      hint.className = "mt-2 text-xs leading-5 text-[#756963]";
      hint.textContent = "Quantity defaults to 1.";

      quantityLabel.appendChild(input);
      wrapper.append(quantityLabel, hint);
      label.insertAdjacentElement("afterend", wrapper);

      const applyQuantity = () => {
        const parsed = Number.parseInt(input.value, 10);
        const nextQuantity = Number.isFinite(parsed) && parsed >= 1 ? String(parsed) : "1";
        input.value = nextQuantity;
        const previousQuantity = quantities.get(rule.label) || "1";
        const previousLabel = `${rule.label} × ${previousQuantity}`;
        const nextLabel = `${rule.label} × ${nextQuantity}`;
        if (nextLabel !== previousLabel) {
          synchronizeAddonSet(checkbox, labelText, previousLabel, nextLabel);
        }
        quantities.set(rule.label, nextQuantity);
        syncReviewQuantity(rule, nextQuantity);
      };

      const currentLabel = labelText.textContent?.trim() || rule.label;
      if (currentLabel !== selectedLabel) {
        synchronizeAddonSet(checkbox, labelText, currentLabel, selectedLabel);
      }
      input.addEventListener("change", applyQuantity);
      input.addEventListener("blur", applyQuantity);
      syncReviewQuantity(rule, quantity);
    };

    const render = () => QUANTITY_RULES.forEach(renderRule);

    const onChange = () => {
      if (syncing) return;
      window.setTimeout(render, 0);
    };

    const observer = new MutationObserver(() => window.setTimeout(render, 0));
    const root = document.getElementById("quote-form");
    if (root) observer.observe(root, { childList: true, subtree: true });
    document.addEventListener("change", onChange, true);
    render();

    return () => {
      observer.disconnect();
      document.removeEventListener("change", onChange, true);
      QUANTITY_RULES.forEach((rule) => document.getElementById(rule.controlId)?.remove());
    };
  }, []);

  return null;
}
