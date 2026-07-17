const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { pool } = require('../db');

const router = express.Router();

// Max 10 login attempts per IP per 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  try {
    const { rows } = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);

    // Always run bcrypt to prevent timing attacks (even if user not found)
    const fakeHash = '$2a$12$invalidhashtopreventtimingattacksXXXXXXXXXXXXXXXXXXXXXX';
    const hash = rows[0]?.password_hash || fakeHash;
    const valid = await bcrypt.compare(password, hash);

    if (!rows.length || !valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const admin = rows[0];
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.json({ token, admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role } });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// One-time setup — disabled in production after first admin exists
router.post('/setup', async (req, res) => {
  if (process.env.NODE_ENV === 'production' && process.env.DISABLE_SETUP === 'true') {
    return res.status(403).json({ error: 'Setup disabled' });
  }
  const { name, email, password, setupKey } = req.body;
  if (!setupKey || setupKey !== process.env.SETUP_KEY) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  if (!name || !email || !password || password.length < 10) {
    return res.status(400).json({ error: 'Name, email, and password (min 10 chars) required' });
  }
  try {
    // Only allow one admin to be created via setup
    const existing = await pool.query('SELECT id FROM admins LIMIT 1');
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Admin already exists. Use the admin panel to add more.' });
    }
    const hash = await bcrypt.hash(password, 12);
    const { rows } = await pool.query(
      'INSERT INTO admins (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hash]
    );
    res.json({ admin: rows[0] });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
