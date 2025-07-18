import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/AddMenuItem.css";

export default function AddMenuItem() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [showCheck, setShowCheck] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || !imageFile) {
      alert("Please fill all fields and select an image");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("image", imageFile);

    try {
      setLoading(true);
      setSuccessMsg("");
      setShowCheck(false);

      await axios.post("http://localhost:5001/api/menu/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ Show success message and checkmark
      setSuccessMsg("✅ Item added successfully!");
      setShowCheck(true);

      // Reset text inputs only (keep image)
      setName("");
      setPrice("");

      // Hide checkmark after 2 seconds
      setTimeout(() => setShowCheck(false), 2000);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-menu-wrapper">
      <div className="add-menu-card">
        <h2>
          <i className="bi bi-plus-circle"></i> Add Menu Item
        </h2>

        {successMsg && (
          <p className="success-text">
            {successMsg}{" "}
            {showCheck && <i className="bi bi-check-circle-fill check-icon"></i>}
          </p>
        )}

        <form onSubmit={handleSubmit} className="add-menu-form">
          <div className="mb-3">
            <label className="form-label">Item Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter item name"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Price (₹)</label>
            <input
              type="number"
              className="form-control"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Item Image</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => setImageFile(e.target.files[0])}
              required={!imageFile} // Allow keeping previous image
            />
          </div>

          {imageFile && (
            <div className="preview-box mb-3">
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Preview"
                className="preview-image"
              />
            </div>
          )}

          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Adding..." : "Add Item"}
          </button>
        </form>
      </div>
    </div>
  );
}
