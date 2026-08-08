const express = require('express');
const rateLimit = require('express-rate-limit');
const { pool } = require('../db');
const { requireAuth } = require('../middleware/auth');
const { isValidId, isValidUrl, isValidDate } = require('../utils/validate');

const router = express.Router();

const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: { error: 'Too many requests. Please try again later.' },
});

function validateEvent(body) {
  const { title, event_date, city, state_province, description, end_date, venue, venue_address, registration_url, image_url } = body;
  if (!title || !event_date || !city || !state_province) {
    return 'title, event_date, city, and state_province are required';
  }
  if (title.length > 200) return 'title must be 200 characters or fewer';
  if (description && description.length > 5000) return 'description must be 5000 characters or fewer';
  if (city.length > 100) return 'city must be 100 characters or fewer';
  if (state_province.length > 100) return 'state_province must be 100 characters or fewer';
  if (venue && venue.length > 200) return 'venue must be 200 characters or fewer';
  if (venue_address && venue_address.length > 300) return 'venue_address must be 300 characters or fewer';
  if (!isValidDate(event_date)) return 'event_date must be a valid date (YYYY-MM-DD)';
  if (end_date && !isValidDate(end_date)) return 'end_date must be a valid date (YYYY-MM-DD)';
  if (!isValidUrl(registration_url)) return 'registration_url must be a valid URL starting with http(s)://';
  if (!isValidUrl(image_url)) return 'image_url must be a valid URL starting with http(s)://';
  return null;
}

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM events WHERE is_published = true ORDER BY event_date DESC'
    );
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ error: 'Invalid event ID' });
  try {
    const { rows } = await pool.query('SELECT * FROM events WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', requireAuth, writeLimiter, async (req, res) => {
  const err = validateEvent(req.body);
  if (err) return res.status(400).json({ error: err });

  const { title, description, event_date, end_date, city, state_province, country, venue, venue_address, registration_url, image_url, is_featured, is_published } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO events (title, description, event_date, end_date, city, state_province, country, venue, venue_address, registration_url, image_url, is_featured, is_published)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
      [
        title.trim(), description?.trim() || null, event_date, end_date || null,
        city.trim(), state_province.trim(), country?.trim() || null,
        venue?.trim() || null, venue_address?.trim() || null,
        registration_url?.trim() || null, image_url?.trim() || null,
        is_featured ?? false, is_published ?? true,
      ]
    );
    res.status(201).json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', requireAuth, writeLimiter, async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ error: 'Invalid event ID' });
  const err = validateEvent(req.body);
  if (err) return res.status(400).json({ error: err });

  const { title, description, event_date, end_date, city, state_province, country, venue, venue_address, registration_url, image_url, is_featured, is_published } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE events SET title=$1, description=$2, event_date=$3, end_date=$4, city=$5, state_province=$6, country=$7, venue=$8, venue_address=$9, registration_url=$10, image_url=$11, is_featured=$12, is_published=$13, updated_at=NOW()
       WHERE id=$14 RETURNING *`,
      [
        title.trim(), description?.trim() || null, event_date, end_date || null,
        city.trim(), state_province.trim(), country?.trim() || null,
        venue?.trim() || null, venue_address?.trim() || null,
        registration_url?.trim() || null, image_url?.trim() || null,
        is_featured, is_published, req.params.id,
      ]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:id/featured', requireAuth, async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ error: 'Invalid event ID' });
  const { is_featured } = req.body;
  if (typeof is_featured !== 'boolean') return res.status(400).json({ error: 'is_featured must be a boolean' });
  try {
    const result = await pool.query(
      'UPDATE events SET is_featured = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [is_featured, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', requireAuth, writeLimiter, async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ error: 'Invalid event ID' });
  try {
    const result = await pool.query('DELETE FROM events WHERE id = $1 RETURNING id', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
