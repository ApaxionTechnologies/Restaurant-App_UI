// import React, { useState } from "react";
// import {
//   FaEnvelope,
//   FaCheckCircle,
//   FaTimes,
//   FaArrowLeft,
//   FaStore
// } from "react-icons/fa";
// import "../styles/ForgotPassword.css";
// import "../styles/Login.css";

// export default function ForgotPassword({ onClose, onBackToLogin }) {
//   const [email, setEmail] = useState("");
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [fieldErrors, setFieldErrors] = useState({ email: "" });

//   const validateForm = () => {
//     const errors = { email: "" };
//     let isValid = true;

//     if (!email.trim()) {
//       errors.email = "Email is required";
//       isValid = false;
//     } else if (!/\S+@\S+\.\S+/.test(email)) {
//       errors.email = "Please enter a valid email address";
//       isValid = false;
//     }

//     setFieldErrors(errors);
//     return isValid;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!validateForm()) {
//       return;
//     }

//     setIsLoading(true);

//     try {
//       await new Promise(resolve => setTimeout(resolve, 1500));
//       setIsSubmitted(true);
//     } catch (err) {
//       setError("Failed to send reset instructions. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleInputChange = (value) => {
//     setEmail(value);
//     if (fieldErrors.email) {
//       setFieldErrors({ ...fieldErrors, email: "" });
//     }
//     if (error) {
//       setError("");
//     }
//   };

//   return (
//     <div className="admin-login-modal">
//       <div className="admin-login-container">
//         <div className="admin-login-card">
//           {onClose && (
//             <button className="close-button" onClick={onClose}>
//               <FaTimes />
//             </button>
//           )}
//           <div className="login-header">
//             <div className="header-icon">
//               <FaStore />
//             </div>
//             <div className="header-top">
//               <h2>Reset Your Password</h2>
//             </div>
//             <p className="login-subtitle">
//               {isSubmitted 
//                 ? "Check your email for further instructions" 
//                 : "Enter your email address and we'll send you a link to reset your password"
//               }
//             </p>
//           </div>

//           {!isSubmitted ? (
//             <form onSubmit={handleSubmit} className="login-form" noValidate>
//               <div className={`form-group ${fieldErrors.email ? "has-error" : ""}`}>
//                 <label htmlFor="forgot-email">Email Address</label>
//                 <div className="field-wrapper">
//                   <div className="input-container">
//                     <span className="input-icon">
//                       <FaEnvelope />
//                     </span>
//                     <input
//                       id="forgot-email"
//                       type="email"
//                       value={email}
//                       onChange={(e) => handleInputChange(e.target.value)}
//                       placeholder="Enter your email address"
//                       className={fieldErrors.email ? "error" : ""}
//                       disabled={isLoading}
//                     />
//                   </div>
//                   {fieldErrors.email && (
//                     <div className="error-message">{fieldErrors.email}</div>
//                   )}
//                 </div>
//               </div>

//               {error && (
//                 <div className="error-message general-error">
//                   <span className="error-icon">!</span>
//                   {error}
//                 </div>
//               )}
              
//               <button
//                 type="submit"
//                 style={{ height: "50px", fontSize: "16px" }}
//                 className={`btn-global ${isLoading ? "submitting" : ""}`}
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <>
//                     <span className="spinner"></span>
//                     Sending instructions...
//                   </>
//                 ) : (
//                   "Send Reset Instructions"
//                 )}
//               </button>
//             </form>
//           ) : (
//             <div className="success-message">
//               <div className="success-icon">
//                 <FaCheckCircle />
//               </div>
//               <h3>Check your email</h3>
//               <p>We've sent password reset instructions to <strong>{email}</strong></p>
//               <p className="resend-text">
//                 Didn't receive the email?{" "}
//                 <button 
//                   className="resend-link" 
//                   onClick={handleSubmit}
//                   disabled={isLoading}
//                 >
//                   Click to resend
//                 </button>
//               </p>
//             </div>
//           )}

//           <div className="login-footer">
//             <button 
//               className="back-to-login" 
//               onClick={onBackToLogin}
//               disabled={isLoading}
//             >
//               <FaArrowLeft /> Back to Login
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



