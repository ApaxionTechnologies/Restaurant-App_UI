import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiList,
  FiFileText,
  FiGrid,
  FiClipboard,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiPlus,
} from "react-icons/fi";
import "./Sidebar.css";

export default function Sidebar({ className = "", onLogout }) {
  const navigate = useNavigate();

  const menu = [
    { to: "/admin-dashboard", label: "Dashboard", icon: <FiHome /> },
    { to: "/menu", label: "View Menu", icon: <FiList /> },
    { to: "/generate-qr", label: "Generate QR", icon: <FiFileText /> },
    { to: "/table-manager", label: "Manage Tables", icon: <FiGrid /> },
    { to: "/order-management", label: "Manage Order", icon: <FiClipboard /> },
    { to: "/reports", label: "Reports", icon: <FiBarChart2 /> },
    { to: "/config", label: "Configuration", icon: <FiSettings /> },
  ];
  

  const handleAddMenus = (e) => {
    e.preventDefault();
    navigate("/menu/create");
  };

  const handleLogout = (e) => {
    e.preventDefault();
    if (typeof onLogout === "function") onLogout();
    else navigate("/logout");
  };

  return (
    <aside className={`app-sidebar ${className}`}>
      <div className="sidebar-top">
        <div className="brand-row">
          <img
            src="/restaurant_logo.png"
            alt="restaurant logo"
            className="brand-logo"
            onError={(e) => (e.currentTarget.src = "/burger.jpg")}
          />
          <div className="brand-text">QRBites</div>
        </div>
        <nav className="menu" aria-label="Main navigation">
          {menu.map((m) => (
            <Link key={m.to} to={m.to} className="menu-item">
              <span className="menu-icon">{m.icon}</span>
              <span className="menu-label">{m.label}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="sidebar-bottom">
        <div className="cta-card" role="region" aria-label="Add menus">
          <div className="cta-content-reverse">
            <div className="cta-texts">
              <div className="cta-title">
                Please, organize your menus through button bellow!
              </div>
              <button className="btn-add" onClick={handleAddMenus}>
                <FiPlus /> <span>Add Menus</span>
              </button>
            </div>

            <div className="cta-illustration" aria-hidden>
              <img
                src="/illustration.png"
                alt="illustration"
                className="cta-img"
              />
            </div>
          </div>
        </div>

        <button className="logout-link" onClick={handleLogout} aria-label="Log out">
          <FiLogOut className="logout-icon" />
          <span className="logout-text">Log Out</span>
        </button>
      </div>
    </aside>
  );
}
  