import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddMenuItem() {
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemImage, setItemImage] = useState("");
  const navigate = useNavigate();

  const handleAddItem = (e) => {
    e.preventDefault();

    const newItem = {
      id: Date.now(), // Unique ID
      name: itemName,
      price: itemPrice,
      image: itemImage,
    };

    const existingMenu = JSON.parse(localStorage.getItem("finalMenu")) || [];
    const updatedMenu = [...existingMenu, newItem];
    localStorage.setItem("finalMenu", JSON.stringify(updatedMenu));

    // Clear form
    setItemName("");
    setItemPrice("");
    setItemImage("");

    // Optional: redirect to view menu
    navigate("/view-menu");
  };

  return (
    <div className="container mt-4">
      <h2>Add New Menu Item</h2>
      <form onSubmit={handleAddItem}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            type="text"
            className="form-control"
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Image URL</label>
          <input
            type="text"
            className="form-control"
            value={itemImage}
            onChange={(e) => setItemImage(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-success mt-3">
          ➕ Add Item
        </button>
      </form>
    </div>
  );
}
