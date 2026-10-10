const express = require('express');
const rateLimit = require('express-rate-limit');
const { pool } = require('../db');
const { requireAuth } = require('../middleware/auth');
const { isValidId } = require('../utils/validate');

const router = express.Router();

const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: { error: 'Too many requests. Please try again later.' },
});

router.get('/', async (req, res) => {
  const { year } = req.query;
  let query = 'SELECT * FROM speakers WHERE is_published = true';
  const params = [];
  if (year) {
    const y = parseInt(year, 10);
    if (isNaN(y)) return res.status(400).json({ error: 'Invalid year' });
    query += ' AND year = $1';
    params.push(y);
  }
  query += ' ORDER BY is_featured DESC, sort_order ASC, created_at ASC';
  try {
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', requireAuth, writeLimiter, async (req, res) => {
  const { name, role, org, bio, photo_url, tag, tag_color, year, facebook_url, linkedin_url, instagram_url, is_featured, is_published, sort_order } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  if (name.length > 200) return res.status(400).json({ error: 'name must be 200 characters or fewer' });
  try {
    if (is_featured) {
      await pool.query('UPDATE speakers SET is_featured = false, updated_at = NOW() WHERE year = $1', [year || null]);
    }
    const { rows } = await pool.query(
      `INSERT INTO speakers (name, role, org, bio, photo_url, tag, tag_color, year, facebook_url, linkedin_url, instagram_url, is_featured, is_published, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
      [name.trim(), role?.trim() || null, org?.trim() || null, bio?.trim() || null, photo_url?.trim() || null,
       tag?.trim() || 'Speaker', tag_color?.trim() || 'bg-[#0e1b4d] text-white',
       year || null, facebook_url?.trim() || null, linkedin_url?.trim() || null, instagram_url?.trim() || null,
       is_featured ?? false, is_published ?? true, sort_order ?? 0]
    );
    res.status(201).json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', requireAuth, writeLimiter, async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ error: 'Invalid speaker ID' });
  const { name, role, org, bio, photo_url, tag, tag_color, year, facebook_url, linkedin_url, instagram_url, is_featured, is_published, sort_order } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  try {
    if (is_featured) {
      await pool.query('UPDATE speakers SET is_featured = false, updated_at = NOW() WHERE year = $1 AND id <> $2', [year || null, req.params.id]);
    }
    const { rows } = await pool.query(
      `UPDATE speakers SET name=$1, role=$2, org=$3, bio=$4, photo_url=$5, tag=$6, tag_color=$7, year=$8,
       facebook_url=$9, linkedin_url=$10, instagram_url=$11, is_featured=$12, is_published=$13, sort_order=$14, updated_at=NOW()
       WHERE id=$15 RETURNING *`,
      [name.trim(), role?.trim() || null, org?.trim() || null, bio?.trim() || null, photo_url?.trim() || null,
       tag?.trim() || 'Speaker', tag_color?.trim() || 'bg-[#0e1b4d] text-white',
       year || null, facebook_url?.trim() || null, linkedin_url?.trim() || null, instagram_url?.trim() || null,
       is_featured ?? false, is_published ?? true, sort_order ?? 0, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:id/featured', requireAuth, async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ error: 'Invalid speaker ID' });
  const { is_featured, year } = req.body;
  if (typeof is_featured !== 'boolean') return res.status(400).json({ error: 'is_featured must be a boolean' });
  try {
    if (is_featured) {
      await pool.query('UPDATE speakers SET is_featured = false, updated_at = NOW() WHERE year = $1 AND id <> $2', [year || null, req.params.id]);
    }
    const { rows } = await pool.query(
      'UPDATE speakers SET is_featured = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [is_featured, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', requireAuth, writeLimiter, async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ error: 'Invalid speaker ID' });
  try {
    const result = await pool.query('DELETE FROM speakers WHERE id = $1 RETURNING id', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
