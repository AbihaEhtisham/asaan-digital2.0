import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tutorialAPI } from '../services/api';
import './Seekhna.css';

const Seekhna = () => {
  const [categories, setCategories] = useState([]);
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, tutRes] = await Promise.all([
          tutorialAPI.getCategories(),
          tutorialAPI.getTutorials({ limit: 100 })
        ]);
        setCategories(catRes.data || []);
        setTutorials(tutRes.data?.tutorials || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categoryTutorials = {
    basics: { title: 'Digital Basics', subtitle: 'Beginner Journey', icon: '📱', color: 'basics' },
    gov: { title: 'Gov Services', subtitle: 'Public Portals', icon: '🏛️', color: 'gov' },
    payments: { title: 'Payments', subtitle: 'Finance', icon: '💳', color: 'payments' },
    smart: { title: 'Smart Services', subtitle: 'Lifestyle', icon: '🚗', color: 'smart' },
    learning: { title: 'Online Learning', subtitle: 'Education', icon: '📚', color: 'learning' }
  };

  const filteredTutorials = tutorials.filter(t => {
    if (selectedCategory && t.category_id !== parseInt(selectedCategory)) return false;
    if (selectedDifficulty && t.difficulty_level !== parseInt(selectedDifficulty)) return false;
    return true;
  });

  const getDifficultyLabel = (level) => {
    const labels = { 1: 'Very Easy', 2: 'Easy', 3: 'Medium', 4: 'Hard', 5: 'Advanced' };
    return labels[level] || 'Easy';
  };

  const getDifficultyColor = (level) => {
    const colors = { 1: '#28a745', 2: '#20c997', 3: '#ffc107', 4: '#fd7e14', 5: '#dc3545' };
    return colors[level] || '#6c757d';
  };

  return (
    <>
      {/* Page Header */}
      <div className="page-header text-center">
        <div className="container-xl" data-aos="zoom-in">
          <div className="hero-urdu-sub mb-3" dir="rtl">
            کچھ <span className="urdu-highlight">سیکھنا</span> ہے؟
          </div>
          <h1 className="display-4 fw-bold" style={{ color: 'var(--green)' }}>
            Kuch Seekhna Hai?
          </h1>
          <p className="text-soft mt-3 mx-auto" style={{ maxWidth: '600px' }}>
            Choose a topic, click the arrow, and start learning — simple, step-by-step guides for everyone.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="container-xl py-4">
        <div className="filters-bar">
          <div className="filter-group">
            <label>Category:</label>
            <div className="filter-options">
              <button 
                className={`filter-btn ${!selectedCategory ? 'active' : ''}`}
                onClick={() => setSelectedCategory(null)}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.name_english}
                </button>
              ))}
            </div>
          </div>
          
          <div className="filter-group">
            <label>Difficulty:</label>
            <div className="filter-options">
              <button 
                className={`filter-btn ${!selectedDifficulty ? 'active' : ''}`}
                onClick={() => setSelectedDifficulty(null)}
              >
                All
              </button>
              {[1, 2, 3, 4, 5].map(level => (
                <button
                  key={level}
                  className={`filter-btn ${selectedDifficulty === level ? 'active' : ''}`}
                  onClick={() => setSelectedDifficulty(level)}
                >
                  {getDifficultyLabel(level)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tutorial Cards */}
      <div className="container-xl py-2">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: 'var(--green)' }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-soft">Loading tutorials...</p>
          </div>
        ) : filteredTutorials.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-search fa-3x mb-3" style={{ color: 'var(--gold)' }}></i>
            <h4>No tutorials found</h4>
            <p className="text-soft">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-4">
            {filteredTutorials.map((tutorial, index) => (
              <div 
                className="tutorial-card" 
                key={tutorial.id}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className={`tutorial-card-accent ${index % 2 === 0 ? 'left' : 'right'}`}>
                  <div className="tutorial-content">
                    <div className="tutorial-badge">
                      {tutorial.category_name}
                    </div>
                    <h2 className="tutorial-title">
                      {tutorial.title_urdu}
                    </h2>
                    <p className="tutorial-subtitle">
                      {tutorial.title_english}
                    </p>
                    <p className="tutorial-desc">
                      {tutorial.description_english?.substring(0, 150)}...
                    </p>
                    
                    <div className="tutorial-meta">
                      <span className="meta-tag difficulty" style={{ borderColor: getDifficultyColor(tutorial.difficulty_level) }}>
                        <i className="fas fa-signal me-1"></i>
                        {getDifficultyLabel(tutorial.difficulty_level)}
                      </span>
                      <span className="meta-tag">
                        <i className="fas fa-list me-1"></i>
                        {tutorial.step_count || 'Multiple'} Steps
                      </span>
                      <span className="meta-tag">
                        <i className="fas fa-clock me-1"></i>
                        {tutorial.estimated_time_minutes || 5} min
                      </span>
                    </div>
                    
                    <Link 
                      to={`/tutorial/${tutorial.id}`}
                      className="start-tutorial-btn"
                    >
                      Start Learning <i className="fas fa-arrow-right ms-2"></i>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Category Sections */}
      <div className="container-xl py-4">
        <div className="d-flex flex-column gap-4">
          {Object.entries(categoryTutorials).map(([key, cat]) => (
            <div className="category-banner" key={key} data-aos="fade-up">
              <div className={`category-banner-accent ${cat.color}`}>
                <div className="category-banner-content">
                  <span className="category-subtitle">{cat.subtitle}</span>
                  <h3 className="category-title">{cat.title}</h3>
                  <Link 
                    to={`/seekhna?category=${key}`}
                    className="category-link"
                  >
                    Explore All <i className="fas fa-arrow-right ms-1"></i>
                  </Link>
                </div>
                <div className="category-icon">
                  {cat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tip Alert */}
      <div className="container-xl mb-5">
        <div className="tip-alert" data-aos="zoom-in">
          <div className="tip-icon">
            <i className="fas fa-lightbulb"></i>
          </div>
          <div className="tip-content">
            <strong>Seekhna Tip:</strong> All our guides are free and tested on real Pakistani platforms. 
            Click the buttons above to access complete tutorials with screenshots.
          </div>
        </div>
      </div>
    </>
  );
};

export default Seekhna;