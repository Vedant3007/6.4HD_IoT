// models/sample.js
const mongoose = require('mongoose');

const MetricsSchema = new mongoose.Schema({
  sleep_hours: { type: Number, required: true },
  focus_level: { type: Number, required: true },
  mood_score: { type: Number, required: true },
  screen_time_hours: { type: Number, required: true },
  steps: { type: Number, required: true }
}, { _id: false });

const SampleSchema = new mongoose.Schema({
  user_id: { type: String, required: true, index: true },
  ts: { type: Date, required: true, index: true },
  metrics: { type: MetricsSchema, required: true },
  daily_score: { type: Number },
  recommendation: { type: String }
}, { timestamps: true });

// Unique index to prevent duplicates for same user + timestamp
SampleSchema.index({ user_id: 1, ts: 1 }, { unique: true });

module.exports = mongoose.model('Sample', SampleSchema);