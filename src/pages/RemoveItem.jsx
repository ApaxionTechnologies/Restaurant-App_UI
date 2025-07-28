import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminLayout from "../components/AdminLayout";

const BASE_URL = "http://localhost:5001/api";

export default function RemoveItem() {
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
    <AdminLayout>
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
    </AdminLayout>
  );
}
