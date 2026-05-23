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

function loadResolver() {
  const window = loadScriptsIntoWindow([registryScript, resolverScript]);
  return window.CountryResolver;
}

test("normalizeCountryInput resolves raw country-like values to canonical keys", () => {
  const resolver = loadResolver();

  assert.equal(resolver.normalizeCountryInput("USA"), "USA");
  assert.equal(resolver.normalizeCountryInput("US"), "USA");
  assert.equal(resolver.normalizeCountryInput("United States"), "USA");
  assert.equal(
    resolver.normalizeCountryInput("United States of America"),
    "USA",
  );
  assert.equal(resolver.normalizeCountryInput("Alaska"), "USA");
  assert.equal(resolver.normalizeCountryInput("GB"), "United Kingdom");
  assert.equal(resolver.normalizeCountryInput("South-Korea"), "South Korea");
});

test("normalizeCountryInput returns null for unsupported or unknown input", () => {
  const resolver = loadResolver();

  assert.equal(resolver.normalizeCountryInput(null), null);
  assert.equal(resolver.normalizeCountryInput(""), null);
  assert.equal(resolver.normalizeCountryInput("Atlantis"), null);
  assert.equal(resolver.normalizeCountryInput("Azerbaijan"), null);
});

test("resolveCountryFromSvgInput respects current SVG attribute priority", () => {
  const resolver = loadResolver();

  assert.equal(
    resolver.resolveCountryFromSvgInput({
      dataCountry: "USA",
      name: "Canada",
      id: "CA",
      className: "Canada",
    }),
    "USA",
  );

  assert.equal(
    resolver.resolveCountryFromSvgInput({
      name: "United States of America",
    }),
    "USA",
  );

  assert.equal(
    resolver.resolveCountryFromSvgInput({
      id: "US",
    }),
    "USA",
  );

  assert.equal(
    resolver.resolveCountryFromSvgInput({
      className: "Alaska",
    }),
    "USA",
  );

  assert.equal(
    resolver.resolveCountryFromSvgInput({
      className: "South-Korea",
    }),
    "South Korea",
  );
});

test("resolveCountryFromSvgInput preserves grouped geography behavior for US paths", () => {
  const resolver = loadResolver();

  const alaskaPath = resolver.resolveCountryFromSvgInput({
    className: "Alaska",
  });
  const mainlandPath = resolver.resolveCountryFromSvgInput({
    dataCountry: "USA",
  });

  assert.equal(alaskaPath, "USA");
  assert.equal(mainlandPath, "USA");
});
