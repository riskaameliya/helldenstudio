import { expect, test } from "@playwright/test";
import { studioModelPath } from "../../src/features/studio-anatomy/lib/studio-model";

test("mobile hero navigates without overflow and respects reduced motion", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const modelRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().endsWith(studioModelPath))
      modelRequests.push(request.url());
  });

  await page.goto("/");
  await expect(page.getByRole("link", { name: "Enter studio" })).toBeInViewport(
    { ratio: 1 },
  );
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Enter the Hellden Universe",
  );
  await page
    .getByRole("region", { name: "Enter the Hellden Universe" })
    .getByRole("link", { name: "Studio map", exact: true })
    .click();
  await expect(page).toHaveURL(/#studio-preview$/);
  await expect(page.getByRole("button", { name: "Open 3D map" })).toBeVisible();
  const layout = await page.evaluate(() => ({
    overflows: document.documentElement.scrollWidth > innerWidth,
    animations: document.getAnimations().length,
  }));
  expect(layout).toEqual({ overflows: false, animations: 0 });
  expect(modelRequests).toHaveLength(0);
});

test("Chromium loads the supplied GLB on demand", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const requests: number[] = [];
  page.on("response", (response) => {
    if (response.url().endsWith(studioModelPath))
      requests.push(response.status());
  });
  await page.getByRole("button", { name: "Open 3D map" }).click();
  await expect(
    page.getByRole("status", { name: "3D preview status" }),
  ).toHaveText("Studio model loaded.");
  await expect(page.locator("canvas")).toBeVisible();
  expect(requests).toEqual([200]);
});

test("a failed model request leaves the preview description available", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  let modelRequested = false;
  await page.route(`**${studioModelPath}`, (route) => {
    modelRequested = true;
    return route.abort();
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Open 3D map" }).click();
  await expect(
    page.getByRole("status", { name: "3D preview status" }),
  ).toHaveText("The 3D map is unavailable.");
  expect(modelRequested).toBe(true);
  await expect(
    page.getByText("A conceptual model of the two-floor studio."),
  ).toBeVisible();
});
