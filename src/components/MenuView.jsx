import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/MenuView.css";

const MenuView = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get("http://localhost:5002/api/menu");
        setMenuItems(response.data);
      } catch (error) {
        console.error("Failed to fetch menu:", error);
      }
    };

    fetchMenu();
  }, []);

  return (
    <div className="menu-view-container">
      <h2 className="menu-title">Current Menu</h2>
      <div className="menu-grid">
        {menuItems.map((item, index) => (
          <div className="menu-card" key={index}>
            <img src={item.image} alt={item.name} className="menu-img" />
            <div className="menu-info">
              <h3>{item.name}</h3>
              <p>₹{item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuView;
