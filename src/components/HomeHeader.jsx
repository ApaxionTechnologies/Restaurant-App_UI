
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './HomeHeader.css';

export default function HomeHeader({ navigate, openAdminModal }) {
  return (
    <header className="home-header">
      <div className="header-left" onClick={() => navigate("/")}>
        <img src="/logo.png" alt="Restaurant Logo" className="header-logo" />
      </div>
      <div className="header-right">
        <a href="#" className="header-link" onClick={(e) => { e.preventDefault(); alert("Redirect to App Download"); }}>
          📲 App Download
        </a>
        <button className="header-link login-btn" onClick={openAdminModal}>
          🔐 Login
        </button>
      </div>
    </header>
  );
}
