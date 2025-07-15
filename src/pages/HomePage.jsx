import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-card">
        <h1 className="mb-3">🍽️ Welcome to QR Menu App</h1>
        <p className="mb-4">Please choose an option below to get started.</p>

        <div className="action-buttons">
          <button
            className="btn btn-primary register-btn"
            onClick={() => navigate("/register")}
          >
            🏪 Register as a Restaurant
          </button>

          <button
            className="btn btn-primary login-btn"
            onClick={() => navigate("/admin-login")}
          >
            🔐 Login as Admin
          </button>

          <button
            className="btn btn-primary scan-btn"
            onClick={() => navigate("/scanner")}
          >
            📷 Scan your table QR to begin ordering!
          </button>
        </div>
      </div>
    </div>
  );
}
