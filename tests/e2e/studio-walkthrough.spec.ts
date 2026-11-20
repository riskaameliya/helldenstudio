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
  await expect(
    tour.getByRole("status", { name: "Walkthrough view" }),
  ).toHaveText("Walkthrough view loaded.");
  expect(requests).toHaveLength(1);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  await expect(canvas).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 260));

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
    cinema.getByRole("heading", { name: "Hellden Cinema" }),
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
  let releaseModel!: () => void;
  const modelDelay = new Promise<void>((resolve) => {
    releaseModel = resolve;
  });
  await page.route(`**${studioModelPath}`, async (route) => {
    await modelDelay;
    await route.continue();
  });
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
  await expect.poll(angle).toBe(96);
  await expect(tour.locator("[data-ready]")).toHaveCSS("opacity", "0");
  releaseModel();
  await expect(tour.locator("[data-ready]")).toHaveCSS("opacity", "1");
  await page.evaluate(() => scrollTo(0, 0));
  await expect.poll(angle).toBe(0);
  await expect(door).toHaveCSS("transform", closed);
});

test("the stairs lead to the upper floor and the upper sets are reachable from the menu", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 850 });
  await page.goto("/");
  const tour = page.getByRole("region", { name: "Enter the Hellden Universe" });
  const menu = tour.getByText("Choose a room", { exact: true });
  const nav = tour.getByRole("navigation", { name: "Walkthrough stops" });
  await menu.click();
  await nav.getByRole("link", { name: "Stairs", exact: true }).click();
  await expect(page).toHaveURL(/#tour-stairs_l1$/);
  await expect(
    tour.getByRole("status", { name: "Walkthrough view" }),
  ).toHaveText("Walkthrough view loaded.");
  const stageShot = () =>
    page.screenshot({ clip: { x: 740, y: 175, width: 350, height: 350 } });
  const stairs = await stageShot();
  await page.getByRole("link", { name: "Continue upstairs" }).click();
  await expect(page).toHaveURL(/#tour-diy_self_photo_l2$/);
  const diy = page.locator("#tour-diy_self_photo_l2");
  await expect(
    diy.getByRole("heading", { name: "DIY Self Photo Passport" }),
  ).toBeInViewport();
  const passportGallery = diy.getByRole("complementary", {
    name: "DIY Self Photo Passport gallery",
  });
  await expect(passportGallery).toBeVisible();
  await expect(passportGallery.getByRole("img")).toHaveCount(3);

  await expect
    .poll(() =>
      passportGallery
        .getByRole("img")
        .evaluateAll((photos) =>
          photos.every(
            (photo) =>
              photo instanceof HTMLImageElement &&
              photo.complete &&
              photo.naturalWidth > 0,
          ),
        ),
    )
    .toBe(true);
  await expect(diy.getByText("Floor 2", { exact: true })).toBeInViewport();
  await expect.poll(async () => (await stageShot()).equals(stairs)).toBe(false);

  await menu.click();
  await nav
    .getByRole("link", { name: "Self Photo Passport", exact: true })
    .click();
  const portrait = page.locator("#tour-self_photo_portrait_l2");
  await expect(
    portrait.getByRole("heading", { name: "Self Photo Passport" }),
  ).toBeInViewport();
  await expect(portrait.getByText("40k/session")).toBeVisible();
  await expect(portrait.getByText("+15k for DIY passport")).toBeVisible();
  const gallery = portrait.getByRole("complementary", {
    name: "Self Photo Passport gallery",
  });
  await expect(gallery).toBeVisible();
  await expect(gallery.getByRole("img")).toHaveCount(3);
  await expect
    .poll(() =>
      gallery
        .getByRole("img")
        .evaluateAll((images) =>
          images.every(
            (image) =>
              image instanceof HTMLImageElement &&
              image.complete &&
              image.naturalWidth > 0,
          ),
        ),
    )
    .toBe(true);
  await portrait.getByText("Look around", { exact: true }).click();
  await expect(
    portrait.getByText(/backdrop, camera, and studio lights/),
  ).toBeVisible();
});

