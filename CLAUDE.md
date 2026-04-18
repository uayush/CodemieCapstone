# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**CRUD-Notes** — a minimal full-stack notes app. Express 5 REST API backend with an in-memory store, vanilla HTML/CSS/JS frontend with no build step.

All application code lives in `CRUD-Notes/`.

## Commands

Run from `CRUD-Notes/`:

```bash
npm install   # install dependencies
npm start     # start server at http://localhost:3000 (runs: node server.js)
```

No tests, no linter, no build step are configured.

## Architecture

Two files contain all application logic:

- **`server.js`** — Express app on port 3000 (hardcoded, no env var). Serves `public/` as static files. Two API routes:
  - `GET /api/notes` — returns the in-memory notes array
  - `POST /api/notes` — validates `title`+`content`, appends `{ id, title, content, createdAt }` to the array
- **`public/index.html`** — single HTML file with inline CSS and JS. On load, fetches notes and renders cards. On form submit, POSTs to the API then re-renders.

**Data is in-memory only** (`let notes = []` in `server.js`). All notes are lost on server restart — there is no database.

**XSS prevention:** the frontend sanitizes output via a DOM-based `escapeHtml()` helper (sets `textContent`, reads back `innerHTML`).
