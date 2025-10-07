// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

const apiRoutes = require('./routes/api');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// API routes
app.use('/api/v1', apiRoutes);

// Root & health/readiness
app.get('/', (req, res) => {
  res.send('vscoach-api — running. Try POST /api/v1/samples');
});
app.get('/health', (req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});
app.get('/ready', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.json({ ok: true, mongo: true });
  } catch (err) {
    res.status(503).json({ ok: false, mongo: false });
  }
});

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vscoach';

async function start() {
  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 });
  console.log('Connected to MongoDB');
  if (require.main === module) {
    app.listen(PORT, '0.0.0.0', () => console.log(`API listening on http://0.0.0.0:${PORT}`));
  }
}

start().catch(err => {
  console.error('Failed to start', err);
  process.exit(1);
});

module.exports = app;