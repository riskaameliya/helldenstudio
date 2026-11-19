import { expect, test } from "@playwright/test";
import { studioModelPath } from "../../src/features/studio-anatomy/lib/studio-model";

test("the entrance leads into the 3D tour and room stops can be inspected", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 850 });
  const requests: string[] = [];
  page.on("request", (request) => {
    if (request.url().endsWith(studioModelPath)) requests.push(request.url());
  });
  await page.goto("/");
  const tour = page.getByRole("region", { name: "Enter the Hellden Universe" });
  const canvas = tour.locator("canvas");
  const chooseRoom = tour.getByText("Choose a room", { exact: true });
  const nav = tour.getByRole("navigation", { name: "Walkthrough stops" });
  await expect(tour.getByText("Hellden Studio entrance")).toBeVisible();
  expect(requests).toHaveLength(0);
  await page.evaluate(() => window.scrollTo(0, 260));
  await expect(
    tour.getByRole("status", { name: "Walkthrough view" }),
  ).toHaveText("Walkthrough view loaded.");
  expect(requests).toHaveLength(1);

  // Keep scroll position fixed while sampling the sticky viewport.
  const stageShot = () =>
    page.screenshot({ clip: { x: 680, y: 160, width: 330, height: 280 } });
  const corridor = await stageShot();
  await chooseRoom.click();
  await nav.getByRole("link", { name: "Cinema", exact: true }).click();
  await expect(page).toHaveURL(/#tour-cinema_l1$/);
  await expect(canvas).toBeVisible();
  const cinema = page.locator("#tour-cinema_l1");
  await expect(
    cinema.getByRole("heading", { name: "Cinema" }),
  ).toBeInViewport();
  await expect
    .poll(async () => (await stageShot()).equals(corridor))
    .toBe(false);
  await cinema.getByText("Look around", { exact: true }).click();
  await expect(cinema.getByText(/screen and rows of seats/)).toBeVisible();
  await chooseRoom.click();
  await nav.getByRole("link", { name: "Entrance", exact: true }).click();
  await expect(page).toHaveURL(/#tour-entrance$/);
  await expect(tour.getByRole("heading", { level: 1 })).toBeInViewport();
});

test("room chapters and gallery links are available when the walkthrough model fails", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route(`**${studioModelPath}`, (route) => route.abort());
  await page.goto("/");
  await page.getByRole("link", { name: "Enter studio" }).click();
  await expect(page).toHaveURL(/#tour-portrait_l1$/);
  await expect(
    page.getByRole("status", { name: "Walkthrough view" }),
  ).toHaveText(/3D is unavailable/);
  const portrait = page.locator("#tour-portrait_l1");
  await portrait.getByText("Look around", { exact: true }).click();
  await expect(
    portrait.getByText(/backdrop and studio lighting/),
  ).toBeVisible();
  await portrait.getByRole("link", { name: "See studio photos" }).click();
  await expect(
    page.getByRole("link", { name: "@helldenstudio on Instagram" }),
  ).toBeInViewport();
});

test("scroll opens the door before showing the corridor and closes it on return", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1200, height: 800 });
  await page.goto("/");
  const tour = page.getByRole("region", { name: "Enter the Hellden Universe" });
  const door = tour.getByTestId("entrance-door-leaf");
  const angle = () =>
    tour.evaluate(
      (element) =>
        parseFloat(
          getComputedStyle(element).getPropertyValue("--door-angle"),
        ) || 0,
    );
  const scrollEntrance = (fraction: number) =>
    page.locator("#tour-entrance").evaluate((chapter, position) => {
      window.scrollBy(
        0,
        chapter.getBoundingClientRect().top +
          chapter.getBoundingClientRect().height * position,
      );
    }, fraction);

  await expect.poll(angle).toBe(0);
  const closed = await door.evaluate(
    (element) => getComputedStyle(element).transform,
  );
  await scrollEntrance(0.11);
  await expect.poll(angle).toBeCloseTo(48, 0);
  await expect(door).not.toHaveCSS("transform", closed);
  await expect(tour.locator("[data-ready]")).toHaveCSS("opacity", "0");
  await scrollEntrance(0.42);
  await expect(tour.locator("[data-ready]")).toHaveCSS("opacity", "1");
  await expect.poll(angle).toBe(96);
  await page.evaluate(() => scrollTo(0, 0));
  await expect.poll(angle).toBe(0);
  await expect(door).toHaveCSS("transform", closed);
});
