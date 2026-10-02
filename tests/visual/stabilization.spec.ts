import { expect, type Page, test } from "@playwright/test";

async function openStory(page: Page, id: string) {
  await page.goto(`/iframe.html?id=${id}&viewMode=story`);
  await page.waitForLoadState("networkidle");
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        caret-color: transparent !important;
        transition-duration: 0s !important;
      }
    `,
  });
  await expect(page.locator("#storybook-root")).toBeVisible();
}

test("action and filter controls stay stable across themes", async ({
  page,
}) => {
  await page.setViewportSize({ height: 980, width: 1440 });
  await openStory(page, "compositions-filter-toolbar--light-and-dark");
  await expect(page).toHaveScreenshot("filter-toolbar-themes.png", {
    fullPage: true,
  });

  await openStory(page, "primitives-button--light-and-dark");
  await expect(page).toHaveScreenshot("action-controls-themes.png", {
    fullPage: true,
  });
});

test("badge stays stable across themes", async ({ page }) => {
  await page.setViewportSize({ height: 980, width: 1440 });
  await openStory(page, "primitives-badge--light-and-dark");
  await expect(page).toHaveScreenshot("badge-themes.png", {
    fullPage: true,
  });
});

test("tooltip placement stays stable in the reference state", async ({
  page,
}) => {
  await page.setViewportSize({ height: 820, width: 1280 });
  await openStory(page, "primitives-tooltip--light-and-dark");
  await expect(page).toHaveScreenshot("tooltip-open-themes.png", {
    fullPage: true,
  });
});

test("console shell stays stable at desktop and narrow widths", async ({
  page,
}) => {
  await page.setViewportSize({ height: 1100, width: 1440 });
  await openStory(page, "layout-console-shell--light-and-dark");
  await expect(page).toHaveScreenshot("console-shell-desktop.png", {
    fullPage: true,
  });

  await page.setViewportSize({ height: 844, width: 390 });
  await openStory(page, "layout-console-shell--narrow");
  await expect(page).toHaveScreenshot("console-shell-narrow.png", {
    fullPage: true,
  });
});

test("button interaction states stay stable", async ({ page }) => {
  await page.setViewportSize({ height: 980, width: 1440 });
  await openStory(page, "primitives-button--light-and-dark");

  const primary = page.getByRole("button", { name: "Run checks" }).first();
  await primary.hover();
  await expect(page).toHaveScreenshot("button-hover-light.png", {
    fullPage: true,
  });

  await page.mouse.down();
  await expect(page).toHaveScreenshot("button-active-light.png", {
    fullPage: true,
  });
  await page.mouse.up();

  await openStory(page, "primitives-button--light-and-dark");
  const focusedPrimary = page
    .getByRole("button", { name: "Run checks" })
    .first();
  await page.keyboard.press("Tab");
  await expect(focusedPrimary).toBeFocused();
  await expect(page).toHaveScreenshot("button-focus-light.png", {
    fullPage: true,
  });
});
