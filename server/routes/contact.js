const express = require('express');
const rateLimit = require('express-rate-limit');
const { pool } = require('../db');
const { requireAuth } = require('../middleware/auth');
const { sendContactNotification } = require('../mailer');

const router = express.Router();

// Max 5 contact form submissions per IP per hour
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: 'Too many messages sent. Please try again later.' },
});

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    const trimmedName    = name.trim();
    const trimmedEmail   = email.trim().toLowerCase();
    const trimmedSubject = subject?.trim();
    const trimmedMessage = message.trim();

    await pool.query(
      'INSERT INTO contact_messages (name, email, subject, message) VALUES ($1,$2,$3,$4)',
      [trimmedName, trimmedEmail, trimmedSubject, trimmedMessage]
    );

    // Send email notification — non-blocking so a mail failure doesn't break the response
    sendContactNotification({
      name: trimmedName,
      email: trimmedEmail,
      subject: trimmedSubject,
      message: trimmedMessage,
    }).catch((err) => console.error('Mail error:', err.message));

    res.json({ success: true, message: 'Your message has been received. We will get back to you soon!' });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:id/read', requireAuth, async (req, res) => {
  try {
    await pool.query('UPDATE contact_messages SET is_read = true WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
