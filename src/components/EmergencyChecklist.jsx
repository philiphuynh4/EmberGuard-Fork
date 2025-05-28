import React, { useState } from 'react';
import EmergencyChecklistResult from './EmergencyChecklistResult';

const EmergencyChecklist = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    adults: 0,
    children: 0,
    infants: 0,
    pets: 0,
    accessibilityNeeds: '',
    
    hasAllergies: '',
    takesmedications: '',
    worksOnsite: '',
    preparationTime: '',
    
    county: '',
    buildingType: ''
  });

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const incrementCounter = (field) => {
    setFormData(prev => ({ ...prev, [field]: prev[field] + 1 }));
  };

  const decrementCounter = (field) => {
    setFormData(prev => ({ ...prev, [field]: Math.max(0, prev[field] - 1) }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    console.log('Questionnaire completed:', formData);
    setCurrentStep(4);
  };

  if (currentStep === 0) {
    return (
      <div className="position-fixed top-0 start-0 end-0 bottom-0 bg-white d-flex flex-column" style={{zIndex: 1002}}>
        <div className="p-4 d-flex align-items-center">
          <button 
            className="btn btn-link p-0 me-3"
            onClick={onClose}
            style={{fontSize: '1.5rem', color: '#000'}}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
        </div>

        <div className="flex-grow-1 d-flex flex-column px-4">
          <div className="d-flex flex-column align-items-center mb-4 text-center">
            <div className="rounded-circle overflow-hidden mb-3" style={{width: '80px', height: '80px'}}>
              <img 
                src="/preparechecklist.png" 
                alt="Emergency Checklist" 
                className="w-100 h-100"
                style={{objectFit: 'cover'}}
              />
            </div>
            <h1 className="text-brand fw-bold mb-0" style={{fontSize: '2rem'}}>
              Emergency checklist questionnaire
            </h1>
          </div>

          <div className="flex-grow-1 d-flex flex-column justify-content-center">
            <div className="row justify-content-center">
              <div className="col-lg-8 col-md-10 col-12">
                <p className="text-dark lh-base mb-4" style={{fontSize: '1.1rem'}}>
                  This short form helps us understand your situation so we can create a personalized checklist to 
                  support you before, during, and after a disaster. It is meant for advance planning rather than immediate 
                  emergencies. Based on your responses, we will provide clear steps, tips, and resources to help you 
                  stay safe, informed, and prepared.
                </p>
                
                <div className="text-center p-4 rounded-3 mb-4">
                  <p className="mb-0 fw-medium">
                    Need immediate help? Please dial 911
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pb-4">
            <div className="row justify-content-center">
              <div className="col-lg-6 col-md-8 col-12">
                <button 
                  className="btn text-white w-100 py-3 fw-medium"
                  onClick={() => setCurrentStep(1)}
                  style={{
                    backgroundColor: '#84B5CE',
                    borderRadius: '12px',
                    fontSize: '1.1rem'
                  }}
                >
                  Start
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 4) {
    return <EmergencyChecklistResult formData={formData} onClose={onClose} />;
  }

  return (
    <div className="position-fixed top-0 start-0 end-0 bottom-0 bg-white d-flex flex-column" style={{zIndex: 1002}}>
      <div className="p-4 border-bottom">
        <div className="d-flex justify-content-center align-items-center mb-3 position-relative">
          <button 
            className="btn-close position-absolute end-0"
            onClick={onClose}
            style={{background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer'}}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 6L6 18M6 6L18 18"/>
            </svg>
          </button>
          <div className="text-center">
            <h2 className="mb-0 fw-bold">Emergency checklist questionnaire</h2>
            <p className="text-muted mb-0">Prepare</p>
          </div>
        </div>

        <div className="d-flex justify-content-center gap-4">
          {[1, 2, 3].map(step => (
            <div key={step} className="d-flex flex-column align-items-center">
              <span 
                className={`fw-medium ${currentStep === step ? 'text-dark' : 'text-muted'}`}
                style={{fontSize: '1.1rem'}}
              >
                Step {step}
              </span>
              <div 
                className={`mt-1`}
                style={{
                  width: '40px',
                  height: '3px',
                  backgroundColor: currentStep === step ? '#000' : '#e5e7eb',
                  borderRadius: '2px'
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex-grow-1 overflow-auto p-4">
        {/* Step 1 */}
        {currentStep === 1 && (
          <div>
            <div className="row justify-content-center">
              <div className="col-lg-8 col-md-10">
                <h3 className="fw-bold mb-5 text-center" style={{fontSize: '1.5rem'}}>
                  How many people are there in your household?
                </h3>

                <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                  <div>
                    <h4 className="fw-bold mb-1">Adults</h4>
                    <p className="text-muted mb-0">Ages 13 or above</p>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <button 
                      className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                      onClick={() => decrementCounter('adults')}
                      style={{width: '40px', height: '40px'}}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 12H6"/>
                      </svg>
                    </button>
                    <span className="fw-bold" style={{fontSize: '1.5rem', minWidth: '30px', textAlign: 'center'}}>
                      {formData.adults}
                    </span>
                    <button 
                      className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                      onClick={() => incrementCounter('adults')}
                      style={{width: '40px', height: '40px'}}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                  <div>
                    <h4 className="fw-bold mb-1">Children</h4>
                    <p className="text-muted mb-0">Ages 2-12</p>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <button 
                      className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                      onClick={() => decrementCounter('children')}
                      style={{width: '40px', height: '40px'}}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 12H6"/>
                      </svg>
                    </button>
                    <span className="fw-bold" style={{fontSize: '1.5rem', minWidth: '30px', textAlign: 'center'}}>
                      {formData.children}
                    </span>
                    <button 
                      className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                      onClick={() => incrementCounter('children')}
                      style={{width: '40px', height: '40px'}}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                  <div>
                    <h4 className="fw-bold mb-1">Infants</h4>
                    <p className="text-muted mb-0">Under 2</p>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <button 
                      className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                      onClick={() => decrementCounter('infants')}
                      style={{width: '40px', height: '40px'}}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 12H6"/>
                      </svg>
                    </button>
                    <span className="fw-bold" style={{fontSize: '1.5rem', minWidth: '30px', textAlign: 'center'}}>
                      {formData.infants}
                    </span>
                    <button 
                      className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                      onClick={() => incrementCounter('infants')}
                      style={{width: '40px', height: '40px'}}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-5 pb-3 border-bottom">
                  <div>
                    <h4 className="fw-bold mb-1">Pets</h4>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <button 
                      className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                      onClick={() => decrementCounter('pets')}
                      style={{width: '40px', height: '40px'}}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 12H6"/>
                      </svg>
                    </button>
                    <span className="fw-bold" style={{fontSize: '1.5rem', minWidth: '30px', textAlign: 'center'}}>
                      {formData.pets}
                    </span>
                    <button 
                      className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                      onClick={() => incrementCounter('pets')}
                      style={{width: '40px', height: '40px'}}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="mb-5">
                  <h3 className="fw-bold mb-3 text-center" style={{fontSize: '1.5rem'}}>
                    Are there any accessibility needs?
                  </h3>
                  <textarea
                    className="form-control form-control-lg custom-focus"
                    rows="4"
                    placeholder="Enter text"
                    value={formData.accessibilityNeeds}
                    onChange={(e) => updateFormData('accessibilityNeeds', e.target.value)}
                    style={{
                      borderRadius: '12px',
                      border: '2px solid #e5e7eb',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 2 */}
        {currentStep === 2 && (
          <div>
            <div className="row justify-content-center">
              <div className="col-lg-8 col-md-10">
                <div className="mb-5">
                  <h3 className="fw-bold mb-4" style={{fontSize: '1.5rem'}}>
                    Do you have any allergies?
                  </h3>
                  <div className="d-flex flex-column gap-3">
                    {['Yes', 'No'].map(option => (
                      <div key={option} className="d-flex align-items-center gap-3">
                        <input
                          type="radio"
                          name="hasAllergies"
                          className="form-check-input"
                          style={{
                            transform: 'scale(1.3)',
                            accentColor: '#84B5CE'
                          }}
                          checked={formData.hasAllergies === option.toLowerCase()}
                          onChange={() => updateFormData('hasAllergies', option.toLowerCase())}
                        />
                        <label className="fw-medium" style={{fontSize: '1.2rem'}}>
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-5">
                  <h3 className="fw-bold mb-4" style={{fontSize: '1.5rem'}}>
                    Do you regularly take medications?
                  </h3>
                  <div className="d-flex flex-column gap-3">
                    {['Yes', 'No'].map(option => (
                      <div key={option} className="d-flex align-items-center gap-3">
                        <input
                          type="radio"
                          name="takesMethaticamedications"
                          className="form-check-input"
                          style={{
                            transform: 'scale(1.3)',
                            accentColor: '#84B5CE'
                          }}
                          checked={formData.takesMethaticamedications === option.toLowerCase()}
                          onChange={() => updateFormData('takesMethaticamedications', option.toLowerCase())}
                        />
                        <label className="fw-medium" style={{fontSize: '1.2rem'}}>
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-5">
                  <h3 className="fw-bold mb-4" style={{fontSize: '1.5rem'}}>
                    Do you work on-site?
                  </h3>
                  <div className="d-flex flex-column gap-3">
                    {['Yes', 'No'].map(option => (
                      <div key={option} className="d-flex align-items-center gap-3">
                        <input
                          type="radio"
                          name="worksOnsite"
                          className="form-check-input"
                          style={{
                            transform: 'scale(1.3)',
                            accentColor: '#84B5CE'
                          }}
                          checked={formData.worksOnsite === option.toLowerCase()}
                          onChange={() => updateFormData('worksOnsite', option.toLowerCase())}
                        />
                        <label className="fw-medium" style={{fontSize: '1.2rem'}}>
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-5">
                  <h3 className="fw-bold mb-4" style={{fontSize: '1.5rem'}}>
                    How well in advance would you like to prepare in case of an emergency?
                  </h3>
                  <div className="d-flex flex-column gap-3">
                    {[
                      {value: '3day', label: '3 day checklist'},
                      {value: '1day', label: '1 day checklist'},
                      {value: '1hour', label: '1 hour checklist'}
                    ].map(option => (
                      <div key={option.value} className="d-flex align-items-center gap-3">
                        <input
                          type="radio"
                          name="preparationTime"
                          className="form-check-input"
                          style={{
                            transform: 'scale(1.3)',
                            accentColor: '#84B5CE'
                          }}
                          checked={formData.preparationTime === option.value}
                          onChange={() => updateFormData('preparationTime', option.value)}
                        />
                        <label className="fw-medium" style={{fontSize: '1.2rem'}}>
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {currentStep === 3 && (
          <div>
            <div className="row justify-content-center">
              <div className="col-lg-8 col-md-10">
                <div className="mb-5">
                  <h2 className="fw-bold mb-4 text-center" style={{fontSize: '1.8rem'}}>
                    Which county do you live in?
                  </h2>
                  <div className="position-relative">
                    <svg 
                      className="position-absolute top-50 translate-middle-y ms-3" 
                      width="20" height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor"
                      style={{color: '#9ca3af', zIndex: 2}}
                    >
                      <circle cx="11" cy="11" r="8" strokeWidth="2"/>
                      <path d="m21 21-4.35-4.35" strokeWidth="2"/>
                    </svg>
                    <input
                      type="text"
                      className="form-control form-control-lg ps-5 custom-focus"
                      placeholder="Search locations"
                      value={formData.county}
                      onChange={(e) => updateFormData('county', e.target.value)}
                      style={{
                        borderRadius: '12px',
                        border: '2px solid #e5e7eb'
                      }}
                    />
                  </div>
                </div>

                <div className="mb-5">
                    <h2 className="fw-bold mb-4 text-center" style={{ fontSize: '1.8rem' }}>
                        What type of building do you live in?
                    </h2>
                    {[
                        { type: 'house', label: 'House', icon: '/thfhouse.png' },
                        { type: 'townhouse', label: 'Townhouse', icon: '/thftown.png' },
                        { type: 'apartment', label: 'Apartment', icon: '/thfapt.png' },
                        { type: 'other', label: 'Other', icon: '/thfshare.png' }
                    ].map(option => (
                    <div
                        key={option.type}
                        className="d-flex align-items-center gap-3 mb-4 p-3 rounded-3"
                        style={{
                            border: formData.buildingType === option.type ? '2px solid #84B5CE' : '2px solid #e5e7eb',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                        onClick={() => updateFormData('buildingType', option.type)}>
                        <input
                            type="radio"
                            name="buildingType"
                            className="form-check-input"
                            style={{
                            transform: 'scale(1.3)',
                            accentColor: '#84B5CE'
                            }}
                            checked={formData.buildingType === option.type}
                            onChange={() => updateFormData('buildingType', option.type)}
                        />
                        <img
                            src={option.icon}
                            alt={option.label}
                            style={{
                                    width: '32px',
                                    height: '32px',
                                    objectFit: 'contain'
                                    }}
                        />
                        <label className="fw-medium flex-grow-1" style={{ fontSize: '1.2rem', cursor: 'pointer' }}>
                            {option.label}
                        </label>
                    </div>
                    ))}
                </div>

                <div className="mb-4 p-4 rounded-3 text-center" style={{backgroundColor: '#f8f9fa'}}>
                  <p className="mb-0 lh-base">
                    Thank you for filling out your details. Once you click finish, your personalized emergency checklist will be generated.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-top d-flex justify-content-between align-items-center">
        <button 
          className="btn btn-link p-0 text-decoration-underline fw-medium"
          onClick={prevStep}
          style={{
            color: '#000',
            fontSize: '1.1rem',
            visibility: currentStep === 1 ? 'hidden' : 'visible'
          }}
        >
          Back
        </button>
        <button 
          className="btn text-white px-5 py-3 fw-medium"
          onClick={currentStep === 3 ? handleFinish : nextStep}
          style={{
            backgroundColor: currentStep === 3 ? '#84B5CE' : '#1e3a5f',
            borderRadius: '12px',
            fontSize: '1.1rem'
          }}
        >
          {currentStep === 3 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default EmergencyChecklist;