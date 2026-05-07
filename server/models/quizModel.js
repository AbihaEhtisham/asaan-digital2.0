// models/quizModel.js
// MongoDB/Mongoose — stores AI-generated questions + user attempts
// Install: npm install mongoose

const mongoose = require('mongoose');

// ── Question schema (embedded in Quiz) ──────────────────────
const questionSchema = new mongoose.Schema({
  question_text:   { type: String, required: true },
  options:         [{ type: String, required: true }],  // always 4 options
  correct_index:   { type: Number, required: true },    // 0-3
  explanation:     { type: String },                    // shown after answer
});

// ── Quiz schema (one per tutorial, questions AI-generated) ───
const quizSchema = new mongoose.Schema({
  tutorial_id:       { type: Number, required: true, index: true }, // FK → PostgreSQL tutorials.id
  tutorial_title:    { type: String, required: true },
  questions:         [questionSchema],                              // always 5
  generated_at:      { type: Date, default: Date.now },
  generation_model:  { type: String, default: 'claude-sonnet-4-20250514' },
});

// ── Attempt schema (one per user attempt) ───────────────────
const attemptSchema = new mongoose.Schema({
  tutorial_id:   { type: Number, required: true, index: true },
  session_id:    { type: String, required: true },               // matches PostgreSQL session
  answers:       [{ type: Number }],                             // user's chosen option indices
  score:         { type: Number, required: true },               // 0-5
  passed:        { type: Boolean, required: true },              // score >= 3
  time_taken_s:  { type: Number },                               // seconds
  attempted_at:  { type: Date, default: Date.now },
});

const Quiz    = mongoose.model('Quiz',    quizSchema);
const Attempt = mongoose.model('Attempt', attemptSchema);

module.exports = { Quiz, Attempt };