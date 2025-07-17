// src/pages/HomePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Header Bar */}
      <div className="header-bar">
        <button
          className="header-btn"
          onClick={() => navigate("/register")}
        >
          🏪 Register as Restaurant
        </button>
        <button
          className="header-btn"
          onClick={() => navigate("/admin-login")}
        >
          🔐 Login as Admin
        </button>
      </div>

      {/* Main Card */}
      <div className="home-card">
        <h1 className="mb-3">🍽️ Welcome to QR Menu App</h1>
        <p className="mb-4">Please scan your table QR to begin ordering.</p>

        <div className="action-buttons">
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
