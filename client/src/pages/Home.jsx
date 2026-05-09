import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import toast from 'react-hot-toast';
import { searchAPI } from '../services/api';
import './Home.css';
import NetworkWeb from './NetworkWeb';

const Home = () => {
  const [counters, setCounters] = useState({
    guides: 0,
    users: 0,
    topics: 0,
    team: 3
  });

  const statsRef = useRef(null);
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 300);
  const [suggestions, setSuggestions] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [trending, setTrending] = useState([]);
  const [sessionId] = useState(() => {
    let sid = localStorage.getItem('sessionId');
    if (!sid) {
      sid = crypto.randomUUID?.() || Math.random().toString(36).substring(2);
      localStorage.setItem('sessionId', sid);
    }
    return sid;
  });

  // Fetch trending topics on mount
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await searchAPI.getTrending(7);
        setTrending(res.data || []);
      } catch (error) {
        console.error('Failed to fetch trending:', error);
      }
    };
    fetchTrending();
  }, []);

  // Fetch suggestions as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await searchAPI.getSuggestions(debouncedQuery);
        setSuggestions(res.data || []);
      } catch (error) {
        console.error('Suggestion error:', error);
      }
    };
    fetchSuggestions();
  }, [debouncedQuery]);

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      toast.error('Please enter at least 2 characters');
      return;
    }

    setLoading(true);
    setSuggestions([]);

    try {
      const res = await searchAPI.search(searchQuery.trim(), sessionId);
      setResults(res);
      
      if (res.status === 'failed') {
        toast.error(res.message_english || 'No results found');
      } else if (res.status === 'success') {
        toast.success('Found matching tutorial!');
      }
    } catch (error) {
      toast.error('Search failed. Please try again.');
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  const getConfidenceClass = (confidence) => {
    if (confidence >= 0.8) return 'high-confidence';
    if (confidence >= 0.5) return 'medium-confidence';
    return 'low-confidence';
  };
  useEffect(() => {
    const targetCounts = { guides: 500, users: 10000, topics: 50 };
    
    const animateCounter = (key, target, duration = 2000) => {
      let start = 0;
      const increment = target / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCounters(prev => ({ ...prev, [key]: Math.floor(target) }));
          clearInterval(timer);
        } else {
          setCounters(prev => ({ ...prev, [key]: Math.floor(start) }));
        }
      }, 16);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter('guides', targetCounts.guides);
          animateCounter('users', targetCounts.users);
          animateCounter('topics', targetCounts.topics);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <NetworkWeb/>
  <div className="container-xl">
    <div className="row justify-content-center">
      
      {/* Center whole hero content */}
      <div className="col-lg-10 text-center">

        {/* Right aligned Urdu heading */}
        <div
          className="hero-urdu-main mb-2 animate-up delay-100"
          dir="rtl"
          style={{
            fontSize: '3.5rem',
            textAlign: 'right',
            width: '100%',
            paddingRight: '300px'
          }}
        >
          آسان ڈیجیٹل
        </div>

        <div
          className="hero-urdu-sub animate-up delay-200"
          dir="rtl"
          style={{
            fontSize: '1.8rem',
            textAlign: 'right',
            width: '100%',
            paddingRight: '300px',
            marginBottom: '3rem',
            marginTop: '1rem'
          }}
        >
          اپنی مدد آپ
        </div>

        {/* Search bar */}
        <div className="row justify-content-center">
          <div className="col-md-11">
            <div className="search-bar-wrapper">
              <div className="search-input-group">
                
                <span className="search-icon">
                  <i className="fas fa-search"></i>
                </span>

                <input
                  type="text"
                  className="search-input"
                  placeholder="Type your question here — Urdu, Roman Urdu, or English..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                />

                <button
                  className="search-btn"
                  onClick={() => handleSearch()}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      />
                      Searching...
                    </>
                  ) : (
                    'Ask'
                  )}
                </button>
              </div>

              {/* Suggestions Dropdown */}
              {suggestions.length > 0 && (
                <div className="suggestions-dropdown">
                  {suggestions.map((suggestion, i) => (
                    <div
                      key={i}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <i className="fas fa-search me-2"></i>
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Increased spacing below search bar */}
            <div
              className="topic-pills"
              style={{ marginTop: '2.5rem' }}
            >
              <span className="topic-label">Quick Topics:</span>

              {['CNIC', 'WhatsApp', 'JazzCash', 'NADRA', 'Easypaisa'].map(
                (topic) => (
                  <button
                    key={topic}
                    className="topic-pill"
                    onClick={() => {
                      setQuery(topic);
                      handleSearch(topic);
                    }}
                  >
                    {topic}
                  </button>
                )
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</section>
{results && (
        <div className="container-xl py-4">
          <div className="results-section" data-aos="fade-up">
            {results.status === 'success' ? (
              <div className="result-card success">
                <div className="result-header">
                  <div className={`confidence-badge ${getConfidenceClass(results.confidence)}`}>
                    <i className="fas fa-chart-line me-1"></i>
                    {Math.round(results.confidence * 100)}% Match
                  </div>
                  <span className="matched-keyword">
                    Matched: "{results.matched_keyword}"
                  </span>
                </div>
                
                <h2 className="result-title">
                  {results.tutorial_title?.urdu}
                </h2>
                <p className="result-subtitle">
                  {results.tutorial_title?.english}
                </p>
                
                <div className="result-meta">
                  <span className="meta-item">
                    <i className="fas fa-folder"></i> {results.category}
                  </span>
                  <span className="meta-item">
                    <i className="fas fa-clock"></i> {results.response_time_ms}ms
                  </span>
                </div>
                
                <Link 
                  to={`/tutorial/${results.tutorial_id}`}
                  className="view-tutorial-btn"
                >
                  View Full Tutorial <i className="fas fa-arrow-right ms-2"></i>
                </Link>
              </div>
            ) : (
              <div className="result-card failed">
                <div className="failed-icon">
                  <i className="fas fa-search"></i>
                </div>
                <h3>{results.message_urdu}</h3>
                <p>{results.message_english}</p>
                
                {results.suggestions && results.suggestions.length > 0 && (
                  <div className="search-suggestions">
                    <p>Try searching for:</p>
                    <div className="suggestion-pills">
                      {results.suggestions.map((s, i) => (
                        <button
                          key={i}
                          className="suggestion-pill"
                          onClick={() => handleSuggestionClick(s)}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      {/* Explore Section */}
<section className="explore-section">
  <NetworkWeb />
  <div className="explore-inner">
    <div className="text-center mb-5" data-aos="fade-up">
  <h2 className="explore-title" style={{ textAlign: 'center' }}>
    Explore Karo — ایکسپلور کریں
  </h2>
  <p className="section-sub" style={{ textAlign: 'center', marginBottom: '7px' }}>
    Pick a topic and start learning in minutes
  </p>
</div>

    <div className="container-xl">
      <div className="explore-cards-grid">
        {[
          { key: 'whatsapp',  icon: '', tag: 'Messaging',       title: 'WhatsApp',           urdu: 'واٹس ایپ',        desc: 'Send messages, voice notes, and video calls step by step.' },
          { key: 'payments',  icon: '', tag: 'Finance',          title: 'Digital Payments',   urdu: 'ڈیجیٹل ادائیگی', desc: 'JazzCash, Easypaisa, and online banking made simple.' },
          { key: 'gov',       icon: '', tag: 'Public Portals',   title: 'Govt Services',      urdu: 'سرکاری خدمات',    desc: 'NADRA, CNIC, passport and FBR guides in plain Urdu.' },
          { key: 'safety',    icon: '', tag: 'Stay Safe',         title: 'Online Safety',      urdu: 'آن لائن حفاظت',   desc: 'Protect yourself from scams, fraud, and fake accounts.' },
          { key: 'phone',     icon: '', tag: 'Beginner Journey',  title: 'Phone Basics',       urdu: 'فون بنیادیات',    desc: 'Learn to use your smartphone from scratch.' },
          { key: 'jobs',      icon: '', tag: 'Career',            title: 'Job Applications',   urdu: 'نوکری درخواست',   desc: 'Write a CV and apply online for jobs across Pakistan.' },
        ].map((card, i) => (
          <Link
            to={`/seekhna?category=${card.key}`}
            className="explore-card"
            key={card.key}
            data-aos="fade-up"
            data-aos-delay={100 + i * 80}
          >
            <div className="explore-card-icon">{card.icon}</div>
            <div className="explore-card-tag">{card.tag}</div>
            <div className="explore-card-title">{card.title}</div>
            <div className="explore-card-urdu" dir="rtl">{card.urdu}</div>
            <p className="explore-card-desc">{card.desc}</p>
            <span className="explore-card-cta">Explore <i className="fas fa-arrow-right ms-1"></i></span>
          </Link>
            
        ))}
      </div>
    </div>
  </div>
</section>
      {/* Stats Section */}
    <section className="stats-section" ref={statsRef}>
  <div className="container-xl">
    <div className="row">
      <div className="stat-card" data-aos="fade-up" data-aos-delay="100">
        <div className="stat-number">{counters.guides}+</div>
        <div className="stat-label">Digital Guides</div>
      </div>
      <div className="stat-card" data-aos="fade-up" data-aos-delay="200">
        <div className="stat-number">{counters.users.toLocaleString()}+</div>
        <div className="stat-label">Happy Users</div>
      </div>
      <div className="stat-card" data-aos="fade-up" data-aos-delay="300">
        <div className="stat-number">{counters.topics}+</div>
        <div className="stat-label">Topics Covered</div>
      </div>
      <div className="stat-card" data-aos="fade-up" data-aos-delay="400">
        <div className="stat-number">{counters.team}</div>
        <div className="stat-label">Team Members</div>
      </div>
    </div>
  </div>
</section>

      {/* Problems Section */}
      <section className="py-5">
        <div className="container-xl">
          <div className="text-center mb-5" data-aos="fade-up">
            <h2 className="section-title">ہم کیا مسئلہ حل کر رہے ہیں؟</h2>
            <p className="section-sub">What Problems Are We Solving?</p>
          </div>
          <div className="row g-4 justify-content-center">
            <div className="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="100">
              <div className="card-alt text-center">
                <div className="display-5 mb-3">
                  <img src="/images/language-barrier.png" alt="Language Barrier" />
                </div>
                <h3 className="h4 fw-bold mb-3" style={{ color: 'var(--green)' }}>Language Barrier</h3>
                <p className="text-soft">
                  Breaking every process down in simple Urdu and Roman Urdu, making technology accessible to over 60% of the population.
                </p>
              </div>
            </div>
            <div className="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="200">
              <div className="card-alt text-center">
                <div className="display-5 mb-3">
                  <img src="/images/digital-illiteracy.png" alt="Digital Illiteracy" />
                </div>
                <h3 className="h4 fw-bold mb-3" style={{ color: 'var(--green)' }}>Digital Illiteracy</h3>
                <p className="text-soft">
                  Teaching essential digital skills step by step, from basic navigation to advanced online transactions.
                </p>
              </div>
            </div>
            <div className="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="300">
              <div className="card-alt text-center">
                <div className="display-5 mb-3">
                  <img src="/images/confusing-portals.png" alt="Confusing Portals" />
                </div>
                <h3 className="h4 fw-bold mb-3" style={{ color: 'var(--green)' }}>Confusing Portals</h3>
                <p className="text-soft">
                  Providing clear, numbered walkthroughs for complex government portals like NADRA, FBR, and Passports.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-5">
        <div className="container-xl">
          <div className="row align-items-center g-5">
            <div className="col-lg-6" data-aos="fade-right">
              <h2 className="section-title mb-4">ہمارا مشن</h2>
              <div className="card-elegant mb-3">
                <p className="m-0">
                  Making digital Pakistan accessible to every citizen, removing language barriers that prevent millions from using digital tools.
                </p>
              </div>
              <div className="card-elegant mb-3">
                <p className="m-0">
                  Serving both urban users and rural communities who have never had proper digital guidance for government services.
                </p>
              </div>
              <div className="card-elegant">
                <p className="m-0">
                  A trusted digital companion for Karachi, Lahore, Peshawar, and every village in between. Apni Madad Aap.
                </p>
              </div>
            </div>
            <div className="col-lg-6" data-aos="fade-left">
              <div className="mission-grid">
                <div className="mission-cluster">
                  <img src="/images/pic1.png" alt="Digital Pakistan" className="mission-piece d1" />
                  <img src="/images/pic2.png" alt="Community" className="mission-piece d2" />
                  <img src="/images/pic3.png" alt="Students" className="mission-piece d3" />
                  <img src="/images/pic4.png" alt="Rural" className="mission-piece d4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-5" style={{ background: 'var(--cream)' }}>
        <div className="container-xl">
          <div className="text-center mb-5" data-aos="fade-up">
            <h2 className="section-title">یہ کیسے کام کرتا ہے</h2>
            <p className="section-sub">Four simple steps to digital confidence</p>
          </div>
          <div className="row g-4">
            {[
              { num: 1, title: 'Ask a Question', desc: 'Type your problem in Urdu, Roman Urdu, or English.' },
              { num: 2, title: 'We Process It', desc: 'Our system finds the most relevant guide or answer for you.' },
              { num: 3, title: 'Get Your Answer', desc: 'Receive clear, numbered instructions without technical jargon.' },
              { num: 4, title: 'Take Action', desc: 'Follow the steps and complete your task confidently.' }
            ].map((step, i) => (
              <div className="col-sm-6 col-lg-3" key={i} data-aos="fade-up" data-aos-delay={100 + i * 100}>
                <div className="step-card">
                  <div className="step-number">{step.num}</div>
                  <h3 className="fw-bold">{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container-xl">
          <div className="text-center mb-5" data-aos="fade-up">
            <h2 className="section-title">ہماری خصوصیات</h2>
            <p className="section-sub">Everything you need in one place</p>
          </div>
          <div className="row g-4">
            <div className="col-md-6" data-aos="fade-right" data-aos-delay="100">
              <div className="feature-card">
                <div className="urdu-feature-title" dir="rtl">کچھ سیکھنا ہے؟</div>
                <p className="text-soft">
                  Step-by-step guides on Digital Basics, Government Services, and Job Applications. Written in plain English and Roman Urdu.
                </p>
                <Link to="/seekhna" className="btn-feature">Explore Seekhna →</Link>
              </div>
            </div>
            <div className="col-md-6" data-aos="fade-left" data-aos-delay="200">
              <div className="feature-card">
                <div className="urdu-feature-title" dir="rtl">کچھ پوچھنا ہے؟</div>
                <p className="text-soft">
                  A safe space to get answers about CNIC, NADRA, JazzCash, and more. Get a clear answer instantly.
                </p>
                <Link to="/poochna" className="btn-feature">Ask on Poochna →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;