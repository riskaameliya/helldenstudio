import { expect, test } from "@playwright/test";

for (const width of [360, 768, 1440]) {
  test(`the page stays within the viewport and exposes keyboard focus at ${width}px`, async ({
    page,
    browserName,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    // macOS WebKit uses Option+Tab to include links in keyboard navigation.
    await page.keyboard.press(
      browserName === "webkit" && process.platform === "darwin"
        ? "Alt+Tab"
        : "Tab",
    );
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await expect(skip).toHaveCSS("outline-style", "solid");
    await page.keyboard.press("Enter");
    await expect(page.getByRole("main")).toBeFocused();

    const title = page.getByRole("heading", { level: 1 });
    await expect(title).toHaveCount(1);
    await expect(title).toHaveCSS("text-transform", "uppercase");
    await expect(title).toHaveCSS("font-family", /Barlow Condensed/);
    expect(
      await title.evaluate((element) =>
        parseFloat(getComputedStyle(element).fontSize),
      ),
    ).toBeGreaterThanOrEqual(64);
    expect(
      await title.evaluate((element) => element.getBoundingClientRect().right),
    ).toBeLessThanOrEqual(width);
    await expect(
      page.getByRole("main").getByRole("heading", { level: 2 }),
    ).toHaveCount(5);
    await expect(page.getByRole("contentinfo")).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
  });
}
