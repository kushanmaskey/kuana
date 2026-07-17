const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();
const isProd = process.env.NODE_ENV === 'production';

// Security headers
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: isProd ? undefined : false,
}));

// CORS — lock to your domain in production
const allowedOrigins = isProd
  ? [process.env.CLIENT_URL, 'https://kuana.org', 'https://www.kuana.org'].filter(Boolean)
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

app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/alumni', require('./routes/alumni'));
app.use('/api/media', require('./routes/media'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/donations', require('./routes/donations'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'KUANA API' }));

// Serve React build in production
if (isProd) {
  const clientBuild = path.join(__dirname, '../client/dist');
  app.use(express.static(clientBuild));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuild, 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`KUANA server running on port ${PORT}`));