// import React, { useState } from "react";
// import {
//   FaEnvelope,
//   FaCheckCircle,
//   FaTimes,
//   FaArrowLeft,
//   FaStore,
//   FaLock,
//   FaEye,
//   FaEyeSlash
// } from "react-icons/fa";
// import "../styles/ForgotPassword.css";
// import "../styles/Login.css";

// export default function ForgotPassword({ onClose, onBackToLogin }) {
//   const [email, setEmail] = useState("");
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [fieldErrors, setFieldErrors] = useState({ email: "" });
//   const [resetToken, setResetToken] = useState("");
//   const [showResetForm, setShowResetForm] = useState(false);
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [resetSuccess, setResetSuccess] = useState(false);

//   // Simulate receiving a reset token (would come from URL in real app)
//   React.useEffect(() => {
//     // Check if we have a token in URL (simulated with query param for demo)
//     const urlParams = new URLSearchParams(window.location.search);
//     const token = urlParams.get('token');
//     if (token) {
//       setResetToken(token);
//       setShowResetForm(true);
//     }
//   }, []);

//   const validateEmailForm = () => {
//     const errors = { email: "" };
//     let isValid = true;

//     if (!email.trim()) {
//       errors.email = "Email is required";
//       isValid = false;
//     } else if (!/\S+@\S+\.\S+/.test(email)) {
//       errors.email = "Please enter a valid email address";
//       isValid = false;
//     }

//     setFieldErrors(errors);
//     return isValid;
//   };

//   const validateResetForm = () => {
//     const errors = {};
//     let isValid = true;

//     if (!password) {
//       errors.password = "Password is required";
//       isValid = false;
//     } else if (password.length < 8) {
//       errors.password = "Password must be at least 8 characters";
//       isValid = false;
//     }

//     if (!confirmPassword) {
//       errors.confirmPassword = "Please confirm your password";
//       isValid = false;
//     } else if (password !== confirmPassword) {
//       errors.confirmPassword = "Passwords do not match";
//       isValid = false;
//     }

//     setFieldErrors(errors);
//     return isValid;
//   };

//   const handleEmailSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!validateEmailForm()) {
//       return;
//     }

//     setIsLoading(true);

//     try {
//       await new Promise(resolve => setTimeout(resolve, 1500));
//       setIsSubmitted(true);
//     } catch (err) {
//       setError("Failed to send reset instructions. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResetSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!validateResetForm()) {
//       return;
//     }

//     setIsLoading(true);

//     try {
//       await new Promise(resolve => setTimeout(resolve, 1500));
//       setResetSuccess(true);
//     } catch (err) {
//       setError("Failed to reset password. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleInputChange = (field, value) => {
//     if (field === 'email') setEmail(value);
//     if (field === 'password') setPassword(value);
//     if (field === 'confirmPassword') setConfirmPassword(value);
    
//     if (fieldErrors[field]) {
//       setFieldErrors({ ...fieldErrors, [field]: "" });
//     }
//     if (error) {
//       setError("");
//     }
//   };

//   const handleClose = () => {
//     if (onClose) onClose();
//   };

//   const simulateTokenClick = () => {
//     // This would normally be a link in an email
//     setShowResetForm(true);
//   };

//   return (
//     <div className="admin-login-modal">
//       <div className="admin-login-container">
//         <div className="admin-login-card">
//           {onClose && (
//             <button className="close-button" onClick={handleClose}>
//               <FaTimes />
//             </button>
//           )}
          
//           <div className="login-header">
//             <div className="header-icon">
//               <FaStore />
//             </div>
//             <div className="header-top">
//               <h2>
//                 {resetSuccess 
//                   ? "Password Reset Successfully" 
//                   : showResetForm 
//                     ? "Create New Password" 
//                     : "Reset Your Password"
//                 }
//               </h2>
//             </div>
//             <p className="login-subtitle">
//               {resetSuccess 
//                 ? "Your password has been successfully reset. You can now login with your new password." 
//                 : showResetForm 
//                   ? "Please enter your new password below" 
//                   : isSubmitted 
//                     ? "Check your email for further instructions" 
//                     : "Enter your email address and we'll send you a link to reset your password"
//               }
//             </p>
//           </div>

