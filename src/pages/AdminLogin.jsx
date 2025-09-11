
    // The Curent Code For AdminLogin Pop-up
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/Login.css"; // Ensure styles are loaded

// export default function AdminLogin({ onClose }) {
//   const navigate = useNavigate();
//   const [adminEmail, setAdminEmail] = useState("");
//   const [adminPassword, setAdminPassword] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Your login logic here
//     navigate("/admin-dashboard");
//   };

//   return (
//     <div className="admin-login-container">
//       <div className="admin-login-header">
//         <h3>🔐 Admin Login     <button className="admin-close-btn" onClick={onClose}>  ❌ </button></h3>
        
//       </div>

//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label>Email Address</label>
//           <input
//             type="email"
//             value={adminEmail}
//             onChange={(e) => setAdminEmail(e.target.value)}
//             className="form-control"
//             placeholder="admin@example.com"
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Password</label>
//           <input
//             type="password"
//             value={adminPassword}
//             onChange={(e) => setAdminPassword(e.target.value)}
//             className="form-control"
//             placeholder="Enter your password"
//             required
//           />
//         </div>

//         <button type="submit" className="btn btn-primary btn-block">
//           Login as Admin
//         </button>
//       </form>
//     </div>
//   );
// }




// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/Login.css";
// import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
// import "../components/AdminLoginModal.css";

