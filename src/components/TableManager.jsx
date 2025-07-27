
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/TableManager.css"; // ✅ Import the CSS here

const TableManager = () => {
  const [restaurantData, setRestaurantData] = useState(null);
  const [tables, setTables] = useState(0);
  const [error, setError] = useState("");
  const restaurantEmail = localStorage.getItem("restaurantEmail");

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        if (!restaurantEmail) {
          setError("Restaurant email is missing.");
          return;
        }

        const encodedEmail = encodeURIComponent(restaurantEmail);
        const response = await axios.get(
          `http://localhost:5001/api/restaurants/${encodedEmail}`
        );

        if (response.data.restaurant) {
          setRestaurantData(response.data.restaurant);
          setTables(response.data.restaurant.tables);
        } else {
          setError("No restaurant data found for this email.");
        }
      } catch (err) {
        console.error("Failed to fetch restaurant data", err);
        setError("Error fetching restaurant data. Please try again later.");
      }
    };

    if (restaurantEmail) {
      fetchRestaurantData();
    } else {
      setError("Restaurant email is missing.");
    }
  }, [restaurantEmail]);

  const handleIncrement = () => {
    const updated = tables + 1;
    setTables(updated);
    updateTablesOnBackend(updated);
  };

  const handleDecrement = () => {
    const updated = tables > 0 ? tables - 1 : 0;
    setTables(updated);
    updateTablesOnBackend(updated);
  };

  const updateTablesOnBackend = async (updatedTables) => {
    try {
      const encodedEmail = encodeURIComponent(restaurantEmail);
      await axios.put(
        `http://localhost:5001/api/restaurants/${encodedEmail}/tables`,
        { tables: updatedTables }
      );
    } catch (err) {
      alert("Failed to update tables on backend");
    }
  };

  const handleSubmit = async () => {
    try {
      const encodedEmail = encodeURIComponent(restaurantEmail);
      await axios.put(
        `http://localhost:5001/api/restaurants/${encodedEmail}/tables`,
        { tables }
      );
      alert("Tables updated successfully!");
    } catch (err) {
      alert("Failed to update tables");
    }
  };

  return (
    <div className="table-manager-container">
      <div className="table-manager-card">
        <h3>Manage Tables</h3>
        <h6>
          {restaurantData ? restaurantData.restaurantName : "Restaurant"}<br />
          Current Tables: {tables}
        </h6>

        <div className="button-group">
          <button onClick={handleDecrement}>-</button>
          <span className="table-count">{tables}</span>
          <button onClick={handleIncrement}>+</button>
        </div>

        <button className="save-button" onClick={handleSubmit}>
          Save Changes
        </button>

        {error && <div className="alert-danger">{error}</div>}
      </div>
    </div>
  );
};

export default TableManager;

