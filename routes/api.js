// routes/api.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Sample = require('../models/sample');

// computeDailyScore (same logic as Node-RED)
function computeDailyScore(metrics) {
  const sleep = Number(metrics.sleep_hours || 0);
  const focus = Number(metrics.focus_level || 0);
  const mood  = Number(metrics.mood_score || 0);
  const screen= Number(metrics.screen_time_hours || 0);
  const steps = Number(metrics.steps || 0);

  const clamp = (v,min,max)=> Math.min(Math.max(v,min),max);
  const screenScore = 10 * (1 - clamp(screen / 14, 0, 1));
  const stepsScore = 10 * clamp(steps / 10000, 0, 1);

  let score = (
    clamp(sleep,0,12)/12 * 25 +
    clamp(focus,0,10)/10 * 20 +
    clamp(mood,0,10)/10 * 20 +
    screenScore/10 * 15 +
    stepsScore/10 * 20
  );
  return Math.round(score);
}

// Validation chain
const sampleValidation = [
  body('user_id').isString().trim().notEmpty().withMessage('user_id required'),
  body('ts').isISO8601().withMessage('ts must be ISO8601'),
  body('metrics').isObject().withMessage('metrics object required'),
  body('metrics.sleep_hours').isFloat({ min: 0, max: 24 }).withMessage('sleep_hours 0-24'),
  body('metrics.focus_level').isFloat({ min: 0, max: 10 }).withMessage('focus_level 0-10'),
  body('metrics.mood_score').isFloat({ min: 0, max: 10 }).withMessage('mood_score 0-10'),
  body('metrics.screen_time_hours').isFloat({ min: 0, max: 48 }).withMessage('screen_time_hours 0-48'),
  body('metrics.steps').isInt({ min: 0 }).withMessage('steps >= 0'),
];

// POST /api/v1/samples
router.post('/samples', sampleValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ ok:false, errors: errors.array() });

  const payload = req.body;
  try {
    const daily_score = computeDailyScore(payload.metrics);
    const doc = new Sample({
      user_id: payload.user_id,
      ts: new Date(payload.ts),
      metrics: payload.metrics,
      daily_score,
      recommendation: payload.recommendation || null
    });

    await doc.save();
    return res.status(201).json({ ok:true, id: doc._id, daily_score });
  } catch (err) {
    // Duplicate key (idempotent)
    if (err.code === 11000) {
      try {
        const existing = await Sample.findOne({ user_id: payload.user_id, ts: new Date(payload.ts) }).lean();
        return res.status(200).json({ ok:true, id: existing._id, daily_score: existing.daily_score, info: 'duplicate_ignored' });
      } catch (lookupErr) {
        return res.status(200).json({ ok:true, info: 'duplicate_ignored' });
      }
    }
    console.error('POST /samples error', err);
    return res.status(500).json({ ok:false, error: 'server error' });
  }
});

// GET /api/v1/users/:userId/samples
router.get('/users/:userId/samples', async (req, res) => {
  try {
    const limit = Math.min(100, Number(req.query.limit || 50));
    const docs = await Sample.find({ user_id: req.params.userId })
                             .sort({ ts: -1 })
                             .limit(limit)
                             .lean();
    res.json({ ok:true, count: docs.length, data: docs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok:false, error: 'server error' });
  }
});

module.exports = router;