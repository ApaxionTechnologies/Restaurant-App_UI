import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

export default function AdminLogin() {
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  setError(""); // Clear previous error

  try {
    const response = await fetch("http://localhost:5002/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: adminEmail.trim().toLowerCase(),  // ✅ Standardized before sending
        password: adminPassword.trim(),          // ✅ Trim spaces just in case
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Admin login successful!");
      navigate("/admin-dashboard");
    } else {
      setError(data.error || "Invalid email or password.");
    }
  } catch (error) {
    setError("Server error. Please try again later.");
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
