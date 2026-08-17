import { expect, test } from "@playwright/test";

async function openQuote(page) {
  await page.goto("/quote");
  await expect(page.getByRole("heading", { name: "Tell us about your home." })).toBeVisible();
  await page.waitForFunction(() => {
    const field = document.querySelector("#field-propertyType");
    return Boolean(field && Object.keys(field).some((key) => key.startsWith("__reactProps$")));
  });
  await expect(page.locator("#field-propertyType")).toBeEnabled();
}

async function selectWhenReady(page, selector, option) {
  const field = page.locator(selector);
  await expect(field).toBeVisible();
  await expect(field).toBeEnabled();
  await field.selectOption(option);
}

async function continueTo(page, heading) {
  await page.getByRole("button", { name: /Continue/i }).click();
  await expect(page.getByRole("heading", { name: heading, exact: true })).toBeVisible();
}

async function fillHomeStep(page) {
  const property = page.locator("#field-propertyType");
  await property.selectOption({ label: "House" });
  await expect(property).toHaveValue("House");
  await page.locator("#field-suburb").fill("Sandton");
  await page.locator("#field-address").fill("1 Readiness Street");
  await selectWhenReady(page, "#field-floorSize", { index: 1 });
  await selectWhenReady(page, "#field-bedrooms", { label: "1" });
  await selectWhenReady(page, "#field-bathrooms", { label: "1" });
  await selectWhenReady(page, "#field-livingAreas", { label: "1" });
  await selectWhenReady(page, "#field-storeys", { label: "1 storey" });
  await selectWhenReady(page, "#field-outdoor", { label: "None" });
  await selectWhenReady(page, "#field-estate", { label: "No" });
  await continueTo(page, "Cleaning Requirements");
}

async function fillCleaningStep(page) {
  await page.locator("#field-service").selectOption({ label: "Regular Home Cleaning" });
  await selectWhenReady(page, "#field-frequency", { label: "One-time" });
  await selectWhenReady(page, "#field-condition", { index: 1 });
  await continueTo(page, "Personalise Your Service");
}

async function skipAddons(page) {
  await continueTo(page, "Preferred Visit");
}

async function fillPreferredVisit(page) {
  const preferredDate = page.locator("#field-preferredDate");
  const minimum = await preferredDate.getAttribute("min");
  expect(minimum).toBeTruthy();
  await preferredDate.fill(minimum);
  await selectWhenReady(page, "#field-preferredTime", { label: "Morning" });
  await selectWhenReady(page, "#field-flexibility", { label: "A day either side" });
  await selectWhenReady(page, "#field-urgency", { label: "Planning ahead" });
  await continueTo(page, "Access and Household Details");
  return minimum;
}

async function fillAccessStep(page, { pets = "No pets", restrictions = "", allergies = "" } = {}) {
  await selectWhenReady(page, "#field-complexAccess", { label: "Not applicable" });
  await selectWhenReady(page, "#field-keyHandover", { label: "Someone will open" });
  await selectWhenReady(page, "#field-present", { label: "Yes" });
  await selectWhenReady(page, "#field-pets", { label: pets });
  if (restrictions) await page.locator("#field-restrictions").fill(restrictions);
  if (allergies) await page.locator("#field-allergies").fill(allergies);
}

async function reachAccessStep(page) {
  await openQuote(page);
  await fillHomeStep(page);
  await fillCleaningStep(page);
  await skipAddons(page);
  await fillPreferredVisit(page);
}

async function reachYourDetails(page) {
  await reachAccessStep(page);
  await fillAccessStep(page);
  await continueTo(page, "Photos and Notes");
  await continueTo(page, "Your Details");
}

