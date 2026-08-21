import { expect, test } from "@playwright/test";

test("quote primary service selector uses the canonical service model", async ({ page }) => {
  await page.goto("/quote");

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
      "Not sure",
    ]);

  await expect(service.locator('option[value="Apartment Cleaning"]')).toHaveCount(0);
  await expect(service.locator('option[value="Eco-Friendly Cleaning"]')).toHaveCount(0);
  await expect(page.locator("#field-propertyType")).toContainText("Apartment");
});
