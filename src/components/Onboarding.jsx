import React, { useState } from 'react';

const Onboarding = ({ onClose, onSkip, onNext }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Welcome to EmberGuard",
      description: "Stay informed and stay prepared with your all-in-one app for preventing wildfires in Washington.",
      logo: true
    },
    {
      title: "Get live alerts in case of an emergency",
      description: "Be prepared in case you need to travel",
      component: "alerts"
    },
    {
      title: "Get real time data for wildfires county wise.",
      description: "Get to know if your area is prone to wildfires",
      component: "map"
    },
    {
      title: "Have temporary housing options ready if you need to get away",
      description: "Get temporary housing for free",
      component: "housing"
    },
    {
      title: "Use our emergency checklist in case of an emergency",
      description: "Optimized checklist to your situation",
      component: "checklist"
    },
    {
      title: "Before we continue, allow location tracking and notifications for:",
      description: "You can change these options later in the settings app.",
      component: "permissions"
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onNext && onNext();
    }
  };

  const handleBack = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleSkip = () => {
    onSkip && onSkip();
  };

  const renderSlideContent = () => {
    const slide = slides[currentSlide];
    
    if (slide.logo) {
      return (
        <div className="logo-section my-4">
          <div className="d-flex flex-column align-items-center gap-3">
            <div className="emberguard-logo" style={{width: '120px', height: '120px'}}>
              <img 
                src="/logo.png" 
                alt="EmberGuard Logo" 
                className="logo-image w-100 h-100"
                style={{objectFit: 'contain', borderRadius: '20px'}}
              />
            </div>
            <h2 className="logo-text">EmberGuard</h2>
          </div>
        </div>
      );
    }

    switch (slide.component) {
      case 'alerts':
        return (
          <div className="d-flex justify-content-center my-4">
            <img src="/obalert.png" alt="alert" className="img-fluid" style={{maxHeight: '1000px'}}/>
          </div>
        );

      case 'map':
        return (
          <div className="d-flex justify-content-center my-4">
            <img src="/obmap.png" alt="map" className="img-fluid" style={{maxHeight: '1000px'}}/>
          </div>
        );

      case 'housing':
        return (
          <div className="d-flex justify-content-center my-4">
            <img src="/obhouse.png" alt="housing" className="img-fluid" style={{maxHeight: '1000px'}}/>
          </div>
        );

      case 'checklist':
        return (
          <div className="d-flex justify-content-center my-4">
            <img src="/obchecklist.png" alt="checklist" className="img-fluid" style={{maxHeight: '1000px'}}/>
          </div>
        );

      case 'permissions':
        return (
          <div className="my-4">
            <div className="d-flex flex-column gap-4" style={{maxWidth: '400px', margin: '0 auto'}}>
              <div className="permission-card d-flex align-items-center gap-4 p-4 bg-white">
                <div className="permission-icon">
                  <img src="/Location.png" alt="location" style={{width: '2rem', height: '2rem'}}/>
                </div>
                <div className="permission-text">
                  <div>Knowing what dangers might be in your area</div>
                </div>
              </div>
              <div className="permission-card d-flex align-items-center gap-4 p-4 bg-white">
                <div className="permission-icon">
                  <img src="/Bell.png" alt="bell" style={{width: '2rem', height: '2rem'}}/>
                </div>
                <div className="permission-text">
                  <div>Getting to know as soon as possible if there is a fire</div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isLastSlide = currentSlide === slides.length - 1;

  return (
    <div className="position-fixed top-0 start-0 end-0 bottom-0 bg-white d-flex flex-column" style={{zIndex: 1001}}>
      <div className="d-flex flex-column h-100">
        <div className="d-flex justify-content-between align-items-center p-4 border-bottom flex-shrink-0">
          <button 
            className="btn btn-link text-dark text-decoration-underline back-btn p-2" 
            onClick={handleBack}
            disabled={currentSlide === 0}
          >
            Back
          </button>
          <button 
            className="btn-close" 
            onClick={onClose}
            aria-label="Close"
            style={{background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', padding: '0.5rem'}}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 6L6 18M6 6L18 18"/>
            </svg>
          </button>
        </div>

        <div className="flex-grow-1 d-flex flex-column p-4 overflow-auto" style={{maxWidth: '500px', margin: '0 auto', width: '100%', minHeight: 0}}>
          <div className="d-flex justify-content-center gap-2 mb-4 flex-shrink-0">
            {slides.map((_, index) => (
              <div 
                key={index}
                className={`slide-indicator ${index === currentSlide ? 'active' : ''}`}
              />
            ))}
          </div>

          <div className="text-center flex-grow-1 d-flex flex-column justify-content-center" style={{maxWidth: '400px', margin: '0 auto'}}>
            <h1 className="onboarding-title mb-3" style={{fontSize: 'clamp(1.8rem, 1vw, 2.5rem)', lineHeight: '1'}}>{slides[currentSlide].title}</h1>
            
            <div className="flex-shrink-0">
              {renderSlideContent()}
            </div>

            <p className="text-brand fs-5 lh-base mb-0 flex-shrink-0" style={{maxWidth: '350px', margin: '0 auto', fontSize: 'clamp(1rem, 2.5vw, 1.25rem)'}}>
              {slides[currentSlide].description}
            </p>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center p-4 border-top w-100 flex-shrink-0">
          {!isLastSlide ? (
            <>
              <button 
                className="btn btn-link text-decoration-underline text-dark fs-5 fw-medium p-3"
                onClick={handleSkip}
              >
                Skip
              </button>
              <button 
                className="btn btn-gradient-primaryalt btn-lg px-4 py-3"
                onClick={handleNext}
              >
                Next
              </button>
            </>
          ) : (
            <>
              <div></div>
              <button 
                className="btn btn-gradient-primary btn-lg px-4 py-3"
                onClick={handleNext}
              >
                Finish
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;