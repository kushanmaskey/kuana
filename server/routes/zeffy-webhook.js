const { pool } = require('../db');

module.exports = async (req, res) => {
  const rawBody = req.body instanceof Buffer ? req.body.toString('utf8') : String(req.body);

  // Log headers so we can see exactly what Zeffy sends
  console.log('[zeffy-webhook] Headers:', JSON.stringify(req.headers));

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  console.log('[zeffy-webhook] Full payload:', JSON.stringify(payload));

  const data = payload.data || payload || {};

  // Extract payer — try every field name Zeffy might use
  const payer = data.payer || data.buyer || data.donor || data.customer || data.user || {};
  const firstName = payer.firstName || payer.first_name || payer.firstname || '';
  const lastName = payer.lastName || payer.last_name || payer.lastname || '';
  const donorName = [firstName, lastName].filter(Boolean).join(' ') || payer.name || payer.fullName || 'Anonymous';
  const donorEmail = (payer.email || data.email || '').trim().toLowerCase();

  // Zeffy sends amounts in cents (e.g. 100 = $1.00)
  const rawAmount = data.amount ?? data.total ?? data.amountInCents ?? data.price ?? 0;
  const amount = rawAmount / 100;
  const currency = (data.currency || 'USD').toUpperCase();

  const purpose = data.form?.title || data.campaign?.title || data.formTitle || data.campaignTitle || null;
  const message = data.note || data.message || data.comment || null;
  const paymentReference = data.id || data.orderId || data.order_id || data.paymentId || null;

  console.log(`[zeffy-webhook] Extracted — event: ${payload.type}, email: ${donorEmail}, amount: ${amount}, ref: ${paymentReference}`);

  if (!donorEmail || amount <= 0) {
    console.warn('[zeffy-webhook] Missing donor email or zero amount — skipping. Data:', JSON.stringify(data));
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

    console.log(`[zeffy-webhook] Saved $${amount} from ${donorEmail}`);
    res.json({ received: true });
  } catch (err) {
    console.error('[zeffy-webhook] DB error:', err.message);
    res.status(500).json({ error: 'Failed to save donation' });
  }
};
