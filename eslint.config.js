module.exports = [
  {
    ignores: ["node_modules/**", "playwright-report/**", "test-results/**"],
  },
  {
    files: ["assets/js/**/*.js", "Countries/assets/**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "script",
      globals: {
        Blob: "readonly",
        URL: "readonly",
        console: "readonly",
        document: "readonly",
        navigator: "readonly",
        setTimeout: "readonly",
        window: "readonly",
      },
    },
    rules: {
      eqeqeq: ["error", "always", { null: "ignore" }],
      "no-implied-eval": "error",
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
  {
    files: ["test/**/*.js", "*.config.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "commonjs",
      globals: {
        __dirname: "readonly",
        module: "readonly",
        process: "readonly",
        require: "readonly",
      },
    },
    rules: {
      eqeqeq: ["error", "always", { null: "ignore" }],
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
];
