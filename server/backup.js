const { Pool } = require('pg');
const fs = require('fs');

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is required.');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const TABLES = ['alumni', 'contact_messages', 'events', 'donations'];

async function run() {
  const backup = {};

  for (const table of TABLES) {
    try {
      const { rows } = await pool.query(`SELECT * FROM ${table} ORDER BY id`);
      backup[table] = rows;
      console.log(`  ${table}: ${rows.length} rows`);
    } catch (err) {
      console.log(`  ${table}: skipped (${err.message})`);
      backup[table] = [];
    }
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `backup-${timestamp}.json`;
  fs.writeFileSync(filename, JSON.stringify(backup, null, 2));
  console.log(`\nBackup saved: ${filename}`);
  await pool.end();
}

run().catch((err) => { console.error(err.message); process.exit(1); });
