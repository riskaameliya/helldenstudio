import { expect, test } from "@playwright/test";

test("editorial sections and navigation work without JavaScript", async ({
  browser,
}) => {
  const page = await browser.newPage({
    javaScriptEnabled: false,
    viewport: { width: 360, height: 800 },
  });
  try {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Main navigation" });
    for (const [label, hash] of [
      ["Studio", "studio-preview"],
      ["Rooms", "rooms"],
      ["Gallery", "gallery"],
      ["Booking", "booking"],
    ]) {
      await nav.getByRole("link", { name: label, exact: true }).click();
      await expect(page).toHaveURL(new RegExp("#" + hash + "$"));
      await expect(page.locator("#" + hash)).toBeVisible();
    }
    await expect(page.locator("main section")).toHaveCount(6);
    await page.getByRole("link", { name: "Back to top" }).click();
    await expect(page).toHaveURL(/#top$/);
  } finally {
    await page.close();
  }
});