test("Hellden Portrait displays its price, inclusions, and three supplied photos", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 820 });
  await page.goto("/#tour-portrait_l1");
  const portrait = page.locator("#tour-portrait_l1");
  const panel = portrait.getByRole("complementary", {
    name: "Hellden Portrait gallery",
  });
  const titleCard = portrait
    .getByRole("heading", { name: "Hellden Portrait" })
    .locator("..");
  await expect(titleCard.getByText("35k/session")).toBeVisible();
  await expect(titleCard.getByText("Look around")).toBeHidden();
  await expect(panel.getByText("35k/session")).toHaveCount(0);
  await expect(
    portrait
      .getByRole("list", { name: "Session inclusions" })
      .getByRole("listitem"),
  ).toHaveText([
    "No mirror",
    "2 photo strips",
    "Unlimited retakes",
    "All soft files included",
  ]);
  await expect(portrait.getByText("Photo, GIF & Live Photo")).toBeVisible();
  const gallery = portrait.getByRole("list", {
    name: "Hellden Portrait examples",
  });
  await gallery.scrollIntoViewIfNeeded();
  await expect(gallery.getByRole("img")).toHaveCount(3);
  await expect
    .poll(() =>
      gallery
        .getByRole("img")
        .evaluateAll((images) =>
          images.every(
            (image) =>
              image instanceof HTMLImageElement &&
              image.complete &&
              image.naturalWidth > 0,
          ),
        ),
    )
    .toBe(true);
  const mobileCard = await titleCard.boundingBox();
  const mobilePanel = await panel.boundingBox();
  expect(mobileCard?.y ?? 0).toBeGreaterThan(
    (mobilePanel?.y ?? 0) + (mobilePanel?.height ?? 0),
  );
  const mobilePhoto = await panel
    .locator('[data-photo-position="active"] img')
    .boundingBox();
  expect(mobilePhoto?.width ?? 0).toBeGreaterThan(190);

  await page.setViewportSize({ width: 1280, height: 850 });
  await expect(titleCard.getByText("Look around")).toBeVisible();
  await expect(panel).toBeVisible();
  const desktopCard = await titleCard.boundingBox();
  const desktopPanel = await panel.boundingBox();
  expect(desktopPanel?.x ?? 0).toBeGreaterThan(
    (desktopCard?.x ?? 0) + (desktopCard?.width ?? 0),
  );
  expect(
    Math.abs(
      desktopPanel!.y +
        desktopPanel!.height / 2 -
        (desktopCard!.y + desktopCard!.height / 2),
    ),
  ).toBeLessThan(2);
});

test("scroll advances each stacked photo before leaving Portrait", async ({
  page,
}) => {
  await page.goto("/#tour-portrait_l1");
  const portrait = page.locator("#tour-portrait_l1");
  const panel = portrait.getByRole("complementary", {
    name: "Hellden Portrait gallery",
    includeHidden: true,
  });
  const photos = panel.locator("[data-gallery-photo]");
  const jumpTo = (fraction: number) =>
    portrait.evaluate((chapter, position) => {
      const layout = chapter.querySelector<HTMLElement>(
        "[data-gallery-layout]",
      )!;
      const hold = (chapter as HTMLElement).offsetHeight - layout.offsetHeight;
      window.scrollBy(0, chapter.getBoundingClientRect().top + hold * position);
    }, fraction);
  await expect(photos.nth(1)).toHaveAttribute("data-photo-position", "active");
  await expect(photos.nth(0)).toHaveAttribute("data-photo-position", "above");
  await expect(photos.nth(2)).toHaveAttribute("data-photo-position", "below");
  const frame = await photos.nth(1).getByRole("img").boundingBox();
  expect(frame).not.toBeNull();
  expect(frame!.width / frame!.height).toBeCloseTo(0.75, 1);
  expect(frame!.height).toBeGreaterThanOrEqual(
    0.5 * (page.viewportSize()?.height ?? 0),
  );
  await expect(panel).toHaveCSS("opacity", "1");
  await jumpTo(0.5);
  await expect(photos.nth(2)).toHaveAttribute("data-photo-position", "active");
  await expect(
    portrait.getByRole("heading", { name: "Hellden Portrait" }),
  ).toBeInViewport();
  await jumpTo(0.85);
  await expect(photos.nth(0)).toHaveAttribute("data-photo-position", "active");
  await jumpTo(1.1);
  await expect(panel).toBeHidden();
  await jumpTo(0.5);
  await expect(photos.nth(2)).toHaveAttribute("data-photo-position", "active");
  await expect(panel).toBeVisible();
});

