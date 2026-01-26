import React from 'react';
import './statCard.css';

const StatCard = ({ label, value, icon, trend, color = 'primary', className = '' }) => {
  return (
    <div className={`stats-card ${className}`}>
      <div className="d-flex justify-content-between align-items-start mb-2">
        {icon && (
          <div className={`p-3 rounded bg-${color} bg-opacity-10 text-${color} stats-icon-wrapper`}>
            {icon}
          </div>
        )}
        {trend && (
          <span className={`badge ${trend.startsWith('+') ? 'bg-success' : 'bg-danger'} rounded-pill`}>
            {trend}
          </span>
        )}
      </div>
      <div className="stats-card-value text-truncate">{value}</div>
      <div className="stats-card-label text-truncate">{label}</div>
    </div>
  );
};

export default StatCard;
