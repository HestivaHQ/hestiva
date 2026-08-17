import { expect, test } from "@playwright/test";

async function installSubmissionStub(page, result, throws = false) {
  await page.addInitScript(({ stubResult, shouldThrow }) => {
    window.__HOMENT_TEST_SUBMIT_COUNT__ = 0;
    window.__HOMENT_TEST_STRUCTURED_QUOTE_SUBMIT__ = async (input) => {
      window.__HOMENT_TEST_SUBMIT_COUNT__ += 1;
      window.__HOMENT_TEST_LAST_SUBMISSION__ = input;
      if (shouldThrow) throw new Error("simulated client/network failure");
      return stubResult;
    };
  }, { stubResult: result, shouldThrow: throws });
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
  await page.goto("/quote");
  await expect(page.getByRole("heading", { name: "Tell us about your home." })).toBeVisible();
  await page.waitForFunction(() => {
    const field = document.querySelector("#field-propertyType");
    return Boolean(field && Object.keys(field).some((key) => key.startsWith("__reactProps$")));
  });
  await expect.poll(() => page.evaluate(() => window.__HOMENT_TEST_STRUCTURED_SUBMISSION_READY__ === true)).toBe(true);

  await page.locator("#field-propertyType").selectOption({ label: "House" });
  await page.locator("#field-suburb").fill("Sandton");
  await page.locator("#field-address").fill("1 Failure Street");
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

  await page.locator("#field-fullName").fill("Failure Category Customer");
  await page.locator("#field-mobile").fill("0821234567");
  await page.locator("#field-email").fill("failure@example.com");
  await selectWhenReady(page, "#field-contactMethod", { label: "Email" });
  await continueTo(page, "Review and Submit");
  await page.getByRole("checkbox").check();
}

async function expectRetryableFailure(page, code, text) {
  await page.getByRole("button", { name: "Send Request", exact: true }).click();
  const notice = page.locator("#homent-form-notice");
  await expect(notice).toContainText("Homent — Request not sent");
  await expect(notice).toContainText(code);
  await expect(notice).toContainText(text);
  await expect(page.getByRole("button", { name: "Send Request", exact: true })).toBeEnabled();
  expect(await page.evaluate(() => window.__HOMENT_TEST_SUBMIT_COUNT__ || 0)).toBe(1);
}

const cases = [
  ["validation", "Q-VALIDATION", "review your selections"],
  ["rate_limit", "Q-RATE-LIMIT", "wait about 15 minutes"],
  ["origin", "Q-SECURITY", "could not verify this quote request"],
  ["unexpected", "Q-UNEXPECTED", "technical error occurred"],
  ["unknown-test-category", "Q-UNKNOWN", "could not send your request"],
];

for (const [category, code, text] of cases) {
  test(`structured ${category} failure remains retryable and shows ${code}`, async ({ page }) => {
    await installSubmissionStub(page, { success: false, category });
    await reachReview(page);
    await expectRetryableFailure(page, code, text);
  });
}

test("thrown client or network failure remains retryable and shows Q-CLIENT", async ({ page }) => {
  await installSubmissionStub(page, null, true);
  await reachReview(page);
  await expectRetryableFailure(page, "Q-CLIENT", "browser or network error interrupted the request");
});