//           {resetSuccess ? (
//             <div className="success-message">
//               <div className="success-icon">
//                 <FaCheckCircle />
//               </div>
//               <button
//                 style={{ height: "50px", fontSize: "16px", marginTop: "20px" }}
//                 className="btn-global"
//                 onClick={onBackToLogin}
//               >
//                 Back to Login
//               </button>
//             </div>
//           ) : showResetForm ? (
//             <form onSubmit={handleResetSubmit} className="login-form" noValidate>
//               <div className={`form-group ${fieldErrors.password ? "has-error" : ""}`}>
//                 <label htmlFor="new-password">New Password</label>
//                 <div className="field-wrapper">
//                   <div className="input-container">
//                     <span className="input-icon">
//                       <FaLock />
//                     </span>
//                     <input
//                       id="new-password"
//                       type={showPassword ? "text" : "password"}
//                       value={password}
//                       onChange={(e) => handleInputChange('password', e.target.value)}
//                       placeholder="Enter your new password"
//                       className={fieldErrors.password ? "error" : ""}
//                       disabled={isLoading}
//                     />
//                     <button 
//                       type="button" 
//                       className="password-toggle"
//                       onClick={() => setShowPassword(!showPassword)}
//                     >
//                       {showPassword ? <FaEyeSlash /> : <FaEye />}
//                     </button>
//                   </div>
//                   {fieldErrors.password && (
//                     <div className="error-message">{fieldErrors.password}</div>
//                   )}
//                 </div>
//               </div>

//               <div className={`form-group ${fieldErrors.confirmPassword ? "has-error" : ""}`}>
//                 <label htmlFor="confirm-password">Confirm Password</label>
//                 <div className="field-wrapper">
//                   <div className="input-container">
//                     <span className="input-icon">
//                       <FaLock />
//                     </span>
//                     <input
//                       id="confirm-password"
//                       type={showConfirmPassword ? "text" : "password"}
//                       value={confirmPassword}
//                       onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
//                       placeholder="Confirm your new password"
//                       className={fieldErrors.confirmPassword ? "error" : ""}
//                       disabled={isLoading}
//                     />
//                     <button 
//                       type="button" 
//                       className="password-toggle"
//                       onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     >
//                       {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
//                     </button>
//                   </div>
//                   {fieldErrors.confirmPassword && (
//                     <div className="error-message">{fieldErrors.confirmPassword}</div>
//                   )}
//                 </div>
//               </div>

//               {error && (
//                 <div className="error-message general-error">
//                   <span className="error-icon">!</span>
//                   {error}
//                 </div>
//               )}
              
//               <button
//                 type="submit"
//                 style={{ height: "50px", fontSize: "16px" }}
//                 className={`btn-global ${isLoading ? "submitting" : ""}`}
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <>
//                     <span className="spinner"></span>
//                     Resetting password...
//                   </>
//                 ) : (
//                   "Reset Password"
//                 )}
//               </button>
//             </form>
//           ) : !isSubmitted ? (
//             <form onSubmit={handleEmailSubmit} className="login-form" noValidate>
//               <div className={`form-group ${fieldErrors.email ? "has-error" : ""}`}>
//                 <label htmlFor="forgot-email">Email Address</label>
//                 <div className="field-wrapper">
//                   <div className="input-container">
//                     <span className="input-icon">
//                       <FaEnvelope />
//                     </span>
//                     <input
//                       id="forgot-email"
//                       type="email"
//                       value={email}
//                       onChange={(e) => handleInputChange('email', e.target.value)}
//                       placeholder="Enter your email address"
//                       className={fieldErrors.email ? "error" : ""}
//                       disabled={isLoading}
//                     />
//                   </div>
//                   {fieldErrors.email && (
//                     <div className="error-message">{fieldErrors.email}</div>
//                   )}
//                 </div>
//               </div>

//               {error && (
//                 <div className="error-message general-error">
//                   <span className="error-icon">!</span>
//                   {error}
//                 </div>
//               )}
              
//               <button
//                 type="submit"
//                 style={{ height: "50px", fontSize: "16px" }}
//                 className={`btn-global ${isLoading ? "submitting" : ""}`}
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <>
//                     <span className="spinner"></span>
//                     Sending instructions...
//                   </>
//                 ) : (
//                   "Send Reset Instructions"
//                 )}
//               </button>
//             </form>
//           ) : (
//             <div className="success-message">
//               <div className="success-icon">
//                 <FaCheckCircle />
//               </div>
//               <h3>Check your email</h3>
//               <p>We've sent password reset instructions to <strong>{email}</strong></p>
              
