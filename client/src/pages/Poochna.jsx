import React, { useState } from 'react';
import './Poochna.css';

export default function Poochna() {
  const [question, setQuestion] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        setQuestion('');
        setSubmitted(false);
      }, 3000);
    }
  };

  const popularQuestions = [
    'How do I create a Gmail account?',
    'What is WhatsApp and how do I use it?',
    'How do I make video calls?',
    'How do I send money online?',
    'What is a password and why do I need one?',
  ];

  return (
    <div className="poochna">
      {/* Hero Section */}
      <section className="poochna-hero">
        <div className="container container-sm">
          <h1>Ask a Question</h1>
          <p>Have a question about digital tools? We're here to help. Type your question below.</p>

          <form className="search-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Ask your question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="btn search-btn">Search</button>
          </form>

          {submitted && (
            <div className="success-message">
              Thank you for your question! Our team will respond soon.
            </div>
          )}
        </div>
      </section>

      {/* Popular Questions */}
      <section className="popular alt">
        <div className="container container-sm">
          <h2>Popular Questions</h2>
          <div className="questions-grid">
            {popularQuestions.map((q, idx) => (
              <div key={idx} className="question-card card">
                <p>{q}</p>
                <a href="#answer" className="question-link">View Answer →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="faqs">
        <div className="container container-sm">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            <details className="faq-item">
              <summary>How do I stay safe online?</summary>
              <p>Always use strong passwords, never share personal information, and be careful about clicking links from unknown sources.</p>
            </details>
            <details className="faq-item">
              <summary>What is the internet?</summary>
              <p>The internet is a global network of computers that allows you to send messages, view information, and communicate with people worldwide.</p>
            </details>
            <details className="faq-item">
              <summary>How do I backup my data?</summary>
              <p>You can backup your data by saving it to cloud storage like Google Drive or by using an external hard drive.</p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
}
