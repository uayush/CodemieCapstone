#!/usr/bin/env node
/**
 * confluence-writer.js
 *
 * Writes content to a Confluence page using the REST API.
 *
 * Usage:
 *   node scripts/confluence-writer.js <pageId> <filePath>
 *   node scripts/confluence-writer.js <pageId> --text "Some content"
 *
 * Environment variables required:
 *   CONFLUENCE_USER  — Atlassian account email
 *   CONFLUENCE_TOKEN — Atlassian API token
 */

const https = require('https');
const fs = require('fs');

const BASE_URL = 'uayush.atlassian.net';

function die(msg) {
  console.error(`ERROR: ${msg}`);
  process.exit(1);
}

const user = process.env.CONFLUENCE_USER;
const token = process.env.CONFLUENCE_TOKEN;
if (!user || !token) {
  die(
    'CONFLUENCE_USER and CONFLUENCE_TOKEN must be set.\n' +
    'Run:\n' +
    '  $env:CONFLUENCE_USER = "uayush@gmail.com"\n' +
    '  $env:CONFLUENCE_TOKEN = "<your-api-token>"'
  );
}

const pageId = process.argv[2];
if (!pageId) die('Usage: node confluence-writer.js <pageId> <filePath | --text "content"> [--html]');

const isHtml = process.argv.includes('--html');
const filteredArgs = process.argv.filter(a => a !== '--html');

let bodyContent;
if (filteredArgs[3] === '--text') {
  bodyContent = filteredArgs.slice(4).join(' ');
} else {
  const filePath = filteredArgs[3];
  if (!filePath || !fs.existsSync(filePath)) die(`File not found: ${filePath}`);
  bodyContent = fs.readFileSync(filePath, 'utf8');
}

if (!bodyContent.trim()) die('Content is empty — nothing to write.');

// Convert plain text to Confluence storage format (basic HTML)
function toStorageFormat(text) {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  // Convert lines to paragraphs
  return escaped
    .split(/\n\n+/)
    .map((para) => `<p>${para.replace(/\n/g, '<br />')}</p>`)
    .join('\n');
}

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${user}:${token}`).toString('base64');
    const data = body ? JSON.stringify(body) : null;
    const req = https.request(
      {
        hostname: BASE_URL,
        path,
        method,
        headers: {
          Authorization: `Basic ${auth}`,
          Accept: 'application/json',
          ...(data ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } : {}),
        },
      },
      (res) => {
        let chunks = '';
        res.on('data', (d) => (chunks += d));
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(JSON.parse(chunks));
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${chunks}`));
          }
        });
      }
    );
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

(async () => {
  try {
    // 1. Get current page version
    const page = await request('GET', `/wiki/rest/api/content/${pageId}?expand=version`);
    const currentVersion = page.version.number;
    const title = page.title;

    // 2. Update page with new content
    const storageHtml = isHtml ? bodyContent : toStorageFormat(bodyContent);
    await request('PUT', `/wiki/rest/api/content/${pageId}`, {
      id: pageId,
      type: 'page',
      title,
      version: { number: currentVersion + 1 },
      body: {
        storage: {
          value: storageHtml,
          representation: 'storage',
        },
      },
    });

    console.log(`Successfully updated Confluence page "${title}" (id: ${pageId}, version: ${currentVersion + 1})`);
  } catch (err) {
    die(err.message);
  }
})();
