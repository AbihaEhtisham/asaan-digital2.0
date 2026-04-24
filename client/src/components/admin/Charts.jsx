import React, { useState } from 'react';
import './Charts.css';

const Charts = ({ queryData = [], heatmapData = null }) => {
  const [chartType, setChartType] = useState('bar');

  // Find max value for scaling
  const maxQueries = Math.max(...queryData.map(d => parseInt(d.total_queries) || 0), 1);

  return (
    <div className="admin-charts">
      {/* Chart Controls */}
      <div className="chart-controls">
        <h3 className="chart-title">
          <i className="fas fa-chart-line me-2"></i>
          Analytics Visualization
        </h3>
        <div className="chart-type-selector">
          <button 
            className={`chart-type-btn ${chartType === 'bar' ? 'active' : ''}`}
            onClick={() => setChartType('bar')}
          >
            <i className="fas fa-chart-bar"></i> Bar
          </button>
          <button 
            className={`chart-type-btn ${chartType === 'line' ? 'active' : ''}`}
            onClick={() => setChartType('line')}
          >
            <i className="fas fa-chart-line"></i> Line
          </button>
          <button 
            className={`chart-type-btn ${chartType === 'heatmap' ? 'active' : ''}`}
            onClick={() => setChartType('heatmap')}
          >
            <i className="fas fa-th"></i> Heatmap
          </button>
        </div>
      </div>

      {/* Bar Chart */}
      {chartType === 'bar' && (
        <div className="bar-chart">
          <div className="chart-y-axis">
            <span>{maxQueries}</span>
            <span>{Math.round(maxQueries / 2)}</span>
            <span>0</span>
          </div>
          <div className="chart-bars-container">
            {queryData.slice(0, 24).reverse().map((row, i) => {
              const height = ((row.total_queries || 0) / maxQueries) * 100;
              const successHeight = ((row.successful_queries || 0) / maxQueries) * 100;
              const failedHeight = ((row.failed_queries || 0) / maxQueries) * 100;

              return (
                <div key={i} className="chart-bar-item" title={`${row.total_queries} total queries`}>
                  <div className="chart-bar-stack" style={{ height: '200px' }}>
                    <div 
                      className="chart-bar-success"
                      style={{ height: `${Math.max(successHeight, 2)}%` }}
                    ></div>
                    <div 
                      className="chart-bar-failed"
                      style={{ height: `${Math.max(failedHeight, 1)}%` }}
                    ></div>
                  </div>
                  <span className="chart-bar-label">
                    {new Date(row.time_period).toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="chart-legend">
            <span className="legend-item">
              <span className="legend-color success"></span> Successful
            </span>
            <span className="legend-item">
              <span className="legend-color failed"></span> Failed
            </span>
          </div>
        </div>
      )}

      {/* Line Chart */}
      {chartType === 'line' && (
        <div className="line-chart">
          <svg className="line-chart-svg" viewBox="0 0 600 250" preserveAspectRatio="xMidYMid meet">
            {/* Grid lines */}
            {[0, 1, 2, 3].map(i => (
              <line
                key={i}
                x1="40"
                y1={50 + i * 50}
                x2="580"
                y2={50 + i * 50}
                stroke="var(--border)"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
            ))}
            
            {/* Success line */}
            <polyline
              fill="none"
              stroke="var(--green)"
              strokeWidth="3"
              points={queryData.slice(0, 20).map((d, i) => {
                const x = 40 + (i / 19) * 540;
                const y = 250 - (((d.successful_queries || 0) / maxQueries) * 180);
                return `${x},${y}`;
              }).join(' ')}
            />
            
            {/* Failed line */}
            <polyline
              fill="none"
              stroke="#dc3545"
              strokeWidth="2"
              strokeDasharray="6,3"
              points={queryData.slice(0, 20).map((d, i) => {
                const x = 40 + (i / 19) * 540;
                const y = 250 - (((d.failed_queries || 0) / maxQueries) * 180);
                return `${x},${y}`;
              }).join(' ')}
            />
          </svg>
          <div className="chart-legend">
            <span className="legend-item">
              <span className="legend-color success"></span> Successful
            </span>
            <span className="legend-item">
              <span className="legend-color failed"></span> Failed
            </span>
          </div>
        </div>
      )}

      {/* Heatmap */}
      {chartType === 'heatmap' && heatmapData && (
        <div className="heatmap-chart">
          <div className="heatmap-header">
            <span>Day / Hour</span>
            <div className="heatmap-hours">
              {Array.from({ length: 24 }, (_, i) => (
                <span key={i} className="heatmap-hour-label">{i}</span>
              ))}
            </div>
          </div>
          <div className="heatmap-body">
            {heatmapData.days?.map((day, dayIndex) => (
              <div key={dayIndex} className="heatmap-row">
                <span className="heatmap-day-label">{day.substring(0, 3)}</span>
                <div className="heatmap-cells">
                  {heatmapData.heatmap?.[dayIndex]?.map((value, hourIndex) => {
                    const maxHeat = Math.max(...(heatmapData.heatmap?.flat() || [1]));
                    const intensity = value / maxHeat;
                    return (
                      <div
                        key={hourIndex}
                        className="heatmap-cell"
                        style={{
                          backgroundColor: `rgba(13, 51, 32, ${Math.max(intensity, 0.05)})`,
                        }}
                        title={`${day}: ${value} queries at ${hourIndex}:00`}
                      >
                        <span className="heatmap-tooltip">{value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="heatmap-legend">
            <span>Low</span>
            <div className="heatmap-gradient"></div>
            <span>High</span>
          </div>
        </div>
      )}

      {/* No Data State */}
      {queryData.length === 0 && chartType !== 'heatmap' && (
        <div className="chart-empty">
          <i className="fas fa-chart-bar fa-3x mb-3" style={{ color: 'var(--gold)' }}></i>
          <h4>No Data Available</h4>
          <p className="text-soft">Analytics data will appear once users start searching.</p>
        </div>
      )}
    </div>
  );
};

export default Charts;