import React, { useState } from 'react';
import HousingForm from './HousingForm';
import EmergencyChecklist from './EmergencyChecklist';

const PreparePage = () => {
  const [showHousingForm, setShowHousingForm] = useState(false);
  const [showChecklistForm, setShowChecklistForm] = useState(false);

  const handleResubmit = (itemType) => {
    console.log(`Resubmit ${itemType}`);
    if (itemType === 'temporary housing form') {
      setShowHousingForm(true);
    } else if (itemType === 'emergency checklist') {
      setShowChecklistForm(true);
    }
  };

  const handleView = (itemType) => {
    console.log(`View ${itemType}`);
    if (itemType === 'temporary housing form') {
      setShowHousingForm(true);
    } else if (itemType === 'emergency checklist') {
      setShowChecklistForm(true);
    }
  };

  const handleCloseHousingForm = () => {
    setShowHousingForm(false);
  };

  const handleCloseChecklistForm = () => {
    setShowChecklistForm(false);
  };

  return (
    <>
      <div className="h-100 d-flex flex-column bg-white overflow-hidden">
        {/* Header */}
        <div className="p-4 pb-3">
          <h1 className="text-brand fw-bold mb-0" style={{fontSize: '2.5rem'}}>Prepare</h1>
        </div>

        {/* Content */}
        <div className="flex-grow-1 overflow-auto px-4 pb-5">
          {/* Emergency Checklist Card */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="position-relative">
              <img 
                src="/preparechecklist.png" 
                alt="Emergency supplies" 
                className="card-img-top"
                style={{height: '180px', objectFit: 'cover'}}
              />
              <div className="position-absolute top-0 start-0 m-3">
              </div>
            </div>
            <div className="card-body p-4">
              <h3 className="card-title h4 fw-bold mb-3">Emergency Checklist</h3>
              <p className="card-text text-muted mb-4" style={{lineHeight: '1.5'}}>
                A checklist builder to help you have all your resources in one place in case of an emergency
              </p>
              <div className="d-flex justify-content-between align-items-center">
                <button 
                  className="btn btn-link p-0 text-decoration-none"
                  onClick={() => handleResubmit('emergency checklist')}
                  style={{color: '#84B5CE', fontSize: '1.1rem'}}
                >
                  Redo
                </button>
                <button 
                  className="btn text-white px-4 py-2 fw-medium"
                  onClick={() => handleView('emergency checklist')}
                  style={{
                    backgroundColor: '#1e3a5f',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                >
                  View
                </button>
              </div>
            </div>
          </div>

          {/* Temporary Housing Form Card */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="position-relative">
              <img 
                src="/preparehouse.png" 
                alt="Temporary housing" 
                className="card-img-top"
                style={{height: '180px', objectFit: 'cover'}}
              />
              <div className="position-absolute top-0 start-0 m-3">
              </div>
            </div>
            <div className="card-body p-4">
              <h3 className="card-title h4 fw-bold mb-3">Temporary Housing Form</h3>
              <p className="card-text text-muted mb-4" style={{lineHeight: '1.5'}}>
                A short form to apply for temporary housing
              </p>
              <div className="d-flex justify-content-between align-items-center">
                <button 
                  className="btn btn-link p-0 text-decoration-none"
                  onClick={() => handleResubmit('temporary housing form')}
                  style={{color: '#84B5CE', fontSize: '1.1rem'}}
                >
                  Resubmit
                </button>
                <button 
                  className="btn text-white px-4 py-2 fw-medium"
                  onClick={() => handleView('temporary housing form')}
                  style={{
                    backgroundColor: '#1e3a5f',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                >
                  View
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Temporary Housing Form Modal */}
      {showHousingForm && (
        <HousingForm onClose={handleCloseHousingForm} />
      )}

      {/* Emergency Checklist Questionnaire Modal */}
      {showChecklistForm && (
        <EmergencyChecklist onClose={handleCloseChecklistForm} />
      )}
    </>
  );
};

export default PreparePage;