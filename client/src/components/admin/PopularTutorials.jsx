import React from 'react';
import { Link } from 'react-router-dom';
import { formatNumber } from '../../utils/formatters';
import './PopularTutorials.css';

const PopularTutorials = ({ tutorials = [], loading = false }) => {
  if (loading) {
    return (
      <div className="popular-tutorials">
        <div className="section-header">
          <h3><i className="fas fa-fire me-2" style={{ color: 'var(--gold)' }}></i>Popular Tutorials</h3>
        </div>
        <div className="skeleton-list">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton-row">
              <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '30%' }}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!tutorials || tutorials.length === 0) {
    return (
      <div className="popular-tutorials">
        <div className="section-header">
          <h3><i className="fas fa-fire me-2" style={{ color: 'var(--gold)' }}></i>Popular Tutorials</h3>
        </div>
        <div className="empty-list">
          <i className="fas fa-chart-bar fa-2x mb-3" style={{ color: 'var(--gold)' }}></i>
          <p>No tutorial data available yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="popular-tutorials">
      <div className="section-header">
        <h3>
          <i className="fas fa-fire me-2" style={{ color: 'var(--gold)' }}></i>
          Popular Tutorials
        </h3>
        <Link to="/seekhna" className="view-all-link">
          View All <i className="fas fa-arrow-right ms-1"></i>
        </Link>
      </div>

      <div className="popular-list">
        {tutorials.slice(0, 10).map((tutorial, index) => (
          <div key={tutorial.tutorial_id || index} className="popular-item">
            <div className="popular-rank">
              {index < 3 ? (
                <span className={`popular-medal medal-${index + 1}`}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                </span>
              ) : (
                <span className="popular-number">#{index + 1}</span>
              )}
            </div>
            
            <div className="popular-info">
              <Link to={`/tutorial/${tutorial.tutorial_id}`} className="popular-title">
                {tutorial.title_urdu}
              </Link>
              <span className="popular-subtitle">{tutorial.title_english}</span>
              <div className="popular-meta">
                <span className="popular-category">{tutorial.category_name}</span>
                <span className="popular-level">Level {tutorial.difficulty_level}</span>
              </div>
            </div>

            <div className="popular-stats">
              <div className="popular-stat">
                <span className="popular-stat-value">{formatNumber(tutorial.total_searches_7d)}</span>
                <span className="popular-stat-label">Searches (7d)</span>
              </div>
              <div className="popular-stat">
                <span className="popular-stat-value">{tutorial.unique_users_7d || 0}</span>
                <span className="popular-stat-label">Users</span>
              </div>
            </div>

            <div className="popular-activity">
              <span className={`activity-dot ${tutorial.activity_status?.toLowerCase() || 'inactive'}`}></span>
              <span className="activity-text">{tutorial.activity_status || 'Inactive'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularTutorials;