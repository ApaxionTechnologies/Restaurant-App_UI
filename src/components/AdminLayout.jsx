
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { FaUserCircle, FaStore } from "react-icons/fa"; 
import "../components/AdminLayout.css"; 

export default function AdminLayout({ children }) {
  const navigate = useNavigate();

  const [restaurantName, setRestaurantName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("adminEmail");
    const storedRestaurant = localStorage.getItem("restaurantName");

    if (!storedEmail) {
      navigate("/"); // redirect if not logged in
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
    <>
     
      <header className="admin-header">
        <div className="admin-header-left">
          <FaStore className="admin-logo-icon" />
          <span className="admin-logo-text">Restaurant Panel</span>
        </div>

        <div className="admin-header-right">
          <div
            className="profile-wrapper"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <FaUserCircle className="profile-icon" />
          </div>

          {dropdownOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-item non-clickable">
                {restaurantName}
              </div>
              <div
                className="dropdown-item"
                onClick={() => navigate("/admin-dashboard")}
              >
                Admin Dashboard
              </div>
              <div className="dropdown-item" onClick={handleLogout}>
                Logout
              </div>
            </div>
          )}
        </div>
      </header>

     
      <div className="admin-dashboard-wrapper">
        <main className="admin-dashboard-content container mt-5 text-center">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
