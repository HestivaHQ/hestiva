import { expect, test } from "@playwright/test";

async function selectWhenReady(page, selector, option) {
  const field = page.locator(selector);
  await expect(field).toBeVisible();
  await expect(field).toBeEnabled();
  await field.selectOption(option);
}

async function reachCleaningRequirements(page) {
  await page.goto("/quote");
  await expect(page.getByRole("heading", { name: "Tell us about your home." })).toBeVisible();
  await page.waitForFunction(() => {
    const field = document.querySelector("#field-propertyType");
    return Boolean(field && Object.keys(field).some((key) => key.startsWith("__reactProps$")));
  });

  const property = page.locator("#field-propertyType");
  await expect(property).toBeEnabled();
  await property.selectOption({ label: "House" });
  await expect(property).toHaveValue("House");

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
  await expect(page.getByRole("heading", { name: "Cleaning Requirements" })).toBeVisible();
}

test("quote primary service selector uses the canonical service model", async ({ page }) => {
  await reachCleaningRequirements(page);

  const service = page.locator("#field-service");
  await expect(service).toBeAttached();

  await expect
    .poll(async () => service.locator("option").allTextContents())
    .toEqual([
      "Select an option",
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
      "Post-Event Cleaning",
      "Not sure",
    ]);

  await expect(service.locator('option[value="Apartment Cleaning"]')).toHaveCount(0);
  await expect(service.locator('option[value="Eco-Friendly Cleaning"]')).toHaveCount(0);

  await page.getByRole("button", { name: /Back/i }).click();
  await expect(page.locator("#field-propertyType")).toContainText("Apartment");
});
