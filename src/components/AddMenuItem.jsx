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
   const [restaurant, setRestaurant] = useState(null);
  
  
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5001/api/restaurants/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRestaurant(res.data.restaurant);
      } catch (err) {
        console.error("Fetch /me failed -", err.response?.status, err.response?.data);
      }
    };
    fetchMe();
  }, []);
  

  useEffect(() => {
    const storedEmail = localStorage.getItem("adminEmail");
    const storedToken = localStorage.getItem("token");

    if (!storedEmail || !storedToken) {
      navigate("/"); 
    } else {
      setAdminEmail(storedEmail);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("token");  
    localStorage.removeItem("restaurant");
    navigate("/");
  };

  const [formData, setFormData] = useState({
    category: "Starter",
    name: "",
    price: "",
    cuisine: "Indian",
    timeToPrepare: "",
  });

  const [imageFile, setImageFile] = useState(null);

  const categoryOptions = ["Starter", "Main Course", "Dessert", "Drinks"];
  const cuisineOptions = ["Indian", "Japanese", "Chinese", "Italian", "Mexican"];

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
    data.append("cuisine", formData.cuisine);
    data.append("timeToPrepare", formData.timeToPrepare);
    if (imageFile) data.append("image", imageFile);

    try {
      const token = localStorage.getItem("token"); 
      if (!token) {
        alert("⚠️ No token found. Please log in again.");
        navigate("/");
        return;
      }

      await axios.post("http://localhost:5001/api/menu/add", data, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });

      alert("✅ Menu item added successfully!");
      setFormData({
        category: "Starter",
        name: "",
        price: "",
        cuisine: "Indian",
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
        restaurant={restaurant}
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

          <label>cuisine</label>
          <select
            name="cuisine"
            value={formData.cuisine}
            onChange={handleChange}
            required
          >
            {cuisineOptions.map((opt, idx) => (
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
