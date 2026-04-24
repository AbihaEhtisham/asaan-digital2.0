import React from 'react';
import { formatNumber } from '../../utils/formatters';
import './DashboardStats.css';

const DashboardStats = ({ data = {} }) => {
  const stats = [
    {
      id: 'tutorials',
      label: 'Total Tutorials',
      value: data.total_tutorials || 0,
      icon: 'fas fa-book',
      color: 'green',
      change: null,
    },
    {
      id: 'queries',
      label: 'Queries (24h)',
      value: formatNumber(data.queries_24h || 0),
      icon: 'fas fa-search',
      color: 'gold',
      change: null,
    },
    {
      id: 'users',
      label: 'Active Users (24h)',
      value: data.active_users_24h || 0,
      icon: 'fas fa-users',
      color: 'blue',
      change: null,
    },
    {
      id: 'gaps',
      label: 'Content Gaps',
      value: data.content_gaps || 0,
      icon: 'fas fa-exclamation-triangle',
      color: 'red',
      change: null,
    },
    {
      id: 'success',
      label: 'Success Rate (24h)',
      value: `${data.success_rate_24h || 0}%`,
      icon: 'fas fa-check-circle',
      color: 'green',
      change: data.success_rate_24h > 80 ? 'positive' : data.success_rate_24h > 50 ? 'neutral' : 'negative',
    },
    {
      id: 'response',
      label: 'Avg Response Time',
      value: `${data.avg_response_time || 0}ms`,
      icon: 'fas fa-clock',
      color: 'gold',
      change: null,
    },
  ];

  const colorMap = {
    green: { bg: 'var(--green)', text: '#fff' },
    gold: { bg: 'var(--gold)', text: 'var(--black)' },
    blue: { bg: '#3498db', text: '#fff' },
    red: { bg: '#e74c3c', text: '#fff' },
  };

  return (
    <div className="dashboard-stats-grid">
      {stats.map((stat) => (
        <div key={stat.id} className="dashboard-stat-card" data-aos="fade-up" data-aos-delay={100}>
          <div 
            className="dashboard-stat-icon"
            style={{ 
              backgroundColor: colorMap[stat.color]?.bg || 'var(--green)',
              color: colorMap[stat.color]?.text || '#fff'
            }}
          >
            <i className={stat.icon}></i>
          </div>
          <div className="dashboard-stat-info">
            <span className="dashboard-stat-value">{stat.value}</span>
            <span className="dashboard-stat-label">{stat.label}</span>
            {stat.change && (
              <span className={`dashboard-stat-change ${stat.change}`}>
                {stat.change === 'positive' && <i className="fas fa-arrow-up me-1"></i>}
                {stat.change === 'negative' && <i className="fas fa-arrow-down me-1"></i>}
                {stat.change === 'neutral' && <i className="fas fa-minus me-1"></i>}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;