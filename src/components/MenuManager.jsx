import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/MenuView.css";

const ViewMenuItems = ({ refreshMenu }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch the menu items whenever the refreshMenu prop changes
  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5001/api/menu");
        setMenuItems(response.data); // Assuming data is an array of menu items
      } catch (error) {
        console.error("Error fetching menu items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [refreshMenu]); // Dependency on refreshMenu prop

  return (
    <div className="menu-items-container">
      <h2>Menu Items</h2>
      {loading ? (
        <p>Loading menu items...</p>
      ) : (
        <div className="menu-items-grid">
          {menuItems.length > 0 ? (
            menuItems.map((item, index) => (
              <div key={index} className="menu-item-card">
                <img
                  src={item.image ? item.image : "/default-image.jpg"}
                  alt={item.name}
                  className="menu-item-image"
                />
                <div className="menu-item-details">
                  <h3>{item.name}</h3>
                  <p>Price: ฿{item.price}</p>
                  <p>Time to Prepare: {item.timeToPrepare} minutes</p>
                </div>
              </div>
            ))
          ) : (
            <p>No menu items available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewMenuItems;
