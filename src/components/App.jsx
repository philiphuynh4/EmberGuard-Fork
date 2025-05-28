import React, { useState } from 'react';
import Register from './Register';
import Login from './Login';
import Onboarding from './Onboarding';
import Dashboard from './Dashboard';

function App() {
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isInApp, setIsInApp] = useState(false);
  const [userMode, setUserMode] = useState(null);

  const handleCloseRegister = () => {
    setShowRegister(false);
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
  };

  const handleSwitchToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  const handleSwitchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const handleGuestMode = () => {
    setShowRegister(false);
    setShowOnboarding(true);
    setUserMode('guest');
  };

  const handleContinue = () => {
    setShowRegister(true);
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    setIsInApp(true);
    console.log('Skipping onboarding - entering main app as guest');
  };

  const handleOnboardingNext = () => {
    setShowOnboarding(false);
    setIsInApp(true);
    console.log('Onboarding completed - entering main app as guest');
  };

  if (isInApp) {
    return <Dashboard userMode={userMode} />;
  }

  return (
    <div className="min-vh-100 bg-white d-flex align-items-center justify-content-center p-4">
      <div className="d-flex flex-column align-items-center justify-content-center text-center w-100" style={{maxWidth: '400px'}}>
        <div className="logo-section mb-5 d-flex flex-column align-items-center">
          <div className="logo-placeholder mb-3 d-flex justify-content-center">
            <img 
              src="/logo.png" 
              alt="EmberGuard Logo" 
              className="logo-image"
              style={{width: '120px', height: '120px', objectFit: 'contain', borderRadius: '20px'}}
            />
          </div>
          <h1 className="app-title">EmberGuard</h1>
        </div>
        
        <div className="action-section w-100 d-flex justify-content-center">
          <button 
            className="btn btn-gradient-primary btn-lg px-4 py-3 continue-btn"
            style={{maxWidth: '280px', width: '100%'}}
            onClick={handleContinue}
          >
            Continue
          </button>
        </div>
      </div>

      {showRegister && (
        <Register 
          onClose={handleCloseRegister}
          onSwitchToLogin={handleSwitchToLogin}
          onGuestMode={handleGuestMode}
        />
      )}

      {showLogin && (
        <Login 
          onClose={handleCloseLogin}
          onSwitchToRegister={handleSwitchToRegister}
        />
      )}

      {showOnboarding && (
        <Onboarding 
          onClose={handleCloseOnboarding}
          onSkip={handleOnboardingSkip}
          onNext={handleOnboardingNext}
        />
      )}
    </div>
  );
}

export default App;