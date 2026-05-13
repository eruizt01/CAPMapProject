const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function createWindowStub(overrides = {}) {
  const window = {
    console,
    ...overrides,
  };

  window.window = window;
  return window;
}

function loadScriptsIntoWindow(scriptPaths, windowOverrides = {}) {
  const window = createWindowStub(windowOverrides);
  const context = vm.createContext({ window, console });

  scriptPaths.forEach((scriptPath) => {
    const absolutePath = path.resolve(scriptPath);
    const source = fs.readFileSync(absolutePath, "utf8");
    vm.runInContext(source, context, { filename: absolutePath });
  });

  return window;
}

module.exports = {
  loadScriptsIntoWindow,
};
