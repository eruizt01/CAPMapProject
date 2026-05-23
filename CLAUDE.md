# CAPMapProject — Claude Instructions

## Project Overview
Static HTML/JS interactive world map showcasing computational antitrust projects by country. No build system, no framework — plain HTML, CSS, and vanilla JavaScript. Chart.js is the only external dependency (loaded via CDN).

## Key Files
- `CAPMap.html` — main map page (styles, layout, and JS all in one file)
- `Countries/assets/country-dashboard.js` — dashboard renderer (renderDashboardView, renderIdentityBlock, etc.)
- `Countries/assets/country-dashboard-data.js` — all country data (profiles, agency info, projects)
- `Countries/assets/country-dashboard.css` — dashboard styles
- `assets/js/country-registry.js` — country registry (name → page path, ISO code, etc.)
- `Countries/[Country].html` — one HTML file per jurisdiction

## Data Conventions
- Country profiles are plain strings in `country-dashboard-data.js` — never hardcode content in HTML or JS templates
- Agency logos → `Countries/assets/agency-logos/`
- Country flags → `Countries/assets/flags/` (only for non-standard flags like CARICOM; standard flags use flagcdn.com)
- Adding a new country requires updates to: `country-registry.js`, `country-dashboard-data.js`, and a new `Countries/[Country].html`

## Coding Style
- No new dependencies — match the existing plain CSS patterns already in the project
- Prefer editing existing files over creating new ones
- Use Python scripts in `/tmp/` for bulk data edits (e.g. adding fields to all countries)
- CSS changes affecting all dashboards go in `country-dashboard.css`; changes to the main map go in `CAPMap.html`

## Workflow & Permissions
- **Git**: commit and push immediately when asked, no confirmation needed
- **Design changes**: always assess feasibility and share recommendation before implementing — user prefers to approve approach first on non-trivial UI changes
- **Bulk data changes**: confirm scope before running (e.g. "this will update all 40 countries")
- **Reversions**: act immediately, no questions asked

## Communication Style
- Keep responses short and direct
- No emojis unless asked
- When something can't be done cleanly, say so and propose an alternative
