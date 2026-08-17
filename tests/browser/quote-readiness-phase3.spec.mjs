import { expect, test } from "@playwright/test";

async function installSubmissionStub(page, result) {
  await page.addInitScript((stubResult) => {
    window.__HOMENT_TEST_SUBMIT_COUNT__ = 0;
    window.__HOMENT_TEST_STRUCTURED_QUOTE_SUBMIT__ = async (input) => {
      window.__HOMENT_TEST_SUBMIT_COUNT__ += 1;
      window.__HOMENT_TEST_LAST_SUBMISSION__ = input;
      return stubResult;
    };
  }, result);
}

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

async function reachReview(page) {
  await openQuote(page);

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

  await page.locator("#field-service").selectOption({ label: "Regular Home Cleaning" });
  await selectWhenReady(page, "#field-frequency", { label: "One-time" });
  await selectWhenReady(page, "#field-condition", { index: 1 });
  await continueTo(page, "Personalise Your Service");
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

  await page.locator("#field-fullName").fill("Readiness Customer");
  await page.locator("#field-mobile").fill("0821234567");
  await page.locator("#field-email").fill("readiness@example.com");
  await selectWhenReady(page, "#field-contactMethod", { label: "Email" });
  await continueTo(page, "Review and Submit");
}

async function submissionCount(page) {
  return page.evaluate(() => window.__HOMENT_TEST_SUBMIT_COUNT__ || 0);
}

test("final consent blocks the structured submission owner before any request is attempted", async ({ page }) => {
  await installSubmissionStub(page, {
    success: true,
    quoteReference: "HOM-TEST-CONSENT",
    correspondenceDelivered: true,
  });
  await reachReview(page);

  const sendButton = page.getByRole("button", { name: "Send Request", exact: true });
  await sendButton.click();

  await expect(page.locator("#quote-error-consent")).toHaveText(
    "Please confirm that Homent may contact you.",
  );
  await expect(page.getByRole("checkbox")).toBeFocused();
  await expect(sendButton).toBeEnabled();
  expect(await submissionCount(page)).toBe(0);
});

test("mocked structured submission success is owned once and locks the final button", async ({ page }) => {
  await installSubmissionStub(page, {
    success: true,
    quoteReference: "HOM-TEST-001",
    correspondenceDelivered: true,
  });
  await reachReview(page);
  await page.getByRole("checkbox").check();

  const dialogPromise = page.waitForEvent("dialog");
  await page.getByRole("button", { name: "Send Request", exact: true }).click();
  const dialog = await dialogPromise;
  expect(dialog.message()).toContain("Your request has been sent successfully.");
  expect(dialog.message()).toContain("HOM-TEST-001");
  await dialog.accept();

  const sentButton = page.getByRole("button", { name: "Request Sent", exact: true });
  await expect(sentButton).toBeDisabled();
  expect(await submissionCount(page)).toBe(1);
  const service = await page.evaluate(
    () => window.__HOMENT_TEST_LAST_SUBMISSION__?.data?.snapshot?.values?.service,
  );
  expect(service).toBe("Regular Home Cleaning");
});

test("mocked delivery failure shows Q-DELIVERY and restores retryability", async ({ page }) => {
  await installSubmissionStub(page, { success: false, category: "delivery" });
  await reachReview(page);
  await page.getByRole("checkbox").check();

  const dialogPromise = page.waitForEvent("dialog");
  await page.getByRole("button", { name: "Send Request", exact: true }).click();
  const dialog = await dialogPromise;
  expect(dialog.message()).toContain("could not reach the quotation system");
  expect(dialog.message()).toContain("Q-DELIVERY");
  await dialog.accept();

  const retryButton = page.getByRole("button", { name: "Send Request", exact: true });
  await expect(retryButton).toBeEnabled();
  expect(await submissionCount(page)).toBe(1);
});
