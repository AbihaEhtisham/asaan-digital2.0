import React, { useState, useEffect } from 'react';
import { adminAPI, analyticsAPI } from '../services/api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Admin.css';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedKey = localStorage.getItem('adminKey');
    if (savedKey) {
      setAdminKey(savedKey);
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      localStorage.setItem('adminKey', adminKey);
      
      const dashRes = await adminAPI.getDashboard();
      console.log('dashRes:', dashRes);
      setDashboard(dashRes.data || dashRes);
    } catch (error) {
      toast.error('Failed to fetch admin data');
      console.error('Admin fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (adminKey.trim()) {
      setIsAuthenticated(true);
    }
  };

  const handleRefreshMVs = async () => {
    try {
      await adminAPI.refreshMVs();
      toast.success('Materialized views refreshed!');
    } catch (error) {
      toast.error('Failed to refresh views');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="admin-login-card">
          <div className="admin-login-icon">
            <i className="fas fa-lock"></i>
          </div>
          <h2>Admin Access</h2>
          <p className="text-soft">Enter admin key to continue</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              className="admin-key-input"
              placeholder="Enter admin key..."
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
            />
            <button type="submit" className="btn-pakistan w-100 mt-3">
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner-border" style={{ color: 'var(--green)' }} role="status" />
        <p className="mt-3">Loading dashboard...</p>
      </div>
    );
  }

  const stats = [
    { label: 'Total Tutorials', value: dashboard?.total_tutorials || 0, icon: 'fa-book', color: 'var(--green)' },
    { label: 'Queries (24h)', value: dashboard?.queries_24h?.toLocaleString() || 0, icon: 'fa-search', color: 'var(--gold)' },
    { label: 'Active Users (24h)', value: dashboard?.active_users_24h || 0, icon: 'fa-users', color: '#3498db' },
    { label: 'Content Gaps', value: dashboard?.content_gaps || 0, icon: 'fa-exclamation-triangle', color: '#e74c3c' },
    { label: 'Success Rate (24h)', value: `${dashboard?.success_rate_24h || 0}%`, icon: 'fa-check-circle', color: '#28a745' },
    { label: 'Avg Response', value: `${dashboard?.avg_response_time || 0}ms`, icon: 'fa-clock', color: '#9b59b6' },
  ];

  return (
    <div className="admin-dashboard">
      {/* Admin Header */}
      <div className="admin-header">
        <div className="container-xl">
          <div className="admin-header-content">
            <div>
              <h1 className="admin-title">Admin Dashboard</h1>
              <p className="admin-subtitle">Asaan Digital 2.0 Platform Management</p>
            </div>
            <div className="admin-actions">
              <button className="admin-action-btn" onClick={handleRefreshMVs}>
                <i className="fas fa-sync-alt me-2"></i> Refresh Views
              </button>
              <button className="admin-action-btn" onClick={fetchDashboardData}>
                <i className="fas fa-redo me-2"></i> Refresh Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="container-xl py-4">
        <div className="admin-stats-grid">
          {stats.map((stat, i) => (
            <div key={i} className="admin-stat-card">
              <div className="admin-stat-icon" style={{ backgroundColor: stat.color }}>
                <i className={`fas ${stat.icon}`}></i>
              </div>
              <div className="admin-stat-info">
                <span className="admin-stat-value">{stat.value}</span>
                <span className="admin-stat-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="admin-quick-links mt-4">
          <h3 className="section-title-sm">Quick Navigation</h3>
          <div className="quick-links-grid">
            <Link to="/admin/analytics" className="quick-link-card">
              <i className="fas fa-chart-line fa-2x mb-3" style={{ color: 'var(--gold)' }}></i>
              <h4>Advanced Analytics</h4>
              <p className="text-soft">Deep insights into platform usage</p>
            </Link>
            <Link to="/admin/content" className="quick-link-card">
              <i className="fas fa-book fa-2x mb-3" style={{ color: 'var(--green)' }}></i>
              <h4>Content Management</h4>
              <p className="text-soft">Manage tutorials and keywords</p>
            </Link>
            <Link to="/seekhna" className="quick-link-card">
              <i className="fas fa-graduation-cap fa-2x mb-3" style={{ color: '#3498db' }}></i>
              <h4>View Tutorials</h4>
              <p className="text-soft">See all published tutorials</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;