import React, { useState } from "react";
import axios from "axios";
import "../styles/AddMenuItem.css";

const AddMenuItem = () => {
  const [menuItem, setMenuItem] = useState({
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

    const { name, price, timeToPrepare, image } = menuItem;
    const restaurantEmail = localStorage.getItem("adminEmail"); // or wherever you store it

    const formData = new FormData();
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

      setMenuItem({
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
        <h2>Add Menu Item</h2>
        <form onSubmit={handleSubmit} className="add-menu-form">
          <div>
            <label>Item Name:</label>
            <input
              type="text"
              name="name"
              value={menuItem.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Price (₹):</label>
            <input
              type="number"
              name="price"
              value={menuItem.price}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Time to Prepare (mins):</label>
            <input
              type="number"
              name="timeToPrepare"
              value={menuItem.timeToPrepare}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Upload Image:</label>
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
