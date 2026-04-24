import React, { useState } from 'react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';
import './ContentGaps.css';

const ContentGaps = ({ gaps = [], onRefresh }) => {
  const [expandedGap, setExpandedGap] = useState(null);
  const [loading, setLoading] = useState(false);

  const getPriorityClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      default: return 'priority-low';
    }
  };

  const getSuggestedCategory = (gap) => {
    if (gap.suggestions?.suggested_category) {
      return gap.suggestions.suggested_category;
    }
    return 'Other';
  };

  const handleCreateTutorial = async (gap) => {
    if (!window.confirm(`Create a new tutorial for: "${gap.normalized_query}"?`)) return;
    
    try {
      setLoading(true);
      // This would typically open a form pre-filled with the gap data
      toast.success('Tutorial creation initiated!');
    } catch (error) {
      toast.error('Failed to create tutorial');
    } finally {
      setLoading(false);
    }
  };

  if (!gaps || gaps.length === 0) {
    return (
      <div className="content-gaps">
        <div className="content-gaps-header">
          <h3 className="gaps-title">
            <i className="fas fa-search-minus me-2"></i>
            Content Gaps Analysis
          </h3>
          {onRefresh && (
            <button className="refresh-btn" onClick={onRefresh} title="Refresh">
              <i className="fas fa-sync-alt"></i>
            </button>
          )}
        </div>
        <div className="gaps-empty">
          <i className="fas fa-check-circle fa-3x mb-3" style={{ color: 'var(--green)' }}></i>
          <h4>No Content Gaps Found!</h4>
          <p className="text-soft">All user queries are being matched successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content-gaps">
      <div className="content-gaps-header">
        <h3 className="gaps-title">
          <i className="fas fa-search-minus me-2"></i>
          Content Gaps ({gaps.length})
        </h3>
        <div className="gaps-header-actions">
          <span className="gaps-subtitle">Queries with no matching tutorials</span>
          {onRefresh && (
            <button className="refresh-btn" onClick={onRefresh} title="Refresh">
              <i className="fas fa-sync-alt"></i>
            </button>
          )}
        </div>
      </div>

      <div className="gaps-table-wrapper">
        <table className="gaps-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Search Query</th>
              <th>Failures</th>
              <th>Users</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {gaps.map((gap, index) => (
              <React.Fragment key={index}>
                <tr 
                  className={`gap-row ${expandedGap === index ? 'expanded' : ''}`}
                  onClick={() => setExpandedGap(expandedGap === index ? null : index)}
                >
                  <td>
                    <span className="gap-rank">
                      {index < 3 ? (
                        <span className={`rank-badge rank-${index + 1}`}>
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                        </span>
                      ) : (
                        `#${gap.gap_rank || index + 1}`
                      )}
                    </span>
                  </td>
                  <td className="query-cell" title={gap.normalized_query}>
                    {gap.normalized_query}
                  </td>
                  <td>
                    <span className="fail-count">{gap.fail_count}</span>
                  </td>
                  <td>
                    <span className="user-count">{gap.unique_users}</span>
                  </td>
                  <td>
                    <span className="category-tag">
                      {getSuggestedCategory(gap)}
                    </span>
                  </td>
                  <td>
                    <span className={`priority-badge ${getPriorityClass(gap.suggestions?.priority)}`}>
                      {gap.suggestions?.priority || 'Low'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="create-tutorial-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCreateTutorial(gap);
                      }}
                      disabled={loading}
                      title="Create tutorial for this query"
                    >
                      <i className="fas fa-plus"></i> Create
                    </button>
                  </td>
                </tr>
                
                {/* Expanded details */}
                {expandedGap === index && (
                  <tr className="gap-details-row">
                    <td colSpan="7">
                      <div className="gap-details">
                        <div className="gap-detail-section">
                          <h5>Sample Queries</h5>
                          <div className="sample-queries">
                            {gap.sample_queries?.map((q, i) => (
                              <span key={i} className="sample-query">{q}</span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="gap-detail-section">
                          <h5>Details</h5>
                          <div className="gap-meta">
                            <span>
                              <strong>Last Searched:</strong> {new Date(gap.last_searched).toLocaleString()}
                            </span>
                            <span>
                              <strong>Avg Response Time:</strong> {gap.avg_response_time}ms
                            </span>
                          </div>
                        </div>
                        
                        <div className="gap-detail-actions">
                          <button
                            className="action-btn primary"
                            onClick={() => handleCreateTutorial(gap)}
                          >
                            <i className="fas fa-plus-circle me-1"></i>
                            Create Tutorial
                          </button>
                          <button className="action-btn secondary">
                            <i className="fas fa-tag me-1"></i>
                            Add Keywords to Existing
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContentGaps;