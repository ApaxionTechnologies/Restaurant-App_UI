import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaGoogle,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTimes,
} from "react-icons/fa";
import "../styles/AdminLogin.css";
import { adminLogin, loginWithGoogle } from "../services/authService";
import { validatePassword } from "../utils/passwordValidation";
import ForgotPassword from "./forgotPassword";

export default function AdminLogin({ onClose }) {
  const navigate = useNavigate();

  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false); 

  const validateForm = () => {
    const errors = { email: "", password: "" };
    let isValid = true;

    if (!adminEmail.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(adminEmail)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!adminPassword) {
      errors.password = "Password is required";
      isValid = false;
    } else if (!validatePassword(adminPassword).isValid) {
      errors.password = "Password does not meet requirements";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleClose = () => {
    if (onClose) onClose();
    else navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const data = await adminLogin({
        email: adminEmail,
        password: adminPassword,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("adminEmail", adminEmail);

      if (rememberMe) {
        localStorage.setItem("rememberAdmin", "true");
      } else {
        localStorage.removeItem("rememberAdmin");
      }

      navigate("/admin-dashboard");
      if (onClose) onClose();
    } catch (err) {
      console.error("Login error:", err);
      setErrorMessage(err.message || "Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailChange = (value) => {
    setAdminEmail(value);
    setFieldErrors((prev) => ({ ...prev, email: "" }));
    if (errorMessage) setErrorMessage("");
  };

  const handlePasswordChange = (value) => {
    setAdminPassword(value);
    setFieldErrors((prev) => ({ ...prev, password: "" }));
    if (errorMessage) setErrorMessage("");
  };

  const handleForgotPasswordClick = (e) => {
    e.preventDefault();
    setShowForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
  };
  const handleGoogleLogin = async () => {
    setErrorMessage("");
    setIsGoogleSubmitting(true);

    try {
      const data = await loginWithGoogle();
      localStorage.setItem("token", data.token);
      localStorage.setItem("adminEmail", data.email);

      if (rememberMe) {
        localStorage.setItem("rememberAdmin", "true");
      } else {
        localStorage.removeItem("rememberAdmin");
      }

      navigate("/admin-dashboard");
      if (onClose) onClose();
    } catch (err) {
      console.error("Google login error:", err);
      setErrorMessage(err.message || "Google sign-in failed. Please try again.");
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  if (showForgotPassword) {
    return (
      <ForgotPassword
        onClose={handleClose}
        onBackToLogin={handleBackToLogin}
      />
    );
  }

  return (
    <div className="admin-login-backdrop">
      <div
        className="admin-login-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="admin-login-close btn btn-ghost btn-icon btn-square"
          onClick={handleClose}
          type="button"
          aria-label="Close"
        >
          <FaTimes />
        </button>

        <h2 className="admin-login-title heading-main text-center">
          Admin Portal
        </h2>
        <p className="admin-login-subtitle text-subtitle text-center">
          Sign in to manage your restaurant
        </p>

        <form
          className="admin-login-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="admin-field">
            <label className="admin-label" htmlFor="admin-email">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              className={`admin-input ${
                fieldErrors.email ? "admin-input-error" : ""
              }`}
              placeholder="Enter your email"
              value={adminEmail}
              onChange={(e) => handleEmailChange(e.target.value)}
            />
            {fieldErrors.email && (
              <div className="admin-error-text">{fieldErrors.email}</div>
            )}
          </div>

          <div className="admin-field">
            <label className="admin-label" htmlFor="admin-password">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              className={`admin-input ${
                fieldErrors.password ? "admin-input-error" : ""
              }`}
              placeholder="Enter your password"
              value={adminPassword}
              onChange={(e) => handlePasswordChange(e.target.value)}
            />
            {fieldErrors.password && (
              <div className="admin-error-text">{fieldErrors.password}</div>
            )}
          </div>

          <div className="admin-remember-row">
            <label className="admin-remember">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me?</span>
            </label>

            <button
              type="button"
              className="admin-forgot-link btn-text"
              onClick={handleForgotPasswordClick}
            >
              Forgot Password
            </button>
          </div>

          {errorMessage && (
            <div className="admin-error-banner">{errorMessage}</div>
          )}

          <button
            type="submit"
            className="admin-submit-btn btn btn-primary btn-pill"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>

          <div className="admin-or text-caption text-center">
            or sign in with other accounts?
          </div>

          <div className="admin-social-row">
            <button
              type="button"
              className="admin-social-btn btn btn-soft btn-square btn-icon btn-google"
              onClick={handleGoogleLogin}
              disabled={isGoogleSubmitting}
            >
             
              <FaGoogle />
            </button>
            <button
              type="button"
              className="admin-social-btn btn btn-soft btn-square btn-icon btn-facebook"
            >
              <FaFacebookF />
            </button>
            <button
              type="button"
              className="admin-social-btn btn btn-soft btn-square btn-icon btn-instagram"
            >
              <FaInstagram />
            </button>
            <button
              type="button"
              className="admin-social-btn btn btn-soft btn-square btn-icon btn-linkedin"
            >
              <FaLinkedinIn />
            </button>
          </div>

          <p className="admin-footer-text text-caption text-center">
            Don&apos;t have an account?{" "}
            <Link to="/registerrestaurant" className="admin-footer-link">
              Register your restaurant.
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
