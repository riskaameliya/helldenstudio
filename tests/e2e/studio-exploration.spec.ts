import { expect, test } from "@playwright/test";

test("room and floor controls share selection and reset to the building", async ({
  page,
}) => {
  await page.goto("/");
  const studio = page.getByRole("region", { name: "Studio map" });
  const selection = studio.getByRole("status", { name: "Studio selection" });
  const floor = studio.getByRole("button", { name: "Floor 2" });
  const rooms = studio.getByLabel("Room on map");

  await expect(selection).toHaveText("Building overview");
  await rooms.selectOption("diy_self_photo_l2");
  await expect(floor).toHaveAttribute("aria-pressed", "true");
  await expect(selection).toHaveText("DIY Self Photo Passport · Floor 2");
  await floor.click();
  await expect(rooms).toHaveValue("");
  await expect(selection).toHaveText("Floor 2");
  await studio.getByRole("button", { name: "Whole building" }).click();
  await expect(floor).toHaveAttribute("aria-pressed", "false");
  await expect(selection).toHaveText("Building overview");
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the map keeps the twelve room names in the two floor groups", async ({
    page,
  }) => {
    await page.goto("/#studio-preview");
    const rooms = page.getByLabel("Room on map");
    await expect(rooms).toBeVisible();
    await expect(rooms.locator("optgroup[label='Floor 1'] option")).toHaveCount(
      9,
    );
    await expect(rooms.locator("optgroup[label='Floor 2'] option")).toHaveCount(
      3,
    );
  });
});
