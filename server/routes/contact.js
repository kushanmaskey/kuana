const express = require('express');
const rateLimit = require('express-rate-limit');
const { pool } = require('../db');
const { requireAuth } = require('../middleware/auth');
const { sendContactEmail } = require('../utils/mailer');
const { EMAIL_REGEX, isValidId } = require('../utils/validate');

const router = express.Router();

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: 'Too many messages sent. Please try again later.' },
});

const PAGE_LIMIT = 50;

router.post('/', contactLimiter, async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }
  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }
  if (name.length > 200 || message.length > 5000 || (subject && subject.length > 255)) {
    return res.status(400).json({ error: 'Input too long' });
  }
  try {
    const trimmed = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject?.trim() || null,
      message: message.trim(),
    };
    await pool.query(
      'INSERT INTO contact_messages (name, email, subject, message) VALUES ($1,$2,$3,$4)',
      [trimmed.name, trimmed.email, trimmed.subject, trimmed.message]
    );
    sendContactEmail(trimmed).catch((err) => console.error('Email send failed:', err));
    res.json({ success: true, message: 'Your message has been received. We will get back to you soon!' });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', requireAuth, async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const offset = (page - 1) * PAGE_LIMIT;
  try {
    const { rows } = await pool.query(
      'SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [PAGE_LIMIT, offset]
    );
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:id/read', requireAuth, async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ error: 'Invalid message ID' });
  try {
    const result = await pool.query(
      'UPDATE contact_messages SET is_read = true WHERE id = $1 RETURNING id',
      [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:id/unread', requireAuth, async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ error: 'Invalid message ID' });
  try {
    const result = await pool.query(
      'UPDATE contact_messages SET is_read = false WHERE id = $1 RETURNING id',
      [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
