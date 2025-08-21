import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "../components/Footer";
import HomeHeader from "../components/HomeHeader.jsx";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:5001/api";

export default function RemoveItem() {
  const navigate = useNavigate();
  const [restaurantName, setRestaurantName] = useState(localStorage.getItem("restaurantName") || "My Restaurant");
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("adminEmail");
    if (!storedEmail) {
      navigate("/");
    } else {
      setAdminEmail(storedEmail);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("restaurantName");
    navigate("/");
  };

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/menu`);
      setMenuItems(response.data.items || []);
    } catch (err) {
      setError("Failed to fetch menu items.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (itemName) => {
    if (!window.confirm(`Are you sure you want to delete "${itemName}"?`)) return;

    try {
      await axios.delete(`${BASE_URL}/menu/${itemName}`);
      setSuccess(`"${itemName}" removed successfully!`);
      setMenuItems(menuItems.filter((item) => item.name !== itemName));
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to delete item.");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <>
      <HomeHeader
        isAdminDashboard={true}
        restaurantName={restaurantName}
        adminEmail={adminEmail}
        onLogout={handleLogout}
      />

      <div className="container mt-4">
        <h4>Remove Menu Items</h4>
        {loading && <p>Loading...</p>}
        {error && <p className="text-danger">{error}</p>}
        {success && <p className="text-success">{success}</p>}

        {menuItems.length === 0 ? (
          <p>No items found.</p>
        ) : (
          <div className="list-group">
            {menuItems.map((item, index) => (
              <div key={index} className="list-group-item d-flex justify-content-between">
                <span>{item.name}</span>
                <button className="btn btn-sm btn-danger" onClick={() => handleRemove(item.name)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer/>
    </>
  );
}
