import React, { useState } from "react";
import {
  FaEnvelope,
  FaCheckCircle,
  FaTimes,
  FaArrowLeft,
  FaStore
} from "react-icons/fa";
import "../styles/ForgotPassword.css";
import "../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/apiService"; 
export default function ForgotPassword({ onClose, onBackToLogin }) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({ email: "" });
  const navigate = useNavigate();

  const validateEmailForm = () => {
    const errors = { email: "" };
    let isValid = true;

    if (!email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };


const handleEmailSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!validateEmailForm()) {
    return;
  }

  setIsLoading(true);

  try {
    const res = await forgotPassword(email);  
    console.log(res);                          
    setIsSubmitted(true);
  } catch (err) {
    setError(err.error || "Failed to send reset instructions. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

  const handleInputChange = (field, value) => {
    if (field === 'email') setEmail(value);
    
    if (fieldErrors[field]) {
      setFieldErrors({ ...fieldErrors, [field]: "" });
    }
    if (error) {
      setError("");
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1); 
    }
  };

  const handleBackToLogin = () => {
    if (onBackToLogin) {
      onBackToLogin();
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="admin-login-modal">
      <div className="admin-login-container">
        <div className="admin-login-card">
         
          <button className="close-button" onClick={handleClose}>
            <FaTimes />
          </button>
          
          <div className="login-header">
            <div className="header-icon">
              <FaStore />
            </div>
            <div className="header-top">
              <h2>Reset Your Password</h2>
            </div>
            <p className="login-subtitle">
              {isSubmitted 
                ? "Check your email for further instructions" 
                : "Enter your email address and we'll send you a link to reset your password"
              }
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleEmailSubmit} className="login-form" noValidate>
              <div className={`form-group ${fieldErrors.email ? "has-error" : ""}`}>
                <label htmlFor="forgot-email">Email Address</label>
                <div className="field-wrapper">
                  <div className="input-container">
                    <span className="input-icon">
                      <FaEnvelope />
                    </span>
                    <input
                      id="forgot-email"
                      type="email"
                      value={email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email address"
                      className={fieldErrors.email ? "error" : ""}
                      disabled={isLoading}
                    />
                  </div>
                  {fieldErrors.email && (
                    <div className="error-message">{fieldErrors.email}</div>
                  )}
                </div>
              </div>

              {error && (
                <div className="error-message general-error">
                  <span className="error-icon">!</span>
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                style={{  fontSize: "20px" }}
                className={`btn-global ${isLoading ? "submitting" : ""}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Sending instructions...
                  </>
                ) : (
                  "Send Reset Instructions"
                )}
              </button>
            </form>
          ) : (
            <div className="success-message">
              <div className="success-icon">
                <FaCheckCircle />
              </div>
              <h3>Check your email</h3>
              <p>We've sent password reset instructions to <strong>{email}</strong></p>
              <div className="demo-reset-link">
                <p>Test:</p>
                <Link to="/reset-passwords" className="reset-link-btn">
                  Click here to open Reset Form
                </Link>
              </div>
              <p className="resend-text">
                Didn't receive the email?{" "}
                <button 
                  className="resend-link" 
                  onClick={handleEmailSubmit}
                  disabled={isLoading}
                >
                  Click to resend
                </button>
              </p>
            </div>
          )}

          {!isSubmitted && (
            <div className="login-footer">
              <button 
                className="back-to-login" 
                onClick={handleBackToLogin}
                disabled={isLoading}
              >
                <FaArrowLeft /> Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}