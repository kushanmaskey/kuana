#!/usr/bin/env node
/**
 * Auto-updates docs/TECHNICAL.md "Last updated" date whenever
 * watched files change and are committed.
 * Invoked by .git/hooks/pre-commit.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DOCS_FILE = path.join(__dirname, 'TECHNICAL.md');

// Files that trigger a doc update when staged
const WATCHED = [
  'server/routes/auth.js',
  'server/routes/events.js',
  'server/routes/alumni.js',
  'server/routes/contact.js',
  'server/routes/donations.js',
  'server/routes/media.js',
  'server/middleware/auth.js',
  'server/db/index.js',
  'server/server.js',
  'client/src/pages/Admin.jsx',
];

function getStagedFiles() {
  try {
    return execSync('git diff --cached --name-only', { encoding: 'utf8' }).trim().split('\n');
  } catch {
    return [];
  }
}

function shouldUpdate(staged) {
  return staged.some((f) => WATCHED.includes(f));
}

function updateTimestamp() {
  const today = new Date().toISOString().split('T')[0];
  let content = fs.readFileSync(DOCS_FILE, 'utf8');
  content = content.replace(
    /> Last updated: .+/,
    `> Last updated: ${today}`
  );
  fs.writeFileSync(DOCS_FILE, content, 'utf8');
  execSync(`git add ${DOCS_FILE}`);
  console.log(`[docs] TECHNICAL.md timestamp updated to ${today}`);
}

const staged = getStagedFiles();
if (shouldUpdate(staged)) {
  updateTimestamp();
} else {
  console.log('[docs] No watched files changed — skipping doc update.');
}
