import React, { useState } from "react";
import { FaEnvelope, FaCheckCircle, FaTimes, FaArrowLeft } from "react-icons/fa";
import "../styles/ForgotPassword.css";

export default function ForgotPassword({ onClose, onBackToLogin }) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({ email: "" });

  const validateForm = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      
      setIsSubmitted(true);
    } catch (err) {
      setError("Failed to send reset instructions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (value) => {
    setEmail(value);
    if (fieldErrors.email) {
      setFieldErrors({ ...fieldErrors, email: "" });
    }
    if (error) {
      setError("");
    }
  };

  return (
    <div className="forgot-password-modal">
      <div className="forgot-password-container">
        <div className="forgot-password-card">
        {onClose && (
                <button className="close-button" onClick={onClose}>
                  <FaTimes />
                </button>
              )}
          <div className="forgot-password-header">
            <div className="header-top">
              <h2>Reset Your Password</h2>
              
            </div>
            <p className="forgot-password-subtitle">
              {isSubmitted 
                ? "Check your email for further instructions" 
                : "Enter your email address and we'll send you a link to reset your password"
              }
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="forgot-password-form" noValidate>
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
                      onChange={(e) => handleInputChange(e.target.value)}
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
                className={`btn-forgot-password ${isLoading ? "submitting" : ""}`}
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
              <p className="resend-text">
                Didn't receive the email?{" "}
                <button 
                  className="resend-link" 
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  Click to resend
                </button>
              </p>
            </div>
          )}

          <div className="forgot-password-footer">
            <button 
              className="back-to-login" 
              onClick={onBackToLogin}
              disabled={isLoading}
            >
              <FaArrowLeft /> Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}