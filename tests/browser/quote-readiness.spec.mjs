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
  await page.waitForFunction(() => {
    const field = document.querySelector("#field-propertyType");
    return Boolean(field && Object.keys(field).some((key) => key.startsWith("__reactProps$")));
  });
  await expect(page.locator("#field-propertyType")).toBeEnabled();
  return consoleErrors;
}

async function selectWhenReady(page, selector, option) {
  const field = page.locator(selector);
  await expect(field).toBeVisible();
  await expect(field).toBeEnabled();
  await field.selectOption(option);
}

async function fillHomeStep(page, propertyType = "House") {
  const property = page.locator("#field-propertyType");
  await property.selectOption({ label: propertyType });
  await expect(property).toHaveValue(propertyType);

  if (propertyType === "Other") {
    await expect(page.locator("#field-propertyTypeOther")).toBeVisible();
    await page.locator("#field-propertyTypeOther").fill("Free-standing cottage");
  }

  await page.locator("#field-suburb").fill("Sandton");
  await page.locator("#field-address").fill("1 Test Street");
  await selectWhenReady(page, "#field-floorSize", { index: 1 });
  await selectWhenReady(page, "#field-bedrooms", { index: 1 });
  await selectWhenReady(page, "#field-bathrooms", { label: "1" });
  await selectWhenReady(page, "#field-livingAreas", { label: "1" });

  if (["Townhouse", "House", "Other"].includes(propertyType)) {
    await expect(property).toHaveValue(propertyType);
    await selectWhenReady(page, "#field-storeys", { index: 1 });
  }
  if (propertyType === "Apartment") {
    await selectWhenReady(page, "#field-unitFloorExact", { label: "Ground floor" });
    await selectWhenReady(page, "#field-buildingAccess", { label: "Elevator available" });
  }

  await selectWhenReady(page, "#field-outdoor", { label: "None" });
  await selectWhenReady(page, "#field-estate", { label: "No" });
  await page.getByRole("button", { name: /Continue/i }).click();
  await expect(page.getByRole("heading", { name: "Cleaning Requirements" })).toBeVisible();
}

async function fillCleaningStep(page, service) {
  await page.locator("#field-service").selectOption({ label: service });
  if (service === "Not sure") {
    await page.locator("#field-serviceOther").fill("General cleaning with help deciding the scope");
  }
  await selectWhenReady(page, "#field-frequency", { label: "One-time" });
  await selectWhenReady(page, "#field-condition", { index: 1 });
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
  await expect(page.getByRole("alert").first()).toContainText(/Property type/i);
  await expect(page.getByRole("heading", { name: "Your Home", exact: true })).toBeVisible();
  await expect(page.locator("#field-propertyType")).toBeFocused();
});

test("House storeys excludes Not sure", async ({ page }) => {
  await openQuote(page);
  const property = page.locator("#field-propertyType");
  await property.selectOption({ label: "House" });
  await expect(property).toHaveValue("House");
  await expect(page.locator("#field-storeys")).toBeVisible();
  const options = await page.locator("#field-storeys option").allTextContents();
  expect(options).not.toContain("Not sure");
});

test("Apartment uses exact floor and building-access choices instead of storeys", async ({ page }) => {
  await openQuote(page);
  const property = page.locator("#field-propertyType");
  await property.selectOption({ label: "Apartment" });
  await expect(property).toHaveValue("Apartment");
  await expect(page.locator("#field-unitFloorExact")).toBeVisible();
  await expect(page.locator("#field-buildingAccess")).toBeVisible();
  await expect(page.locator("#field-storeys")).toHaveCount(0);
  await expect(page.locator("#field-unitFloorExact option")).toContainText(["Ground floor"]);
  await expect(page.locator("#field-buildingAccess option")).toContainText(["Elevator available"]);
});

test("Townhouse keeps storeys, balcony/patio and estate/complex controls usable", async ({ page }) => {
  await openQuote(page);
  const property = page.locator("#field-propertyType");
  await property.selectOption({ label: "Townhouse" });
  await expect(property).toHaveValue("Townhouse");

  await page.locator("#field-suburb").fill("Sandton");
  await page.locator("#field-address").fill("1 Test Street");
  await selectWhenReady(page, "#field-floorSize", { index: 1 });
  await selectWhenReady(page, "#field-bedrooms", { index: 1 });
  await selectWhenReady(page, "#field-bathrooms", { label: "1" });
  await selectWhenReady(page, "#field-livingAreas", { label: "1" });
  await selectWhenReady(page, "#field-storeys", { index: 1 });
  await selectWhenReady(page, "#field-outdoor", { label: "Balcony" });
  await expect(page.locator("#field-outdoor")).toHaveValue("Balcony");
  await selectWhenReady(page, "#field-estate", { label: "Yes — complex" });
  await expect(page.locator("#field-outdoor")).toHaveValue("Balcony");
  await expect(page.locator("#field-estate")).toHaveValue("Yes — complex");
});

test("Other property type requires a description", async ({ page }) => {
  await openQuote(page);
  const property = page.locator("#field-propertyType");
  await property.selectOption({ label: "Other" });
  await expect(property).toHaveValue("Other");
  await expect(page.locator("#field-propertyTypeOther")).toBeVisible();

  await page.locator("#field-suburb").fill("Sandton");
  await page.locator("#field-address").fill("1 Test Street");
  await selectWhenReady(page, "#field-floorSize", { index: 1 });
  await selectWhenReady(page, "#field-bedrooms", { index: 1 });
  await selectWhenReady(page, "#field-bathrooms", { label: "1" });
  await selectWhenReady(page, "#field-livingAreas", { label: "1" });
  await selectWhenReady(page, "#field-storeys", { index: 1 });
  await selectWhenReady(page, "#field-outdoor", { label: "None" });
  await selectWhenReady(page, "#field-estate", { label: "No" });

  await page.getByRole("button", { name: /Continue/i }).click();
  await expect(page.getByText("Please describe the property type.", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Your Home", exact: true })).toBeVisible();
});

test("Not sure primary service requires cleaning requirements text", async ({ page }) => {
  await openQuote(page);
  await fillHomeStep(page);
  await page.locator("#field-service").selectOption({ label: "Not sure" });
  await expect(page.locator("#field-serviceOther")).toBeVisible();
  await selectWhenReady(page, "#field-frequency", { label: "One-time" });
  await selectWhenReady(page, "#field-condition", { index: 1 });
  await page.getByRole("button", { name: /Continue/i }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Please tell us what you would like cleaned.",
  );
});

test("Custom frequency requires a customer description", async ({ page }) => {
  await openQuote(page);
  await fillHomeStep(page);
  await page.locator("#field-service").selectOption({ label: "Regular Home Cleaning" });
  await selectWhenReady(page, "#field-frequency", { label: "Custom" });
  await expect(page.locator("#field-customFrequency")).toBeVisible();
  await selectWhenReady(page, "#field-condition", { index: 1 });
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
    const ironing = page.getByRole("checkbox", { name: /^Ironing(?: × \d+)?$/ });
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
