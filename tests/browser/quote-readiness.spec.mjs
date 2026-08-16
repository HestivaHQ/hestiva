import { expect, test } from "@playwright/test";

const primaryServices = [
  "Regular Home Cleaning",
  "Deep Cleaning",
  "Move-In Cleaning",
  "Move-Out Cleaning",
  "Apartment Cleaning",
  "Kitchen Cleaning",
  "Bathroom Sanitisation",
  "Bedroom Cleaning",
  "Living Area Cleaning",
  "Interior Window Cleaning",
  "Eco-Friendly Cleaning",
  "Post-Renovation Cleaning",
  "Not sure",
];

async function openQuote(page) {
  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  await page.goto("/quote");
  await expect(page.getByRole("heading", { name: "Tell us about your home." })).toBeVisible();
  return consoleErrors;
}

async function fillHomeStep(page, propertyType = "House") {
  await page.locator("#field-propertyType").selectOption({ label: propertyType });
  if (propertyType === "Other") {
    await page.locator("#field-propertyTypeOther").fill("Free-standing cottage");
  }
  await page.locator("#field-suburb").fill("Sandton");
  await page.locator("#field-address").fill("1 Test Street");
  await page.locator("#field-floorSize").selectOption({ index: 1 });
  await page.locator("#field-bedrooms").selectOption({ index: 1 });
  await page.locator("#field-bathrooms").selectOption({ label: "1" });
  await page.locator("#field-livingAreas").selectOption({ label: "1" });
  if (["Townhouse", "House", "Other"].includes(propertyType)) {
    await page.locator("#field-storeys").selectOption({ index: 1 });
  }
  if (propertyType === "Apartment") {
    await page.locator("#field-unitFloor").selectOption({ label: "Ground floor" });
  }
  await page.locator("#field-outdoor").selectOption({ label: "None" });
  await page.locator("#field-estate").selectOption({ label: "No" });
  await page.getByRole("button", { name: /Continue/i }).click();
  await expect(page.getByRole("heading", { name: "Cleaning Requirements" })).toBeVisible();
}

async function fillCleaningStep(page, service) {
  await page.locator("#field-service").selectOption({ label: service });
  if (service === "Not sure") {
    await page.locator("#field-serviceOther").fill("General cleaning with help deciding the scope");
  }
  await page.locator("#field-frequency").selectOption({ label: "One-time" });
  await page.locator("#field-condition").selectOption({ index: 1 });
  await page.getByRole("button", { name: /Continue/i }).click();
  await expect(page.getByRole("heading", { name: "Personalise Your Service" })).toBeVisible();
}

test("quote page loads without browser console errors", async ({ page }) => {
  const consoleErrors = await openQuote(page);
  expect(consoleErrors).toEqual([]);
});

test("empty first step shows required-field feedback and keeps focus in the step", async ({ page }) => {
  await openQuote(page);
  await page.getByRole("button", { name: /Continue/i }).click();
  await expect(page.getByRole("alert")).toContainText("Property type is required.");
  await expect(page.getByRole("heading", { name: "Your Home" })).toBeVisible();
  await expect(page.locator("#field-propertyType")).toBeFocused();
});

test("House storeys excludes Not sure", async ({ page }) => {
  await openQuote(page);
  await page.locator("#field-propertyType").selectOption({ label: "House" });
  const options = await page.locator("#field-storeys option").allTextContents();
  expect(options).not.toContain("Not sure");
});

test("Apartment uses unit-floor choices instead of storeys", async ({ page }) => {
  await openQuote(page);
  await page.locator("#field-propertyType").selectOption({ label: "Apartment" });
  await expect(page.locator("#field-unitFloor")).toBeVisible();
  await expect(page.locator("#field-storeys")).toHaveCount(0);
  await expect(page.locator("#field-unitFloor option")).toContainText(["Ground floor"]);
});

test("Townhouse keeps storeys, balcony/patio and estate/complex controls usable", async ({ page }) => {
  await openQuote(page);
  await page.locator("#field-propertyType").selectOption({ label: "Townhouse" });
  await expect(page.locator("#field-storeys")).toBeEnabled();
  await expect(page.locator("#field-outdoor")).toBeEnabled();
  await expect(page.locator("#field-estate")).toBeEnabled();
  await page.locator("#field-outdoor").selectOption({ label: "Balcony" });
  await page.locator("#field-estate").selectOption({ label: "Yes — complex" });
  await expect(page.locator("#field-outdoor")).toHaveValue("Balcony");
  await expect(page.locator("#field-estate")).toHaveValue("Yes — complex");
});

test("Other property type requires a description", async ({ page }) => {
  await openQuote(page);
  await page.locator("#field-propertyType").selectOption({ label: "Other" });
  await expect(page.locator("#field-propertyTypeOther")).toBeVisible();
  await page.getByRole("button", { name: /Continue/i }).click();
  await expect(page.getByRole("alert")).toContainText("Please describe the property type.");
});

test("Not sure primary service requires cleaning requirements text", async ({ page }) => {
  await openQuote(page);
  await fillHomeStep(page);
  await page.locator("#field-service").selectOption({ label: "Not sure" });
  await expect(page.locator("#field-serviceOther")).toBeVisible();
  await page.locator("#field-frequency").selectOption({ label: "One-time" });
  await page.locator("#field-condition").selectOption({ index: 1 });
  await page.getByRole("button", { name: /Continue/i }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Please tell us what you would like cleaned.",
  );
});

test("Custom frequency requires a customer description", async ({ page }) => {
  await openQuote(page);
  await fillHomeStep(page);
  await page.locator("#field-service").selectOption({ label: "Regular Home Cleaning" });
  await page.locator("#field-frequency").selectOption({ label: "Custom" });
  await expect(page.locator("#field-customFrequency")).toBeVisible();
  await page.locator("#field-condition").selectOption({ index: 1 });
  await page.getByRole("button", { name: /Continue/i }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Please describe your preferred cleaning frequency.",
  );
});

for (const service of primaryServices) {
  test(`Laundry and Ironing are selectable after ${service}`, async ({ page }) => {
    await openQuote(page);
    await fillHomeStep(page);
    await fillCleaningStep(page, service);

    const laundry = page.getByRole("checkbox", { name: /^Laundry$/ });
    const ironing = page.getByRole("checkbox", { name: /^Ironing$/ });
    await expect(laundry).toBeEnabled();
    await expect(ironing).toBeEnabled();
    await laundry.check();
    await ironing.check();
    await expect(laundry).toBeChecked();
    await expect(ironing).toBeChecked();
    await expect(page.locator("#field-laundryFacilities")).toBeVisible();
    await expect(page.locator("#field-laundryLoads")).toHaveValue("1");
    await expect(page.locator("#field-ironingLoads")).toHaveValue("1");
  });
}

test("Laundry with no washing machine is rejected before leaving add-ons", async ({ page }) => {
  await openQuote(page);
  await fillHomeStep(page);
  await fillCleaningStep(page, "Regular Home Cleaning");
  await page.getByRole("checkbox", { name: /^Laundry$/ }).check();
  await page
    .locator("#field-laundryFacilities")
    .selectOption({ label: "No washing machine" });
  await page.getByRole("button", { name: /Continue/i }).click();
  await expect(page.locator("#laundry-operating-model-error")).toContainText(
    "Laundry cannot be added without a working washing machine",
  );
  await expect(page.getByRole("heading", { name: "Personalise Your Service" })).toBeVisible();
});
