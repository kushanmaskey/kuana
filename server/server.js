const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();
const isProd = process.env.NODE_ENV === 'production';

// Trust Render's proxy so rate-limiter reads the real client IP
app.set('trust proxy', 1);

// Security headers — CSP enabled in all environments
app.use(helmet({
  crossOriginEmbedderPolicy: false,
}));

// CORS — lock to your domain in production
const allowedOrigins = isProd
  ? [process.env.CLIENT_URL, 'https://kuana.org', 'https://www.kuana.org', 'https://staging.kuana.org', 'http://staging.kuana.org'].filter(Boolean)
  : ['http://localhost:5174', 'http://localhost:5173'];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// Zeffy webhook — raw body must be parsed before express.json(); separate rate limit
const webhookLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many webhook requests' },
});
app.post('/api/donations/webhook', webhookLimiter, express.raw({ type: 'application/json' }), require('./routes/zeffy-webhook'));

// Body size limits
app.use(express.json({ limit: '50kb' }));

// Global rate limiter — 200 requests per 15 min per IP
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
}));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/alumni', require('./routes/alumni'));
app.use('/api/media', require('./routes/media'));
app.use('/api/speakers', require('./routes/speakers'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/donations', require('./routes/donations'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'KUANA API' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`KUANA server running on port ${PORT}`));
