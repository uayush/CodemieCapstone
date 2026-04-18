#!/usr/bin/env node
/**
 * watch-gaps.js
 * Watches Gaps/gaps.txt for changes and triggers /deploy-from-gaps via the
 * Claude CLI whenever the file content changes.
 *
 * Start : node watch-gaps.js
 * Stop  : Ctrl+C
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const GAPS_FILE     = path.join(__dirname, 'Gaps', 'gaps.txt');
const SNAPSHOT_FILE = path.join(__dirname, 'Gaps', '.gaps_deployed');
const DEBOUNCE_MS   = 1000; // wait 1 s after last write before acting
const POLL_MS       = 50000; // poll every 50 s

let isDeploying  = false;
let debounceTimer = null;

// ── helpers ──────────────────────────────────────────────────────────────────

function readFile(filePath) {
  try { return fs.readFileSync(filePath, 'utf8').trim(); }
  catch { return null; }
}

function log(msg) {
  console.log(`[watch-gaps ${new Date().toLocaleTimeString()}] ${msg}`);
}

// ── deploy ────────────────────────────────────────────────────────────────────

function deploy() {
  const current = readFile(GAPS_FILE);

  if (!current) {
    log('gaps.txt is empty or missing — nothing to deploy.');
    return;
  }

  const last = readFile(SNAPSHOT_FILE);
  if (current === last) {
    log('No change detected — skipping.');
    return;
  }

  if (isDeploying) {
    log('Deploy already running — will re-check when it finishes.');
    return;
  }

  log('Change detected! Invoking /deploy-from-gaps via Claude CLI...\n');
  isDeploying = true;

  const proc = spawn('claude', ['--print', '/deploy-from-gaps'], {
    stdio : 'inherit',
    shell : true,
    cwd   : __dirname,
  });

  proc.on('close', (code) => {
    isDeploying = false;
    if (code === 0) {
      fs.writeFileSync(SNAPSHOT_FILE, current, 'utf8');
      log('Deployment complete. Snapshot saved.\n');
    } else {
      log(`Deployment exited with code ${code}. Snapshot NOT updated (will retry on next change).\n`);
    }
  });

  proc.on('error', (err) => {
    isDeploying = false;
    log(`Failed to start Claude CLI: ${err.message}`);
    log('Make sure "claude" is on your PATH (run: claude --version to verify).\n');
  });
}

// ── watcher ───────────────────────────────────────────────────────────────────

log(`Watching: ${GAPS_FILE}`);
log('Press Ctrl+C to stop.\n');

// watchFile uses polling — reliable on Windows and network drives
fs.watchFile(GAPS_FILE, { interval: POLL_MS }, (curr, prev) => {
  if (curr.mtime.getTime() !== prev.mtime.getTime()) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(deploy, DEBOUNCE_MS);
  }
});

// Run once on startup to catch any pending change (e.g. file was edited while
// the watcher was not running)
deploy();

// ── shutdown ──────────────────────────────────────────────────────────────────

process.on('SIGINT', () => {
  console.log('\n');
  log('Watcher stopped. Goodbye!');
  fs.unwatchFile(GAPS_FILE);
  process.exit(0);
});
