import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <h1>Master Digital Skills</h1>
              <p className="hero-subtitle">Learn how to use digital tools in simple, easy steps. No complicated jargon.</p>
              <div className="hero-buttons">
                <Link to="/poochna" className="btn">Ask a Question</Link>
                <Link to="/seekhna" className="btn btn-outline">Start Learning</Link>
              </div>
            </div>
            <div className="hero-image">
              <img src="/images/pic1.png" alt="Learn Digital Skills" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features alt">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="grid grid-3">
            <div className="card feature-card">
              <div className="feature-number">1</div>
              <h3>Ask Questions</h3>
              <p>Have a question? Ask anything about digital services and get instant answers.</p>
              <Link to="/poochna" className="card-link">Go to Poochna →</Link>
            </div>
            <div className="card feature-card">
              <div className="feature-number">2</div>
              <h3>Learn Tutorials</h3>
              <p>Follow step-by-step guides on any digital topic. Clear, simple instructions.</p>
              <Link to="/seekhna" className="card-link">Go to Seekhna →</Link>
            </div>
            <div className="card feature-card">
              <div className="feature-number">3</div>
              <h3>Join Community</h3>
              <p>Connect with others learning digital skills and share your experience.</p>
              <Link to="/community" className="card-link">Go to Community →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="grid grid-4">
            <div className="stat-card">
              <div className="stat-number">500+</div>
              <p>Active Users</p>
            </div>
            <div className="stat-card">
              <div className="stat-number">50+</div>
              <p>Tutorials</p>
            </div>
            <div className="stat-card">
              <div className="stat-number">20+</div>
              <p>Topics</p>
            </div>
            <div className="stat-card">
              <div className="stat-number">24/7</div>
              <p>Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta alt">
        <div className="container container-sm">
          <h2>Ready to Learn?</h2>
          <p>Start your digital journey today. Choose how you want to learn.</p>
          <div className="cta-buttons">
            <Link to="/poochna" className="btn">Ask Now</Link>
            <Link to="/seekhna" className="btn btn-outline">Browse Tutorials</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
