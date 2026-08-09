const express = require('express');
const rateLimit = require('express-rate-limit');
const { pool } = require('../db');
const { requireAuth } = require('../middleware/auth');
const { EMAIL_REGEX, isValidId } = require('../utils/validate');

const router = express.Router();

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: 'Too many registrations from this IP. Try again later.' },
});

const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: { error: 'Too many requests. Please try again later.' },
});

const MAX_SEARCH_LEN = 100;
const PAGE_LIMIT = 50;

router.get('/', requireAuth, async (req, res) => {
  const { search, year, city, state, page = 1 } = req.query;

  if (search && search.length > MAX_SEARCH_LEN) {
    return res.status(400).json({ error: 'Search term too long' });
  }
  const offset = (Math.max(1, parseInt(page) || 1) - 1) * PAGE_LIMIT;

  let query = `SELECT id, first_name, last_name, email, phone, graduation_year, degree, department,
               city, state_province, country, linkedin_url, bio, created_at
               FROM alumni WHERE is_active = true`;
  const params = [];
  let idx = 1;

  if (search) {
    query += ` AND (first_name ILIKE $${idx} OR last_name ILIKE $${idx} OR email ILIKE $${idx})`;
    params.push(`%${search.substring(0, MAX_SEARCH_LEN)}%`);
    idx++;
  }
  if (year) {
    const y = parseInt(year, 10);
    if (isNaN(y) || y < 1991 || y > new Date().getFullYear() + 1) {
      return res.status(400).json({ error: 'Invalid graduation year filter' });
    }
    query += ` AND graduation_year = $${idx}`;
    params.push(y);
    idx++;
  }
  if (city) {
    if (city.length > 100) return res.status(400).json({ error: 'City filter too long' });
    query += ` AND city ILIKE $${idx}`;
    params.push(`%${city}%`);
    idx++;
  }
  if (state) {
    if (state.length > 100) return res.status(400).json({ error: 'State filter too long' });
    query += ` AND state_province ILIKE $${idx}`;
    params.push(`%${state}%`);
    idx++;
  }

  query += ` ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`;
  params.push(PAGE_LIMIT, offset);

  try {
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/register', registerLimiter, async (req, res) => {
  const { first_name, last_name, email, phone, graduation_year, degree, department, city, state_province, country, bio, linkedin_url } = req.body;

  if (!first_name || !last_name || !email) {
    return res.status(400).json({ error: 'First name, last name, and email are required' });
  }
  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }
  if (email.length > 200) return res.status(400).json({ error: 'Email too long' });
  if (first_name.length > 100 || last_name.length > 100) {
    return res.status(400).json({ error: 'Name too long' });
  }
  if (phone && !/^\d{10}$/.test(phone)) {
    return res.status(400).json({ error: 'Phone must be exactly 10 digits' });
  }
  if (city && city.length > 100) return res.status(400).json({ error: 'City too long' });
  if (state_province && state_province.length > 100) return res.status(400).json({ error: 'State/Province too long' });
  if (graduation_year && (isNaN(graduation_year) || graduation_year < 1991 || graduation_year > new Date().getFullYear() + 1)) {
    return res.status(400).json({ error: 'Invalid graduation year' });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO alumni (first_name, last_name, email, phone, graduation_year, degree, department, city, state_province, country, bio, linkedin_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id, first_name, last_name, email`,
      [
        first_name.trim(), last_name.trim(), email.trim().toLowerCase(),
        phone?.trim() || null, graduation_year || null, degree?.trim() || null, department?.trim() || null,
        city?.trim() || null, state_province?.trim() || null, (country ?? 'USA').trim(),
        bio?.substring(0, 1000) || null, linkedin_url?.trim() || null,
      ]
    );
    res.status(201).json({ success: true, alumni: rows[0] });
  } catch (err) {
    console.error('Alumni register error:', err.message);
    if (err.code === '23505') return res.status(409).json({ error: 'Email already registered' });
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', requireAuth, writeLimiter, async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ error: 'Invalid alumni ID' });

  const { first_name, last_name, phone, graduation_year, degree, department, city, state_province, country, bio, linkedin_url, is_active } = req.body;

  if (!first_name || !last_name) {
    return res.status(400).json({ error: 'First name and last name are required' });
  }
  if (first_name.length > 100 || last_name.length > 100) {
    return res.status(400).json({ error: 'Name too long' });
  }
  if (graduation_year && (isNaN(graduation_year) || graduation_year < 1991 || graduation_year > new Date().getFullYear() + 1)) {
    return res.status(400).json({ error: 'Invalid graduation year' });
  }
  if (bio && bio.length > 1000) return res.status(400).json({ error: 'Bio must be 1000 characters or fewer' });

  try {
    const { rows } = await pool.query(
      `UPDATE alumni SET first_name=$1, last_name=$2, phone=$3, graduation_year=$4, degree=$5, department=$6,
       city=$7, state_province=$8, country=$9, bio=$10, linkedin_url=$11, is_active=$12, updated_at=NOW()
       WHERE id=$13 RETURNING id, first_name, last_name, email, city, graduation_year`,
      [
        first_name.trim(), last_name.trim(), phone?.trim() || null,
        graduation_year || null, degree?.trim() || null, department?.trim() || null,
        city?.trim() || null, state_province?.trim() || null, country?.trim() || null,
        bio?.trim() || null, linkedin_url?.trim() || null,
        is_active ?? true, req.params.id,
      ]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', requireAuth, writeLimiter, async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ error: 'Invalid alumni ID' });
  try {
    const result = await pool.query('UPDATE alumni SET is_active = false WHERE id = $1 RETURNING id', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
