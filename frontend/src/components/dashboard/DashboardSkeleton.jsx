import React from 'react';
import './DashboardSkeleton.css';

const DashboardSkeleton = () => {
  return (
    <div className="dashboard-container skeleton-dashboard">
      <div className="dashboard-header skeleton-header">
        <div className="skeleton-line title"></div>
        <div className="skeleton-line subtitle"></div>
      </div>

      <div className="skeleton-hero-stats">
        <div className="skeleton-card"></div>
        <div className="skeleton-card"></div>
        <div className="skeleton-card"></div>
      </div>

      <div className="skeleton-card large-card"></div>

      <div className="dashboard-grid">
        <div className="skeleton-card tall-card"></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="skeleton-card medium-card"></div>
          <div className="skeleton-card medium-card"></div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
