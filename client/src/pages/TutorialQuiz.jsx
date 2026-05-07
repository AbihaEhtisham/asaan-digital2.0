import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './TutorialQuiz.css';

const getSessionId = () => {
  let id = localStorage.getItem('sessionId');
  if (!id) {
    id = crypto.randomUUID?.() || Math.random().toString(36).substring(2);
    localStorage.setItem('sessionId', id);
  }
  return id;
};

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── States ───────────────────────────────────────────────────
const STATE = { IDLE: 'idle', LOADING: 'loading', QUIZ: 'quiz', RESULT: 'result', ERROR: 'error' };

const TutorialQuiz = ({ tutorialId, tutorialTitle }) => {
  const [state,     setState]     = useState(STATE.IDLE);
  const [quiz,      setQuiz]      = useState(null);
  const [answers,   setAnswers]   = useState(Array(5).fill(null));
  const [current,   setCurrent]   = useState(0);
  const [result,    setResult]    = useState(null);
  const [error,     setError]     = useState('');
  const startTime = useRef(null);

  // ── Load quiz ──────────────────────────────────────────────
  const loadQuiz = async () => {
    setState(STATE.LOADING);
    setError('');
    try {
      const res  = await fetch(`${API}/quiz/${tutorialId}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setQuiz(data.data);
      setAnswers(Array(5).fill(null));
      setCurrent(0);
      setResult(null);
      startTime.current = Date.now();
      setState(STATE.QUIZ);
    } catch (err) {
      setError(err.message || 'Failed to load quiz');
      setState(STATE.ERROR);
    }
  };

  // ── Select answer ──────────────────────────────────────────
  const selectAnswer = (optionIndex) => {
    const updated = [...answers];
    updated[current] = optionIndex;
    setAnswers(updated);
  };

  // ── Submit ─────────────────────────────────────────────────
  const submitQuiz = async () => {
    if (answers.includes(null)) return;
    setState(STATE.LOADING);
    try {
      const timeTaken = Math.round((Date.now() - startTime.current) / 1000);
      const res  = await fetch(`${API}/quiz/${tutorialId}/submit`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id:   getSessionId(),
          answers,
          time_taken_s: timeTaken,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setResult(data.data);
      setState(STATE.RESULT);
    } catch (err) {
      setError(err.message || 'Failed to submit');
      setState(STATE.ERROR);
    }
  };

  const retry = () => loadQuiz();

  const progress = answers.filter(a => a !== null).length;
  const allAnswered = progress === 5;

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════

  // ── Idle (entry point at bottom of TutorialDetail) ──
  if (state === STATE.IDLE) {
    return (
      <div className="quiz-entry" data-aos="fade-up">
        <div className="quiz-entry-left">
          <span className="quiz-entry-tag">📝 Quiz</span>
          <h3 className="quiz-entry-title">Test Your Knowledge</h3>
          <p className="quiz-entry-desc">
            5 questions · Pass with 3/5 · Retries allowed
          </p>
        </div>
        <button className="quiz-start-btn" onClick={loadQuiz}>
          Start Quiz <i className="fas fa-arrow-right ms-2" />
        </button>
      </div>
    );
  }

  // ── Loading ──
  if (state === STATE.LOADING) {
    return (
      <div className="quiz-loading">
        <div className="quiz-spinner" />
        <p>{quiz ? 'Submitting…' : 'Generating your quiz with AI…'}</p>
      </div>
    );
  }

  // ── Error ──
  if (state === STATE.ERROR) {
    return (
      <div className="quiz-error">
        <i className="fas fa-exclamation-triangle" />
        <p>{error}</p>
        <button className="quiz-retry-btn" onClick={loadQuiz}>Try Again</button>
      </div>
    );
  }

  // ── Result ──
  if (state === STATE.RESULT && result) {
    const pct = Math.round((result.score / 5) * 100);
    return (
      <div className="quiz-result" data-aos="zoom-in">
        <div className={`quiz-result-banner ${result.passed ? 'passed' : 'failed'}`}>
          <div className="quiz-result-icon">
            {result.passed ? '🏆' : '📚'}
          </div>
          <div>
            <h3 className="quiz-result-title">
              {result.passed ? 'Well Done!' : 'Keep Practicing!'}
            </h3>
            <p className="quiz-result-score">
              {result.score} / 5 &nbsp;·&nbsp; {pct}%
              &nbsp;·&nbsp; {result.passed ? 'PASSED' : 'NOT PASSED'}
            </p>
          </div>
        </div>

        {/* Per-question breakdown */}
        <div className="quiz-breakdown">
          {quiz.questions.map((q, i) => {
            const r = result.results[i];
            return (
              <div key={i} className={`quiz-breakdown-item ${r.correct ? 'correct' : 'wrong'}`}>
                <div className="quiz-breakdown-header">
                  <span className="qb-num">Q{i + 1}</span>
                  <span className="qb-question">{q.question_text}</span>
                  <span className="qb-icon">{r.correct ? '✓' : '✗'}</span>
                </div>
                <div className="qb-detail">
                  <span className="qb-your">
                    Your answer: <strong>{q.options[answers[i]]}</strong>
                  </span>
                  {!r.correct && (
                    <span className="qb-correct">
                      Correct: <strong>{q.options[r.correct_index]}</strong>
                    </span>
                  )}
                  {r.explanation && (
                    <span className="qb-explanation">💡 {r.explanation}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="quiz-result-actions">
          {!result.passed && (
            <button className="quiz-retry-btn" onClick={retry}>
              <i className="fas fa-redo me-2" /> Retry Quiz
            </button>
          )}
          <Link to="/seekhna" className="quiz-browse-btn">
            Browse More Tutorials <i className="fas fa-arrow-right ms-2" />
          </Link>
        </div>
      </div>
    );
  }

  // ── Quiz ──
  if (state === STATE.QUIZ && quiz) {
    const q = quiz.questions[current];
    return (
      <div className="quiz-wrap">
        {/* Header bar */}
        <div className="quiz-header">
          <div className="quiz-header-left">
            <span className="quiz-label">📝 Quiz</span>
            <span className="quiz-counter">Question {current + 1} of 5</span>
          </div>
          <div className="quiz-progress-bar">
            <div
              className="quiz-progress-fill"
              style={{ width: `${(progress / 5) * 100}%` }}
            />
          </div>
          <span className="quiz-progress-text">{progress}/5 answered</span>
        </div>

        {/* Question */}
        <div className="quiz-question-block">
          {/* Step dots nav */}
          <div className="quiz-dots">
            {quiz.questions.map((_, i) => (
              <button
                key={i}
                className={`quiz-dot ${i === current ? 'active' : ''} ${answers[i] !== null ? 'done' : ''}`}
                onClick={() => setCurrent(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <h3 className="quiz-question-text">{q.question_text}</h3>

          <div className="quiz-options">
            {q.options.map((opt, oi) => (
              <button
                key={oi}
                className={`quiz-option ${answers[current] === oi ? 'selected' : ''}`}
                onClick={() => selectAnswer(oi)}
              >
                <span className="quiz-option-letter">
                  {['A', 'B', 'C', 'D'][oi]}
                </span>
                <span className="quiz-option-text">{opt}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="quiz-nav">
          <button
            className="quiz-nav-btn"
            onClick={() => setCurrent(c => Math.max(0, c - 1))}
            disabled={current === 0}
          >
            <i className="fas fa-arrow-left" /> Prev
          </button>

          {current < 4 ? (
            <button
              className="quiz-nav-btn primary"
              onClick={() => setCurrent(c => c + 1)}
              disabled={answers[current] === null}
            >
              Next <i className="fas fa-arrow-right" />
            </button>
          ) : (
            <button
              className={`quiz-submit-btn ${allAnswered ? '' : 'disabled'}`}
              onClick={submitQuiz}
              disabled={!allAnswered}
            >
              Submit Quiz <i className="fas fa-check ms-2" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default TutorialQuiz;