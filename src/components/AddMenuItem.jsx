import React, { useState } from "react";
import axios from "axios";
import "../styles/AddMenuItem.css";

const AddMenuItem = () => {
  const [formData, setFormData] = useState({
    category: "Starter",
    name: "",
    price: "",
    queries: "Indian",
    timeToPrepare: ""
  });

  const [imageFile, setImageFile] = useState(null);

  const categoryOptions = ["Starter", "Main Course", "Dessert", "Drinks"];
  const queriesOptions = ["Indian", "Japanese", "Chinese", "Italian", "Mexican"];

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const data  = new FormData();
  data.append("category", formData.category);
  data.append("name", formData.name);
  data.append("price", formData.price);
  data.append("queries", formData.queries);
  data.append("timeToPrepare", formData.timeToPrepare);
  if (imageFile) {
    data.append("image", imageFile);
  }

  try {
    await axios.post("http://localhost:5001/api/menu/add", data, {
      headers: { "Content-Type": "multipart/form-data" },
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
    console.error(err);
    alert("❌ Failed to add item");
  }
};


  return (
    <div className="add-menu-container">
      <h2>Add Menu Item</h2>
      <form onSubmit={handleSubmit} className="add-menu-form">
        
        {/* Category */}
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

        {/* Item Name */}
        <label>Item Name</label>
        <input
          type="text"
          name="name"
          placeholder="Item Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        {/* Price */}
        <label>Price (₹)</label>
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />

        {/* Image Upload */}
        <label>Upload Image</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
          required
        />

        {/* Queries */}
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

        {/* Time to Prepare */}
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
