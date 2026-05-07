const express   = require('express');
const router    = express.Router();
const { Quiz, Attempt } = require('../models/quizModel');
const pool      = require('../config/database');  // your existing PostgreSQL pool

// ─────────────────────────────────────────────────────────────
// GET /api/quiz/:tutorialId
// Returns cached quiz or generates a new one via Claude
// ─────────────────────────────────────────────────────────────
router.get('/:tutorialId', async (req, res) => {
  const { tutorialId } = req.params;

  try {
    // Simply find the quiz in MongoDB by ID
    const quiz = await Quiz.findOne({ tutorial_id: parseInt(tutorialId) });

    if (!quiz) {
      // If no quiz exists for this tutorial, return an error or empty state
      return res.status(404).json({ 
        success: false, 
        error: 'No quiz available for this tutorial yet.' 
      });
    }

    // Return the sanitized quiz (hiding correct answers)
    return res.json({ success: true, data: sanitizeQuiz(quiz) });

  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/quiz/:tutorialId/submit
// Body: { session_id, answers: [0,2,1,3,0], time_taken_s: 45 }
// Returns: score, passed, correct answers, explanations
// ─────────────────────────────────────────────────────────────
router.post('/:tutorialId/submit', async (req, res) => {
  const { tutorialId } = req.params;
  const { session_id, answers, time_taken_s } = req.body;

  if (!session_id || !Array.isArray(answers) || answers.length !== 5) {
    return res.status(400).json({ success: false, error: 'Invalid submission' });
  }

  try {
    const quiz = await Quiz.findOne({ tutorial_id: parseInt(tutorialId) });
    if (!quiz) {
      return res.status(404).json({ success: false, error: 'Quiz not found — load it first' });
    }

    // Grade answers
    const results = quiz.questions.map((q, i) => ({
      correct:       answers[i] === q.correct_index,
      correct_index: q.correct_index,
      explanation:   q.explanation,
    }));

    const score  = results.filter(r => r.correct).length;
    const passed = score >= 3;

    // Save attempt to MongoDB
    await Attempt.create({
      tutorial_id:  parseInt(tutorialId),
      session_id,
      answers,
      score,
      passed,
      time_taken_s: time_taken_s || null,
    });

    res.json({
      success: true,
      data: { score, passed, total: 5, results },
    });

  } catch (err) {
    console.error('Quiz submit error:', err);
    res.status(500).json({ success: false, error: 'Failed to submit quiz' });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/quiz/:tutorialId/attempts?session_id=xxx
// Returns best attempt for this session
// ─────────────────────────────────────────────────────────────
router.get('/:tutorialId/attempts', async (req, res) => {
  const { tutorialId } = req.params;
  const { session_id } = req.query;

  try {
    const attempts = await Attempt.find({
      tutorial_id: parseInt(tutorialId),
      ...(session_id ? { session_id } : {}),
    }).sort({ attempted_at: -1 }).limit(5);

    res.json({ success: true, data: attempts });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch attempts' });
  }
});

// Strip correct_index from questions before sending to client
function sanitizeQuiz(quiz) {
  return {
    _id:           quiz._id,
    tutorial_id:   quiz.tutorial_id,
    tutorial_title: quiz.tutorial_title,
    generated_at:  quiz.generated_at,
    questions: quiz.questions.map(q => ({
      _id:           q._id,
      question_text: q.question_text,
      options:       q.options,
      // correct_index intentionally omitted
    })),
  };
}

module.exports = router;