// export default function AdminLogin({ onClose }) {
//   const navigate = useNavigate();
//   const [adminEmail, setAdminEmail] = useState("");
//   const [adminPassword, setAdminPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   const validatePassword = (password) => {
//     const minLength = /.{6,}/;
//     const uppercase = /[A-Z]/;
//     const lowercase = /[a-z]/;
//     const number = /[0-9]/;
//     const specialChar = /[!@#$%^&*(),.?":{}|<>]/;
//     return (
//       minLength.test(password) &&
//       uppercase.test(password) &&
//       lowercase.test(password) &&
//       number.test(password) &&
//       specialChar.test(password)
//     );
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch("http://localhost:5001/api/restaurants/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: adminEmail, password: adminPassword }),
//       });
      
//       e.preventDefault();
//     if (!validatePassword(adminPassword)) {
//       setErrorMessage("Password must be at least 6 characters and include uppercase, lowercase, number, and special character.");
//       return;
//     }

//       const data = await response.json();

//     if (response.ok) {
   
//       localStorage.setItem("token", data.token);  
// localStorage.setItem("adminEmail", adminEmail);
//        navigate("/admin-dashboard");
//        onClose();  
//     } else {
    
//       setErrorMessage(data.error || "Invalid email or password");
//     }
//   } catch (error) {
//     console.error("Login error:", error);
//     setErrorMessage("An error occurred. Please try again.");
//   }
// };


//   return (
//     <div className="admin-login-overlay">
//       <div className="admin-login-box">
     
//         <button className="admin-close-btn" onClick={onClose}>✕</button>

//         <h2 className="admin-login-title">Login</h2>

//         <form onSubmit={handleSubmit} className="admin-login-form">
//           <div className="input-wrapper">
//             <FaUser className="input-icon" />
//             <input
//               className="admin-login-input"
//               type="email"
//               value={adminEmail}
//               onChange={(e) => setAdminEmail(e.target.value)}
//               placeholder="Email"
//               required
//             />
//           </div>

//           <div className="input-wrapper">
//             <FaLock className="input-icon" />
//             <input
//               className="admin-login-input"
//               type={showPassword ? "text" : "password"}
//               value={adminPassword}
//               onChange={(e) => setAdminPassword(e.target.value)}
//               placeholder="Password"
//               required
//             />
//             {showPassword ? (
//               <FaEyeSlash className="toggle-icon" onClick={() => setShowPassword(false)} />
//             ) : (
//               <FaEye className="toggle-icon" onClick={() => setShowPassword(true)} />
//             )}
//           </div>

//           {errorMessage && <p className="error-text">{errorMessage}</p>}

//           <button type="submit" className="continue-btn">Continue</button>
//         </form>
//       </div>
//     </div>
//   );
// }


// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaUser, FaLock, FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
// import "../styles/Login.css";

// export default function AdminLogin({ onClose }) {
//   const navigate = useNavigate();
//   const [adminEmail, setAdminEmail] = useState("");
//   const [adminPassword, setAdminPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [fieldErrors, setFieldErrors] = useState({
//     email: "",
//     password: ""
//   });

//   const validatePassword = (password) => {
//     const uppercase = /[A-Z]/;
//     const lowercase = /[a-z]/;
//     const number = /[0-9]/;
//     const specialChar = /[!@#$%^&*(),.?":{}|<>]/;

//     return (
//       password?.length >= 6 &&
//       uppercase.test(password) &&
//       lowercase.test(password) &&
//       number.test(password) &&
//       specialChar.test(password)
//     );
//   };

//   const validateForm = () => {
//     const errors = {
//       email: "",
//       password: ""
//     };

//     let isValid = true;

//     if (!adminEmail.trim()) {
//       errors.email = "Email is required";
//       isValid = false;
//     } else if (!/\S+@\S+\.\S+/.test(adminEmail)) {
//       errors.email = "Please enter a valid email address";
//       isValid = false;
//     }

//     if (!adminPassword) {
//       errors.password = "Password is required";
//       isValid = false;
//     } else if (!validatePassword(adminPassword)) {
//       errors.password =
//         "Password must be at least 6 characters and include uppercase, lowercase, number, and special character.";
//       isValid = false;
//     }

//     setFieldErrors(errors);
//     return isValid;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMessage("");

//     if (!validateForm()) {
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const response = await fetch("http://localhost:5001/api/restaurants/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: adminEmail, password: adminPassword }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("adminEmail", adminEmail);
//         navigate("/admin-dashboard");
//         if (onClose) onClose();
//       } else {
//         setErrorMessage(data.error || "Invalid email or password");
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       setErrorMessage("Network error. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleInputChange = (field, value) => {
//     if (field === "email") {
//       setAdminEmail(value);
//       if (fieldErrors.email) {
//         setFieldErrors({ ...fieldErrors, email: "" });
//       }
//     } else if (field === "password") {
//       setAdminPassword(value);
//       if (fieldErrors.password) {
//         setFieldErrors({ ...fieldErrors, password: "" });
//       }
//     }
//     if (errorMessage) {
//       setErrorMessage("");
//     }
//   };

//   return (
//     <div className="admin-login-modal">
//       <div className="admin-login-container">
//         <div className="admin-login-card">
//           <div className="login-header">
//             <div className="header-top">
//               <h2>Admin Login</h2>
//               {onClose && (
//                 <button className="close-button" onClick={onClose}>
//                   <FaTimes />
//                 </button>
//               )}
//             </div>
//             <p className="login-subtitle">Access your restaurant dashboard</p>
//           </div>

//           <form onSubmit={handleSubmit} className="login-form" noValidate>
          
//   <div className={`form-group ${fieldErrors.email ? "has-error" : ""}`}>
//   <label htmlFor="email">Email Address</label>
//   <div className="field-wrapper">
//     <div className="input-container">
//       <span className="input-icon">
//         <FaUser />
//       </span>
//       <input
//         id="email"
//         type="email"
//         value={adminEmail}
//         onChange={(e) => handleInputChange("email", e.target.value)}
//         placeholder="Enter your email"
//         className={fieldErrors.email ? "error" : ""}
//       />
//     </div>
//     {(fieldErrors.email === "Email is required" ||
//       fieldErrors.email === "Please enter a valid email address") && (
//       <div className="error-message">{fieldErrors.email}</div>
//     )}
//   </div>
// </div>

//             <div className={`form-group ${fieldErrors.password ? "has-error" : ""}`}>
//   <div className="password-label-container">
//     <label htmlFor="password">Password</label>
//     <a href="#forgot" className="forgot-link">
//       Forgot password?
//     </a>
//   </div>

//   {/* ✅ Wrap with field-wrapper */}
//   <div className="field-wrapper">
//     <div className="input-container">
//       <span className="input-icon">
//         <FaLock />
//       </span>
//       <input
//         id="password"
//         type={showPassword ? "text" : "password"}
//         value={adminPassword}
//         onChange={(e) => handleInputChange("password", e.target.value)}
//         placeholder="Enter your password"
//         className={fieldErrors.password ? "error" : ""}
//       />
//       <button
//         type="button"
//         className="toggle-password"
//         onClick={() => setShowPassword(!showPassword)}
//       >
//         {showPassword ? <FaEyeSlash /> : <FaEye />}
//       </button>
//     </div>

//     {/* ✅ Short error bubble (top-right) */}
//     {fieldErrors.password === "Password is required" && (
//       <div className="error-message">{fieldErrors.password}</div>
//     )}
//   </div>

//   {/* ✅ Long error (rules) below input */}
//   {fieldErrors.password &&
//     fieldErrors.password.includes("must be") && (
//       <span className="validation-error">{fieldErrors.password}</span>
//     )}
// </div>

//             {errorMessage && (
//               <div className="error-message">
//                 <span className="error-icon">!</span>
//                 {errorMessage}
//               </div>
//             )}
//             <button
//               type="submit"
//               className={`login-button ${isSubmitting ? "submitting" : ""}`}
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? (
//                 <>
//                   <span className="spinner"></span>
//                   Signing in...
//                 </>
//               ) : (
//                 "Continue to Dashboard"
//               )}
//             </button>
//           </form>

//           <div className="login-footer">
//             <p>
//               Don't have an account? <a href="#signup">Contact support</a>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaUser, FaLock, FaEye, FaEyeSlash, FaTimes, FaStore } from "react-icons/fa";
// import "../styles/Login.css";
// import { Link } from "react-router-dom"; 
// import { adminLogin } from "../services/apiService";

// export default function AdminLogin({ onClose }) {
//   const navigate = useNavigate();
//   const [adminEmail, setAdminEmail] = useState("");
//   const [adminPassword, setAdminPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [fieldErrors, setFieldErrors] = useState({
//     email: "",
//     password: ""
//   });

//   const validatePassword = (password) => {
//     const uppercase = /[A-Z]/;
//     const lowercase = /[a-z]/;
//     const number = /[0-9]/;
//     const specialChar = /[!@#$%^&*(),.?":{}|<>]/;

//     return (
//       password?.length >= 6 &&
//       uppercase.test(password) &&
//       lowercase.test(password) &&
//       number.test(password) &&
//       specialChar.test(password)
//     );
//   };

// const [showForgotPassword, setShowForgotPassword] = useState(false);
//   const validateForm = () => {
//     const errors = {
//       email: "",
//       password: ""
//     };

//     let isValid = true;

//     if (!adminEmail.trim()) {
//       errors.email = "Email is required";
//       isValid = false;
//     } else if (!/\S+@\S+\.\S+/.test(adminEmail)) {
//       errors.email = "Please enter a valid email address";
//       isValid = false;
//     }

//     if (!adminPassword) {
//       errors.password = "Password is required";
//       isValid = false;
//     } else if (!validatePassword(adminPassword)) {
//       errors.password =
//         "Password must be at least 6 characters and include uppercase, lowercase, number, and special character.";
//       isValid = false;
//     }

//     setFieldErrors(errors);
//     return isValid;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMessage("");

//     if (!validateForm()) {
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const data = await adminLogin({ email: adminEmail, password: adminPassword });
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("adminEmail", adminEmail);
//         navigate("/admin-dashboard");
//         if (onClose) onClose();
//        else {
//         setErrorMessage(data.error || "Invalid email or password");
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       setErrorMessage("Network error. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleInputChange = (field, value) => {
//     if (field === "email") {
//       setAdminEmail(value);
//       if (fieldErrors.email) {
//         setFieldErrors({ ...fieldErrors, email: "" });
//       }
//     } else if (field === "password") {
//       setAdminPassword(value);
//       if (fieldErrors.password) {
//         setFieldErrors({ ...fieldErrors, password: "" });
//       }
//     }
//     if (errorMessage) {
//       setErrorMessage("");
//     }
//   };

//   return (
//     <div className="admin-login-modal">
//       <div className="admin-login-container">
//         <div className="admin-login-card">
//           <div className="login-header">
//             <div className="header-icon">
//               <FaStore />
//             </div>
//             <div className="header-top">
//               <h2>Restaurant Admin Portal</h2>
//               {onClose && (
//                 <button className="close-button" onClick={onClose}>
//                   <FaTimes />
//                 </button>
//               )}
//             </div>
//             <p className="login-subtitle">Sign in to manage your restaurant</p>
//           </div>

//           <form onSubmit={handleSubmit} className="login-form" noValidate>
//             <div className={`form-group ${fieldErrors.email ? "has-error" : ""}`}>
//               <label htmlFor="email">Email Address</label>
//               <div className="field-wrapper">
//                 <div className="input-container">
//                   <span className="input-icon">
//                     <FaUser />
//                   </span>
//                   <input
//                     id="email"
//                     type="email"
//                     value={adminEmail}
//                     onChange={(e) => handleInputChange("email", e.target.value)}
//                     placeholder="Enter your email"
//                     className={fieldErrors.email ? "error" : ""}
//                   />
//                 </div>
//                 {(fieldErrors.email === "Email is required" ||
//                   fieldErrors.email === "Please enter a valid email address") && (
//                   <div className="error-message">{fieldErrors.email}</div>
//                 )}
//               </div>
//             </div>

//             <div className={`form-group ${fieldErrors.password ? "has-error" : ""}`}>
//               <div className="password-label-container">
//                 <label htmlFor="password">Password</label>
//                 <a href="/forgot-password" className="forgot-link" onClick={(e) => {
//   e.preventDefault();
//   setShowForgotPassword(true);
// }}>
//   Forgot password?
// </a>

//               </div>

//               <div className="field-wrapper">
//                 <div className="input-container">
//                   <span className="input-icon">
//                     <FaLock />
//                   </span>
//                   <input
//                     id="password"
//                     type={showPassword ? "text" : "password"}
//                     value={adminPassword}
//                     onChange={(e) => handleInputChange("password", e.target.value)}
//                     placeholder="Enter your password"
//                     className={fieldErrors.password ? "error" : ""}
//                   />
//                   <button
//                     type="button"
//                     className="toggle-password"
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     {showPassword ? <FaEyeSlash /> : <FaEye />}
//                   </button>
//                 </div>

//                 {fieldErrors.password === "Password is required" && (
//                   <div className="error-message">{fieldErrors.password}</div>
//                 )}
//               </div>

//               {fieldErrors.password &&
//                 fieldErrors.password.includes("must be") && (
//                   <span className="validation-error">{fieldErrors.password}</span>
//                 )}
//             </div>

//             {errorMessage && (
//               <div className="error-message general-error">
//                 <span className="error-icon">!</span>
//                 {errorMessage}
//               </div>
//             )}
            
//             <button
//               type="submit"
//               style={{ height: "50px", fontSize: "16px" }}
//               className={` btn-global  ${isSubmitting ? "submitting" : ""}`}
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? (
//                 <>
//                   <span className="spinner"></span>
//                   Signing in...
//                 </>
//               ) : (
//                 "Continue to Dashboard"
//               )}
//             </button>
//           </form>

//         <div className="login-footer">
//   <p>
//     Don't have an account?{" "}
//     <Link to="/registerrestaurant" className="support-link">
//       Register Your Restaurant
//     </Link>
//   </p>
// </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// src/components/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaTimes, FaStore } from "react-icons/fa";
import "../styles/Login.css";
import { Link } from "react-router-dom"; 
import { adminLogin } from "../services/apiService";
import ForgotPassword from "./forgotPassword"; // Import ForgotPassword component

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
  const [showForgotPassword, setShowForgotPassword] = useState(false); // Add this state

  const validatePassword = (password) => {
    const uppercase = /[A-Z]/;
    const lowercase = /[a-z]/;
    const number = /[0-9]/;
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/;

    return (
      password?.length >= 6 &&
      uppercase.test(password) &&
      lowercase.test(password) &&
      number.test(password) &&
      specialChar.test(password)
    );
  };

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
    } else if (!validatePassword(adminPassword)) {
      errors.password =
        "Password must be at least 6 characters and include uppercase, lowercase, number, and special character.";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
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
          {onClose && (
                  <button className="close-button" onClick={onClose}>
                    <FaTimes />
                  </button>
                )}
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

                  {fieldErrors.password === "Password is required" && (
                    <div className="error-message">{fieldErrors.password}</div>
                  )}
                </div>

                {fieldErrors.password &&
                  fieldErrors.password.includes("must be") && (
                    <span className="validation-error">{fieldErrors.password}</span>
                  )}
              </div>

              {errorMessage && (
                <div className="error-message general-error">
                  <span className="error-icon">!</span>
                  {errorMessage}
                </div>
              )}
              
              <button
                type="submit"
                style={{ height: "50px", fontSize: "16px" }}
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