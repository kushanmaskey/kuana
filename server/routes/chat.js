const express = require('express');
const rateLimit = require('express-rate-limit');
const Anthropic = require('@anthropic-ai/sdk');
const { requireAuth } = require('../middleware/auth');
const { pool } = require('../db');
const { sendContactEmail } = require('../utils/mailer');

const router = express.Router();

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: 'Too many messages. Please wait a moment.' },
});

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a helpful assistant for KUANA (Kathmandu University Alumni, North America), an admin tool assistant.

About KUANA:
- KUANA is a non-profit organization (501(c)(3) tax-exempt) of alumni of Kathmandu University, Nepal, located in North America.
- Formed in 2023. Connects Nepali engineers, scientists, and professionals from Kathmandu University across North America.
- Organizes reunions every two years in different North American cities to reconnect, re-network, and celebrate shared journeys.
- Supports scholarships, mentorship, and development initiatives at Kathmandu University.
- Reunion events: KUANA Reunion 2023 (Trophy Club, TX), KUANA Reunion 2025 (Lewisville, TX), KUANA Reunion 2027 (Boston, MA).
- Website: kuana.org

Admin tool capabilities:
- Summary tab: Dashboard with alumni growth chart and latest events, messages, donations.
- Alumni tab: Search, browse, export alumni. Filter by graduation year, city, state, reunion interest.
- Events tab: Create, view, delete reunion events. Star button marks the featured event (radio selection).
- Messages tab: View contact form submissions, mark read/unread.
- Donations tab: View donation records and stats (total, average, unique donors).

EMAIL DRAFTING:
When asked to draft or compose an email to alumni, always format your response exactly like this so the system can detect and send it:

---EMAIL DRAFT---
Subject: <subject line here>

<email body here — can use multiple paragraphs>
---END DRAFT---

After the draft block, briefly summarize what you wrote and ask if the admin would like to send it or make changes. Keep emails warm, professional, and concise.`;

router.post('/', requireAuth, chatLimiter, async (req, res) => {
  const { messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' });
  }
  if (messages.length > 50) {
    return res.status(400).json({ error: 'Conversation too long' });
  }

  const sanitized = messages
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map((m) => ({ role: m.role, content: m.content.substring(0, 4000) }));

  if (!sanitized.length || sanitized[sanitized.length - 1].role !== 'user') {
    return res.status(400).json({ error: 'Last message must be from user' });
  }

  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your_anthropic_api_key_here') {
    return res.status(503).json({ error: 'ANTHROPIC_API_KEY is not configured on the server.' });
  }

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: sanitized,
    });
    const reply = response.content[0].text;

    // Detect email draft in response
    const draftMatch = reply.match(/---EMAIL DRAFT---([\s\S]*?)---END DRAFT---/);
    let emailDraft = null;
    if (draftMatch) {
      const draftText = draftMatch[1].trim();
      const subjectMatch = draftText.match(/^Subject:\s*(.+)/m);
      const bodyStart = draftText.indexOf('\n', draftText.indexOf('Subject:'));
      if (subjectMatch && bodyStart !== -1) {
        emailDraft = {
          subject: subjectMatch[1].trim(),
          body: draftText.slice(bodyStart).trim(),
        };
      }
    }

    res.json({ reply, emailDraft });
  } catch (err) {
    console.error('Chat error:', err.message);
    const msg = err.status === 401
      ? 'Invalid API key. Check ANTHROPIC_API_KEY in server/.env.'
      : 'AI service error — please try again.';
    res.status(500).json({ error: msg });
  }
});

// Preview: return alumni count before sending
router.get('/email-preview', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT COUNT(*) FROM alumni WHERE is_active = true AND email IS NOT NULL');
    res.json({ count: parseInt(rows[0].count) });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// Send mass email to all active alumni
router.post('/send-email', requireAuth, async (req, res) => {
  const { subject, body } = req.body;
  if (!subject || !body) return res.status(400).json({ error: 'subject and body are required' });
  if (subject.length > 300) return res.status(400).json({ error: 'Subject too long' });

  try {
    const { rows } = await pool.query(
      'SELECT first_name, last_name, email FROM alumni WHERE is_active = true AND email IS NOT NULL ORDER BY first_name'
    );
    if (!rows.length) return res.status(400).json({ error: 'No active alumni found' });

    let sent = 0;
    for (const alumni of rows) {
      const personalizedBody = body.replace(/\[Alumni Name\]/gi, `${alumni.first_name} ${alumni.last_name}`)
                                   .replace(/\[Name\]/gi, alumni.first_name);
      try {
        await sendContactEmail({
          name: 'KUANA Admin',
          email: alumni.email,
          subject,
          message: personalizedBody,
        });
        sent++;
      } catch (err) {
        console.error(`Failed to send to ${alumni.email}:`, err.message);
      }
    }
    res.json({ sent, total: rows.length });
  } catch (err) {
    console.error('Send email error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
