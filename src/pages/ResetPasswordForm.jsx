import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaCheckCircle,
  FaKey,
  FaTimes 
} from "react-icons/fa";
import "../styles/ForgotPassword.css";
import "../styles/Login.css";
import { validatePassword, PasswordRequirements } from "../utils/passwordValidation";

export default function ResetPasswordPage({ onClose }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [resetSuccess, setResetSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1); // Go back to previous page
    }
  };

  // Commented out for UI testing
  // useEffect(() => {
  //   const tokenFromUrl = searchParams.get("token");
  //   if (!tokenFromUrl) {
  //     setTokenValid(false);
  //   }
  // }, [searchParams]);

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setIsPasswordValid(validatePassword(newPassword).isValid);
    
    if (fieldErrors.password) {
      setFieldErrors({...fieldErrors, password: ""});
    }
  };

  const validateResetForm = () => {
    const errors = {};
    let isValid = true;

    if (!password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (!isPasswordValid) {
      errors.password = "Password does not meet requirements";
      isValid = false;
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateResetForm()) return;

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setResetSuccess(true);
    } catch {
      setError("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="reset-password-page">
        <div className="reset-password-container">
          <div className="reset-password-card">
          
            <button className="close-button" onClick={handleClose}>
              <FaTimes />
            </button>
            <h2>Invalid Reset Link</h2>
            <p>The password reset link is invalid or has expired.</p>
            <button className="btn-global" onClick={() => navigate("/login")}>
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (resetSuccess) {
    return (
      <div className="reset-password-page">
        <div className="reset-password-container">
          <div className="reset-password-card success-message">
           
            <button className="close-button" onClick={handleClose}>
              <FaTimes />
            </button>
            <div className="success-icon">
              <FaCheckCircle />
            </div>
            <h2>Password Reset Successfully</h2>
            <p>
              Your password has been successfully reset. You can now login with
              your new password.
            </p>
            <button className="btn-global" onClick={() => navigate("/admin-login")}>
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <div className="reset-password-card">
          
          <button className="close-button" onClick={handleClose}>
            <FaTimes />
          </button>
          
          <div className="login-header">
            <div className="header-icon">
              <FaKey />
            </div>
            <div className="header-top">
              <h2>Create New Password</h2>
            </div>
            <p className="login-subtitle">
              Please enter your new password below
            </p>
          </div>

          <form onSubmit={handleResetSubmit} className="login-form" noValidate>
          
            <div
              className={`form-group ${
                fieldErrors.password ? "has-error" : ""
              }`}
            >
              <label htmlFor="new-password">New Password</label>
              <div className="field-wrapper">
                <div className="input-container">
                  <span className="input-icon">
                    <FaLock />
                  </span>
                  <input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Enter your new password"
                    className={fieldErrors.password ? "error" : ""}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                
                  <div className="password-requirements-container">
                    <PasswordRequirements password={password} />
                  </div>
              

                {fieldErrors.password && (
                  <div className="error-message">{fieldErrors.password}</div>
                )}
              </div>
            </div>
            <div
              className={`form-group ${
                fieldErrors.confirmPassword ? "has-error" : ""
              }`}
            >
              <label htmlFor="confirm-password">Confirm Password</label>
              <div className="field-wrapper">
                <div className="input-container">
                  <span className="input-icon">
                    <FaLock />
                  </span>
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    className={fieldErrors.confirmPassword ? "error" : ""}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex="-1"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <div className="error-message">
                    {fieldErrors.confirmPassword}
                  </div>
                )}
              </div>
            </div>

            {error && <div className="error-message general-error">{error}</div>}

            <button
              type="submit"
              className={`btn-global reset-btn ${isLoading ? "submitting" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Resetting password...
                </>
              ) : (
                "Reset Password"
              )}
            </button>

            <div className="login-footer">
              <button
                type="button"
                className="back-to-login"
                onClick={() => navigate("/admin-login")}
                disabled={isLoading}
              >
                <FaArrowLeft /> Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}