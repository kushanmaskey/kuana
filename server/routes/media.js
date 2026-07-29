const express = require('express');
const rateLimit = require('express-rate-limit');
const { pool } = require('../db');
const { requireAuth } = require('../middleware/auth');
const { isValidId, isValidUrl, ALLOWED_MEDIA_TYPES } = require('../utils/validate');

const router = express.Router();

const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: { error: 'Too many requests. Please try again later.' },
});

router.get('/', async (req, res) => {
  const { type, event_id } = req.query;

  if (type && !ALLOWED_MEDIA_TYPES.includes(type)) {
    return res.status(400).json({ error: `type must be one of: ${ALLOWED_MEDIA_TYPES.join(', ')}` });
  }
  if (event_id && !isValidId(event_id)) {
    return res.status(400).json({ error: 'Invalid event_id' });
  }

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
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', requireAuth, writeLimiter, async (req, res) => {
  const { title, description, media_type, url, thumbnail_url, event_id, year, city, is_published, sort_order } = req.body;

  if (!title || !media_type || !url) {
    return res.status(400).json({ error: 'title, media_type, and url are required' });
  }
  if (!ALLOWED_MEDIA_TYPES.includes(media_type)) {
    return res.status(400).json({ error: `media_type must be one of: ${ALLOWED_MEDIA_TYPES.join(', ')}` });
  }
  if (title.length > 200) return res.status(400).json({ error: 'title must be 200 characters or fewer' });
  if (description && description.length > 1000) return res.status(400).json({ error: 'description must be 1000 characters or fewer' });
  if (!isValidUrl(url)) return res.status(400).json({ error: 'url must be a valid URL starting with http(s)://' });
  if (!isValidUrl(thumbnail_url)) return res.status(400).json({ error: 'thumbnail_url must be a valid URL starting with http(s)://' });
  if (event_id && !isValidId(event_id)) return res.status(400).json({ error: 'Invalid event_id' });

  try {
    const { rows } = await pool.query(
      `INSERT INTO media (title, description, media_type, url, thumbnail_url, event_id, year, city, is_published, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [
        title.trim(), description?.trim() || null, media_type,
        url.trim(), thumbnail_url?.trim() || null,
        event_id || null, year || null, city?.trim() || null,
        is_published ?? true, sort_order ?? 0,
      ]
    );
    res.status(201).json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', requireAuth, writeLimiter, async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ error: 'Invalid media ID' });
  try {
    const result = await pool.query('DELETE FROM media WHERE id = $1 RETURNING id', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
