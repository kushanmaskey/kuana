const express = require('express');
const rateLimit = require('express-rate-limit');
const { pool } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const donationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: 'Too many requests. Please try again later.' },
});

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_DONATION = 100000;

router.post('/', donationLimiter, async (req, res) => {
  const { donor_name, donor_email, amount, currency, purpose, message, payment_reference, payment_method } = req.body;

  if (!donor_name || !donor_email || !amount) {
    return res.status(400).json({ error: 'Name, email, and amount are required' });
  }
  if (!EMAIL_REGEX.test(donor_email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }
  const numAmount = Number(amount);
  if (isNaN(numAmount) || numAmount <= 0 || numAmount > MAX_DONATION) {
    return res.status(400).json({ error: 'Invalid donation amount' });
  }
  if (donor_name.length > 200) {
    return res.status(400).json({ error: 'Name too long' });
  }

  try {
    const [alumniRows] = await pool.query('SELECT id FROM alumni WHERE email = ?', [donor_email.toLowerCase()]);
    const alumni_id = alumniRows[0]?.id || null;

    const [result] = await pool.query(
      `INSERT INTO donations (alumni_id, donor_name, donor_email, amount, currency, purpose, message, payment_reference, payment_method, status)
       VALUES (?,?,?,?,?,?,?,?,?,'completed')`,
      [alumni_id, donor_name.trim(), donor_email.trim().toLowerCase(), numAmount, currency ?? 'USD', purpose?.trim() || null, message?.substring(0, 1000) || null, payment_reference || null, payment_method || null]
    );
    res.status(201).json({ success: true, donation: { id: result.insertId, amount: numAmount, donor_name } });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT d.*, a.first_name, a.last_name FROM donations d
       LEFT JOIN alumni a ON d.alumni_id = a.id
       ORDER BY d.donated_at DESC`
    );
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/stats', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT COUNT(*) as total_donations, SUM(amount) as total_amount,
              AVG(amount) as average_amount, COUNT(DISTINCT donor_email) as unique_donors
       FROM donations WHERE status = 'completed'`
    );
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
