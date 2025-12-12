import React, { useState } from "react";
import { FaCheckCircle, FaTimes } from "react-icons/fa";
import "../styles/ForgotPassword.css";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/authService";

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

    if (!validateEmailForm()) return;

    setIsLoading(true);

    try {
      const res = await forgotPassword(email);
      console.log(res);
      setIsSubmitted(true);
    } catch (err) {
      setError(
        err.error || "Failed to send reset instructions. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field === "email") setEmail(value);

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

  const handleBackToLoginClick = () => {
    if (onBackToLogin) {
      onBackToLogin();
    } else {
      navigate("/login");
    }
  };

  const handleBackdropClick = () => {
    handleClose();
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="forgot-modal" onClick={handleBackdropClick}>
      <div className="forgot-container" onClick={stopPropagation}>
        <div className="forgot-card">
          <button
            className="close-button btn btn-ghost btn-icon btn-square"
            onClick={handleClose}
            type="button"
            aria-label="Close"
          >
            <FaTimes />
          </button>

          <div className="forgot-header">
            <h2 className="forgot-title">Reset Password</h2>
            <p className="forgot-subtitle">
              {isSubmitted
                ? "Check your email for further instructions."
                : "Enter your email address and we’ll send you an email with instructions to reset your password."}
            </p>
          </div>

          {!isSubmitted ? (
            <form
              onSubmit={handleEmailSubmit}
              className="forgot-form"
              noValidate
            >
              <div
                className={`form-group ${
                  fieldErrors.email ? "has-error" : ""
                }`}
              >
                <label htmlFor="forgot-email" className="field-label">
                  Email
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email address"
                  className={`forgot-input ${
                    fieldErrors.email ? "input-error" : ""
                  }`}
                  disabled={isLoading}
                />
                {fieldErrors.email && (
                  <div className="field-error">{fieldErrors.email}</div>
                )}
              </div>

              {error && <div className="general-error">{error}</div>}

              <button
                type="submit"
                className={`forgot-btn btn btn-primary btn-pill ${
                  isLoading ? "submitting" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Reset"}
              </button>
            </form>
          ) : (
            <div className="forgot-success">
              <div className="success-icon">
                <FaCheckCircle />
              </div>
              <h3 className="success-title">Check your email</h3>
              <p className="success-text">
                We&apos;ve sent password reset instructions to{" "}
                <strong>{email}</strong>
              </p>

              <div className="demo-reset-link">
                <p>Test:</p>
                <Link to="/reset-password/:token" className="reset-link-btn">
                  Click here to open Reset Form
                </Link>
              </div>

              <p className="resend-text">
                Didn&apos;t receive the email?{" "}
                <button
                  className="resend-link"
                  onClick={handleEmailSubmit}
                  disabled={isLoading}
                  type="button"
                >
                  Click to resend
                </button>
              </p>
            </div>
          )}

          <div className="forgot-footer">
            <span className="forgot-footer-text">
              or Back to{" "}
              <button
                type="button"
                className="forgot-footer-link"
                onClick={handleBackToLoginClick}
                disabled={isLoading}
              >
                Login
              </button>
              .
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
