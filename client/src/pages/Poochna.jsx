import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import toast from 'react-hot-toast';
import { searchAPI } from '../services/api';
import './Poochna.css';

const Poochna = () => {
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

  return (
    <>
      {/* Hero Search Section */}
      <div className="poochna-hero">
        <div className="container-xl" data-aos="fade-up">
          <div className="poochna-content">
            <h1 className="poochna-title">Ask Your Question</h1>
            <p className="poochna-subtitle">Get instant answers to your digital questions</p>
            <div className="poochna-search-wrapper">
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
                        <span className="spinner-border spinner-border-sm me-2" role="status" />
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
              <p className="text-soft mt-3">
                Ask anything about Pakistani digital services — we have got the answer for you.
              </p>
              
              {/* Quick Topic Pills */}
              <div className="topic-pills mt-4">
                <span className="topic-label">Quick Topics:</span>
                {['CNIC', 'WhatsApp', 'JazzCash', 'NADRA', 'Easypaisa'].map((topic) => (
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
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results */}
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

      {/* Popular Questions Section */}
      <div className="container-xl py-5">
        <h2 className="section-title mb-5" data-aos="fade-right">Popular Questions</h2>
        
        <div className="row g-4">
          {/* Featured Card */}
          <div className="col-lg-8" data-aos="fade-up">
            <div className="featured-question-card">
              <div className="featured-image">
                <img src="https://images.unsplash.com/photo-1568219557405-376e23e4f7cf?w=600&q=80" alt="CNIC" />
              </div>
              <div className="featured-content">
                <span className="badge">Most Searched</span>
                <h3>CNIC & NADRA</h3>
                <p>Apply for, renew, or track your CNIC. We cover document requirements and fees for every citizen.</p>
                <button 
                  className="btn-pakistan"
                  onClick={() => handleSearch('CNIC online apply')}
                >
                  Learn More <i className="fas fa-arrow-right ms-2"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Access Cards */}
          <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
            <div className="quick-card">
              <img src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&q=80" alt="Banking" />
              <div className="quick-card-content">
                <h4>Online Banking</h4>
                <p>Digital account setup and fund transfers.</p>
                <button 
                  className="card-link"
                  onClick={() => handleSearch('online banking Pakistan')}
                >
                  Explore <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
            <div className="quick-card whatsapp-card">
              <div className="whatsapp-content">
                <i className="fab fa-whatsapp"></i>
                <h4>Ask on WhatsApp</h4>
                <p>Chat with our team for instant personal support.</p>
                <a href="#" className="whatsapp-btn">
                  Message Now <i className="fab fa-whatsapp ms-1"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
            <div className="quick-card">
              <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80" alt="Tutorials" />
              <div className="quick-card-content">
                <h4>Video Tutorials</h4>
                <p>Step-by-step visual learning for all services.</p>
                <Link to="/seekhna" className="card-link">
                  Watch Now <i className="fas fa-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-12" data-aos="fade-up" data-aos-delay="400">
            <div className="quick-card horizontal">
              <div className="horizontal-image">
                <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80" alt="Wallets" />
              </div>
              <div className="quick-card-content">
                <h4>Mobile Wallets</h4>
                <p>Master JazzCash & Easypaisa in minutes.</p>
                <button 
                  className="card-link"
                  onClick={() => handleSearch('JazzCash Easypaisa')}
                >
                  Learn <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Topics */}
      {trending.length > 0 && (
        <div className="container-xl mb-5">
          <div className="trending-section" data-aos="fade-up">
            <h3 className="trending-title">
              <i className="fas fa-fire me-2" style={{ color: 'var(--gold)' }}></i>
              Trending This Week
            </h3>
            <div className="trending-list">
              {trending.slice(0, 5).map((topic, i) => (
                <button
                  key={i}
                  className="trending-item"
                  onClick={() => handleSearch(topic.title_english)}
                >
                  <span className="trend-rank">#{i + 1}</span>
                  <span className="trend-name">{topic.title_urdu}</span>
                  <span className={`trend-direction ${topic.trend_direction}`}>
                    {topic.trend_direction === 'rising' && <i className="fas fa-arrow-up"></i>}
                    {topic.trend_direction === 'falling' && <i className="fas fa-arrow-down"></i>}
                    {topic.trend_direction === 'stable' && <i className="fas fa-minus"></i>}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Master Section */}
      <div className="container-xl mb-5">
        <div className="master-section" data-aos="fade-up">
          <h2 className="section-title text-center mb-5">Master Your Digital World</h2>
          
          <div className="steps-flow">
            <div className="flow-step">
              <div className="flow-icon">1</div>
              <span>Ask</span>
            </div>
            <i className="fas fa-arrow-right flow-arrow"></i>
            <div className="flow-step">
              <div className="flow-icon">2</div>
              <span>Read</span>
            </div>
            <i className="fas fa-arrow-right flow-arrow"></i>
            <div className="flow-step">
              <div className="flow-icon">3</div>
              <span>Watch</span>
            </div>
            <i className="fas fa-arrow-right flow-arrow"></i>
            <div className="flow-step">
              <div className="flow-icon">4</div>
              <span>Try</span>
            </div>
          </div>
          
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <p className="text-soft mb-4">
                Asaan Digital 2.0 makes learning digital skills simple. Start by asking any question. 
                Our platform provides clear guides to help you go from a beginner to a confident user.
              </p>
              <div className="d-flex flex-wrap gap-3 justify-content-center">
                <Link to="/poochna" className="btn-pakistan">کچھ پوچھنا ہے؟</Link>
                <Link to="/seekhna" className="btn-pakistan-outline">کچھ سیکھنا ہے؟</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Alert */}
      <div className="container-xl mb-5">
        <div className="safety-alert">
          <div className="safety-icon">
            <i className="fas fa-shield-alt"></i>
          </div>
          <div className="safety-content">
            <h4>Why Use Asaan Digital 2.0 Poochna?</h4>
            <p>Unlike generic search engines, we provide localized, tested, and verified answers in Urdu and Roman Urdu. Every process is tested by our team personally.</p>
            <div className="warning-message">
              <i className="fas fa-exclamation-triangle me-2"></i>
              <strong>Important:</strong> Asaan Digital 2.0 will never ask for your bank passwords or OTP. Hang up on fraudulent calls immediately.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Poochna;
