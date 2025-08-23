import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/AddMenuItem.css";
import Footer from "./Footer";
import HomeHeader from "./HomeHeader.jsx";
import { useNavigate } from "react-router-dom";

const AddMenuItem = () => {
  const navigate = useNavigate();

  const [restaurantName, setRestaurantName] = useState(
    localStorage.getItem("restaurant") || "My Restaurant"
  );
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("adminEmail");
    const storedToken = localStorage.getItem("token"); // ✅ changed (was adminToken)

    if (!storedEmail || !storedToken) {
      navigate("/"); // agar login nahi hai toh home pe bhej do
    } else {
      setAdminEmail(storedEmail);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("token");   // ✅ changed (was adminToken)
    localStorage.removeItem("restaurant");
    navigate("/");
  };

  const [formData, setFormData] = useState({
    category: "Starter",
    name: "",
    price: "",
    queries: "Indian",
    timeToPrepare: "",
  });

  const [imageFile, setImageFile] = useState(null);

  const categoryOptions = ["Starter", "Main Course", "Dessert", "Drinks"];
  const queriesOptions = ["Indian", "Japanese", "Chinese", "Italian", "Mexican"];

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("category", formData.category);
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("queries", formData.queries);
    data.append("timeToPrepare", formData.timeToPrepare);
    if (imageFile) data.append("image", imageFile);

    try {
      const token = localStorage.getItem("token"); // ✅ changed
      if (!token) {
        alert("⚠️ No token found. Please log in again.");
        navigate("/");
        return;
      }

      await axios.post("http://localhost:5001/api/menu/add", data, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ send token properly
        },
      });

      alert("✅ Menu item added successfully!");
      setFormData({
        category: "Starter",
        name: "",
        price: "",
        queries: "Indian",
        timeToPrepare: "",
      });
      setImageFile(null);
    } catch (err) {
      console.error("❌ Error adding item:", err.response?.data || err.message);
      alert("❌ Failed to add item: " + (err.response?.data?.message || "Unauthorized"));
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
      <div className="add-menu-container">
        <h2>Add Menu Item</h2>
        <form onSubmit={handleSubmit} className="add-menu-form">
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {categoryOptions.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <label>Item Name</label>
          <input
            type="text"
            name="name"
            placeholder="Item Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Price (₹)</label>
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />

          <label>Upload Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            required
          />

          <label>Queries</label>
          <select
            name="queries"
            value={formData.queries}
            onChange={handleChange}
            required
          >
            {queriesOptions.map((opt, idx) => (
              <option key={idx} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          <label>Time to Prepare (mins)</label>
          <input
            type="text"
            name="timeToPrepare"
            placeholder="e.g. 30 mins"
            value={formData.timeToPrepare}
            onChange={handleChange}
          />

          <button type="submit">Add Item</button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default AddMenuItem;
