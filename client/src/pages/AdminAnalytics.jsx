import React, { useState, useEffect } from 'react';
import { analyticsAPI, adminAPI } from '../services/api';
import toast from 'react-hot-toast';
import './AdminAnalytics.css';

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('queries');
  const [queryAnalytics, setQueryAnalytics] = useState([]);
  const [userAnalytics, setUserAnalytics] = useState(null);
  const [topSearches, setTopSearches] = useState([]);
  const [performance, setPerformance] = useState(null);
  const [categoryPerf, setCategoryPerf] = useState([]);
  const [coverage, setCoverage] = useState([]);
  const [dailyStats, setDailyStats] = useState([]);
  const [period, setPeriod] = useState('day');
  const [days, setDays] = useState(7);

  useEffect(() => {
    fetchAllAnalytics();
  }, [period, days]);

  const fetchAllAnalytics = async () => {
    try {
      setLoading(true);
      
      const [queryRes, userRes, topRes, perfRes, catRes, covRes, dailyRes] = await Promise.all([
        analyticsAPI.getQueryAnalytics({ period, limit: 30 }),
        analyticsAPI.getUserAnalytics(),
        analyticsAPI.getTopSearches(20, days),
        analyticsAPI.getPerformanceMetrics(),
        analyticsAPI.getCategoryPerformance(),
        analyticsAPI.getContentCoverage(),
        analyticsAPI.getDailyStats(days)
      ]);
      
      setQueryAnalytics(queryRes.data || []);
      setUserAnalytics(userRes.data || null);
      setTopSearches(topRes.data || []);
      setPerformance(perfRes.data || null);
      setCategoryPerf(catRes.data || []);
      setCoverage(covRes.data || []);
      setDailyStats(dailyRes.data || []);
    } catch (error) {
      console.error('Analytics fetch error:', error);
      toast.error('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
  };

  const getSuccessRateColor = (rate) => {
    if (rate >= 80) return '#28a745';
    if (rate >= 50) return '#ffc107';
    return '#dc3545';
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner-border" style={{ color: 'var(--green)' }} role="status" />
        <p className="mt-3">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="admin-analytics">
      {/* Analytics Header */}
      <div className="analytics-header">
        <div className="container-xl">
          <div className="analytics-header-content">
            <div>
              <h1 className="analytics-title">Advanced Analytics</h1>
              <p className="analytics-subtitle">Deep insights into platform usage and performance</p>
            </div>
            <div className="analytics-controls">
              <select 
                className="analytics-select"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                <option value="hour">Hourly</option>
                <option value="day">Daily</option>
                <option value="week">Weekly</option>
                <option value="month">Monthly</option>
              </select>
              <select 
                className="analytics-select"
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
              >
                <option value={7}>Last 7 days</option>
                <option value={14}>Last 14 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>
              <button className="analytics-refresh-btn" onClick={fetchAllAnalytics}>
                <i className="fas fa-sync-alt me-2"></i> Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="container-xl py-4">
        <div className="kpi-grid">
          {userAnalytics && (
            <>
              <div className="kpi-card">
                <div className="kpi-icon sessions">
                  <i className="fas fa-users"></i>
                </div>
                <div className="kpi-info">
                  <span className="kpi-value">{formatNumber(userAnalytics.total_sessions)}</span>
                  <span className="kpi-label">Total Sessions</span>
                </div>
              </div>
              
              <div className="kpi-card">
                <div className="kpi-icon queries">
                  <i className="fas fa-search"></i>
                </div>
                <div className="kpi-info">
                  <span className="kpi-value">{userAnalytics.avg_queries_per_session}</span>
                  <span className="kpi-label">Avg Queries/Session</span>
                </div>
              </div>
              
              <div className="kpi-card">
                <div className="kpi-icon success">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="kpi-info">
                  <span className="kpi-value">{userAnalytics.avg_success_rate}%</span>
                  <span className="kpi-label">Avg Success Rate</span>
                </div>
              </div>
              
              <div className="kpi-card">
                <div className="kpi-icon duration">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="kpi-info">
                  <span className="kpi-value">{Math.round(userAnalytics.avg_session_duration_seconds)}s</span>
                  <span className="kpi-label">Avg Session Duration</span>
                </div>
              </div>
            </>
          )}
          
          {performance && (
            <>
              <div className="kpi-card">
                <div className="kpi-icon perf">
                  <i className="fas fa-tachometer-alt"></i>
                </div>
                <div className="kpi-info">
                  <span className="kpi-value">{performance.avg_response_time}ms</span>
                  <span className="kpi-label">Avg Response Time</span>
                </div>
              </div>
              
              <div className="kpi-card">
                <div className="kpi-icon perf">
                  <i className="fas fa-bolt"></i>
                </div>
                <div className="kpi-info">
                  <span className="kpi-value">{performance.p95_response_time}ms</span>
                  <span className="kpi-label">P95 Response Time</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="container-xl">
        <div className="analytics-tabs">
          {[
            { key: 'queries', label: 'Query Analytics', icon: 'fa-chart-line' },
            { key: 'top-searches', label: 'Top Searches', icon: 'fa-fire' },
            { key: 'categories', label: 'Category Performance', icon: 'fa-layer-group' },
            { key: 'coverage', label: 'Content Coverage', icon: 'fa-chart-pie' },
            { key: 'daily', label: 'Daily Stats', icon: 'fa-calendar-alt' }
          ].map(tab => (
            <button
              key={tab.key}
              className={`analytics-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <i className={`fas ${tab.icon} me-2`}></i>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="container-xl py-4">
        {/* Query Analytics */}
        {activeTab === 'queries' && (
          <div className="analytics-section">
            <h3 className="section-title-sm">
              <i className="fas fa-chart-line me-2"></i>
              Query Volume Over Time
            </h3>
            
            {queryAnalytics.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-chart-bar fa-3x mb-3" style={{ color: 'var(--gold)' }}></i>
                <h4>No query data available</h4>
                <p className="text-soft">Data will appear as users search on the platform</p>
              </div>
            ) : (
              <div className="analytics-table-wrapper">
                <table className="analytics-table">
                  <thead>
                    <tr>
                      <th>Time Period</th>
                      <th>Total Queries</th>
                      <th>Successful</th>
                      <th>Failed</th>
                      <th>Low Confidence</th>
                      <th>Success Rate</th>
                      <th>Avg Response</th>
                      <th>Unique Users</th>
                    </tr>
                  </thead>
                  <tbody>
                    {queryAnalytics.map((row, i) => {
                      const total = parseInt(row.total_queries) || 1;
                      const successRate = ((row.successful_queries / total) * 100).toFixed(1);
                      
                      return (
                        <tr key={i}>
                          <td className="time-cell">
                            {new Date(row.time_period).toLocaleString()}
                          </td>
                          <td><strong>{formatNumber(row.total_queries)}</strong></td>
                          <td className="text-success">{formatNumber(row.successful_queries)}</td>
                          <td className="text-danger">{formatNumber(row.failed_queries)}</td>
                          <td className="text-warning">{formatNumber(row.low_confidence_queries)}</td>
                          <td>
                            <div className="mini-bar-wrapper">
                              <div 
                                className="mini-bar"
                                style={{ 
                                  width: `${successRate}%`,
                                  backgroundColor: getSuccessRateColor(successRate)
                                }}
                              ></div>
                            </div>
                            <small>{successRate}%</small>
                          </td>
                          <td>{row.avg_response_time}ms</td>
                          <td>{formatNumber(row.unique_users)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Query Trend Visualization */}
            {queryAnalytics.length > 0 && (
              <div className="trend-visualization mt-4">
                <h4 className="vis-title">Query Trend (Last {queryAnalytics.length} periods)</h4>
                <div className="trend-bars">
                  {queryAnalytics.slice(0, 24).reverse().map((row, i) => {
                    const maxQueries = Math.max(...queryAnalytics.slice(0, 24).map(r => parseInt(r.total_queries) || 1));
                    const height = ((row.total_queries / maxQueries) * 100).toFixed(0);
                    const successRate = ((row.successful_queries / (row.total_queries || 1)) * 100).toFixed(0);
                    
                    return (
                      <div key={i} className="trend-bar-item" title={`${row.total_queries} queries, ${successRate}% success`}>
                        <div className="trend-bar-stack">
                          <div 
                            className="trend-bar-success"
                            style={{ height: `${(height * successRate / 100)}%` }}
                          ></div>
                          <div 
                            className="trend-bar-failed"
                            style={{ height: `${(height * (100 - successRate) / 100)}%` }}
                          ></div>
                        </div>
                        <span className="trend-bar-label">
                          {new Date(row.time_period).toLocaleDateString('en-US', { weekday: 'short' })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Top Searches */}
        {activeTab === 'top-searches' && (
          <div className="analytics-section">
            <h3 className="section-title-sm">
              <i className="fas fa-fire me-2" style={{ color: 'var(--gold)' }}></i>
              Top Search Terms (Last {days} days)
            </h3>
            
            {topSearches.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-search fa-3x mb-3" style={{ color: 'var(--gold)' }}></i>
                <h4>No search data yet</h4>
              </div>
            ) : (
              <div className="top-searches-list">
                {topSearches.map((item, i) => (
                  <div key={i} className="top-search-item">
                    <div className="top-search-rank">
                      {i < 3 ? (
                        <span className={`rank-medal rank-${i + 1}`}>
                          {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                        </span>
                      ) : (
                        <span className="rank-number">#{i + 1}</span>
                      )}
                    </div>
                    <div className="top-search-info">
                      <span className="top-search-term">{item.search_term}</span>
                      <div className="top-search-stats">
                        <span className="search-stat">
                          <i className="fas fa-search me-1"></i>
                          {formatNumber(item.search_count)} searches
                        </span>
                        <span className="search-stat">
                          <i className="fas fa-users me-1"></i>
                          {formatNumber(item.unique_users)} users
                        </span>
                        <span className="search-stat">
                          <i className="fas fa-clock me-1"></i>
                          {item.avg_response_time}ms avg
                        </span>
                      </div>
                    </div>
                    <div className="top-search-bar-wrapper">
                      <div className="top-search-bar-bg">
                        <div 
                          className="top-search-bar-fill"
                          style={{ 
                            width: `${(item.search_count / (topSearches[0]?.search_count || 1)) * 100}%`
                          }}
                        ></div>
                      </div>
                      <span className="top-search-percent">
                        {((item.search_count / (topSearches[0]?.search_count || 1)) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Category Performance */}
        {activeTab === 'categories' && (
          <div className="analytics-section">
            <h3 className="section-title-sm">
              <i className="fas fa-layer-group me-2"></i>
              Category Performance
            </h3>
            
            {categoryPerf.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-folder-open fa-3x mb-3" style={{ color: 'var(--gold)' }}></i>
                <h4>No category data available</h4>
              </div>
            ) : (
              <div className="category-perf-grid">
                {categoryPerf.map((cat) => (
                  <div key={cat.id} className="category-perf-card">
                    <div className="category-perf-header">
                      <h4 className="category-perf-name">{cat.name_english}</h4>
                      <span className="category-perf-urdu" dir="rtl">{cat.name_urdu}</span>
                    </div>
                    <div className="category-perf-stats">
                      <div className="cat-stat">
                        <span className="cat-stat-val">{cat.tutorial_count}</span>
                        <span className="cat-stat-label">Tutorials</span>
                      </div>
                      <div className="cat-stat">
                        <span className="cat-stat-val">{formatNumber(cat.total_searches)}</span>
                        <span className="cat-stat-label">Searches</span>
                      </div>
                      <div className="cat-stat">
                        <span className="cat-stat-val">{cat.keyword_count || 0}</span>
                        <span className="cat-stat-label">Keywords</span>
                      </div>
                    </div>
                    <div className="category-perf-bar">
                      <div 
                        className="category-perf-fill"
                        style={{ 
                          width: `${Math.min((cat.total_searches / Math.max(...categoryPerf.map(c => c.total_searches || 1))) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Content Coverage */}
        {activeTab === 'coverage' && (
          <div className="analytics-section">
            <h3 className="section-title-sm">
              <i className="fas fa-chart-pie me-2"></i>
              Content Coverage Analysis
            </h3>
            
            {coverage.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-chart-pie fa-3x mb-3" style={{ color: 'var(--gold)' }}></i>
                <h4>No coverage data available</h4>
              </div>
            ) : (
              <div className="coverage-grid">
                {coverage.map((item) => (
                  <div key={item.id} className="coverage-card">
                    <div className="coverage-header">
                      <h5>{item.name_english}</h5>
                      <span className="coverage-percent">{item.tutorial_percentage}%</span>
                    </div>
                    <div className="coverage-bar-track">
                      <div 
                        className="coverage-bar-fill"
                        style={{ width: `${item.tutorial_percentage}%` }}
                      ></div>
                    </div>
                    <div className="coverage-details">
                      <span>{item.tutorial_count} tutorials</span>
                      <span>{item.intent_count} intents</span>
                      <span>{item.keyword_count} keywords</span>
                    </div>
                  </div>
                ))}
                
                {/* Coverage Summary */}
                <div className="coverage-summary">
                  <h5>📊 Coverage Summary</h5>
                  <div className="summary-stats">
                    <div className="summary-stat">
                      <span className="summary-val">
                        {coverage.reduce((sum, c) => sum + parseInt(c.tutorial_count), 0)}
                      </span>
                      <span className="summary-label">Total Tutorials</span>
                    </div>
                    <div className="summary-stat">
                      <span className="summary-val">
                        {coverage.reduce((sum, c) => sum + parseInt(c.intent_count), 0)}
                      </span>
                      <span className="summary-label">Total Intents</span>
                    </div>
                    <div className="summary-stat">
                      <span className="summary-val">
                        {coverage.reduce((sum, c) => sum + parseInt(c.keyword_count), 0)}
                      </span>
                      <span className="summary-label">Total Keywords</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Daily Stats */}
        {activeTab === 'daily' && (
          <div className="analytics-section">
            <h3 className="section-title-sm">
              <i className="fas fa-calendar-alt me-2"></i>
              Daily Platform Statistics
            </h3>
            
            {dailyStats.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-calendar fa-3x mb-3" style={{ color: 'var(--gold)' }}></i>
                <h4>No daily stats available</h4>
              </div>
            ) : (
              <div className="analytics-table-wrapper">
                <table className="analytics-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Total Queries</th>
                      <th>Successful</th>
                      <th>Failed</th>
                      <th>Low Conf.</th>
                      <th>Avg Response</th>
                      <th>P50</th>
                      <th>P95</th>
                      <th>P99</th>
                      <th>Unique Users</th>
                      <th>Tutorials Accessed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyStats.map((row) => (
                      <tr key={row.stat_date}>
                        <td className="time-cell">
                          {new Date(row.stat_date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </td>
                        <td><strong>{formatNumber(row.total_queries)}</strong></td>
                        <td className="text-success">{formatNumber(row.successful_queries)}</td>
                        <td className="text-danger">{formatNumber(row.failed_queries)}</td>
                        <td className="text-warning">{formatNumber(row.low_confidence_queries)}</td>
                        <td>{row.avg_response_ms}ms</td>
                        <td>{row.p50_response_ms}ms</td>
                        <td>{row.p95_response_ms}ms</td>
                        <td>{row.p99_response_ms}ms</td>
                        <td>{formatNumber(row.unique_users)}</td>
                        <td>{row.unique_tutorials_accessed}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAnalytics;