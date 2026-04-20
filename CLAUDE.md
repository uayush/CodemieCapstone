# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**CRUD-Notes** — a minimal full-stack notes app. Express 5 REST API backend with an in-memory store, vanilla HTML/CSS/JS frontend with no build step.

All application code lives in `CRUD-Notes/`.

## Commands

Run from `CRUD-Notes/`:

```bash
npm install   # install dependencies
npm start     # start server at http://localhost:3001 (runs: node server.js)
npm test      # run Playwright UI tests (server must be running)
npm run test:report  # generate human-readable report from last test run
```

## Prompts

- `/implement-gaps` — reads `Gaps/gaps.txt`, writes to Confluence Tests page, runs Playwright tests, publishes report to Confluence TestReports page
- `/run-tests` — runs Playwright UI tests only and shows results

## Testing

Playwright is configured in `playwright.config.js`. Tests live in `CRUD-Notes/Tests/ui.spec.js`.
The server must be running on port 3001 before running tests.

```bash
cd CRUD-Notes
npx playwright test          # run all tests
npx playwright test --headed # run with visible browser
```

## Confluence Integration

Scripts in `CRUD-Notes/scripts/`:
- `confluence-writer.js <pageId> <filePath>` — writes file content to a Confluence page
- `generate-report.js` — converts Playwright JSON results to a text report

Required env vars: `CONFLUENCE_USER`, `CONFLUENCE_TOKEN`

No linter or build step configured.

## Architecture

Two files contain all application logic:

- **`server.js`** — Express app on port 3001 (hardcoded, no env var). Serves `public/` as static files. Two API routes:
  - `GET /api/notes` — returns the in-memory notes array
  - `POST /api/notes` — validates `title`+`content`, appends `{ id, title, content, createdAt }` to the array
- **`public/index.html`** — single HTML file with inline CSS and JS. On load, fetches notes and renders cards. On form submit, POSTs to the API then re-renders.

**Data is in-memory only** (`let notes = []` in `server.js`). All notes are lost on server restart — there is no database.

**XSS prevention:** the frontend sanitizes output via a DOM-based `escapeHtml()` helper (sets `textContent`, reads back `innerHTML`).
