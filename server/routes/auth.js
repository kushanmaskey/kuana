const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { pool } = require('../db');

const router = express.Router();

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

router.post('/setup', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Setup disabled in production' });
  }
  const { name, email, password, setupKey } = req.body;
  if (!setupKey || setupKey !== process.env.SETUP_KEY) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  if (!name || !email || !password || password.length < 10) {
    return res.status(400).json({ error: 'Name, email, and password (min 10 chars) required' });
  }
  try {
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

router.patch('/password', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  let payload;
  try {
    payload = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  const { current_password, new_password } = req.body;
  if (!current_password || !new_password) {
    return res.status(400).json({ error: 'current_password and new_password are required' });
  }
  if (new_password.length < 10) {
    return res.status(400).json({ error: 'New password must be at least 10 characters' });
  }

  try {
    const { rows } = await pool.query('SELECT * FROM admins WHERE id = $1', [payload.id]);
    if (!rows.length) return res.status(404).json({ error: 'Admin not found' });

    const valid = await bcrypt.compare(current_password, rows[0].password_hash);
    if (!valid) return res.status(401).json({ error: 'Current password is incorrect' });

    const hash = await bcrypt.hash(new_password, 12);
    await pool.query('UPDATE admins SET password_hash = $1 WHERE id = $2', [hash, payload.id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
