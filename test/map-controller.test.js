const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const { loadScriptsIntoWindow } = require("./helpers/load-browser-scripts");

const registryScript = path.join(
  __dirname,
  "..",
  "assets",
  "js",
  "country-registry.js",
);
const resolverScript = path.join(
  __dirname,
  "..",
  "assets",
  "js",
  "country-resolver.js",
);
const mapControllerScript = path.join(
  __dirname,
  "..",
  "assets",
  "js",
  "map-controller.js",
);

function createController(countryData = {}) {
  const window = loadScriptsIntoWindow([
    registryScript,
    resolverScript,
    mapControllerScript,
  ]);
  return window.MapController.createMapController({
    countryRegistry: window.CountryRegistry,
    countryResolver: window.CountryResolver,
    getCountryData: () => countryData,
    loadDashboardData: async () => ({ projects: [] }),
    openDashboard: () => {},
  });
}

test("map controller exposes country code lookup through the registry", () => {
  const controller = createController();

  assert.equal(controller.getCountryCode("USA"), "US");
  assert.equal(controller.getCountryCode("United States"), "US");
  assert.equal(controller.getCountryCode("South-Korea"), "KR");
});

test("map controller renders country tags only for countries with project data", () => {
  const controller = createController({
    Argentina: { hasProjects: true, visited: true },
    USA: { hasProjects: false },
    "South Korea": { hasProjects: false },
  });

  const markup = controller.renderCountryTags();

  assert.match(markup, /data-country="Argentina"/);
  assert.match(markup, /country-tag visited/);
  assert.doesNotMatch(markup, /data-country="USA"/);
  assert.doesNotMatch(markup, /data-country="South Korea"/);
  assert.doesNotMatch(markup, /no-project-data/);
  assert.doesNotMatch(markup, /No recorded data yet/);
});
