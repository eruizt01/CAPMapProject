const { test, expect } = require("@playwright/test");

test("direct country dashboard renders and supports a basic view toggle", async ({
  page,
}) => {
  await page.goto("/Countries/Argentina.html");

  await expect(page.locator('[data-testid="dashboard-root"]')).toBeVisible();
  await expect(page.locator("#search-filter")).toBeVisible();

  await page.locator('.view-btn[data-view="cards"]').click();

  await expect(page.locator(".project-list-cards")).toBeVisible();
  await expect(page.locator(".project-card").first()).toBeVisible();
});

test("dashboard explains filtered project counts separately from total count", async ({
  page,
}) => {
  await page.goto("/Countries/Argentina.html");

  await expect(page.locator(".total-projects")).toHaveText("5");
  await expect(
    page.locator('[data-testid="visible-projects-summary"]'),
  ).toHaveText("Showing 3 projects from 2023");
  await expect(page.locator(".project-table tbody tr")).toHaveCount(3);
});

test("dashboard print button names the browser print behavior", async ({
  page,
}) => {
  await page.goto("/Countries/Argentina.html");

  await expect(page.locator("#export-pdf")).toContainText(
    "Print / Save as PDF",
  );
});

test("country dashboard table owns horizontal overflow on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/Countries/Argentina.html");

  await expect(page.locator('[data-testid="dashboard-root"]')).toBeVisible();
  const overflow = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
    tableClientWidth: document.querySelector(".project-table").clientWidth,
    tableScrollWidth: document.querySelector(".project-table").scrollWidth,
  }));

  expect(overflow.documentWidth).toBeLessThanOrEqual(overflow.viewportWidth);
  expect(overflow.tableScrollWidth).toBeGreaterThan(overflow.tableClientWidth);
});

test("dashboard renders generated project text without interpreting HTML", async ({
  page,
}) => {
  await page.route("**/Countries/assets/country-dashboard-data.js", (route) =>
    route.fulfill({
      contentType: "application/javascript",
      body: `
        (function (window) {
          window.CountryDashboardData = Object.freeze({
            Argentina: {
              projects: [{
                id: "malicious-project",
                name: "<img src=x onerror=alert(1)>",
                category: "Document Management",
                report: "1st. Annual Report",
                year: 2024,
                details: "<img src=x onerror=alert(1)>"
              }]
            }
          });
        })(window);
      `,
    }),
  );

  await page.goto("/Countries/Argentina.html");

  await expect(
    page.getByText("<img src=x onerror=alert(1)>").first(),
  ).toBeVisible();
  await expect(page.locator('img[src="x"]')).toHaveCount(0);
});
