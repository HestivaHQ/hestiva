import { expect, test } from "@playwright/test";

test("quote success notice stays visible until the customer closes it", async ({ page }) => {
  await page.goto("/quote");
  await expect(page.getByRole("heading", { name: "Tell us about your home." })).toBeVisible();

  await page.evaluate(() => {
    window.alert(
      "Your request has been sent successfully. Reference: HOM-PERSISTENCE-TEST. A confirmation email has been sent.",
    );
  });

  const notice = page.locator("#homent-form-notice");
  await expect(notice).toContainText("Homent — Request received");
  await expect(notice).toContainText("HOM-PERSISTENCE-TEST");

  await page.waitForTimeout(8500);
  await expect(notice).toBeVisible();

  await page.getByRole("button", { name: "Close notification" }).click();
  await expect(notice).toHaveCount(0);
});
