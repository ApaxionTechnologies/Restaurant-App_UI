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
          email: adminEmail.trim().toLowerCase(),
          password: adminPassword.trim(),
        }),
      });

      const data = await response.json();
      if (response.ok && data.message === 'Login successful') {
        // ✅ Store email in localStorage
        localStorage.setItem("restaurantEmail", adminEmail);
        alert("Admin login successful!");
        navigate("/admin-dashboard");
      } else {
        setError(data.error || "Invalid email or password");
      }
    } catch (error) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        background: "linear-gradient(120deg, #b2c8f6, #e0f0ff)",
        minHeight: "100vh",
      }}
    >
      <form
        className="card shadow p-4"
        style={{ width: "400px", borderRadius: "14px" }}
        onSubmit={handleSubmit}
      >
        <h3 className="text-center mb-4">🔐 Admin Login</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label>Email Address</label>
          <input
            type="email"
            className="form-control"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          style={{ fontWeight: "600" }}
        >
          Login as Admin
        </button>
      </form>
    </div>
  );
}