function previousIsoDate(isoDate) {
  const date = new Date(`${isoDate}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}

test("preferred visit rejects dates before the allowed minimum", async ({ page }) => {
  await openQuote(page);
  await fillHomeStep(page);
  await fillCleaningStep(page);
  await skipAddons(page);

  const preferredDate = page.locator("#field-preferredDate");
  const minimum = await preferredDate.getAttribute("min");
  expect(minimum).toBeTruthy();
  await preferredDate.fill(previousIsoDate(minimum));
  await selectWhenReady(page, "#field-preferredTime", { label: "Morning" });
  await selectWhenReady(page, "#field-flexibility", { label: "Exact date preferred" });
  await selectWhenReady(page, "#field-urgency", { label: "Planning ahead" });

  await page.getByRole("button", { name: /Continue/i }).click();
  await expect(page.locator("#field-preferredDate-error")).toHaveText(
    "Please choose a date from tomorrow onwards.",
  );
  await expect(page.getByRole("heading", { name: "Preferred Visit", exact: true })).toBeVisible();
});

test("pet-dependent details are mandatory when pets are selected", async ({ page }) => {
  await reachAccessStep(page);
  await fillAccessStep(page, { pets: "Yes, pets will be home" });

  await expect(page.locator("#field-petType")).toBeVisible();
  await expect(page.locator("#field-petTemperament")).toBeVisible();
  await page.getByRole("button", { name: /Continue/i }).click();

  await expect(page.locator("#field-petType-error")).toHaveText("Pet type is required.");
  await expect(page.locator("#field-petTemperament-error")).toHaveText(
    "Pet temperament is required.",
  );
  await expect(
    page.getByRole("heading", { name: "Access and Household Details", exact: true }),
  ).toBeVisible();
});

test("product restrictions and allergies stay on the household-details step after back navigation", async ({
  page,
}) => {
  await reachAccessStep(page);
  await fillAccessStep(page, {
    restrictions: "No bleach on natural stone",
    allergies: "Fragrance sensitivity",
  });
  await continueTo(page, "Photos and Notes");

  await page.getByRole("button", { name: /Back/i }).click();
  await expect(
    page.getByRole("heading", { name: "Access and Household Details", exact: true }),
  ).toBeVisible();
  await expect(page.locator("#field-restrictions")).toHaveValue("No bleach on natural stone");
  await expect(page.locator("#field-allergies")).toHaveValue("Fragrance sensitivity");
});

test("malformed email blocks progression from Your Details", async ({ page }) => {
  await reachYourDetails(page);
  await page.locator("#field-fullName").fill("Readiness Customer");
  await page.locator("#field-mobile").fill("0821234567");
  await page.locator("#field-email").fill("not-an-email");
  await selectWhenReady(page, "#field-contactMethod", { label: "Email" });

  await page.getByRole("button", { name: /Continue/i }).click();
  await expect(page.locator("#field-email-error")).toHaveText("Enter a valid email address.");
  await expect(page.getByRole("heading", { name: "Your Details", exact: true })).toBeVisible();
});

test("entered customer journey survives back and forward navigation through Review", async ({ page }) => {
  await openQuote(page);
  await fillHomeStep(page);
  await fillCleaningStep(page);
  await skipAddons(page);
  const preferredDate = await fillPreferredVisit(page);
  await fillAccessStep(page, {
    restrictions: "Use customer-approved surface products only",
    allergies: "Mild fragrance sensitivity",
  });
  await continueTo(page, "Photos and Notes");
  await page.locator("#field-notes").fill("Please call on arrival.");
  await continueTo(page, "Your Details");

  await page.locator("#field-fullName").fill("Readiness Customer");
  await page.locator("#field-mobile").fill("0821234567");
  await page.locator("#field-email").fill("readiness@example.com");
  await selectWhenReady(page, "#field-contactMethod", { label: "WhatsApp" });
  await continueTo(page, "Review and Submit");

  await expect(page.getByText("Regular Home Cleaning", { exact: true })).toBeVisible();
  await expect(page.getByText(preferredDate, { exact: true })).toBeVisible();
  await expect(page.getByText("WhatsApp", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: /Back/i }).click();
  await expect(page.getByRole("heading", { name: "Your Details", exact: true })).toBeVisible();
  await expect(page.locator("#field-fullName")).toHaveValue("Readiness Customer");
  await expect(page.locator("#field-email")).toHaveValue("readiness@example.com");
  await selectWhenReady(page, "#field-contactMethod", { label: "Email" });
  await continueTo(page, "Review and Submit");
  await expect(page.getByText("Email", { exact: true })).toBeVisible();

  // The readiness suite intentionally stops here. It does not submit a real quote.
});