test("Cinema holds the camera and scrolls all three photos", async ({
  page,
}) => {
  await page.goto("/#tour-cinema_l1");
  const cinema = page.locator("#tour-cinema_l1");
  await expect(
    cinema.getByRole("heading", { name: "Hellden Cinema" }),
  ).toBeVisible();
  await expect(cinema.getByText("40k/session")).toBeVisible();
  await expect(
    cinema
      .getByRole("list", { name: "Session inclusions" })
      .getByRole("listitem"),
  ).toHaveText([
    "No mirror",
    "2 photo strips",
    "Unlimited retakes",
    "All soft files included",
  ]);
  await expect(cinema.getByText("Photo, GIF & Live Photo")).toBeVisible();
  const panel = cinema.getByRole("complementary", { name: "Cinema gallery" });
  const photos = panel.locator("[data-gallery-photo]");
  await expect(panel).toBeVisible();
  await expect(photos).toHaveCount(3);
  await expect(photos.nth(1)).toHaveAttribute("data-photo-position", "active");
  await cinema.evaluate((chapter) => {
    const layout = chapter.querySelector<HTMLElement>("[data-gallery-layout]")!;
    const hold = (chapter as HTMLElement).offsetHeight - layout.offsetHeight;
    window.scrollBy(0, chapter.getBoundingClientRect().top + hold * 0.55);
  });
  await expect(photos.nth(2)).toHaveAttribute("data-photo-position", "active");
  await expect(
    cinema.getByRole("heading", { name: "Hellden Cinema" }),
  ).toBeInViewport();
});

test("Hellden Record shows its session offer and photo stack", async ({
  page,
}) => {
  await page.goto("/#tour-record_l1");
  const record = page.locator("#tour-record_l1");
  await expect(
    record.getByRole("heading", { name: "Hellden Record" }),
  ).toBeInViewport();
  await expect(record.getByText("40k/session")).toBeVisible();
  await expect(
    record
      .getByRole("list", { name: "Session inclusions" })
      .getByRole("listitem"),
  ).toHaveCount(4);
  await expect(record.getByText("Photo, GIF & Live Photo")).toBeVisible();
  const gallery = record.getByRole("complementary", { name: "Record gallery" });
  await expect(gallery).toBeVisible();
  await expect(gallery.getByRole("img")).toHaveCount(3);
});

test("Hellden Express shows its session inclusions and photo stack", async ({
  page,
}) => {
  await page.goto("/#tour-express_l1");
  const express = page.locator("#tour-express_l1");
  await expect(
    express.getByRole("heading", { name: "Hellden Express" }),
  ).toBeInViewport();
  await expect(express.getByText("40k/session")).toBeVisible();
  await expect(
    express
      .getByRole("list", { name: "Session inclusions" })
      .getByRole("listitem"),
  ).toHaveText([
    "No mirror",
    "2 photo strips",
    "Unlimited retakes",
    "All soft files included",
  ]);
  await expect(express.getByText("Photo, GIF & Live Photo")).toBeVisible();
  const gallery = express.getByRole("complementary", {
    name: "Express gallery",
  });
  await expect(gallery).toBeVisible();
  await expect(gallery.getByRole("img")).toHaveCount(3);
  await expect
    .poll(() =>
      gallery
        .getByRole("img")
        .evaluateAll((images) =>
          images.every(
            (image) =>
              image instanceof HTMLImageElement &&
              image.complete &&
              image.naturalWidth > 0,
          ),
        ),
    )
    .toBe(true);
});

test("DIY photography area loads its three photos", async ({ page }) => {
  await page.goto("/#tour-diy_l1");
  const room = page.locator("#tour-diy_l1");
  await expect(room.getByText("Floor 1", { exact: true })).toBeInViewport();
  const gallery = room.getByRole("complementary", {
    name: "DIY photography area gallery",
  });
  await expect(gallery).toBeVisible();
  const photos = gallery.getByRole("img");
  await expect(photos).toHaveCount(3);
  await expect
    .poll(() =>
      photos.evaluateAll((images) =>
        images.every(
          (image) =>
            image instanceof HTMLImageElement &&
            image.complete &&
            image.naturalWidth > 0,
        ),
      ),
    )
    .toBe(true);
});
