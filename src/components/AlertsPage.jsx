import React, { useState } from 'react';

const AlertsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="h-100 d-flex flex-column bg-white overflow-hidden">
      <div className="alerts-header">
        <h1 className="alerts-title mb-4">Alerts</h1>
        
        <div className="d-flex gap-3 align-items-center">
          <div className="search-input-wrapper flex-grow-1 position-relative">
            <svg className="search-icon position-absolute" width="20" height="20" viewBox="0 0 24 24" fill="none" style={{left: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, color: '#9ca3af'}}>
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <input
              type="text"
              placeholder="Search by location"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control form-control-lg search-input-with-icon custom-focus"
            />
          </div>
          <button className="btn btn-outline-secondary filter-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path 
                d="M3 6h18M7 12h10m-7 6h4" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-grow-1 d-flex align-items-center justify-content-center p-4">
        <div className="no-alerts-message text-center" style={{maxWidth: '400px'}}>
          <p className="no-alerts-text mb-0 fs-5 text-muted lh-base">
            There are currently no recent alerts. Please check again later
          </p>
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;