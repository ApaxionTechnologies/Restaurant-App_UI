// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TableManager from '../components/TableManager';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Bootstrap icons

export default function AdminDashboard() {
  const [restaurantEmail, setRestaurantEmail] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('restaurantEmail');
    if (storedEmail) {
      setRestaurantEmail(storedEmail);
      setLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    if (restaurantEmail.trim()) {
      localStorage.setItem('restaurantEmail', restaurantEmail.trim());
      setLoggedIn(true);
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem('restaurantEmail');
      setRestaurantEmail('');
      setLoggedIn(false);
    }
  };

  const goToAddItem = () => {
    navigate('/add-item');
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="w-100" style={{ maxWidth: '700px' }}>
        <div className="text-center mb-4">
          <h1 className="fw-bold">🍽️ Admin Dashboard</h1>
        </div>

        {!loggedIn ? (
          <div className="card shadow p-4">
            <h4 className="text-center mb-3">Admin Login</h4>
            <input
              type="email"
              className="form-control mb-3"
              placeholder="Enter restaurant email"
              value={restaurantEmail}
              onChange={(e) => setRestaurantEmail(e.target.value)}
            />
            <button className="btn btn-primary w-100" onClick={handleLogin}>
              Login
            </button>
          </div>
        ) : (
          <div className="card shadow p-4">
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
              <h5 className="mb-2">Logged in as: {restaurantEmail}</h5>
              <button className="btn btn-sm btn-danger" onClick={handleLogout}>
                Logout
              </button>
            </div>

            {/* ✅ Centered Add Item Button with Icon */}
            <div className="d-flex justify-content-center mb-4">
              <button className="btn btn-success" onClick={goToAddItem}>
                <i className="bi bi-plus-circle me-2"></i> Add New Menu Item
              </button>
            </div>

            {/* ✅ Table Manager */}
            <TableManager restaurantEmail={restaurantEmail} />
          </div>
        )}
      </div>
    </div>
  );
}
