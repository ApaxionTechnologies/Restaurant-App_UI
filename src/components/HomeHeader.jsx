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








import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaUserCircle } from "react-icons/fa";
import { BsPersonLock } from "react-icons/bs";
import AdminLogin from "../pages/AdminLogin";
import "../components/AdminLoginModal.css";
import "./HomeHeader.css";


export default function HomeHeader({
  isAdminDashboard = false,
  restaurantName = "",
  adminEmail = "",
  onLogout,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const isRegisterPage = location.pathname === "/registerrestaurant";
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showDropdownopen, setShowDropdownopen] = useState(false);

  return (
    <>
      <header className="home-header">
        {/* ✅ LEFT SIDE */}
        <div className="header-left">
          {isAdminDashboard ? (
            <img
              src="/restaurant-logo.png"
              alt="Restaurant Logo"
              className="restaurant-logo"
            />
          ) : (
            <>
              {!isRegisterPage && (
                <button
                  className="register-btn"
                  onClick={() => navigate("/registerrestaurant")}
                >
                  Register as Restaurant
                </button>
              )}

              {isRegisterPage && (
                <FaHome
                  className="home-icon"
                  title="Back to Home"
                  onClick={() => navigate("/")}
                  style={{ cursor: "pointer" }}
                />
              )}
            </>
          )}
        </div>

        {/* ✅ RIGHT SIDE */}
        <div className="header-right">
          {isAdminDashboard ? (
             
            <div className="profile-menu">
              <FaUserCircle
                className="profile-icon"
                onClick={() => {
                  console.log("Profile icon clicked ✅"); // <-- ADD THIS
                  setShowDropdownopen(!showDropdownopen);
                }}
              />
              {showDropdownopen && (
                <div className="dropdown-menu">
                  <div className="dropdown-item">
                    <strong>{restaurantName}</strong>
                    <br />
                    <small>{adminEmail}</small>
                  </div>
                  <div
                    className="dropdown-item"
                    onClick={() => {
                      setShowDropdownopen(false);
                      navigate("/admindashboard");
                    }}
                  >
                    Dashboard
                  </div>
                  <div
                    className="dropdown-item"
                    onClick={() => {
                      setShowDropdownopen(false);
                      onLogout();
                    }}
                  >
                    Logout
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              className="header-link login-btn"
              onClick={() => setShowAdminModal(true)}
            >
              <BsPersonLock style={{ color: "green", fontSize: "20px" }} /> Login
            </button>
          )}
        </div>
      </header>

      {/* ✅ Admin Login Modal */}
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
