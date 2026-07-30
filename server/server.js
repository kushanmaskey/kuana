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

// Security headers
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: isProd ? undefined : false,
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
app.use('/api/contact', require('./routes/contact'));
app.use('/api/donations', require('./routes/donations'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'KUANA API' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`KUANA server running on port ${PORT}`));
