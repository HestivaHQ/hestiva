import { expect, test } from "@playwright/test";

function imageFile(name, mimeType = "image/png", size = 128) {
  return { name, mimeType, buffer: Buffer.alloc(size, 1) };
}

async function installSubmissionStub(page) {
  await page.addInitScript(() => {
    window.__HOMENT_TEST_SUBMIT_COUNT__ = 0;
    window.__HOMENT_TEST_STRUCTURED_QUOTE_SUBMIT__ = async (input) => {
      window.__HOMENT_TEST_SUBMIT_COUNT__ += 1;
      window.__HOMENT_TEST_LAST_SUBMISSION__ = input;
      return {
        success: true,
        quoteReference: "HOM-TEST-FILES",
        correspondenceDelivered: true,
      };
    };
  });
}

async function openQuote(page) {
  await page.goto("/quote");
  await expect(page.getByRole("heading", { name: "Tell us about your home." })).toBeVisible();
  await page.waitForFunction(() => {
    const field = document.querySelector("#field-propertyType");
    return Boolean(field && Object.keys(field).some((key) => key.startsWith("__reactProps$")));
  });
  await expect(page.locator("#field-propertyType")).toBeEnabled();
  await expect.poll(() => page.evaluate(() => window.__HOMENT_TEST_STRUCTURED_SUBMISSION_READY__ === true)).toBe(true);
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

async function reachPhotos(page) {
  await openQuote(page);
  await page.locator("#field-propertyType").selectOption({ label: "House" });
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
}

test("only retained quote photos cross the structured submission boundary", async ({ page }) => {
  await installSubmissionStub(page);
  await reachPhotos(page);

  const gallery = page.locator('input[type="file"][multiple]');
  await gallery.setInputFiles([
    imageFile("keep.png"),
    imageFile("remove.jpg", "image/jpeg"),
  ]);
  await expect(page.getByText("keep.png", { exact: true })).toBeVisible();
  await expect(page.getByText("remove.jpg", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Remove remove.jpg" }).click();
  await expect(page.getByText("remove.jpg", { exact: true })).toHaveCount(0);
  await expect(page.getByText("keep.png", { exact: true })).toBeVisible();

  await continueTo(page, "Your Details");
  await page.locator("#field-fullName").fill("Readiness Customer");
  await page.locator("#field-mobile").fill("0821234567");
  await page.locator("#field-email").fill("readiness@example.com");
  await selectWhenReady(page, "#field-contactMethod", { label: "Email" });
  await continueTo(page, "Review and Submit");

  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Send Request", exact: true }).click();
  await expect(page.getByRole("button", { name: "Request Sent", exact: true })).toBeDisabled();

  const payload = await page.evaluate(() => ({
    count: window.__HOMENT_TEST_SUBMIT_COUNT__ || 0,
    files: window.__HOMENT_TEST_LAST_SUBMISSION__?.data?.files || [],
  }));

  expect(payload.count).toBe(1);
  expect(payload.files).toHaveLength(1);
  expect(payload.files[0].name).toBe("keep.png");
  expect(payload.files[0].type).toBe("image/png");
  expect(payload.files[0].clientPhotoId).toMatch(/^[0-9a-f-]{36}$/i);
  expect(payload.files[0].base64.length).toBeGreaterThan(0);
  expect(payload.files.some((file) => file.name === "remove.jpg")).toBe(false);
});