//               {/* Demo only - would not be in production */}
//               <div className="demo-reset-link">
//                 <p>For demo purposes:</p>
//                 <button 
//                   className="reset-link-btn" 
//                   onClick={simulateTokenClick}
//                 >
//                   Click here to simulate receiving the reset link
//                 </button>
//               </div>
              
//               <p className="resend-text">
//                 Didn't receive the email?{" "}
//                 <button 
//                   className="resend-link" 
//                   onClick={handleEmailSubmit}
//                   disabled={isLoading}
//                 >
//                   Click to resend
//                 </button>
//               </p>
//             </div>
//           )}

//           {!resetSuccess && (
//             <div className="login-footer">
//               <button 
//                 className="back-to-login" 
//                 onClick={onBackToLogin}
//                 disabled={isLoading}
//               >
//                 <FaArrowLeft /> Back to Login
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



// import React, { useState } from "react";
// import {
//   FaEnvelope,
//   FaCheckCircle,
//   FaTimes,
//   FaArrowLeft,
//   FaStore,
//   FaLock,
//   FaEye,
//   FaEyeSlash,
//   FaCheck,
//   FaTimesCircle
// } from "react-icons/fa";
// import "../styles/ForgotPassword.css";
// import "../styles/Login.css";

// export default function ForgotPassword({ onClose, onBackToLogin }) {
//   const [email, setEmail] = useState("");
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [fieldErrors, setFieldErrors] = useState({ email: "" });
//   const [resetToken, setResetToken] = useState("");
//   const [showResetForm, setShowResetForm] = useState(false);
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [resetSuccess, setResetSuccess] = useState(false);

//   const validatePassword = (password) => {
//     const uppercase = /[A-Z]/;
//     const lowercase = /[a-z]/;
//     const number = /[0-9]/;
//     const specialChar = /[!@#$%^&*(),.?":{}|<>]/;

//     return {
//       hasMinLength: password?.length >= 6,
//       hasUppercase: uppercase.test(password),
//       hasLowercase: lowercase.test(password),
//       hasNumber: number.test(password),
//       hasSpecialChar: specialChar.test(password),
//       isValid: password?.length >= 6 &&
//         uppercase.test(password) &&
//         lowercase.test(password) &&
//         number.test(password) &&
//         specialChar.test(password)
//     };
//   };

//   React.useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const token = urlParams.get('token');
//     if (token) {
//       setResetToken(token);
//       setShowResetForm(true);
//     }
//   }, []);

//   const validateEmailForm = () => {
//     const errors = { email: "" };
//     let isValid = true;

//     if (!email.trim()) {
//       errors.email = "Email is required";
//       isValid = false;
//     } else if (!/\S+@\S+\.\S+/.test(email)) {
//       errors.email = "Please enter a valid email address";
//       isValid = false;
//     }

//     setFieldErrors(errors);
//     return isValid;
//   };

//   const validateResetForm = () => {
//     const errors = {};
//     let isValid = true;

//     const passwordValidation = validatePassword(password);
    
//     if (!password) {
//       errors.password = "Password is required";
//       isValid = false;
//     } else if (!passwordValidation.isValid) {
//       errors.password = "Password does not meet all requirements";
//       isValid = false;
//     }

//     if (!confirmPassword) {
//       errors.confirmPassword = "Please confirm your password";
//       isValid = false;
//     } else if (password !== confirmPassword) {
//       errors.confirmPassword = "Passwords do not match";
//       isValid = false;
//     }

//     setFieldErrors(errors);
//     return isValid;
//   };

//   const handleEmailSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!validateEmailForm()) {
//       return;
//     }

//     setIsLoading(true);

//     try {
//       await new Promise(resolve => setTimeout(resolve, 1500));
//       setIsSubmitted(true);
//     } catch (err) {
//       setError("Failed to send reset instructions. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResetSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!validateResetForm()) {
//       return;
//     }

//     setIsLoading(true);

//     try {
//       await new Promise(resolve => setTimeout(resolve, 1500));
//       setResetSuccess(true);
//     } catch (err) {
//       setError("Failed to reset password. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleInputChange = (field, value) => {
//     if (field === 'email') setEmail(value);
//     if (field === 'password') setPassword(value);
//     if (field === 'confirmPassword') setConfirmPassword(value);
    
