import React from 'react';
import './StatCard.css';

const StatCard = ({ label, value, icon, trend, color = 'primary', className = '' }) => {
  return (
    <div className={`stats-card ${className}`}>
      <div className="d-flex align-items-center gap-3">
        {icon && (
          <div className={`p-2 rounded bg-${color} bg-opacity-10 text-${color} stats-icon-wrapper`}>
            {icon}
          </div>
        )}
        <div className="flex-grow-1 min-w-0">
          <div className="d-flex justify-content-between align-items-center mb-0">
            <div className="stats-card-value text-truncate mb-0">{value}</div>
            {trend && (
              <span className={`badge ${trend.startsWith('+') ? 'bg-success' : 'bg-danger'} rounded-pill stats-card-trend`}>
                {trend}
              </span>
            )}
          </div>
          <div className="stats-card-label text-truncate">{label}</div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
