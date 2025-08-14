import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import './Header3.css';


export default function Header() {
  const navigate = useNavigate();

  const [restaurantName, setRestaurantName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [showDropdown, setShowDropdown] = useState(false); // ✅ Define this!

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
    <header className="admin-header">
      <div className="header-left">
        <span className="restaurant-name">{restaurantName}</span>
        <span className="admin-email">{adminEmail}</span>
      </div>

      <div className="header-right">
        <FaUserCircle
          className="profile-icon"
          onClick={() => setShowDropdown(!showDropdown)}
        />
        {showDropdown && (
          <div className="dropdown">
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </header>
  );
}
