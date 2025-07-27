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

// export default function AdminLogin({ onClose }) {
//   const navigate = useNavigate();
//   const [adminEmail, setAdminEmail] = useState("");
//   const [adminPassword, setAdminPassword] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // 👉 Store the email in localStorage
//     localStorage.setItem("adminEmail", adminEmail);

//     // Navigate to dashboard
//     navigate("/admin-dashboard");
//   };

//   return (
//     <div className="admin-login-container">
//       <div className="admin-login-header">
//         <h3>
//           🔐 Admin Login{" "}
//           <button className="admin-close-btn" onClick={onClose}>
//             ❌
//           </button>
//         </h3>
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

// export default function AdminLogin({ onClose }) {
//   const navigate = useNavigate();
//   const [adminEmail, setAdminEmail] = useState("");
//   const [adminPassword, setAdminPassword] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     localStorage.setItem("adminEmail", adminEmail);
//     navigate("/admin-dashboard");
//   };

//   return (
//     <div className="admin-login-container">
//       <div className="admin-login-header">
//         <h3 className="amnin-font">
//           🔐 Admin Login{" "}
//           <button className="admin-close-btn" onClick={onClose}>
//             ❌
//           </button>
//         </h3>
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
//     <div className="admin-login-overlay">
//       <div className="admin-login-box">
//         <button className="admin-close-btn" onClick={onClose}>
//           ❌
//         </button>
//         <h3 className="admin-login-title">🔐 Admin Login</h3>
//         <form onSubmit={handleSubmit} className="admin-login-form">
//           <div className="form-group">
//             <label>Email Address</label>
//             <input
//               type="email"
//               value={adminEmail}
//               onChange={(e) => setAdminEmail(e.target.value)}
//               className="form-control"
//               placeholder="admin@example.com"
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label>Password</label>
//             <input
//               type="password"
//               value={adminPassword}
//               onChange={(e) => setAdminPassword(e.target.value)}
//               className="form-control"
//               placeholder="Enter your password"
//               required
//             />
//           </div>

//           <button type="submit" className="btn btn-primary btn-block">
//             Login as Admin
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }



import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

export default function AdminLogin({ onClose }) {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");  // State for error message

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send login request to the server
      const response = await fetch("http://localhost:5001/api/restaurants/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: adminEmail,
          password: adminPassword,
        }),
      });

      // Check for errors in the response
      const data = await response.json();

      if (response.ok) {
        // Successful login: Store email in localStorage and navigate to dashboard
        localStorage.setItem("adminEmail", adminEmail);
        navigate("/admin-dashboard");
      } else {
        // Display error message from the server
        setErrorMessage(data.error || "Invalid email or password");
        console.log("Login failed:", data.error);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="admin-login-overlay">
      <div className="admin-login-box">
        {/* Top-right close button */}
        <button className="admin-close-btn" onClick={onClose}>
          ❌
        </button>

        {/* Centered heading */}
        <h3 className="admin-login-title">🔐 Admin Login</h3>

        {/* Error message if credentials are incorrect */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="form-control"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="form-control"
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Login as Admin
          </button>
        </form>
      </div>
    </div>
  );
}

