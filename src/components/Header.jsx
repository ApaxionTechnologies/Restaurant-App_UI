// src/components/Header.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className="main-header">
      <div className="logo">QR Menu</div>
      {!isHome && (
        <div className="header-buttons">
          <Link to="/register"><button className="header-btn">Register as Restaurant</button></Link>
          <Link to="/admin-login"><button className="header-btn">Login as Admin</button></Link>
        </div>
      )}
    </header>
  );
}
