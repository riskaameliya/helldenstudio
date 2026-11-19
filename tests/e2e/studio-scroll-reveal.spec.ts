import { expect, test } from "@playwright/test";
import { studioModelPath } from "../../src/features/studio-anatomy/lib/studio-model";

test("the desktop reveal follows scroll until a manual selection takes over", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });

  // Preserve the test framebuffer so reading it does not scroll the page.
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = new Proxy(getContext, {
      apply(target, canvas, args) {
        if (args[0] === "webgl2")
          args[1] = { ...args[1], preserveDrawingBuffer: true };
        return Reflect.apply(target, canvas, args);
      },
    });
  });
  let modelRequests = 0;
  page.on("request", (request) => {
    if (request.url().endsWith(studioModelPath)) modelRequests++;
  });
  await page.goto("/");
  expect(modelRequests).toBe(0);

  const studio = page.getByRole("region", { name: "Studio map" });
  const previewStatus = studio.getByRole("status", {
    name: "3D preview status",
  });
  const canvas = studio.locator("canvas");
  const readFrame = () =>
    canvas.evaluate((element) => (element as HTMLCanvasElement).toDataURL());
  await studio.evaluate((element) => {
    const stage = element.querySelector(
      "[aria-label='3D preview status']",
    )?.parentElement;
    if (!stage) throw new Error("Missing studio stage");
    window.scrollBy(0, stage.getBoundingClientRect().top - innerHeight * 0.96);
  });
  await expect(previewStatus).toHaveText("Studio model loaded.");
  expect(modelRequests).toBe(1);

  const scrollToStage = (fraction: number) =>
    canvas.evaluate((element, position) => {
      window.scrollBy(
        0,
        element.getBoundingClientRect().top - innerHeight * position,
      );
    }, fraction);

  const arrival = await readFrame();
  await scrollToStage(0.34);
  await expect.poll(readFrame).not.toBe(arrival);
  const overview = await readFrame();
  await scrollToStage(0.96);
  await expect.poll(readFrame).toBe(arrival);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(readFrame).toBe(overview);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect.poll(readFrame).toBe(arrival);

  await studio.getByRole("button", { name: "Floor 1" }).click();
  await studio.getByRole("button", { name: "Floor 2" }).click();
  await studio.getByRole("button", { name: "Whole building" }).click();
  await expect.poll(readFrame).toBe(overview);
  await scrollToStage(0.34);
  await scrollToStage(0.96);
  await expect.poll(readFrame).toBe(overview);
});
