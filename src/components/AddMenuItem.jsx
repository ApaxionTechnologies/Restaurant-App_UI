import React, { useState } from "react";
import axios from "axios";
import "../styles/AddMenuItem.css";

const AddMenuItem = () => {
  const [formData, setFormData] = useState({
    category: "Starter", // default category
    name: "",
    price: "",
    image: "",
    queries: "Indian", // default cuisine
    timeToPrepare: ""
  });

  const categoryOptions = ["Starter", "Main Course", "Dessert", "Drinks"];
  const queriesOptions = ["Indian", "Japanese", "Chinese", "Italian", "Mexican"];

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5001/api/menu/add", formData);
      alert("✅ Menu item added successfully!");
      setFormData({
        category: "Starter",
        name: "",
        price: "",
        image: "",
        queries: "Indian",
        timeToPrepare: ""
      });
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add item");
    }
  };

  return (
    <div className="add-menu-container">
      <h2>Add Menu Item</h2>
      <form onSubmit={handleSubmit} className="add-menu-form">
        
        {/* Category Dropdown */}
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

        <label>Image URL</label>
        <input
          type="text"
          name="image"
          placeholder="Enter Image URL"
          value={formData.image}
          onChange={handleChange}
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
  );
};

export default AddMenuItem;
