
import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaUserCircle } from "react-icons/fa";
import { BsPersonLock } from "react-icons/bs";
import AdminLogin from "../pages/AdminLogin";
import "../components/AdminLoginModal.css";
import "./HomeHeader.css";
import { Home } from "lucide-react";

export default function HomeHeader({
  isAdminDashboard = false,
  restaurant = null,
  onLogout,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(() => {
    return sessionStorage.getItem("headerScrolled") === "true";
  });

  const isRegisterPage = location.pathname === "/registerrestaurant";
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showDropdownopen, setShowDropdownopen] = useState(false);

  const profileRef = useRef(null);
  const dropdownRef = useRef(null);
  const [anchor, setAnchor] = useState({ top: 80, left: window.innerWidth - 230 });

  const computeAnchor = () => {
    if (!profileRef.current) return;
    const rect = profileRef.current.getBoundingClientRect();
    const top = rect.bottom + window.scrollY + 8;
    const minWidth = 210;
    let left = rect.right + window.scrollX - minWidth;
    if (left < 8) left = 8;
    if (left + minWidth > window.innerWidth - 8) left = window.innerWidth - minWidth - 8;
    return { top, left, minWidth };
  };

  const handleProfileClick = (e) => {
    e.stopPropagation();
    setShowDropdownopen((prev) => {
      const willOpen = !prev;
      if (willOpen) {
        const a = computeAnchor();
        if (a) setAnchor(a);
      }
      return willOpen;
    });
  };

useEffect(() => {
  const handleScroll = () => {
    if (window.scrollY > 0) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });

  // Run once on mount in case user reloads page scrolled
  handleScroll();

  return () => window.removeEventListener("scroll", handleScroll);
}, []);


  
  useEffect(() => {
    const handleDocClick = (e) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setShowDropdownopen(false);
      }
    };

    const handleKey = (e) => {
      if (e.key === "Escape") setShowDropdownopen(false);
    };

    const handleResizeScroll = () => {
      if (showDropdownopen) {
        const a = computeAnchor();
        if (a) setAnchor(a);
      }
    };

    document.addEventListener("click", handleDocClick);
    document.addEventListener("keydown", handleKey);
    window.addEventListener("resize", handleResizeScroll);
    window.addEventListener("scroll", handleResizeScroll, { passive: true });

    return () => {
      document.removeEventListener("click", handleDocClick);
      document.removeEventListener("keydown", handleKey);
      window.removeEventListener("resize", handleResizeScroll);
      window.removeEventListener("scroll", handleResizeScroll);
    };
  }, [showDropdownopen]);

  return (
    <>
      <header
        className={`Home-Header ${scrolled ? "scrolled" : ""} ${isAdminDashboard ? "admin" : ""}`}
        data-admin={isAdminDashboard ? "true" : "false"}
      >
        <div className="Header-left">
          {isAdminDashboard ? (
            <span className="restaurant-name-text">
              {typeof restaurant?.restaurantName === "string"
                ? restaurant.restaurantName
                : typeof restaurant?.restaurant === "object"
                ? restaurant.restaurant.restaurantName
                : "My Restaurant"}
            </span>
          ) : (
            <>
              {!isRegisterPage && (
                <button
                  className="btn-global"
                  style={{ height: "50px", fontSize: "16px" }}
                  onClick={() => navigate("/registerrestaurant")}
                >
                  Register as Restaurant
                </button>
              )}

              {isRegisterPage && (
                <Home
                  className="home-icon"
                  size={26}
                  strokeWidth={2}
                  style={{ cursor: "pointer", color: "#333" }}
                  onClick={() => navigate("/")}
                />
              )}
            </>
          )}
        </div>

        <div className="header-right">
          {isAdminDashboard ? (
            <div className="profile-menu" ref={profileRef}>
              <img
                src={
                  restaurant?.logoImage
                    ? restaurant.logoImage.startsWith("http")
                      ? restaurant.logoImage
                      : `http://localhost:5001${restaurant.logoImage}`
                    : "/burger.jpg"
                }
                alt="Restaurant Logo"
                className="profile-logo"
                onClick={handleProfileClick}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
              />
            </div>
          ) : (
            <button
              className=" btn-global "
              style={{ height: "50px", fontSize: "16px" }}
              onClick={() => setShowAdminModal(true)}
            >
              <BsPersonLock style={{ color: "white", fontSize: "20px" }} /> Login
            </button>
          )}
        </div>
      </header>

      {/* Dropdown */}
      <div
        ref={dropdownRef}
        className="dropdown-menu"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "fixed",
          borderRadius: "22px",
          top: anchor.top,
          left: anchor.left,
          minWidth: anchor.minWidth || 210,
          display: showDropdownopen ? "block" : "none",
          zIndex: 99999,
        }}
      >
        <div
          className="dropdown-item"
          onClick={() => {
            setShowDropdownopen(false);
            navigate("/admin-dashboard");
          }}
        >
          <FaHome className="dropdown-icon" /> Dashboard
        </div>

        <div
          className="dropdown-item"
          onClick={() => {
            setShowDropdownopen(false);
            navigate("/edit-restaurant-profile");
          }}
        >
          <FaUserCircle className="dropdown-icon" /> Edit Profile
        </div>

        <div
          className="dropdown-item logout-item"
          onClick={() => {
            setShowDropdownopen(false);
            if (onLogout) {
              onLogout();
              sessionStorage.removeItem("headerScrolled"); 
            }
          }}
        >
          <BsPersonLock className="dropdown-icon" /> Logout
        </div>
      </div>

      {/* Admin Login Modal */}
      {showAdminModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowAdminModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <AdminLogin onClose={() => setShowAdminModal(false)} />
          </div>
        </div>
      )}
    </>
  );
}
