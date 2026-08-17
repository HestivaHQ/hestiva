import { expect, test } from "@playwright/test";

function imageFile(name, mimeType = "image/png", size = 128) {
  return { name, mimeType, buffer: Buffer.alloc(size, 1) };
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

function galleryInput(page) {
  return page.locator('input[type="file"][multiple]');
}

test("valid gallery images appear in selected file state and can be removed", async ({ page }) => {
  await reachPhotos(page);
  await galleryInput(page).setInputFiles([
    imageFile("kitchen.png"),
    imageFile("lounge.jpg", "image/jpeg"),
  ]);

  await expect(page.getByText("kitchen.png", { exact: true })).toBeVisible();
  await expect(page.getByText("lounge.jpg", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Remove kitchen.png" }).click();
  await expect(page.getByText("kitchen.png", { exact: true })).toHaveCount(0);
  await expect(page.getByText("lounge.jpg", { exact: true })).toBeVisible();
});

test("gallery accepts the ten-photo maximum and rejects an eleventh photo", async ({ page }) => {
  await reachPhotos(page);
  await galleryInput(page).setInputFiles(
    Array.from({ length: 10 }, (_, index) => imageFile(`room-${index + 1}.png`)),
  );

  await expect(page.getByRole("button", { name: /^Remove room-/ })).toHaveCount(10);

  await galleryInput(page).setInputFiles(imageFile("room-11.png"));
  await expect(page.getByRole("alert")).toContainText("You can attach up to 10 photos.");
  await expect(page.getByText("room-11.png", { exact: true })).toHaveCount(0);
});

test("unsupported files are rejected without entering selected file state", async ({ page }) => {
  await reachPhotos(page);
  await galleryInput(page).setInputFiles({
    name: "instructions.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("not an image"),
  });

  await expect(page.getByRole("alert")).toContainText(
    "instructions.txt is not a supported image.",
  );
  await expect(page.getByText("instructions.txt", { exact: true })).toHaveCount(0);
});

test("files over 10 MB are rejected without entering selected file state", async ({ page }) => {
  await reachPhotos(page);
  await galleryInput(page).setInputFiles(imageFile("oversized.png", "image/png", 10 * 1024 * 1024 + 1));

  await expect(page.getByRole("alert")).toContainText("oversized.png must be smaller than 10 MB.");
  await expect(page.getByText("oversized.png", { exact: true })).toHaveCount(0);
});

test("selected photos survive forward and back navigation", async ({ page }) => {
  await reachPhotos(page);
  await galleryInput(page).setInputFiles(imageFile("persistent.png"));
  await expect(page.getByText("persistent.png", { exact: true })).toBeVisible();

  await continueTo(page, "Your Details");
  await page.getByRole("button", { name: /Back/i }).click();
  await expect(page.getByRole("heading", { name: "Photos and Notes", exact: true })).toBeVisible();
  await expect(page.getByText("persistent.png", { exact: true })).toBeVisible();
});

test("mobile camera input retains environment capture and image acceptance", async ({ page }) => {
  await reachPhotos(page);
  const cameraInput = page.locator('input[type="file"][capture="environment"]');
  await expect(cameraInput).toHaveAttribute("accept", "image/*");
  await cameraInput.setInputFiles(imageFile("camera.jpg", "image/jpeg"));
  await expect(page.getByText("camera.jpg", { exact: true })).toBeVisible();
});
