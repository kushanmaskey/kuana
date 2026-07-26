const express = require('express');
const { pool } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM events WHERE is_published = 1 ORDER BY event_date DESC'
    );
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  const { title, description, event_date, end_date, city, state_province, country, venue, venue_address, registration_url, image_url, is_featured, is_published } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO events (title, description, event_date, end_date, city, state_province, country, venue, venue_address, registration_url, image_url, is_featured, is_published)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [title, description, event_date, end_date || null, city, state_province, country, venue, venue_address, registration_url, image_url, is_featured ? 1 : 0, is_published !== false ? 1 : 0]
    );
    const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  const { title, description, event_date, end_date, city, state_province, country, venue, venue_address, registration_url, image_url, is_featured, is_published } = req.body;
  try {
    const [result] = await pool.query(
      `UPDATE events SET title=?, description=?, event_date=?, end_date=?, city=?, state_province=?, country=?, venue=?, venue_address=?, registration_url=?, image_url=?, is_featured=?, is_published=?, updated_at=NOW()
       WHERE id=?`,
      [title, description, event_date, end_date || null, city, state_province, country, venue, venue_address, registration_url, image_url, is_featured ? 1 : 0, is_published ? 1 : 0, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: 'Not found' });
    const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM events WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
