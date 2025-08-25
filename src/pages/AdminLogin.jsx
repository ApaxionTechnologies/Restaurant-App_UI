
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




import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import "../components/AdminLoginModal.css";

export default function AdminLogin({ onClose }) {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const validatePassword = (password) => {
    const minLength = /.{6,}/;
    const uppercase = /[A-Z]/;
    const lowercase = /[a-z]/;
    const number = /[0-9]/;
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/;
    return (
      minLength.test(password) &&
      uppercase.test(password) &&
      lowercase.test(password) &&
      number.test(password) &&
      specialChar.test(password)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5001/api/restaurants/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminEmail, password: adminPassword }),
      });
      
      e.preventDefault();
    if (!validatePassword(adminPassword)) {
      setErrorMessage("Password must be at least 6 characters and include uppercase, lowercase, number, and special character.");
      return;
    }

      const data = await response.json();

    if (response.ok) {
   
      localStorage.setItem("token", data.token);  
localStorage.setItem("adminEmail", adminEmail);
       navigate("/admin-dashboard");
       onClose();  
    } else {
    
      setErrorMessage(data.error || "Invalid email or password");
    }
  } catch (error) {
    console.error("Login error:", error);
    setErrorMessage("An error occurred. Please try again.");
  }
};


  return (
    <div className="admin-login-overlay">
      <div className="admin-login-box">
     
        <button className="admin-close-btn" onClick={onClose}>✕</button>

        <h2 className="admin-login-title">Login</h2>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="input-wrapper">
            <FaUser className="input-icon" />
            <input
              className="admin-login-input"
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>

          <div className="input-wrapper">
            <FaLock className="input-icon" />
            <input
              className="admin-login-input"
              type={showPassword ? "text" : "password"}
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Password"
              required
            />
            {showPassword ? (
              <FaEyeSlash className="toggle-icon" onClick={() => setShowPassword(false)} />
            ) : (
              <FaEye className="toggle-icon" onClick={() => setShowPassword(true)} />
            )}
          </div>

          {errorMessage && <p className="error-text">{errorMessage}</p>}

          <button type="submit" className="continue-btn">Continue</button>
        </form>
      </div>
    </div>
  );
}
