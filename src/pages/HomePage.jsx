import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./HomePage.css";
import AdminLogin from "../pages/AdminLogin";

export default function HomePage() {
  const navigate = useNavigate();
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  useEffect(() => {
    document.body.classList.add("home-page");
    document.documentElement.classList.add("home-page");

    return () => {
      document.documentElement.classList.remove("home-page");
      document.body.classList.remove("home-page");
    };
  }, []);

  const handleLoginClick = () => {
    setShowAdminLogin(true);
  };

  return (
    <>
      <section
        className="hero-page"
        style={{ backgroundImage: "url('/bgimage.jpg')" }}
      >
        <div className="hero-dark-overlay" />
        <div className="hero-content-wrapper">
          <div className="hero-logo-row">
            <img
              src="/restaurant_logo.png"
              alt="Restaurant Logo"
              className="hero-logo-image"
            />
            <h1>QRBites</h1>
          </div>

          <div className="hero-main">
            <div className="hero-left">
             
              <h1 className="hero-heading">
              The Future of Restaurant Ordering is Here — Serve Faster. Manage Better
              </h1>
              <p className="hero-description">
              No queues. No confusion. No messy paper menus.
Just a simple QR scan that gives your customers the seamless experience they expect — and your staff the speed and efficiency they need.
              </p>

              <div className="hero-buttons">
                <button
                  className="hero-btn hero-btn-light"
                  onClick={handleLoginClick}
                >
                  Login
                </button>

                <Link
                  className="hero-btn hero-btn-orange"
                  to="/registerrestaurant"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showAdminLogin && (
        <AdminLogin onClose={() => setShowAdminLogin(false)} />
      )}
    </>
  );
}
