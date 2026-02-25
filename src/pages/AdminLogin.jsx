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

      if (rememberMe) localStorage.setItem("rememberAdmin", "true");
      else localStorage.removeItem("rememberAdmin");

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
    setFieldErrors((p) => ({ ...p, email: "" }));
    if (errorMessage) setErrorMessage("");
  };

  const handlePasswordChange = (value) => {
    setAdminPassword(value);
    setFieldErrors((p) => ({ ...p, password: "" }));
    if (errorMessage) setErrorMessage("");
  };

  const handleForgotPasswordClick = (e) => {
    e.preventDefault();
    setShowForgotPassword(true);
  };

  const handleBackToLogin = () => setShowForgotPassword(false);

  const handleGoogleLogin = async () => {
    setErrorMessage("");
    setIsGoogleSubmitting(true);
    try {
      const data = await loginWithGoogle();
      localStorage.setItem("token", data.token);
      localStorage.setItem("adminEmail", data.email);
      if (rememberMe) localStorage.setItem("rememberAdmin", "true");
      else localStorage.removeItem("rememberAdmin");

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
    return <ForgotPassword onClose={handleClose} onBackToLogin={handleBackToLogin} />;
  }

  return (
    <div className="al-backdrop" onClick={handleClose}>
      <div className="al-card" onClick={(e) => e.stopPropagation()}>
        <button
          className="al-close"
          onClick={handleClose}
          type="button"
          aria-label="Close"
        >
          <FaTimes />
        </button>

        <div className="al-inner">
          <h2 className="al-title">Admin Portal</h2>
          <p className="al-sub">Sign in to Manage your Resturant</p>

          <form className="al-form" onSubmit={handleSubmit} noValidate>
            <div className="al-field">
              <label htmlFor="admin-email" className="al-label">Email</label>
              <input
                id="admin-email"
                type="email"
                className={`al-input ${fieldErrors.email ? "al-input-error" : ""}`}
                placeholder=""
                value={adminEmail}
                onChange={(e) => handleEmailChange(e.target.value)}
                autoComplete="email"
              />
              {fieldErrors.email && <div className="al-field-error">{fieldErrors.email}</div>}
            </div>

            <div className="al-field">
              <label htmlFor="admin-password" className="al-label">Password</label>
              <input
                id="admin-password"
                type="password"
                className={`al-input ${fieldErrors.password ? "al-input-error" : ""}`}
                placeholder=""
                value={adminPassword}
                onChange={(e) => handlePasswordChange(e.target.value)}
                autoComplete="current-password"
              />
              {fieldErrors.password && <div className="al-field-error">{fieldErrors.password}</div>}
            </div>

            <div className="al-row">
              <label className="al-remember">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me?</span>
              </label>

              <button type="button" className="al-forgot" onClick={handleForgotPasswordClick}>
                Forgot Password
              </button>
            </div>

            {errorMessage && <div className="al-error">{errorMessage}</div>}

            <div className="al-submit-wrap">
              <button
                type="submit"
                className="al-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            </div>

            <div className="al-or">or sign in with other accounts?</div>

            <div className="al-socials">
              <button
                type="button"
                className="al-social al-g"
                onClick={handleGoogleLogin}
                disabled={isGoogleSubmitting}
                aria-label="Google"
              >
                <FaGoogle />
              </button>
            </div>

            <p className="al-foot">
              Don&apos;t have an account?{" "}
              <Link to="/registerrestaurant" className="al-register">Register Your Restaurant.</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
