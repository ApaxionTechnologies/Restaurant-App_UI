import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaCheckCircle,
  FaKey,
  FaTimes,
} from "react-icons/fa";

import "../styles/ResetPassword.css";
import {
  validatePassword,
  PasswordRequirements,
} from "../utils/passwordValidation";
import { resetPassword } from "../services/authService";
import toast from "react-hot-toast";

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
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const navigate = useNavigate();
  const { token } = useParams();

  const handleClose = () => {
    if (onClose) onClose();
    else navigate(-1);
  };

  const handleBackdropClick = () => {
    handleClose();
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setIsPasswordValid(validatePassword(newPassword).isValid);

    if (fieldErrors.password) {
      setFieldErrors({ ...fieldErrors, password: "" });
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
      await resetPassword(token, password);
      setResetSuccess(true);
      toast.success("Password Updated Successfully");
    } catch (err) {
      setError(err.error || "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div
        className="reset-password-page"
        style={{ backgroundImage: "url('/bgimage.jpg')" }}
        onClick={handleBackdropClick}
      >
        <div className="reset-password-container" onClick={stopPropagation}>
          <div className="reset-password-card">
            <button className="close-button" onClick={handleClose}>
              <FaTimes />
            </button>

            <h2>Invalid Reset Link</h2>
            <p>The password reset link is invalid or has expired.</p>

            <button
              className="reset-btn"
              type="button"
              onClick={() => navigate("/login")}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (resetSuccess) {
    return (
      <div
        className="reset-password-page"
        style={{ backgroundImage: "url('/bgimage.jpg')" }}
        onClick={handleBackdropClick}
      >
        <div className="reset-password-container" onClick={stopPropagation}>
          <div className="reset-password-card success-message">
            <button className="close-button" onClick={handleClose}>
              <FaTimes />
            </button>

            <div className="success-icon">
              <FaCheckCircle />
            </div>

            <h2>Password Reset Successfully</h2>
            <p>You can now login with your new password.</p>

            <button
              className="reset-btn"
              type="button"
              onClick={() => navigate("/admin-login")}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="reset-password-page"
      style={{ backgroundImage: "url('/bgimage.jpg')" }}
      onClick={handleBackdropClick}
    >
      <div className="reset-password-container" onClick={stopPropagation}>
        <div className="reset-password-card">
          <button className="close-button" onClick={handleClose}>
            <FaTimes />
          </button>

          <div className="header-icon">
            <FaKey />
          </div>

          <h2>Create New Password</h2>
          <p>Please enter your new password below</p>

          <form onSubmit={handleResetSubmit} noValidate>
            <div className="form-group">
              <label>New Password</label>

              <div className="input-container">
                <span className="input-icon">
                  <FaLock />
                </span>

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter your new password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <PasswordRequirements password={password} />

              {fieldErrors.password && (
                <div className="error-message">{fieldErrors.password}</div>
              )}
            </div>

            <div className="form-group">
              <label>Confirm Password</label>

              <div className="input-container">
                <span className="input-icon">
                  <FaLock />
                </span>

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
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

            {error && <div className="error-message">{error}</div>}

            <button className="reset-btn" type="submit" disabled={isLoading}>
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>

            <button
              className="back-to-login"
              type="button"
              onClick={() => navigate("/admin-login")}
            >
              <FaArrowLeft /> Back to Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

