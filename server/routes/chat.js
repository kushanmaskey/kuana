const express = require('express');
const rateLimit = require('express-rate-limit');
const Anthropic = require('@anthropic-ai/sdk');
const { requireAuth } = require('../middleware/auth');

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

You assist the admin in understanding the KUANA data and navigating the admin tool. Keep answers concise and helpful.`;

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
    .map((m) => ({ role: m.role, content: m.content.substring(0, 2000) }));

  if (!sanitized.length || sanitized[sanitized.length - 1].role !== 'user') {
    return res.status(400).json({ error: 'Last message must be from user' });
  }

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: sanitized,
    });
    res.json({ reply: response.content[0].text });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({ error: 'AI service error' });
  }
});

module.exports = router;
