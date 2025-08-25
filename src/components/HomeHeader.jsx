// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import './HomeHeader.css';

// export default function HomeHeader({ navigate, openAdminModal }) {
//   return (
//     <header className="home-header">
//       <div className="header-left" onClick={() => navigate("/")}>
//         <img src="/logo.png" alt="Restaurant Logo" className="header-logo" />
//       </div>
//       <div className="header-right">
//         <a href="#" className="header-link" onClick={(e) => { e.preventDefault(); alert("Redirect to App Download"); }}>
//           📲 App Download
//         </a>
//         <button className="header-link login-btn" onClick={openAdminModal}>
//           🔐 Login
//         </button>
//       </div>
//     </header>
//   );
// }



// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { FaHome } from "react-icons/fa"; // Home icon
// import "./HomeHeader.css";

// export default function HomeHeader({ openAdminModal }) {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const isRegisterPage = location.pathname === "/registerrestaurant";

//   return (
//     <header className="home-header">
//       <div
//         className="header-left"
//         onClick={() => isRegisterPage && navigate("/")}
//         style={{ cursor: isRegisterPage ? "pointer" : "default" }}
//       >
//         {isRegisterPage && (
//           <FaHome className="home-icon" title="Back to Home" />
//         )}
//       </div>

//       <div className="header-right">
//         <button className="header-link login-btn" onClick={openAdminModal}>
//           🔐 Login
//         </button>
//       </div>
//     </header>
//   );
// }






// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { FaHome } from "react-icons/fa"; // Home icon
// import { BsPersonLock } from "react-icons/bs"; // Login icon
// import AdminLogin from "../pages/AdminLogin"; // ✅ import login popup
// import "../components/AdminLoginModal.css";
// import "./HomeHeader.css";

// export default function HomeHeader() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const isRegisterPage = location.pathname === "/registerrestaurant";
//   const [showAdminModal, setShowAdminModal] = useState(false);

//   return (
//     <>
//       <header className="home-header">
//         <div className="header-left">
//           {/* HomePage → Register button */}
//           {!isRegisterPage && (
//             <button
//               className="register-btn"
//               onClick={() => navigate("/registerrestaurant")}
//             >
//               Register as Restaurant
//             </button>
//           )}

//           {/* Register Page → Home button */}
//           {isRegisterPage && (
//             <FaHome
//               className="home-icon"
//               title="Back to Home"
//               onClick={() => navigate("/")}
//               style={{ cursor: "pointer" }}
//             />
//           )}
//         </div>

//         <div className="header-right">
//           <button
//             className="header-link login-btn"
//             onClick={() => setShowAdminModal(true)}
//           >
//             <BsPersonLock style={{ color: "green", fontSize: "20px" }} />Login
//           </button>
//         </div>
//       </header>

//       {/* ✅ Admin Login Modal (works on both pages) */}
//       {showAdminModal && (
//         <div className="modal-overlay" onClick={() => setShowAdminModal(false)}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <AdminLogin onClose={() => setShowAdminModal(false)} />
//           </div>
//         </div>
//       )}
//     </>
//   );
// }






import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaUserCircle } from "react-icons/fa";
import { BsPersonLock } from "react-icons/bs";
import AdminLogin from "../pages/AdminLogin";
import "../components/AdminLoginModal.css";
import "./HomeHeader.css";

export default function HomeHeader({
  isAdminDashboard = false,
  restaurant=null,
  onLogout,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const isRegisterPage = location.pathname === "/registerrestaurant";
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showDropdownopen, setShowDropdownopen] = useState(false);

  const profileRef = useRef(null);
  const dropdownRef = useRef(null);
  const [anchor, setAnchor] = useState({ top: 80, left: window.innerWidth - 230 });

  // compute coords for fixed dropdown (so it won't get clipped)
  const computeAnchor = () => {
    if (!profileRef.current) return;
    const rect = profileRef.current.getBoundingClientRect();
    const top = rect.bottom + window.scrollY + 8; // 8px gap
    const minWidth = 210;
    // align right edge of dropdown with right edge of icon
    let left = rect.right + window.scrollX - minWidth;
    // keep inside viewport
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
    function handleDocClick(e) {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setShowDropdownopen(false);
      }
    }
    function handleKey(e) {
      if (e.key === "Escape") setShowDropdownopen(false);
    }
    document.addEventListener("click", handleDocClick);
    document.addEventListener("keydown", handleKey);
    function handleResizeScroll() {
      if (showDropdownopen) {
        const a = computeAnchor();
        if (a) setAnchor(a);
      }
    }
    window.addEventListener("resize", handleResizeScroll);
    window.addEventListener("scroll", handleResizeScroll, { passive: true });

    return () => {
      document.removeEventListener("click", handleDocClick);
      document.removeEventListener("keydown", handleKey);
      window.removeEventListener("resize", handleResizeScroll);
      window.removeEventListener("scroll", handleResizeScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDropdownopen]);


  return (
    <>
      <header className="Home-Header">
        <div className="Header-left">
          {isAdminDashboard ? (
            <img  src={
    restaurant?.logoImage
      ? restaurant.logoImage.startsWith("http")
        ? restaurant.logoImage
        : `http://localhost:5001${restaurant.logoImage}`
      : "/burger.jpg"
  } alt="Restaurant Logo" className="restaurant-logo" />
          ) : (
            <>
              {!isRegisterPage && (
                <button className="register-btn" onClick={() => navigate("/registerrestaurant")}>
                  Register as Restaurant
                </button>
              )}
              {isRegisterPage && (
                <FaHome className="home-icon" title="Back to Home" onClick={() => navigate("/")} />
              )}
            </>
          )}
        </div>

      
        <div className="header-right">
          {isAdminDashboard ? (
            <div className="profile-menu" ref={profileRef}>
              <FaUserCircle className="profile-icon" onClick={handleProfileClick} />
            </div>
          ) : (
            <button className="Header-link login-btn" onClick={() => setShowAdminModal(true)}>
              <BsPersonLock style={{ color: "green", fontSize: "20px" }} /> Login
            </button>
          )}
        </div>
      </header>
      <div
        ref={dropdownRef}
        className="dropdown-menu"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "fixed",
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
          Dashboard
        </div>

          <div
          className="dropdown-item"
          onClick={() => {
            setShowDropdownopen(false);
            navigate("/");
          }}
        >
          Edit Profile
        </div>

        <div
          className="dropdown-item"
          onClick={() => {
            setShowDropdownopen(false);
            if (onLogout) onLogout();
          }}
        >
          Logout
        </div>
      </div>

      {/* Admin Login Modal */}
      {showAdminModal && (
        <div className="modal-overlay" onClick={() => setShowAdminModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <AdminLogin onClose={() => setShowAdminModal(false)} />
          </div>
        </div>
      )}
    </>
  );
}
