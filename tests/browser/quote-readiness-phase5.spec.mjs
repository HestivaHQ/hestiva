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

async function reachAddons(page) {
  await openQuote(page);
  await page.locator("#field-propertyType").selectOption({ label: "House" });
  await page.locator("#field-suburb").fill("Sandton");
  await page.locator("#field-address").fill("1 Keyboard Street");
  await selectWhenReady(page, "#field-floorSize", { index: 1 });
  await selectWhenReady(page, "#field-bedrooms", { label: "1" });
  await selectWhenReady(page, "#field-bathrooms", { label: "1" });
  await selectWhenReady(page, "#field-livingAreas", { label: "1" });
  await selectWhenReady(page, "#field-storeys", { label: "1 storey" });
  await selectWhenReady(page, "#field-outdoor", { label: "None" });
  await selectWhenReady(page, "#field-estate", { label: "No" });
  await continueTo(page, "Cleaning Requirements");
  await page.locator("#field-service").selectOption({ label: "Regular Home Cleaning" });
  await selectWhenReady(page, "#field-frequency", { label: "One-time" });
  await selectWhenReady(page, "#field-condition", { index: 1 });
  await continueTo(page, "Personalise Your Service");
}

async function installSubmissionStub(page) {
  await page.addInitScript(() => {
    window.__HOMENT_TEST_SUBMIT_COUNT__ = 0;
    window.__HOMENT_TEST_STRUCTURED_QUOTE_SUBMIT__ = async (input) => {
      window.__HOMENT_TEST_SUBMIT_COUNT__ += 1;
      window.__HOMENT_TEST_LAST_SUBMISSION__ = input;
      return {
        success: true,
        quoteReference: "HOM-KEYBOARD-001",
        correspondenceDelivered: true,
      };
    };
  });
}

async function reachReview(page) {
  await reachAddons(page);
  await continueTo(page, "Preferred Visit");

  const preferredDate = page.locator("#field-preferredDate");
  const minimum = await preferredDate.getAttribute("min");
  expect(minimum).toBeTruthy();
  await preferredDate.fill(minimum);
  await selectWhenReady(page, "#field-preferredTime", { label: "Morning" });
  await selectWhenReady(page, "#field-flexibility", { label: "A day either side" });
  await selectWhenReady(page, "#field-urgency", { label: "Planning ahead" });
  await continueTo(page, "Access and Household Details");

  await selectWhenReady(page, "#field-complexAccess", { label: "Not applicable" });
  await selectWhenReady(page, "#field-keyHandover", { label: "Someone will open" });
  await selectWhenReady(page, "#field-present", { label: "Yes" });
  await selectWhenReady(page, "#field-pets", { label: "No pets" });
  await selectWhenReady(page, "#field-restrictionsChoice", { label: "None" });
  await selectWhenReady(page, "#field-allergiesChoice", { label: "None" });
  await continueTo(page, "Photos and Notes");
  await continueTo(page, "Your Details");

  await page.locator("#field-fullName").fill("Keyboard Customer");
  await page.locator("#field-mobile").fill("0821234567");
  await page.locator("#field-email").fill("keyboard@example.com");
  await selectWhenReady(page, "#field-contactMethod", { label: "Email" });
  await continueTo(page, "Review and Submit");
  await expect.poll(() => page.evaluate(() => window.__HOMENT_TEST_STRUCTURED_SUBMISSION_READY__ === true)).toBe(true);
}

test("first-step focus order follows the visible customer controls", async ({ page }) => {
  await openQuote(page);
  const property = page.locator("#field-propertyType");
  await property.focus();
  await expect(property).toBeFocused();

  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Use my current location" })).toBeFocused();

  await page.keyboard.press("Tab");
  await expect(page.locator("#field-suburb")).toBeFocused();

  await page.keyboard.press("Tab");
  await expect(page.locator("#field-postcode")).toBeFocused();

  await page.keyboard.press("Tab");
  await expect(page.locator("#field-address")).toBeFocused();
});

test("conditional Other property description enters the keyboard order immediately after property type", async ({ page }) => {
  await openQuote(page);
  const property = page.locator("#field-propertyType");
  await property.selectOption({ label: "Other" });
  await expect(page.locator("#field-propertyTypeOther")).toBeVisible();

  await property.focus();
  await page.keyboard.press("Tab");
  await expect(page.locator("#field-propertyTypeOther")).toBeFocused();
});

test("keyboard activation of Continue recovers focus to the first invalid field", async ({ page }) => {
  await openQuote(page);
  const continueButton = page.getByRole("button", { name: /Continue/i });
  await continueButton.focus();
  await expect(continueButton).toBeFocused();
  await page.keyboard.press("Enter");

  await expect(page.getByRole("alert").first()).toContainText(/Property type/i);
  await expect(page.locator("#field-propertyType")).toBeFocused();
});

test("add-on checkboxes can be toggled with Space and reveal dependent controls", async ({ page }) => {
  await reachAddons(page);
  const laundry = page.getByRole("checkbox", { name: /^Laundry$/ });
  await laundry.focus();
  await expect(laundry).toBeFocused();
  await page.keyboard.press("Space");

  await expect(laundry).toBeChecked();
  await expect(page.locator("#field-laundryFacilities")).toBeVisible();
  await expect(page.locator("#field-laundryLoads")).toHaveValue("1");
});

test("final consent and structured submission can be completed from the keyboard", async ({ page }) => {
  await installSubmissionStub(page);
  await reachReview(page);

  const consent = page.getByRole("checkbox");
  await consent.focus();
  await expect(consent).toBeFocused();
  await page.keyboard.press("Space");
  await expect(consent).toBeChecked();

  const sendButton = page.getByRole("button", { name: "Send Request", exact: true });
  await sendButton.focus();
  await expect(sendButton).toBeFocused();
  await page.keyboard.press("Enter");

  const notice = page.locator("#homent-form-notice");
  await expect(notice).toContainText("Homent — Request received");
  await expect(notice).toContainText("HOM-KEYBOARD-001");
  await expect(page.getByRole("button", { name: "Request Sent", exact: true })).toBeDisabled();
  expect(await page.evaluate(() => window.__HOMENT_TEST_SUBMIT_COUNT__ || 0)).toBe(1);
});
