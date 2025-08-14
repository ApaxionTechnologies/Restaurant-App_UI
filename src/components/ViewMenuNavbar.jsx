import React, { useState, useEffect, useRef } from "react";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import "./ViewMenuNavbar.css";
import CartDrawer from "./CartDrawer";

const defaultTabs = [
  { key: "choose", label: "Choose Food", path: "/menu" },
  { key: "feedback", label: "Give Feedback", path: "/feedback" },
];

const ViewMenuNavbar = () => {
  const location = useLocation();
  const [active, setActive] = useState("choose");
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileRef = useRef();

  // set active tab based on URL
  useEffect(() => {
    if (location.pathname.includes("/feedback")) {
      setActive("feedback");
    } else if (location.pathname.includes("/cart")) {
      setActive("cart");
    } else {
      setActive("choose");
    }
  }, [location.pathname]);

  // close mobile menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (mobileRef.current && !mobileRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };
    if (mobileOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [mobileOpen]);

  return (
    <>
      <nav className="vm-navbar">
        <div className="vm-navbar-inner">
          {/* Hamburger menu for mobile */}
          <div className="vm-left">
            <button
              className="vm-hamburger"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((s) => !s)}
            >
              {mobileOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {/* Brand */}
          <div className="vm-brand">PAGES</div>

          {/* Desktop nav */}
          <ul className="vm-nav">
            {defaultTabs.map((tab) => (
              <li key={tab.key} className="vm-nav-item vm-nav-desktop-only">
                <Link
                  to={tab.path}
                  className={`vm-nav-link ${active === tab.key ? "active" : ""}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {tab.label}
                </Link>
              </li>
            ))}

            <li className="vm-divider" />

            {/* Cart icon with active state */}
            <li className="vm-nav-item vm-nav-desktop-only">
              <Link
                to="/cart"
                className={`vm-nav-link icon-btn ${active === "cart" ? "active" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                <FaShoppingCart className="cart-icon" />
              </Link>
            </li>

            {/* Existing CartDrawer stays as is */}
            <CartDrawer />
          </ul>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        ref={mobileRef}
        className={`vm-mobile-panel ${mobileOpen ? "open" : ""}`}
        role="menu"
        aria-hidden={!mobileOpen}
      >
        <ul className="vm-mobile-list">
          {defaultTabs.map((tab) => (
            <li key={tab.key} className="vm-mobile-item">
              <Link
                to={tab.path}
                className={`vm-mobile-link ${active === tab.key ? "active" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                {tab.label}
              </Link>
            </li>
          ))}
          {/* Mobile cart icon */}
          <li className="vm-mobile-item">
            <Link
              to="/cart"
              className={`vm-mobile-link ${active === "cart" ? "active" : ""}`}
              onClick={() => setMobileOpen(false)}
            >
              <FaShoppingCart className="cart-icon" />
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default ViewMenuNavbar;
