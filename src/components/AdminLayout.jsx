// src/components/AdminLayout.jsx
// import React from "react";
// import Header3 from "../components/Header3.jsx";
// import Footer from "./Footer";

// export default function AdminLayout({ children }) {
//   return (
//     <div className="admin-layout" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
//       <Header3 />
//       <main style={{ flex: 1, padding: "20px" }}>
//         {children}
//       </main>
//       <Footer />
//     </div>
//   );
// }



import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaStore, FaEnvelope } from "react-icons/fa";
import Footer from "./Footer";
import "./AdminDashboard.css";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const [restaurantName, setRestaurantName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("adminEmail");
    const storedRestaurant = localStorage.getItem("restaurantName");

    if (!storedEmail) {
      navigate("/");
    } else {
      setAdminEmail(storedEmail);
      setRestaurantName(storedRestaurant || "My Restaurant");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("restaurantName");
    navigate("/");
  };

  return (
    <div className="admin-dashboard-wrapper">
      <header className="admin-header d-flex justify-content-between align-items-center p-3 shadow">
        <div>
          <h5 className="mb-0 fw-bold d-flex align-items-center">
            <FaStore className="me-2" /> {restaurantName}
          </h5>
          <span className="text-muted small d-flex align-items-center">
            <FaEnvelope className="me-2" /> {adminEmail}
          </span>
        </div>
        <div className="profile-icon">
          <FaUserCircle
            size={30}
            className="dropdown-toggle"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{ cursor: "pointer" }}
          />
          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <span className="dropdown-item-text text-muted">{adminEmail}</span>
            </li>
            <li><hr className="dropdown-divider" /></li>
            <li>
              <button className="dropdown-item text-danger" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </header>

      <main className="admin-dashboard-content container py-5">
        {children}
      </main>

      <Footer />
    </div>
  );
}
