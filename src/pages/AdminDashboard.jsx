import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../components/AdminDashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Footer from "../components/Footer";
import HomeHeader from "../components/HomeHeader.jsx"; // ✅ Single header

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [restaurantName, setRestaurantName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");

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
      {/* ✅ Pass props to HomeHeader */}
      <HomeHeader
        isAdminDashboard={true}
        restaurantName={restaurantName}
        adminEmail={adminEmail}
        onLogout={handleLogout}
      />

      <div className="admin-dashboard-wrapper">
        {/* Main Content */}
        <main className="admin-dashboard-content container text-center mt-5">
          <h2>Welcome, Admin 👨‍💻</h2>
          <p className="lead">Manage your restaurant menu and settings below:</p>

          <div className="d-flex flex-column gap-3 mt-4">
            <Link to="/view-menu" className="btn btn-info btn-lg">
              📋 View Menu
            </Link>
            <Link to="/add-item" className="btn btn-success btn-lg">
              ➕ Add Menu Item
            </Link>
            <Link to="/remove-item" className="btn btn-danger btn-lg">
              ❌ Remove Menu Item
            </Link>
            <Link to="/generate-qr" className="btn btn-primary btn-lg">
              🔗 Generate Table QR
            </Link>
            <Link to="/table-manager" className="btn btn-warning btn-lg">
              🪑 Manage Tables
            </Link>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
