const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./test/smoke",
  timeout: 30000,
  use: {
    baseURL: "http://127.0.0.1:4173",
  },
  webServer: {
    command: "node test/helpers/static-server.js",
    port: 4173,
    reuseExistingServer: !process.env.CI,
  },
});
