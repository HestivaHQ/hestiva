import { useEffect } from "react";

const ADDON_LABEL = "Extra refrigerator";
const CONTROL_ID = "extra-refrigerator-quantity-control";

function addonCheckbox() {
  return Array.from(
    document.querySelectorAll<HTMLInputElement>('#quote-form input[type="checkbox"]'),
  ).find((checkbox) =>
    checkbox.closest("label")?.querySelector("span")?.textContent?.trim().startsWith(ADDON_LABEL),
  );
}

function syncReviewQuantity(quantity: string) {
  document.querySelectorAll<HTMLElement>("#quote-form dt").forEach((term) => {
    if (term.textContent?.trim() !== "Selected add-ons") return;
    const value = term.parentElement?.querySelector<HTMLElement>("dd");
    if (!value) return;
    const current = value.textContent || "";
    const next = current.replace(
      /Extra refrigerator(?: × \d+)?/,
      `Extra refrigerator × ${quantity}`,
    );
    if (next !== current) value.textContent = next;
  });
}

export function ExtraRefrigeratorQuantity() {
  useEffect(() => {
    let syncing = false;
    let lastRenderedQuantity = "1";

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

    const render = () => {
      const checkbox = addonCheckbox();
      const existing = document.getElementById(CONTROL_ID);
      if (!checkbox) {
        existing?.remove();
        syncReviewQuantity(lastRenderedQuantity);
        return;
      }

      const label = checkbox.closest("label");
      const labelText = label?.querySelector<HTMLElement>("span");
      if (!label || !labelText) return;

      if (!checkbox.checked) {
        existing?.remove();
        if (labelText.textContent !== ADDON_LABEL) labelText.textContent = ADDON_LABEL;
        lastRenderedQuantity = "1";
        return;
      }

      if (existing) {
        syncReviewQuantity(lastRenderedQuantity);
        return;
      }

      const wrapper = document.createElement("div");
      wrapper.id = CONTROL_ID;
      wrapper.className = "mt-3 rounded-xl border border-[#D8CCC0] bg-[#FBF7EF] p-4";

      const quantityLabel = document.createElement("label");
      quantityLabel.htmlFor = "field-extraRefrigeratorQuantity";
      quantityLabel.className = "text-sm font-semibold text-[#4A3435]";
      quantityLabel.textContent = "Extra refrigerator quantity";

      const input = document.createElement("input");
      input.id = "field-extraRefrigeratorQuantity";
      input.type = "number";
      input.min = "1";
      input.step = "1";
      input.value = lastRenderedQuantity;
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
        const quantity = Number.isFinite(parsed) && parsed >= 1 ? String(parsed) : "1";
        input.value = quantity;
        const previousLabel = `${ADDON_LABEL} × ${lastRenderedQuantity}`;
        const nextLabel = `${ADDON_LABEL} × ${quantity}`;
        if (nextLabel !== previousLabel) {
          synchronizeAddonSet(checkbox, labelText, previousLabel, nextLabel);
        }
        lastRenderedQuantity = quantity;
        syncReviewQuantity(quantity);
      };

      const currentLabel = labelText.textContent?.trim() || ADDON_LABEL;
      const nextLabel = `${ADDON_LABEL} × ${lastRenderedQuantity}`;
      if (currentLabel !== nextLabel) {
        synchronizeAddonSet(checkbox, labelText, currentLabel, nextLabel);
      }
      input.addEventListener("change", applyQuantity);
      input.addEventListener("blur", applyQuantity);
      syncReviewQuantity(lastRenderedQuantity);
    };

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
      document.getElementById(CONTROL_ID)?.remove();
    };
  }, []);

  return null;
}
