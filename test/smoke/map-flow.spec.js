const { test, expect } = require("@playwright/test");

test("CAPMap loads and a supported country opens a usable dashboard", async ({
  page,
}) => {
  await page.goto("/CAPMap.html");

  await expect(page.locator('[data-testid="map-root"]')).toBeVisible();
  await expect(page.locator("#world-map")).toBeVisible();
  await expect(
    page.getByText("Includes recorded initiatives", { exact: false }),
  ).toHaveCount(0);

  await page.locator('.country-tag[data-country="Argentina"]').click();

  await expect(page).toHaveURL(/Countries\/Argentina\.html$/);
  await expect(page.locator('[data-testid="dashboard-root"]')).toBeVisible();
  await expect(page.locator(".country-name")).toHaveText("Argentina");
});

test("CAPMap renders when persisted country data is corrupted", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem("countryData", "{bad json");
  });

  await page.goto("/CAPMap.html");

  await expect(page.locator('[data-testid="map-root"]')).toBeVisible();
  await expect(page.locator("#world-map")).toBeVisible();
  await expect(
    page.locator('.country-tag[data-country="Argentina"]'),
  ).toBeVisible();
  await expect(page.locator('.country-tag[data-country="USA"]')).toHaveCount(0);
});

test("CAPMap renders one SVG path source for supported countries", async ({
  page,
}) => {
  await page.goto("/CAPMap.html");

  await expect(
    page.locator('#world-map path[data-country="Argentina"]'),
  ).toHaveCount(2);
});

test("CAPMap hides prepared pages without project data from the initial map controls", async ({
  page,
}) => {
  await page.goto("/CAPMap.html");

  const usaTag = page.locator('.country-tag[data-country="USA"]');
  const usaPath = page.locator('#world-map path[data-country="USA"]');

  await expect(usaTag).toHaveCount(0);
  await expect(page.getByText("No recorded data yet")).toHaveCount(0);
  await expect(usaPath.first()).not.toHaveClass(/clickable/);
});
