const express = require('express');
const { pool } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM events WHERE is_published = true ORDER BY event_date DESC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM events WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  const { title, description, event_date, end_date, city, state_province, country, venue, venue_address, registration_url, image_url, is_featured, is_published } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO events (title, description, event_date, end_date, city, state_province, country, venue, venue_address, registration_url, image_url, is_featured, is_published)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
      [title, description, event_date, end_date, city, state_province, country, venue, venue_address, registration_url, image_url, is_featured ?? false, is_published ?? true]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  const { title, description, event_date, end_date, city, state_province, country, venue, venue_address, registration_url, image_url, is_featured, is_published } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE events SET title=$1, description=$2, event_date=$3, end_date=$4, city=$5, state_province=$6, country=$7, venue=$8, venue_address=$9, registration_url=$10, image_url=$11, is_featured=$12, is_published=$13, updated_at=NOW()
       WHERE id=$14 RETURNING *`,
      [title, description, event_date, end_date, city, state_province, country, venue, venue_address, registration_url, image_url, is_featured, is_published, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM events WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
