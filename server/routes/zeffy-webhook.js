const { Webhook, WebhookVerificationError } = require('standardwebhooks');
const { pool } = require('../db');

module.exports = async (req, res) => {
  const secret = process.env.ZEFFY_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[zeffy-webhook] ZEFFY_WEBHOOK_SECRET not set');
    return res.status(500).json({ error: 'Webhook not configured' });
  }

  const rawBody = req.body instanceof Buffer ? req.body.toString('utf8') : String(req.body);

  try {
    const wh = new Webhook(secret);
    wh.verify(rawBody, req.headers);
  } catch (err) {
    if (err instanceof WebhookVerificationError) {
      console.warn('[zeffy-webhook] Signature verification failed:', err.message);
      return res.status(400).json({ error: 'Invalid signature' });
    }
    console.error('[zeffy-webhook] Unexpected verification error:', err);
    return res.status(400).json({ error: 'Verification failed' });
  }

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  console.log('[zeffy-webhook] Event received:', payload.type, JSON.stringify(payload.data));

  // Zeffy sends order.completed for successful donations
  const HANDLED_TYPES = ['order.completed', 'order.created', 'payment.completed', 'donation.completed'];
  if (!HANDLED_TYPES.includes(payload.type)) {
    return res.json({ received: true });
  }

  const data = payload.data || {};
  const payer = data.payer || data.buyer || data.donor || {};

  const firstName = payer.firstName || payer.first_name || '';
  const lastName = payer.lastName || payer.last_name || '';
  const donorName = [firstName, lastName].filter(Boolean).join(' ') || payer.name || 'Anonymous';
  const donorEmail = (payer.email || '').trim().toLowerCase();

  // Zeffy sends amounts in cents
  const amountCents = data.amount ?? data.total ?? 0;
  const amount = amountCents / 100;
  const currency = (data.currency || 'USD').toUpperCase();

  const purpose = data.form?.title || data.campaign?.title || null;
  const message = data.note || data.message || data.comment || null;
  const paymentReference = data.id || data.orderId || data.order_id || null;

  if (!donorEmail || amount <= 0) {
    console.warn('[zeffy-webhook] Missing donor email or zero amount — skipping');
    return res.json({ received: true });
  }

  try {
    const { rows: alumniRows } = await pool.query(
      'SELECT id FROM alumni WHERE email = $1',
      [donorEmail]
    );

    await pool.query(
      `INSERT INTO donations
         (alumni_id, donor_name, donor_email, amount, currency, purpose, message, payment_reference, payment_method, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'zeffy','completed')
       ON CONFLICT (payment_reference) DO NOTHING`,
      [alumniRows[0]?.id ?? null, donorName, donorEmail, amount, currency, purpose, message, paymentReference]
    );

    console.log(`[zeffy-webhook] Saved donation $${amount} from ${donorEmail}`);
    res.json({ received: true });
  } catch (err) {
    console.error('[zeffy-webhook] DB error:', err.message);
    res.status(500).json({ error: 'Failed to save donation' });
  }
};
