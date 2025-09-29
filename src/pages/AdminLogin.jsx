import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaTimes, FaStore } from "react-icons/fa";
import "../styles/Login.css";
import { Link } from "react-router-dom"; 
import { adminLogin } from "../services/apiService";
import ForgotPassword from "./forgotPassword"; 
import { validatePassword, PasswordRequirements } from "../utils/passwordValidation";

export default function AdminLogin({ onClose }) {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: ""
  });
  const [showForgotPassword, setShowForgotPassword] = useState(false); 
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  const validateForm = () => {
    const errors = {
      email: "",
      password: ""
    };

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
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await adminLogin({ email: adminEmail, password: adminPassword });
        localStorage.setItem("token", data.token);
        localStorage.setItem("adminEmail", adminEmail);
        navigate("/admin-dashboard");
        if (onClose) onClose();
       else {
        setErrorMessage(data.error || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field === "email") {
      setAdminEmail(value);
      if (fieldErrors.email) {
        setFieldErrors({ ...fieldErrors, email: "" });
      }
    } else if (field === "password") {
      setAdminPassword(value);
      if (fieldErrors.password) {
        setFieldErrors({ ...fieldErrors, password: "" });
      }
    }
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleForgotPasswordClick = (e) => {
    e.preventDefault();
    setShowForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
  };

  return (
    <div className="admin-login-modal">
      {showForgotPassword ? (
        <ForgotPassword onClose={onClose} onBackToLogin={handleBackToLogin} />
      ) : (
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
                <h2>Restaurant Admin Portal</h2>
                
              </div>
              <p className="login-subtitle">Sign in to manage your restaurant</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form" noValidate>
              <div className={`form-group ${fieldErrors.email ? "has-error" : ""}`}>
                <label htmlFor="email">Email Address</label>
                <div className="field-wrapper">
                  <div className="input-container">
                    <span className="input-icon">
                      <FaUser />
                    </span>
                    <input
                      id="email"
                      type="email"
                      value={adminEmail}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Enter your email"
                      className={fieldErrors.email ? "error" : ""}
                    />
                  </div>
                  {(fieldErrors.email === "Email is required" ||
                    fieldErrors.email === "Please enter a valid email address") && (
                    <div className="error-message">{fieldErrors.email}</div>
                  )}
                </div>
              </div>

              <div className={`form-group ${fieldErrors.password ? "has-error" : ""}`}>
                <div className="password-label-container">
                  <label htmlFor="password">Password</label>
                  <a href="#forgot" className="forgot-link" onClick={handleForgotPasswordClick}>
                    Forgot password?
                  </a>
                </div>

                <div className="field-wrapper">
                  <div className="input-container">
                    <span className="input-icon">
                      <FaLock />
                    </span>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={adminPassword}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                    
                      placeholder="Enter your password"
                      className={fieldErrors.password ? "error" : ""}
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <div className="error-message">{fieldErrors.password}</div>
                  )}
                </div>
                
              
              </div>

              {errorMessage && (
                <div className="error-message general-error">
                  <span className="error-icon">!</span>
                  {errorMessage}
                </div>
              )}
              
              <button
                type="submit"
                style={{ height: "50px", fontSize: "20px" }}
                className={` btn-global  ${isSubmitting ? "submitting" : ""}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Signing in...
                  </>
                ) : (
                  "Continue to Dashboard"
                )}
              </button>
            </form>

            <div className="login-footer">
              <p>
                Don't have an account?{" "}
                <Link to="/registerrestaurant" className="support-link">
                  Register Your Restaurant
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}