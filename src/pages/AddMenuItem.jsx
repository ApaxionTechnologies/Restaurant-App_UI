// src/pages/AddMenuItem.jsx
import React, { useState } from "react";
import axios from "axios";

const AddMenuItem = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
    restaurantEmail: "",
  });

  const [message, setMessage] = useState("");

  // handle text input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle image upload
  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };


  
  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("restaurantEmail", formData.restaurantEmail);
      if (formData.image) {
        data.append("image", formData.image);
      }

      const res = await axios.post("http://localhost:5000/api/menu/add", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(res.data.message || "Menu item added successfully!");
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        image: null,
        restaurantEmail: "",
      });
    } catch (error) {
      console.error("Error adding menu item:", error);
      setMessage("Failed to add menu item. Try again!");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add Menu Item</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit} className="p-3 border rounded shadow-sm">
        <div className="mb-3">
          <label className="form-label">Item Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Price (₹)</label>
          <input
            type="number"
            name="price"
            className="form-control"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Category</label>
          <input
            type="text"
            name="category"
            className="form-control"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Restaurant Email</label>
          <input
            type="email"
            name="restaurantEmail"
            className="form-control"
            value={formData.restaurantEmail}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Upload Image</label>
          <input
            type="file"
            className="form-control"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>

        <button type="submit" className="btn btn-success w-100">
          Add Item
        </button>
      </form>
    </div>
  );
};

export default AddMenuItem;
