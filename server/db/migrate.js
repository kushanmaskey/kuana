const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

async function run() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  const env = process.env.NODE_ENV || 'development';
  console.log(`Environment: ${env}`);
  console.log(`Database: ${process.env.DATABASE_URL?.replace(/:\/\/.*@/, '://***@')}`);

  // Ensure migrations tracking table exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      run_at TIMESTAMP DEFAULT NOW()
    )
  `);

  // Get already-run migrations
  const { rows: ran } = await pool.query('SELECT name FROM migrations');
  const ranNames = new Set(ran.map(r => r.name));

  // Get all migration files sorted by name
  const files = fs.readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql'))
    .sort();

  let applied = 0;
  for (const file of files) {
    const name = path.basename(file, '.sql');
    if (ranNames.has(name)) {
      console.log(`  ✓ ${file} (already run)`);
      continue;
    }

    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
    await pool.query(sql);
    await pool.query('INSERT INTO migrations (name) VALUES ($1) ON CONFLICT DO NOTHING', [name]);
    console.log(`  ✅ ${file} applied`);
    applied++;
  }

  if (applied === 0) console.log('Nothing to migrate — all up to date.');
  else console.log(`\nDone — ${applied} migration(s) applied.`);

  await pool.end();
}

run().catch(err => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
