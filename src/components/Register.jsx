import React, { useState } from 'react';

const Register = ({ onClose, onSwitchToLogin, onGuestMode }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      console.log('Registration data:', formData); 
      alert('Registration successful!'); 
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
      });
      
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="position-fixed top-0 start-0 end-0 bottom-0 d-flex justify-content-center align-items-center p-3" style={{backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000}}>
      <div className="bg-white rounded-4 w-100 auth-modal overflow-auto shadow-lg position-relative">
        <div className="p-3 d-flex justify-content-start">
          <button 
            className="btn-close"
            onClick={onClose}
            type="button"
            aria-label="Close"
            style={{background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', padding: '0.5rem'}}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 6L6 18M6 6L18 18"/>
            </svg>
          </button>
        </div>

        <div className="px-4 px-md-5 pb-4 pb-md-5">
          <h1 className="form-title mb-2">Register</h1>
          <p className="text-muted mb-4">Create an account to continue!</p>

          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            <div>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`form-control form-control-lg custom-focus ${errors.firstName ? 'is-invalid' : ''}`}
                style={{zIndex: 1}}
              />
              {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
            </div>

            <div>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`form-control form-control-lg custom-focus ${errors.lastName ? 'is-invalid' : ''}`}
                style={{zIndex: 1}}
              />
              {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-control form-control-lg custom-focus ${errors.email ? 'is-invalid' : ''}`}
                style={{zIndex: 1}}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            <div>
              <div className="position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`form-control form-control-lg custom-focus ${errors.password ? 'is-invalid' : ''}`}
                  style={{zIndex: 1}}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  style={{zIndex: 2}}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    {showPassword ? (
                      <path 
                        d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    ) : (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </>
                    )}
                  </svg>
                </button>
              </div>
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>

            <button 
              type="submit" 
              className="btn btn-gradient-primary btn-lg w-100 form-submit-btn mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                'Register'
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <span className="text-muted">Already have an account? </span>
              <button 
                type="button"
                className="btn btn-link p-0 text-decoration-underline"
                onClick={onSwitchToLogin}
                style={{verticalAlign: 'baseline'}}
              >
            Log in
              </button>
          </div>

          <div className="text-center mt-3">
            <span className="text-muted">Or </span>
              <button 
                type="button"
                className="btn btn-link p-0 text-decoration-underline"
                onClick={onGuestMode}
                style={{verticalAlign: 'baseline'}}
              >
            Guest Mode
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;