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

function loadRegistry() {
  return loadScriptsIntoWindow([registryScript]).CountryRegistry;
}

test("supported country lookup includes expected canonical entries", () => {
  const registry = loadRegistry();
  const supported = registry.getSupportedCountryNames();

  assert.ok(supported.includes("USA"));
  assert.ok(supported.includes("European Union"));
  assert.ok(supported.includes("South Korea"));
  assert.ok(!supported.includes("United States"));
});

test("alias normalization resolves grouped and alternate names", () => {
  const registry = loadRegistry();

  assert.equal(registry.normalizeCountryName("US"), "USA");
  assert.equal(registry.normalizeCountryName("United States"), "USA");
  assert.equal(
    registry.normalizeCountryName("United States of America"),
    "USA",
  );
  assert.equal(registry.normalizeCountryName("Alaska"), "USA");
  assert.equal(registry.normalizeCountryName("South-Korea"), "South Korea");
  assert.equal(registry.normalizeCountryName("New-Zealand"), "New Zealand");
  assert.equal(registry.normalizeCountryName("Türkiye"), "Turkey");
  assert.equal(registry.normalizeCountryName("Bahamas"), "Caribbean Community");
});

test("map target lookup preserves explicit special-case associations", () => {
  const registry = loadRegistry();

  assert.deepEqual([...registry.getCountryMapTargets("Catalonia")], ["Spain"]);
  assert.deepEqual(
    [...registry.getCountryMapTargets("Caribbean Community")],
    ["Caribbean Community"],
  );
});

test("ISO and page path lookup use canonical country records", () => {
  const registry = loadRegistry();

  assert.equal(registry.getCountryIsoCode("USA"), "US");
  assert.equal(registry.getCountryIsoCode("United Kingdom"), "GB");

  const pageMap = registry.getCountryPageMap();
  assert.equal(pageMap.USA, "Countries/USA.html");
  assert.equal(pageMap["European Union"], "Countries/European-Union.html");
  assert.equal(pageMap["South Africa"], "Countries/South-Africa.html");
});

test("buildCountryPageConfig merges registry defaults with overrides", () => {
  const registry = loadRegistry();

  const argentinaConfig = registry.buildCountryPageConfig("Argentina", {
    projects: [{ name: "Mordelon", year: 2022 }],
  });
  assert.equal(argentinaConfig.country, "Argentina");
  assert.equal(argentinaConfig.isoCode, "AR");
  assert.deepEqual(
    { ...argentinaConfig.yearDownloads },
    {
      2022: "Reports/Argentina - 1st. Report.pdf",
    },
  );
  assert.equal(argentinaConfig.projects.length, 1);

  const brazilConfig = registry.buildCountryPageConfig("Brazil", {
    yearDownloads: { 2025: "Reports/custom.pdf" },
  });
  assert.deepEqual(
    { ...brazilConfig.yearDownloads },
    {
      2025: "Reports/custom.pdf",
    },
  );
});
