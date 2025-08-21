// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/Login.css";

// export default function AdminLogin() {
//   const [adminEmail, setAdminEmail] = useState("");
//   const [adminPassword, setAdminPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//  const handleSubmit = async (e) => {
//   e.preventDefault();
//   setError(""); // Clear previous error

//   try {
//     const response = await fetch("http://localhost:5001/api/restaurants/login", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         email: adminEmail.trim().toLowerCase(),
//         password: adminPassword.trim(),
//       }),
//     });

//     const data = await response.json();
//     if (response.ok && data.message === "Login successful") {
//       // ✅ Store email in localStorage
//       localStorage.setItem("restaurantEmail", adminEmail);
//       alert("Admin login successful!");
//       navigate("/admin-dashboard");
//     } else {
//       setError(data.error || "Invalid email or password");
//     }
//   } catch (error) {
//     setError("Server error. Please try again later.");
//   }
// };


//   return (
//     <div
//       className="d-flex justify-content-center align-items-center"
//       style={{
//         //background: "linear-gradient(120deg, #b2c8f6, #e0f0ff)",
//         minHeight: "0vh",
//       }}
//     >
//       <form
//         className="card p4"
//         style={{ width: "400px", borderRadius: "14px" }}
//         onSubmit={handleSubmit}
//       >
//         <h3 className="text-center mb-4">🔐 Admin Login</h3>

//         {error && <div className="alert alert-danger">{error}</div>}

//         <div className="mb-3">
//           <label>Email Address</label>
//           <input
//             type="email"
//             className="form-control"
//             value={adminEmail}
//             onChange={(e) => setAdminEmail(e.target.value)}
//             required
//           />
//         </div>

//         <div className="mb-3">
//           <label>Password</label>
//           <input
//             type="password"
//             className="form-control"
//             value={adminPassword}
//             onChange={(e) => setAdminPassword(e.target.value)}
//             required
//           />
//         </div>

//         <button
//           type="submit"
//           className="btn btn-primary w-100"
//           style={{ fontWeight: "600" }}
//         >
//           Login as Admin
//         </button>
//       </form>
//     </div>
//   );
// }





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
// import { FaUser } from "react-icons/fa";
// import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
// import "../components/AdminLoginModal.css";

//  export default function AdminLogin({ onClose }) {
//   const navigate = useNavigate();
//   const [adminEmail, setAdminEmail] = useState("");
//   const [adminPassword, setAdminPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch("http://localhost:5001/api/restaurants/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: adminEmail, password: adminPassword }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         localStorage.setItem("adminEmail", adminEmail);
//         navigate("/admin-dashboard");
//       } else {
//         setErrorMessage(data.error || "Invalid email or password");
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       setErrorMessage("An error occurred. Please try again.");
//     }
//   };

//   return (
//     <div className="admin-login-overlay">
//       <div className="admin-login-box">
//         <button className="admin-close-btn" onClick={onClose}>✕</button>
//         <h2 className="admin-login-title">Login</h2>

//         {errorMessage && <p className="error-text">{errorMessage}</p>}

//         <form onSubmit={handleSubmit} className="admin-login-form">
//           <div className="input-wrapper">
//             <FaUser className="input-icon" />

//             <input
//              className="admin-login-input"
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
//              className="admin-login-input"
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

//           <button type="submit" className="continue-btn">Continue</button>
//         </form>
//       </div>
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
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch("http://localhost:5001/api/restaurants/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: adminEmail, password: adminPassword }),
    });

    const data = await response.json();

    if (response.ok) {
      // ✅ Token aur email save karo
      localStorage.setItem("token", data.token);  // yeh line badal do
localStorage.setItem("adminEmail", adminEmail);


      // ✅ Success message show karo
      alert("Login successful ✅");


   // modal close karo
      // ✅ Navigate to dashboard 
       navigate("/admin-dashboard");
       onClose();  
    } else {
      // ✅ Error message UI me dikhao
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
        {/* ✅ Working close button with correct prop */}
        <button className="admin-close-btn" onClick={onClose}>✕</button>

        <h2 className="admin-login-title">Login</h2>

        {errorMessage && <p className="error-text">{errorMessage}</p>}

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

          <button type="submit" className="continue-btn">Continue</button>
        </form>
      </div>
    </div>
  );
}
