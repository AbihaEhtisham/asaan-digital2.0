import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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

const STATE = { IDLE: 'idle', LOADING: 'loading', QUIZ: 'quiz', RESULT: 'result', ERROR: 'error' };

const TutorialQuiz = () => {
  const { id: tutorialId } = useParams();
  const navigate = useNavigate();
  
  const [state, setState] = useState(STATE.LOADING);
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState(Array(5).fill(null));
  const [current, setCurrent] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [tutorialTitle, setTutorialTitle] = useState('');
  const startTime = useRef(null);

  // Load quiz on mount
  useEffect(() => {
    const loadQuiz = async () => {
      setState(STATE.LOADING);
      setError('');
      try {
        const res = await fetch(`${API}/quiz/${tutorialId}`);
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
        setQuiz(data.data);
        setTutorialTitle(data.data.tutorial_title);
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
    
    if (tutorialId) {
      loadQuiz();
    }
  }, [tutorialId]);

  const selectAnswer = (optionIndex) => {
    const updated = [...answers];
    updated[current] = optionIndex;
    setAnswers(updated);
  };

  const submitQuiz = async () => {
    if (answers.includes(null)) return;
    setState(STATE.LOADING);
    try {
      const timeTaken = Math.round((Date.now() - startTime.current) / 1000);
      const res = await fetch(`${API}/quiz/${tutorialId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: getSessionId(),
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

  const retry = () => {
    setAnswers(Array(5).fill(null));
    setCurrent(0);
    setResult(null);
    startTime.current = Date.now();
    setState(STATE.QUIZ);
  };

  const progress = answers.filter(a => a !== null).length;
  const allAnswered = progress === 5;

  // Loading State
  if (state === STATE.LOADING) {
    return (
      <div className="quiz-page-container">
        <div className="quiz-loading">
          <div className="quiz-spinner" />
          <p>آپ کا کوئز لوڈ ہو رہا ہے...</p>
          <p className="quiz-loading-sub">Loading your quiz...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (state === STATE.ERROR) {
    return (
      <div className="quiz-page-container">
        <div className="quiz-error">
          <i className="fas fa-exclamation-triangle"></i>
          <p>{error}</p>
          <button className="quiz-retry-btn" onClick={() => window.location.reload()}>
            دوبارہ کوشش کریں
          </button>
          <Link to={`/tutorial/${tutorialId}`} className="quiz-back-btn">
            واپس سبق پر جائیں
          </Link>
        </div>
      </div>
    );
  }

  // Result State - Success Message with Aur Kuch Seekhein Button
  if (state === STATE.RESULT && result) {
    const pct = Math.round((result.score / 5) * 100);
    const passed = result.score >= 3;
    
    return (
      <div className="quiz-page-container">
        <div className="quiz-result-card">
          {/* Celebration Animation */}
          <div className="quiz-celebration">
            <div className="confetti">🎉</div>
            <div className="confetti delay-1">🎊</div>
            <div className="confetti delay-2">🏆</div>
            <div className="confetti delay-3">⭐</div>
            <div className="confetti delay-4">🎈</div>
          </div>
          
          <div className={`quiz-result-banner ${passed ? 'passed' : 'failed'}`}>
            <div className="quiz-result-icon">
              {passed ? '🏆' : '📚'}
            </div>
            <div>
              <h3 className="quiz-result-title">
                {passed ? 'مبارک ہو! ' : 'پریکٹس جاری رکھیں! '}
              </h3>
              <p className="quiz-result-message">
                {passed 
                  ? 'آپ نے کوئز کامیابی سے پاس کر لیا!'
                  : 'اگلی بار بہتر کوشش کریں۔ مزید پریکٹس کریں!'}
              </p>
            </div>
          </div>
          
          {/* Score Display */}
          <div className="quiz-score-card">
            <div className="quiz-score-circle">
              <span className="quiz-score-number">{result.score}</span>
              <span className="quiz-score-total">/5</span>
            </div>
            <div className="quiz-score-details">
              <div className="quiz-score-percent">{pct}%</div>
              <div className="quiz-score-status">
                {passed ? '✅ پاس ہو گئے' : '❌ پاس نہیں ہوئے'}
              </div>
              <div className="quiz-score-message">
                {passed 
                  ? 'بہت خوب! آپ نے یہ سبق اچھی طرح سیکھ لیا ہے۔'
                  : 'پریشان نہ ہوں! دوبارہ کوشش کریں اور سبق دوبارہ پڑھیں۔'}
              </div>
            </div>
          </div>

          {/* Question Breakdown - Collapsible */}
          <details className="quiz-breakdown-details">
            <summary className="quiz-breakdown-summary">
              <i className="fas fa-list-ul"></i> سوالات کے جوابات دیکھیں
              <span className="summary-arrow">▼</span>
            </summary>
            <div className="quiz-breakdown">
              {quiz.questions.map((q, i) => {
                const r = result.results[i];
                return (
                  <div key={i} className={`quiz-breakdown-item ${r.correct ? 'correct' : 'wrong'}`}>
                    <div className="quiz-breakdown-header">
                      <span className="qb-num">سوال {i + 1}</span>
                      <span className="qb-icon">{r.correct ? '✓' : '✗'}</span>
                    </div>
                    <div className="qb-question-text">{q.question_text}</div>
                    <div className="qb-detail">
                      <div className="qb-your">
                        آپ کا جواب: <strong>{q.options[answers[i]]}</strong>
                      </div>
                      {!r.correct && (
                        <div className="qb-correct">
                          صحیح جواب: <strong>{q.options[r.correct_index]}</strong>
                        </div>
                      )}
                      {r.explanation && (
                        <div className="qb-explanation">
                          💡 وضاحت: {r.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </details>

          {/* Action Buttons */}
          <div className="quiz-result-actions">
            {!passed && (
              <button className="quiz-retry-btn" onClick={retry}>
                <i className="fas fa-redo me-2"></i> دوبارہ کوئز دیں
              </button>
            )}
            <Link to="/seekhna" className="quiz-more-btn">
              <i className="fas fa-graduation-cap me-2"></i> اور کچھ سیکھیں
            </Link>
            <Link to={`/tutorial/${tutorialId}`} className="quiz-review-btn">
              <i className="fas fa-book me-2"></i> سبق دوبارہ پڑھیں
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Quiz State
  if (state === STATE.QUIZ && quiz) {
    const q = quiz.questions[current];
    return (
      <div className="quiz-page-container">
        <div className="quiz-header-section">
          <Link to={`/tutorial/${tutorialId}`} className="quiz-exit-btn">
            <i className="fas fa-times"></i> کوئز چھوڑیں
          </Link>
          <div className="quiz-header-stats">
            <span className="quiz-header-title">{tutorialTitle}</span>
            <span className="quiz-header-progress">{progress}/5 جواب دیے</span>
          </div>
        </div>

        <div className="quiz-wrap">
          <div className="quiz-question-block">
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
                    {['الف', 'ب', 'پ', 'ت'][oi]}
                  </span>
                  <span className="quiz-option-text">{opt}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="quiz-nav">
            <button
              className="quiz-nav-btn"
              onClick={() => setCurrent(c => Math.max(0, c - 1))}
              disabled={current === 0}
            >
              <i className="fas fa-arrow-right"></i> پچھلا
            </button>

            {current < 4 ? (
              <button
                className="quiz-nav-btn primary"
                onClick={() => setCurrent(c => c + 1)}
                disabled={answers[current] === null}
              >
                اگلا <i className="fas fa-arrow-left"></i>
              </button>
            ) : (
              <button
                className={`quiz-submit-btn ${allAnswered ? '' : 'disabled'}`}
                onClick={submitQuiz}
                disabled={!allAnswered}
              >
                کوئز جمع کروائیں <i className="fas fa-check ms-2"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default TutorialQuiz;