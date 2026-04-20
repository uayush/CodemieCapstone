---
description: "Use when the user says 'implement the gaps', 'implement gaps', 'deploy gaps to tests', or 'write gaps to confluence'. Reads gaps, writes them to the Confluence Tests page, runs Playwright UI tests, and publishes the report."
agent: "agent"
---
Implement the gaps end-to-end: read gaps, write to Confluence Tests page, run Playwright UI tests, and publish the report.

## Prerequisites

Ensure CONFLUENCE_USER and CONFLUENCE_TOKEN are set:
```powershell
$env:CONFLUENCE_USER = "uayush@gmail.com"
$env:CONFLUENCE_TOKEN = "<token>"
```
If they are not set, **stop and ask the user** to set them.

Ensure the CRUD-Notes server is running on http://localhost:3001. If not, start it:
```powershell
cd CRUD-Notes; node server.js
```

## Step 1 — Read gaps

Read the file `Gaps/gaps.txt` from the project root. If it is empty, inform the user and stop.

## Step 2 — Write gaps to Confluence Tests page

Run the Confluence writer to publish the gaps as test cases to the **Tests** page (page id `2097178`):

```powershell
cd CRUD-Notes
node scripts/confluence-writer.js 2097178 ../Gaps/gaps.txt
```

If this fails due to auth errors, ask the user to verify their CONFLUENCE_USER and CONFLUENCE_TOKEN.

## Step 3 — Run Playwright UI tests

Run the Playwright tests against the app on localhost:3001:

```powershell
cd CRUD-Notes
npx playwright test
```

Wait for tests to complete. Show the user the test output.

## Step 4 — Generate report

Generate a human-readable report from the JSON results:

```powershell
cd CRUD-Notes
node scripts/generate-report.js
```

## Step 5 — Publish report to Confluence

Write the test report to the **TestReports** page (page id `2424847`):

```powershell
cd CRUD-Notes
node scripts/confluence-writer.js 2424847 Tests/report.txt
```

## Step 6 — Summary

Tell the user:
- How many tests passed/failed
- That gaps were written to https://uayush.atlassian.net/wiki/spaces/MFS/pages/2097178/Tests
- That the test report was written to https://uayush.atlassian.net/wiki/spaces/MFS/pages/2424847/TestReports
