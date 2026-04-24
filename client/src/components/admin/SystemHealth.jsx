import React from 'react';
import { formatNumber, formatFileSize } from '../../utils/formatters';
import './SystemHealth.css';

const SystemHealth = ({ data = {}, loading = false }) => {
  if (loading) {
    return (
      <div className="system-health">
        <div className="health-header">
          <h3><i className="fas fa-heartbeat me-2"></i>System Health</h3>
        </div>
        <div className="health-loading">
          <div className="spinner-border" style={{ color: 'var(--green)' }} role="status" />
          <p className="mt-2">Loading system metrics...</p>
        </div>
      </div>
    );
  }

  const healthMetrics = [
    {
      title: 'Database',
      icon: 'fas fa-database',
      metrics: [
        {
          label: 'Status',
          value: data.db_size_mb ? 'Connected' : 'Unknown',
          type: 'status',
          status: data.db_size_mb ? 'healthy' : 'warning',
        },
        {
          label: 'Size',
          value: data.db_size_mb ? `${data.db_size_mb} MB` : 'N/A',
          type: 'text',
        },
        {
          label: 'Active Connections',
          value: data.active_connections || 0,
          type: 'number',
        },
        {
          label: 'Uptime',
          value: data.uptime_hours ? `${data.uptime_hours}h` : 'N/A',
          type: 'text',
        },
      ],
    },
    {
      title: 'Query Performance',
      icon: 'fas fa-tachometer-alt',
      metrics: [
        {
          label: 'Avg Response Time',
          value: data.avg_response_time ? `${data.avg_response_time}ms` : 'N/A',
          type: 'text',
        },
        {
          label: 'Success Rate',
          value: data.success_rate_24h ? `${data.success_rate_24h}%` : 'N/A',
          type: 'percentage',
          good: data.success_rate_24h > 80,
        },
        {
          label: 'Slow Queries (1h)',
          value: data.slow_queries_last_hour || 0,
          type: 'number',
          warning: data.slow_queries_last_hour > 10,
        },
      ],
    },
    {
      title: 'Cache',
      icon: 'fas fa-bolt',
      metrics: [
        {
          label: 'Cache Hit Ratio',
          value: data.cache_hit_ratio ? `${data.cache_hit_ratio}%` : 'N/A',
          type: 'percentage',
          good: data.cache_hit_ratio > 90,
        },
        {
          label: 'Status',
          value: data.cache_hit_ratio > 90 ? 'Optimal' : 'Degraded',
          type: 'status',
          status: data.cache_hit_ratio > 90 ? 'healthy' : 'warning',
        },
      ],
    },
  ];

  return (
    <div className="system-health">
      <div className="health-header">
        <h3><i className="fas fa-heartbeat me-2"></i>System Health</h3>
        <span className="health-timestamp">
          {new Date().toLocaleTimeString()}
        </span>
      </div>

      <div className="health-metrics-grid">
        {healthMetrics.map((section, i) => (
          <div key={i} className="health-section">
            <div className="health-section-header">
              <i className={section.icon}></i>
              <h4>{section.title}</h4>
            </div>
            <div className="health-metrics-list">
              {section.metrics.map((metric, j) => (
                <div key={j} className="health-metric-item">
                  <span className="health-metric-label">{metric.label}</span>
                  {metric.type === 'status' ? (
                    <span className={`health-status ${metric.status}`}>
                      <span className="status-indicator"></span>
                      {metric.value}
                    </span>
                  ) : metric.type === 'percentage' ? (
                    <span className={`health-value ${metric.good ? 'good' : ''} ${metric.warning ? 'warning' : ''}`}>
                      {metric.value}
                    </span>
                  ) : (
                    <span className={`health-value ${metric.warning ? 'warning' : ''}`}>
                      {metric.value}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="health-actions">
        <button className="health-action-btn" onClick={() => window.location.reload()}>
          <i className="fas fa-sync-alt me-2"></i>
          Refresh Metrics
        </button>
        <button className="health-action-btn secondary">
          <i className="fas fa-download me-2"></i>
          Export Report
        </button>
      </div>
    </div>
  );
};

export default SystemHealth;