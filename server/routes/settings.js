const express = require('express');
const { pool } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const ALLOWED_KEYS = ['media_featured_year'];

router.get('/:key', async (req, res) => {
  if (!ALLOWED_KEYS.includes(req.params.key)) return res.status(400).json({ error: 'Unknown setting' });
  try {
    const { rows } = await pool.query('SELECT value FROM settings WHERE key = $1', [req.params.key]);
    res.json({ key: req.params.key, value: rows[0]?.value ?? null });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:key', requireAuth, async (req, res) => {
  if (!ALLOWED_KEYS.includes(req.params.key)) return res.status(400).json({ error: 'Unknown setting' });
  const { value } = req.body;
  if (value === undefined) return res.status(400).json({ error: 'value is required' });
  try {
    await pool.query(
      `INSERT INTO settings (key, value, updated_at) VALUES ($1, $2, NOW())
       ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()`,
      [req.params.key, String(value)]
    );
    res.json({ key: req.params.key, value: String(value) });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
