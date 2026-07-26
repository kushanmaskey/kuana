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
  let query = 'SELECT id, first_name, last_name, email, phone, graduation_year, degree, department, city, state_province, country, linkedin_url, created_at FROM alumni WHERE is_active = 1';
  const params = [];

  if (search) {
    query += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (year) {
    query += ' AND graduation_year = ?';
    params.push(year);
  }
  if (city) {
    query += ' AND city LIKE ?';
    params.push(`%${city}%`);
  }

  query += ' ORDER BY last_name, first_name';
  try {
    const [rows] = await pool.query(query, params);
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
    const [result] = await pool.query(
      `INSERT INTO alumni (first_name, last_name, email, phone, graduation_year, degree, department, city, state_province, country, bio, linkedin_url)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        first_name.trim(), last_name.trim(), email.trim().toLowerCase(),
        phone?.trim() || null, graduation_year || null, degree?.trim() || null, department?.trim() || null,
        city?.trim() || null, state_province?.trim() || null, (country ?? 'USA').trim(),
        bio?.substring(0, 1000) || null, linkedin_url?.trim() || null,
      ]
    );
    res.status(201).json({ success: true, alumni: { id: result.insertId, first_name, last_name, email } });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Email already registered' });
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  const { first_name, last_name, phone, graduation_year, degree, department, city, state_province, country, bio, linkedin_url, is_active } = req.body;
  try {
    const [result] = await pool.query(
      `UPDATE alumni SET first_name=?, last_name=?, phone=?, graduation_year=?, degree=?, department=?, city=?, state_province=?, country=?, bio=?, linkedin_url=?, is_active=?, updated_at=NOW()
       WHERE id=?`,
      [first_name, last_name, phone, graduation_year, degree, department, city, state_province, country, bio, linkedin_url, is_active ? 1 : 0, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: 'Not found' });
    const [rows] = await pool.query('SELECT id, first_name, last_name, email, city, graduation_year FROM alumni WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await pool.query('UPDATE alumni SET is_active = 0 WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
