const express = require('express');
const rateLimit = require('express-rate-limit');
const { pool } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: 'Too many registrations from this IP. Try again later.' },
});

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.get('/', requireAuth, async (req, res) => {
  const { search, year, city } = req.query;
  let query = 'SELECT id, first_name, last_name, email, phone, graduation_year, degree, department, city, state_province, country, linkedin_url, created_at FROM alumni WHERE is_active = true';
  const params = [];
  let idx = 1;

  if (search) {
    query += ` AND (first_name ILIKE $${idx} OR last_name ILIKE $${idx} OR email ILIKE $${idx})`;
    params.push(`%${search}%`);
    idx++;
  }
  if (year) {
    query += ` AND graduation_year = $${idx}`;
    params.push(year);
    idx++;
  }
  if (city) {
    query += ` AND city ILIKE $${idx}`;
    params.push(`%${city}%`);
    idx++;
  }

  query += ' ORDER BY last_name, first_name';
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
  if (first_name.length > 100 || last_name.length > 100) {
    return res.status(400).json({ error: 'Name too long' });
  }
  if (graduation_year && (isNaN(graduation_year) || graduation_year < 1991 || graduation_year > new Date().getFullYear() + 1)) {
    return res.status(400).json({ error: 'Invalid graduation year' });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO alumni (first_name, last_name, email, phone, graduation_year, degree, department, city, state_province, country, bio, linkedin_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id, first_name, last_name, email`,
      [
        first_name.trim(), last_name.trim(), email.trim().toLowerCase(),
        phone?.trim(), graduation_year || null, degree?.trim(), department?.trim(),
        city?.trim(), state_province?.trim(), (country ?? 'USA').trim(),
        bio?.substring(0, 1000), linkedin_url?.trim(),
      ]
    );
    res.status(201).json({ success: true, alumni: rows[0] });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Email already registered' });
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  const { first_name, last_name, phone, graduation_year, degree, department, city, state_province, country, bio, linkedin_url, is_active } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE alumni SET first_name=$1, last_name=$2, phone=$3, graduation_year=$4, degree=$5, department=$6, city=$7, state_province=$8, country=$9, bio=$10, linkedin_url=$11, is_active=$12, updated_at=NOW()
       WHERE id=$13 RETURNING id, first_name, last_name, email, city, graduation_year`,
      [first_name, last_name, phone, graduation_year, degree, department, city, state_province, country, bio, linkedin_url, is_active, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await pool.query('UPDATE alumni SET is_active = false WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
