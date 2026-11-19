import { expect, test } from "@playwright/test";

test("room and floor controls share selection and reset to the building", async ({
  page,
}) => {
  await page.goto("/");
  const studio = page.getByRole("region", { name: "Studio preview" });
  const index = page.getByRole("region", {
    name: "Two floors. Different frames.",
  });
  const selection = studio.getByRole("status", { name: "Studio selection" });
  const floor = studio.getByRole("button", { name: "Floor 2" });
  const room = index.getByRole("button", {
    name: "DIY Self Photo",
    exact: true,
  });

  await expect(selection).toHaveText("Building overview");
  await room.focus();
  await page.keyboard.press("Enter");
  await expect(room).toHaveAttribute("aria-pressed", "true");
  await expect(floor).toHaveAttribute("aria-pressed", "true");
  await expect(selection).toHaveText("DIY Self Photo");
  await expect(index.getByRole("status")).toHaveText(
    /DIY Self Photo\s*Floor 2/,
  );
  await floor.click();
  await expect(room).toHaveAttribute("aria-pressed", "false");
  await expect(selection).toHaveText("Floor 2");
  await studio.getByRole("button", { name: "Back to building" }).click();
  await expect(floor).toHaveAttribute("aria-pressed", "false");
  await expect(selection).toHaveText("Building overview");
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the room index still lists all twelve entries", async ({ page }) => {
    await page.goto("/#rooms");
    const index = page.getByRole("region", {
      name: "Two floors. Different frames.",
    });
    await expect(index.getByRole("listitem")).toHaveCount(12);
    await expect(index.getByRole("heading", { name: "Floor 1" })).toBeVisible();
    await expect(index.getByRole("heading", { name: "Floor 2" })).toBeVisible();
  });
});