//     if (fieldErrors[field]) {
//       setFieldErrors({ ...fieldErrors, [field]: "" });
//     }
//     if (error) {
//       setError("");
//     }
//   };

//   const handleClose = () => {
//     if (onClose) onClose();
//   };

//   const simulateTokenClick = () => {
//     setShowResetForm(true);
//   };

//   const passwordValidation = validatePassword(password);

//   return (
//     <div className="admin-login-modal">
//       <div className="admin-login-container">
//         <div className="admin-login-card">
//           {onClose && (
//             <button className="close-button" onClick={handleClose}>
//               <FaTimes />
//             </button>
//           )}
          
//           <div className="login-header">
//             <div className="header-icon">
//               <FaStore />
//             </div>
//             <div className="header-top">
//               <h2>
//                 {resetSuccess 
//                   ? "Password Reset Successfully" 
//                   : showResetForm 
//                     ? "Create New Password" 
//                     : "Reset Your Password"
//                 }
//               </h2>
//             </div>
//             <p className="login-subtitle">
//               {resetSuccess 
//                 ? "Your password has been successfully reset. You can now login with your new password." 
//                 : showResetForm 
//                   ? "Please enter your new password below" 
//                   : isSubmitted 
//                     ? "Check your email for further instructions" 
//                     : "Enter your email address and we'll send you a link to reset your password"
//               }
//             </p>
//           </div>

//           {resetSuccess ? (
//             <div className="success-message">
//               <div className="success-icon">
//                 <FaCheckCircle />
//               </div>
//               <button
//                 style={{ height: "50px", fontSize: "16px", marginTop: "20px" }}
//                 className="btn-global"
//                 onClick={onBackToLogin}
//               >
//                 Back to Login
//               </button>
//             </div>
//           ) : showResetForm ? (
//             <form onSubmit={handleResetSubmit} className="login-form" noValidate>
//               <div className={`form-group ${fieldErrors.password ? "has-error" : ""}`}>
//                 <label htmlFor="new-password">New Password</label>
//                 <div className="field-wrapper">
//                   <div className="input-container">
//                     <span className="input-icon">
//                       <FaLock />
//                     </span>
//                     <input
//                       id="new-password"
//                       type={showPassword ? "text" : "password"}
//                       value={password}
//                       onChange={(e) => handleInputChange('password', e.target.value)}
//                       placeholder="Enter your new password"
//                       className={fieldErrors.password ? "error" : ""}
//                       disabled={isLoading}
//                     />
//                     <button 
//                       type="button" 
//                       className="password-toggle"
//                       onClick={() => setShowPassword(!showPassword)}
//                     >
//                       {showPassword ? <FaEyeSlash /> : <FaEye />}
//                     </button>
//                   </div>
                  
//                   <div className="password-requirements">
//                     <p className="requirements-title">Password must include:</p>
//                     <div className="requirement">
//                       {passwordValidation.hasMinLength ? <FaCheck className="valid" /> : <FaTimesCircle className="invalid" />}
//                       <span>At least 6 characters</span>
//                     </div>
//                     <div className="requirement">
//                       {passwordValidation.hasUppercase ? <FaCheck className="valid" /> : <FaTimesCircle className="invalid" />}
//                       <span>One uppercase letter</span>
//                     </div>
//                     <div className="requirement">
//                       {passwordValidation.hasLowercase ? <FaCheck className="valid" /> : <FaTimesCircle className="invalid" />}
//                       <span>One lowercase letter</span>
//                     </div>
//                     <div className="requirement">
//                       {passwordValidation.hasNumber ? <FaCheck className="valid" /> : <FaTimesCircle className="invalid" />}
//                       <span>One number</span>
//                     </div>
//                     <div className="requirement">
//                       {passwordValidation.hasSpecialChar ? <FaCheck className="valid" /> : <FaTimesCircle className="invalid" />}
//                       <span>One special character</span>
//                     </div>
//                   </div>
                  
//                   {fieldErrors.password && (
//                     <div className="error-message">{fieldErrors.password}</div>
//                   )}
//                 </div>
//               </div>

