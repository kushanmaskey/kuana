#!/usr/bin/env node
// One-time migration: encrypt existing plaintext emails in alumni, donations, and contact_messages.
// Run with: FIELD_ENCRYPTION_KEY=<64hexchars> DATABASE_URL=<url> node 005_encrypt_emails.js
//
// Safe to run multiple times — already-encrypted values (starting with 'enc:') are skipped.

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const { Pool } = require('pg');
const { encrypt } = require('../../utils/fieldEncryption');

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function migrateTable(table, emailCol, idCol = 'id') {
  const { rows } = await pool.query(`SELECT ${idCol}, ${emailCol} FROM ${table}`);
  let updated = 0;
  let skipped = 0;

  for (const row of rows) {
    const val = row[emailCol];
    if (!val || val.startsWith('enc:')) {
      skipped++;
      continue;
    }
    const encVal = encrypt(val);
    await pool.query(`UPDATE ${table} SET ${emailCol} = $1 WHERE ${idCol} = $2`, [encVal, row[idCol]]);
    updated++;
  }

  console.log(`  ${table}.${emailCol}: ${updated} encrypted, ${skipped} skipped`);
}

async function main() {
  console.log('Starting email encryption migration...');
  await migrateTable('alumni', 'email');
  await migrateTable('donations', 'donor_email');
  await migrateTable('contact_messages', 'email');
  console.log('Done.');
  await pool.end();
}

main().catch(err => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
