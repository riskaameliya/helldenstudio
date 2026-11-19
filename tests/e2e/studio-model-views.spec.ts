import { expect, test } from "@playwright/test";

test("changing the selection changes the rendered model and returns to the overview", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 820 });
  await page.goto("/");
  const studio = page.getByRole("region", { name: "Studio map" });
  const canvas = studio.locator("canvas");
  await studio.getByRole("button", { name: "Open 3D map" }).click();
  await expect(
    studio.getByRole("status", { name: "3D preview status" }),
  ).toHaveText("Studio model loaded.");
  const overview = await canvas.screenshot();
  await studio.getByRole("button", { name: "Floor 1" }).click();
  await expect
    .poll(async () => (await canvas.screenshot()).equals(overview))
    .toBe(false);
  const lower = await canvas.screenshot();
  await studio.getByRole("button", { name: "Floor 2" }).click();
  await expect
    .poll(async () => (await canvas.screenshot()).equals(lower))
    .toBe(false);
  const upper = await canvas.screenshot();
  await studio.getByLabel("Room on map").selectOption("diy_self_photo_l2");
  await expect
    .poll(async () => (await canvas.screenshot()).equals(upper))
    .toBe(false);
  await studio.getByRole("button", { name: "Whole building" }).click();
  await expect
    .poll(async () => (await canvas.screenshot()).equals(overview))
    .toBe(true);
});

test("choosing a floor with WebGL disabled keeps the room controls usable", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = new Proxy(original, {
      apply(target, canvas, args) {
        if (typeof args[0] === "string" && args[0].includes("webgl"))
          return null;
        return Reflect.apply(target, canvas, args);
      },
    });
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Floor 1" }).click();
  await expect(
    page.getByRole("status", { name: "3D preview status" }),
  ).toHaveText("The 3D map is unavailable.");
  await page.getByLabel("Room on map").selectOption("cinema_l1");
  await expect(
    page.getByRole("status", { name: "Studio selection" }),
  ).toHaveText("Cinema · Floor 1");
});

test("losing the renderer context preserves room selection and HTML controls", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const studio = page.getByRole("region", { name: "Studio map" });
  await studio.getByRole("button", { name: "Floor 2" }).click();
  const status = studio.getByRole("status", { name: "3D preview status" });
  await expect(status).toHaveText("Studio model loaded.");
  const contextLost = await studio.locator("canvas").evaluate((element) => {
    const extension = (element as HTMLCanvasElement)
      .getContext("webgl2")
      ?.getExtension("WEBGL_lose_context");
    extension?.loseContext();
    return Boolean(extension);
  });
  expect(contextLost).toBe(true);
  await expect(status).toHaveText("The 3D map is unavailable.");
  await expect(studio.getByRole("button", { name: "Floor 2" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await studio.getByLabel("Room on map").selectOption("diy_self_photo_l2");
  await expect(
    studio.getByRole("status", { name: "Studio selection" }),
  ).toHaveText("DIY Self Photo · Floor 2");
});
