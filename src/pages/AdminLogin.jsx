import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
//import Header from './components/Header'; // ✅ correct if in same folder as src/components

export default function AdminLogin() {
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const storedData = JSON.parse(localStorage.getItem("restaurantData"));

    if (
      storedData &&
      storedData.email === adminEmail &&
      storedData.password === adminPassword
    ) {
      alert("Admin login successful!");
      navigate("/admin-dashboard"); // ✅ Route to your admin page
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>🔐 Admin Login</h2>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="admin-login-btn">
          🔐 Login as Admin
        </button>
      </form>
    </div>
  );
}
