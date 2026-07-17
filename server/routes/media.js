const express = require('express');
const { pool } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  const { type, event_id } = req.query;
  let query = 'SELECT m.*, e.title as event_title FROM media m LEFT JOIN events e ON m.event_id = e.id WHERE m.is_published = true';
  const params = [];
  let idx = 1;

  if (type) {
    query += ` AND m.media_type = $${idx}`;
    params.push(type);
    idx++;
  }
  if (event_id) {
    query += ` AND m.event_id = $${idx}`;
    params.push(event_id);
    idx++;
  }
  query += ' ORDER BY m.sort_order, m.created_at DESC';

  try {
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  const { title, description, media_type, url, thumbnail_url, event_id, year, city, is_published, sort_order } = req.body;
  if (!title || !media_type || !url) {
    return res.status(400).json({ error: 'title, media_type, and url are required' });
  }
  try {
    const { rows } = await pool.query(
      `INSERT INTO media (title, description, media_type, url, thumbnail_url, event_id, year, city, is_published, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [title, description, media_type, url, thumbnail_url, event_id || null, year, city, is_published ?? true, sort_order ?? 0]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM media WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
