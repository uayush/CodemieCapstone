---
description: "Use when the user says 'run tests', 'run tests only', 'run UI tests', 'run playwright tests', or 'execute tests'. Runs Playwright UI tests against the CRUD-Notes app on localhost:3001 and shows results."
agent: "agent"
---
Run the Playwright UI tests only (no Confluence publishing).

## Prerequisites

Ensure the CRUD-Notes server is running on http://localhost:3001. If not, start it first:
```powershell
cd CRUD-Notes; node server.js
```

## Step 1 — Run tests

```powershell
cd CRUD-Notes
npx playwright test
```

Show the user the full test output.

## Step 2 — Generate report

```powershell
cd CRUD-Notes
node scripts/generate-report.js
```

Show the summary (passed/failed counts) to the user.
