import { expect, test } from "@playwright/test";

test("studio lights apply to every page section and can be toggled from the footer", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const footerLights = page
    .getByRole("contentinfo")
    .getByRole("button", { name: "Studio lights" });
  const readLights = () =>
    page
      .locator("[data-light-surface]")
      .evaluateAll((surfaces) =>
        surfaces.map((surface) => getComputedStyle(surface, "::after").opacity),
      );

  await expect.poll(readLights).toEqual(Array(7).fill("0"));
  await expect(footerLights).toHaveAttribute("aria-pressed", "false");

  const manifesto = page.getByRole("region", {
    name: "Make a frame of your own.",
  });
  const unlitManifesto = await manifesto.screenshot();

  await footerLights.focus();
  await page.keyboard.press("Space");
  await expect(footerLights).toHaveAttribute("aria-pressed", "true");
  await expect.poll(readLights).toEqual(Array(7).fill("1"));
  const litManifesto = await manifesto.screenshot();
  expect(litManifesto.equals(unlitManifesto)).toBe(false);

  await footerLights.click();
  await expect(footerLights).toHaveAttribute("aria-pressed", "false");
  await expect.poll(readLights).toEqual(Array(7).fill("0"));

  await expect(
    page.getByRole("link", { name: "@helldenstudio on Instagram" }),
  ).toHaveAttribute("href", "https://www.instagram.com/helldenstudio/");
  await expect(
    page.getByRole("link", { name: "Contact Hellden on Instagram" }),
  ).toHaveAttribute("href", "https://www.instagram.com/helldenstudio/");
});

test("desktop pointer lighting moves between sections", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Studio lights" }).click();
  const manifesto = page.getByRole("region", {
    name: "Make a frame of your own.",
  });
  const booking = page.getByRole("region", { name: "Book a session" });
  await manifesto.hover();
  await expect
    .poll(() =>
      manifesto.evaluate((element) =>
        (element as HTMLElement).style.getPropertyValue("--light-x"),
      ),
    )
    .toMatch(/px$/);
  await booking.hover();
  await expect
    .poll(() =>
      booking.evaluate((element) =>
        (element as HTMLElement).style.getPropertyValue("--light-x"),
      ),
    )
    .toMatch(/px$/);
  await expect
    .poll(() =>
      manifesto.evaluate((element) =>
        (element as HTMLElement).style.getPropertyValue("--light-x"),
      ),
    )
    .toBe("");
});
