const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const { loadScriptsIntoWindow } = require("./helpers/load-browser-scripts");

const dashboardScript = path.join(
  __dirname,
  "..",
  "Countries",
  "assets",
  "country-dashboard.js",
);

function loadDashboardRuntime() {
  return loadScriptsIntoWindow([dashboardScript]).CountryDashboard;
}

test("CSV export escapes quotes inside cells", () => {
  const dashboard = loadDashboardRuntime();
  const csv = dashboard.buildProjectsCSV([
    {
      name: "Selene",
      category: "Web Scraping",
      report: "4th Annual Report",
      year: 2025,
      agency: "CMA",
      details: '"Selene": open-sourced Python web-scraping package',
    },
  ]);

  assert.match(csv, /"""Selene"": open-sourced Python web-scraping package"/);
});
