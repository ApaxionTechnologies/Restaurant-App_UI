import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AdminDashboard() {
  const restaurantId = "yourRestaurantIdHere"; // replace with dynamic ID if needed

  return (
    <div className="container mt-5 text-center">
      <h2>Welcome, Admin 👨‍💻</h2>
      <p className="lead">Manage your restaurant menu and settings below:</p>
      <div className="d-flex flex-column gap-3 mt-4">
        <Link to={`/menu/${restaurantId}`} className="btn btn-info btn-lg">
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
      </div>
    </div>
  );
}
