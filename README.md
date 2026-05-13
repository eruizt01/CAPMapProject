# CAPMapProject

CAPMapProject is a static, no-build-step web app for exploring computational antitrust initiatives by jurisdiction. The main screen renders an interactive world map. It includes recorded initiatives for 40 jurisdictions, with additional jurisdiction pages prepared for future data.

## Local Run

Install dependencies:

```bash
npm ci
```

Run the local static server used by the smoke tests:

```bash
node test/helpers/static-server.js
```

Then open:

```text
http://127.0.0.1:4173/CAPMap.html
```

Individual jurisdiction dashboards are available under `Countries/`, for example:

```text
http://127.0.0.1:4173/Countries/Argentina.html
```

## Test Commands

```bash
npm test
npm run lint
npm run format:check
npm run test:smoke
```

`npm test` runs unit tests with Node's built-in test runner. `npm run test:smoke` runs Playwright against the local static server configured in `playwright.config.js`.

## Architecture Overview

- `CAPMap.html` renders the global map and loads the browser-side map runtime.
- `assets/js/country-registry.js` defines canonical country metadata, aliases, page paths, ISO codes, and map target mappings.
- `assets/js/country-resolver.js` maps SVG attributes to canonical countries.
- `assets/js/map-controller.js` controls map interaction, country highlighting, tooltips, and navigation to country dashboard pages.
- `Countries/*.html` are jurisdiction dashboard pages with a shared page shell.
- `Countries/assets/country-dashboard-data.js` contains generated dashboard data used by the jurisdiction pages.
- `Countries/assets/country-dashboard.js` renders dashboard tables, cards, filters, modals, exports, and charts.
- `Countries/assets/country-dashboard.css` provides the shared jurisdiction dashboard styling.

## Data Source Note

The dashboard dataset is committed as generated JavaScript in `Countries/assets/country-dashboard-data.js`. Project records include report year, jurisdiction, agency, project category, practice area, software, notes, and details where available. The current generated dataset has recorded project data for 40 jurisdictions and prepared no-data pages for 13 additional jurisdictions. Some rows reflect missing or incomplete source fields from the generated dataset.

## Current Limitations

- Some jurisdiction pages are prepared for future data and currently show no recorded initiatives.
- Chart.js is currently loaded from a CDN rather than bundled locally.
- Accessibility has not yet received a full remediation pass.
- The project intentionally remains a static no-build-step app.
