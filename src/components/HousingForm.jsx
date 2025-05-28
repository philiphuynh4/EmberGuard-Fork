import React, { useState, useEffect } from 'react';

const HousingForm = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    adults: 0,
    children: 0,
    infants: 0,
    pets: 0,
    accessibilityNeeds: '',

    durationType: 'dates',
    stayDuration: 'week',
    selectedMonth: 'August 2025',
    selectedDates: [],
    dateFlexibility: 'exact',
    preferredLocations: '',
    housingType: [],
    sameEmail: 'yes',
    additionalInfo: ''
  });

  useEffect(() => {
  const startDate = document.getElementById('startDate');
  const endDate = document.getElementById('endDate');

  if (startDate && endDate) {
    startDate.addEventListener('change', (e) => {
      const startDateVal = e.target.value;
      document.getElementById('startDateSelected').innerText = startDateVal;
    });

    endDate.addEventListener('change', (e) => {
      const endDateVal = e.target.value;
      document.getElementById('endDateSelected').innerText = endDateVal;
    });
  }

  return () => {
    if (startDate) startDate.removeEventListener('change', () => {});
    if (endDate) endDate.removeEventListener('change', () => {});
  };
}, [currentStep]);

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
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log('Form completed:', formData);
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const saveForm = () => {
    console.log('Form saved:', formData);
  };

  if (currentStep === 0) {
    return (
      <div className="position-fixed top-0 start-0 end-0 bottom-0 bg-white d-flex flex-column" style={{ zIndex: 1002 }}>
        <div className="p-4 d-flex align-items-center">
          <button
            className="btn btn-link p-0 me-3"
            onClick={onClose}
            style={{ fontSize: '1.5rem', color: '#000' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </div>

        <div className="flex-grow-1 d-flex flex-column px-4">
          <div className="d-flex flex-column align-items-center mb-4 text-center">
            <div className="rounded-circle overflow-hidden mb-3" style={{ width: '80px', height: '80px' }}>
              <img
                src="/preparehouse.png"
                alt="Housing"
                className="w-100 h-100"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <h1 className="text-brand fw-bold mb-0" style={{ fontSize: '2rem' }}>
              Temporary Housing Form
            </h1>
          </div>

          <div className="flex-grow-1 d-flex flex-column justify-content-center">
            <div className="row justify-content-center">
              <div className="col-lg-8 col-md-10 col-12">
                <p className="text-dark" style={{ fontSize: '1.1rem' }}>
                  This short form helps us understand your preferences so we can prepare in advance to
                  connect you with people who have volunteered to offer their homes for temporary housing in the
                  event your home is damaged by a wildfire. While this is not an emergency shelter request, it allows us to
                  support you more quickly if the need arises. This form is intended for non-urgent, short-term housing
                  planning and is fulfilled on a first-come, first-served basis. If your home is affected, our team will use this
                  information to contact you by email within one to seven days with a potential match
                </p>
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

  return (
    <div className="position-fixed top-0 start-0 end-0 bottom-0 bg-white d-flex flex-column" style={{ zIndex: 1002 }}>
      <div className="p-4 border-bottom">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button
            className="btn btn-link p-0 text-decoration-underline"
            onClick={saveForm}
            style={{ color: '#000', fontSize: '1.1rem' }}
          >
            Save
          </button>
          <div className="text-center">
            <h2 className="mb-0 fw-bold">Temporary Housing Form</h2>
            <p className="text-muted mb-0">Prepare</p>
          </div>
          <button
            className="btn-close"
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 6L6 18M6 6L18 18" />
            </svg>
          </button>
        </div>

        <div className="d-flex justify-content-center gap-4">
          {[1, 2, 3].map(step => (
            <div key={step} className="d-flex flex-column align-items-center">
              <span
                className={`fw-medium ${currentStep === step ? 'text-dark' : 'text-muted'}`}
                style={{ fontSize: '1.1rem' }}
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
                <h3 className="fw-bold mb-5 text-center" style={{ fontSize: '1.5rem' }}>
                  How many people need housing?
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
                      style={{ width: '40px', height: '40px' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 12H6" />
                      </svg>
                    </button>
                    <span className="fw-bold" style={{ fontSize: '1.5rem', minWidth: '30px', textAlign: 'center' }}>
                      {formData.adults}
                    </span>
                    <button
                      className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                      onClick={() => incrementCounter('adults')}
                      style={{ width: '40px', height: '40px' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
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
                      style={{ width: '40px', height: '40px' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 12H6" />
                      </svg>
                    </button>
                    <span className="fw-bold" style={{ fontSize: '1.5rem', minWidth: '30px', textAlign: 'center' }}>
                      {formData.children}
                    </span>
                    <button
                      className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                      onClick={() => incrementCounter('children')}
                      style={{ width: '40px', height: '40px' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
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
                      style={{ width: '40px', height: '40px' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 12H6" />
                      </svg>
                    </button>
                    <span className="fw-bold" style={{ fontSize: '1.5rem', minWidth: '30px', textAlign: 'center' }}>
                      {formData.infants}
                    </span>
                    <button
                      className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                      onClick={() => incrementCounter('infants')}
                      style={{ width: '40px', height: '40px' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
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
                      style={{ width: '40px', height: '40px' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 12H6" />
                      </svg>
                    </button>
                    <span className="fw-bold" style={{ fontSize: '1.5rem', minWidth: '30px', textAlign: 'center' }}>
                      {formData.pets}
                    </span>
                    <button
                      className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                      onClick={() => incrementCounter('pets')}
                      style={{ width: '40px', height: '40px' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="mb-5">
                  <h3 className="fw-bold mb-3 text-center" style={{ fontSize: '1.5rem' }}>
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
            <h3 className="fw-bold mb-4 text-center" style={{ fontSize: '1.5rem' }}>
              How long do you need housing?
            </h3>

            <div className="mb-5">
              <div className="row justify-content-center">
                <div className="col-lg-3 col-sm-6">
                  <label htmlFor="startDate" className="form-label fw-medium mb-2">Check-in Date</label>
                  <input
                    id="startDate"
                    className="form-control custom-date-input"
                    type="date"
                    style={{
                      borderRadius: '12px',
                      border: '2px solid #e5e7eb',
                      fontSize: '1rem',
                      padding: '12px 16px',
                      backgroundColor: 'white'
                    }}
                  />
                  <span id="startDateSelected" className="text-muted small"></span>
                </div>
                <div className="col-lg-3 col-sm-6">
                  <label htmlFor="endDate" className="form-label fw-medium mb-2">Check-out Date</label>
                  <input
                    id="endDate"
                    className="form-control custom-date-input"
                    type="date"
                    style={{
                      borderRadius: '12px',
                      border: '2px solid #e5e7eb',
                      fontSize: '1rem',
                      padding: '12px 16px',
                      backgroundColor: 'white'
                    }}
                  />
                  <span id="endDateSelected" className="text-muted small"></span>
                </div>
              </div>
            </div>

            <div className="mb-5">
              <div className="row justify-content-center">
                <div className="col-lg-6 col-md-8">
                  <h3 className="fw-bold mb-3 text-center" style={{ fontSize: '1.5rem' }}>
                    Which locations do you prefer living in?
                  </h3>
                  <div className="position-relative">
                    <svg
                      className="position-absolute top-50 translate-middle-y ms-3"
                      width="20" height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      style={{ color: '#9ca3af', zIndex: 2 }}
                    >
                      <circle cx="11" cy="11" r="8" strokeWidth="2" />
                      <path d="m21 21-4.35-4.35" strokeWidth="2" />
                    </svg>
                    <input
                      type="text"
                      className="form-control form-control-lg ps-5 custom-focus"
                      placeholder="Search locations"
                      value={formData.preferredLocations}
                      onChange={(e) => updateFormData('preferredLocations', e.target.value)}
                      style={{
                        borderRadius: '12px',
                        border: '2px solid #e5e7eb'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="row justify-content-center">
                <div className="col-lg-8 col-md-10">
                  <h3 className="fw-bold mb-4 text-center" style={{ fontSize: '1.5rem' }}>
                    What type of housing do you prefer?
                  </h3>

                  {[
                    { type: 'house', label: 'House', subtitle: '4+ members', icon: '/thfhouse.png' },
                    { type: 'townhouse', label: 'Townhouse', subtitle: '3-4 members', icon: '/thftown.png' },
                    { type: 'apartment', label: 'Apartment', subtitle: '2-3 members', icon: '/thfapt.png' },
                    { type: 'shared', label: 'Shared living', subtitle: '1-2 members', icon: '/thfshare.png' }
                  ].map(option => (
                    <div key={option.type} className="d-flex justify-content-between align-items-center py-3 border-bottom">
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={option.icon}
                          alt={option.label}
                          style={{
                            width: '32px',
                            height: '32px',
                            objectFit: 'contain'
                          }}
                        />
                        <div>
                          <h5 className="fw-bold mb-0">{option.label}</h5>
                          <p className="text-muted mb-0 small">{option.subtitle}</p>
                        </div>
                      </div>
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input custom-checkbox"
                          checked={formData.housingType.includes(option.type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              updateFormData('housingType', [...formData.housingType, option.type]);
                            } else {
                              updateFormData('housingType', formData.housingType.filter(t => t !== option.type));
                            }
                          }}
                        />
                      </div>
                    </div>
                  ))}
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
                <h3 className="fw-bold mb-5 text-center" style={{ fontSize: '1.5rem' }}>
                  Do you want to use the same email to receive housing options?
                </h3>

                <div className="mb-5 d-flex justify-content-center">
                  <div className="d-flex flex-column gap-3">
                    {['Yes', 'No'].map(option => (
                      <div key={option} className="d-flex align-items-center gap-3">
                        <input
                          type="radio"
                          name="sameEmail"
                          className="form-check-input"
                          style={{
                            transform: 'scale(1.3)',
                            accentColor: '#84B5CE'
                          }}
                          checked={formData.sameEmail === option.toLowerCase()}
                          onChange={() => updateFormData('sameEmail', option.toLowerCase())}
                        />
                        <label className="fw-medium" style={{ fontSize: '1.2rem' }}>
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-5">
                  <h3 className="fw-bold mb-3 text-center" style={{ fontSize: '1.5rem' }}>
                    Is there anything else to know?
                  </h3>
                  <textarea
                    className="form-control form-control-lg custom-focus"
                    rows="4"
                    placeholder="Enter text"
                    value={formData.additionalInfo}
                    onChange={(e) => updateFormData('additionalInfo', e.target.value)}
                    style={{
                      borderRadius: '12px',
                      border: '2px solid #e5e7eb',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div className="mb-4 p-4 rounded-3 text-center" style={{ backgroundColor: '#f8f9fa' }}>
                  <p className="mb-0 lh-base">
                    Thank you for sharing your preferences. We will email you as soon as we find potential temporary housing
                    matches. Please keep an eye on your inbox as wait times can vary
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
          onClick={nextStep}
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

export default HousingForm;