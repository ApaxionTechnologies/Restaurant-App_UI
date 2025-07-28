import React, { useState } from "react";
import axios from "axios";
import { FaUtensils, FaMoneyBillAlt, FaClock, FaImage, FaListAlt } from "react-icons/fa";  // Added icons
import "../styles/AddMenuItem.css";

const AddMenuItem = ({ refreshMenu }) => {
  const [menuItem, setMenuItem] = useState({
    category: "",  // New field for category
    name: "",
    price: "",
    timeToPrepare: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMenuItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setMenuItem((prev) => ({ ...prev, image: file }));
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { category, name, price, timeToPrepare, image } = menuItem;
    const restaurantEmail = localStorage.getItem("adminEmail");

    const formData = new FormData();
    formData.append("category", category);  // Include category in form data
    formData.append("name", name);
    formData.append("price", price);
    formData.append("timeToPrepare", timeToPrepare);
    formData.append("image", image);
    formData.append("restaurantEmail", restaurantEmail);

    try {
      await axios.post("http://localhost:5001/api/menu/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Menu item added successfully!");
      refreshMenu();

      setMenuItem({
        category: "",  // Reset category field
        name: "",
        price: "",
        timeToPrepare: "",
        image: null,
      });
      setPreview(null);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add menu item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-menu-page">
      <div className="add-menu-card">
        <div className="form-header">
          <FaListAlt className="form-header-icon" />
          <h2>Add Menu Item</h2>
        </div>
        <form onSubmit={handleSubmit} className="add-menu-form">
          {/* Category Dropdown */}
          <div className="input-group">
            <FaListAlt className="form-icon" />
            <select
              name="category"
              value={menuItem.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="starter">Starter</option>
              <option value="main">Main</option>
              <option value="beverages">Beverages</option>
              <option value="dessert">Dessert</option>
            </select>
          </div>

          {/* Item Name */}
          <div className="input-group">
            <FaUtensils className="form-icon" />
            <input
              type="text"
              name="name"
              value={menuItem.name}
              onChange={handleChange}
              placeholder="Item Name"
              required
            />
          </div>

          {/* Price */}
          <div className="input-group">
            <FaMoneyBillAlt className="form-icon" />
            <input
              type="number"
              name="price"
              value={menuItem.price}
              onChange={handleChange}
              placeholder="Price (฿)"
              required
            />
          </div>

          {/* Time to Prepare */}
          <div className="input-group">
            <FaClock className="form-icon" />
            <input
              type="number"
              name="timeToPrepare"
              value={menuItem.timeToPrepare}
              onChange={handleChange}
              placeholder="Time to Prepare (mins)"
              required
            />
          </div>

          {/* Upload Image */}
          <div className="input-group">
            <FaImage className="form-icon" />
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          {preview && (
            <div className="image-preview">
              <img src={preview} alt="Preview" />
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Item"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMenuItem;