//               <div className={`form-group ${fieldErrors.confirmPassword ? "has-error" : ""}`}>
//                 <label htmlFor="confirm-password">Confirm Password</label>
//                 <div className="field-wrapper">
//                   <div className="input-container">
//                     <span className="input-icon">
//                       <FaLock />
//                     </span>
//                     <input
//                       id="confirm-password"
//                       type={showConfirmPassword ? "text" : "password"}
//                       value={confirmPassword}
//                       onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
//                       placeholder="Confirm your new password"
//                       className={fieldErrors.confirmPassword ? "error" : ""}
//                       disabled={isLoading}
//                     />
//                     <button 
//                       type="button" 
//                       className="password-toggle"
//                       onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     >
//                       {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
//                     </button>
//                   </div>
//                   {fieldErrors.confirmPassword && (
//                     <div className="error-message">{fieldErrors.confirmPassword}</div>
//                   )}
//                 </div>
//               </div>

//               {error && (
//                 <div className="error-message general-error">
//                   <span className="error-icon">!</span>
//                   {error}
//                 </div>
//               )}
              
//               <button
//                 type="submit"
//                 style={{ height: "50px", fontSize: "16px" }}
//                 className={`btn-global ${isLoading ? "submitting" : ""}`}
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <>
//                     <span className="spinner"></span>
//                     Resetting password...
//                   </>
//                 ) : (
//                   "Reset Password"
//                 )}
//               </button>
//             </form>
//           ) : !isSubmitted ? (
//             <form onSubmit={handleEmailSubmit} className="login-form" noValidate>
//               <div className={`form-group ${fieldErrors.email ? "has-error" : ""}`}>
//                 <label htmlFor="forgot-email">Email Address</label>
//                 <div className="field-wrapper">
//                   <div className="input-container">
//                     <span className="input-icon">
//                       <FaEnvelope />
//                     </span>
//                     <input
//                       id="forgot-email"
//                       type="email"
//                       value={email}
//                       onChange={(e) => handleInputChange('email', e.target.value)}
//                       placeholder="Enter your email address"
//                       className={fieldErrors.email ? "error" : ""}
//                       disabled={isLoading}
//                     />
//                   </div>
//                   {fieldErrors.email && (
//                     <div className="error-message">{fieldErrors.email}</div>
//                   )}
//                 </div>
//               </div>

//               {error && (
//                 <div className="error-message general-error">
//                   <span className="error-icon">!</span>
//                   {error}
//                 </div>
//               )}
              
//               <button
//                 type="submit"
//                 style={{ height: "50px", fontSize: "16px" }}
//                 className={`btn-global ${isLoading ? "submitting" : ""}`}
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <>
//                     <span className="spinner"></span>
//                     Sending instructions...
//                   </>
//                 ) : (
//                   "Send Reset Instructions"
//                 )}
//               </button>
//             </form>
//           ) : (
//             <div className="success-message">
//               <div className="success-icon">
//                 <FaCheckCircle />
//               </div>
//               <h3>Check your email</h3>
//               <p>We've sent password reset instructions to <strong>{email}</strong></p>
              
//               {/* Demo only - would not be in production */}
//               <div className="demo-reset-link">
//                 <p>test:</p>
//                 <button 
//                   className="reset-link-btn" 
//                   onClick={simulateTokenClick}
//                 >
//                   Click here to link
//                 </button>
//               </div>
              
//               <p className="resend-text">
//                 Didn't receive the email?{" "}
//                 <button 
//                   className="resend-link" 
//                   onClick={handleEmailSubmit}
//                   disabled={isLoading}
//                 >
//                   Click to resend
//                 </button>
//               </p>
//             </div>
//           )}

//           {!resetSuccess && (
//             <div className="login-footer">
//               <button 
//                 className="back-to-login" 
//                 onClick={onBackToLogin}
//                 disabled={isLoading}
//               >
//                 <FaArrowLeft /> Back to Login
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



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
import { Link } from "react-router-dom";

export default function ForgotPassword({ onClose, onBackToLogin }) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({ email: "" });

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
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubmitted(true);
    } catch (err) {
      setError("Failed to send reset instructions. Please try again.");
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
    if (onClose) onClose();
  };

  return (
    <div className="admin-login-modal">
      <div className="admin-login-container">
        <div className="admin-login-card">
          {onClose && (
            <button className="close-button" onClick={handleClose}>
              <FaTimes />
            </button>
          )}
          
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
                style={{ height: "50px", fontSize: "16px" }}
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
  <Link to="/reset-password" className="reset-link-btn">
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
                onClick={onBackToLogin}
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