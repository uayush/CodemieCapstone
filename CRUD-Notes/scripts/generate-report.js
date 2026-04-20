#!/usr/bin/env node
/**
 * generate-report.js
 *
 * Reads Playwright JSON test results and produces a human-readable report.
 *
 * Usage:
 *   node scripts/generate-report.js [--json Tests/test-results.json] [--out Tests/report.txt]
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
function arg(flag, fallback) {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : fallback;
}

const jsonPath = arg('--json', path.join(__dirname, '..', 'Tests', 'test-results.json'));
const outPath = arg('--out', path.join(__dirname, '..', 'Tests', 'report.txt'));

if (!fs.existsSync(jsonPath)) {
  console.error(`Test results not found at ${jsonPath}. Run tests first.`);
  process.exit(1);
}

const results = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const lines = [];
lines.push('=== CRUD-Notes UI Test Report ===');
lines.push(`Date: ${new Date().toISOString()}`);
lines.push(`App URL: http://localhost:3001`);
lines.push('');

let totalPassed = 0;
let totalFailed = 0;
let totalSkipped = 0;

for (const suite of results.suites || []) {
  for (const innerSuite of suite.suites || []) {
    lines.push(`Suite: ${innerSuite.title}`);
    lines.push('-'.repeat(40));
    for (const spec of innerSuite.specs || []) {
      const result = spec.tests?.[0]?.results?.[0];
      const status = result?.status || 'unknown';
      const duration = result?.duration || 0;
      const icon = status === 'passed' ? 'PASS' : status === 'failed' ? 'FAIL' : 'SKIP';
      lines.push(`  [${icon}] ${spec.title} (${duration}ms)`);
      if (status === 'passed') totalPassed++;
      else if (status === 'failed') totalFailed++;
      else totalSkipped++;

      if (status === 'failed' && result?.error?.message) {
        lines.push(`         Error: ${result.error.message.split('\n')[0]}`);
      }
    }
    lines.push('');
  }
}

lines.push('=== Summary ===');
lines.push(`Total: ${totalPassed + totalFailed + totalSkipped}  |  Passed: ${totalPassed}  |  Failed: ${totalFailed}  |  Skipped: ${totalSkipped}`);
lines.push(`Result: ${totalFailed === 0 ? 'ALL PASSED' : 'FAILURES DETECTED'}`);

const report = lines.join('\n');
fs.writeFileSync(outPath, report, 'utf8');
console.log(report);
console.log(`\nReport written to ${outPath}`);

// ── Generate Confluence HTML version with tables ──
const htmlLines = [];
htmlLines.push('<h1>CRUD-Notes UI Test Report</h1>');
htmlLines.push(`<p><strong>Date:</strong> ${new Date().toISOString()}</p>`);
htmlLines.push(`<p><strong>App URL:</strong> http://localhost:3001</p>`);
htmlLines.push('<hr />');

for (const suite of results.suites || []) {
  for (const innerSuite of suite.suites || []) {
    htmlLines.push(`<h2>${innerSuite.title}</h2>`);
    htmlLines.push('<table><thead><tr><th>Status</th><th>Test Case</th><th>Duration</th><th>Error</th></tr></thead><tbody>');
    for (const spec of innerSuite.specs || []) {
      const r = spec.tests?.[0]?.results?.[0];
      const st = r?.status || 'unknown';
      const dur = r?.duration || 0;
      const icon = st === 'passed' ? '&#9989;' : st === 'failed' ? '&#10060;' : '&#9898;';
      const color = st === 'passed' ? '#006644' : st === 'failed' ? '#BF2600' : '#666';
      const errMsg = (st === 'failed' && r?.error?.message) ? r.error.message.split('\n')[0].replace(/</g,'&lt;').replace(/>/g,'&gt;') : '—';
      htmlLines.push(`<tr><td style="color:${color};font-weight:bold">${icon} ${st.toUpperCase()}</td><td>${spec.title}</td><td>${dur}ms</td><td>${errMsg}</td></tr>`);
    }
    htmlLines.push('</tbody></table>');
  }
}

htmlLines.push('<hr />');
htmlLines.push('<h2>Summary</h2>');
htmlLines.push('<table><thead><tr><th>Total</th><th>Passed</th><th>Failed</th><th>Skipped</th><th>Result</th></tr></thead><tbody>');
const total = totalPassed + totalFailed + totalSkipped;
const resultText = totalFailed === 0 ? '<span style="color:#006644;font-weight:bold">ALL PASSED</span>' : '<span style="color:#BF2600;font-weight:bold">FAILURES DETECTED</span>';
htmlLines.push(`<tr><td>${total}</td><td style="color:#006644">${totalPassed}</td><td style="color:#BF2600">${totalFailed}</td><td>${totalSkipped}</td><td>${resultText}</td></tr>`);
htmlLines.push('</tbody></table>');

const htmlOut = path.join(path.dirname(outPath), 'report-confluence.html');
fs.writeFileSync(htmlOut, htmlLines.join('\n'), 'utf8');
console.log(`Confluence HTML report written to ${htmlOut}`);
