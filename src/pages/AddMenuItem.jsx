import React, { useState } from "react";
import axios from "axios";
import "../styles/AddMenuItem.css";

const AddMenuItem = () => {
  const [formData, setFormData] = useState({
    restaurantEmail: "",
    name: "",
    price: "",
    category: "",
    timeToPrepare: ""
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5001/api/menuitems/add", formData);
      alert("Menu item added!");
      setFormData({
        restaurantEmail: "",
        name: "",
        price: "",
        category: "",
        timeToPrepare: ""
      });
    } catch (err) {
      console.error(err);
      alert("Failed to add item");
    }
  };

  return (
    <div>
      <h2>Add Menu Item</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="restaurantEmail" placeholder="Restaurant Email" value={formData.restaurantEmail} onChange={handleChange} required /><br/>
        <input type="text" name="name" placeholder="Item Name" value={formData.name} onChange={handleChange} required /><br/>
        <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required /><br/>
        <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} /><br/>
        <input type="text" name="timeToPrepare" placeholder="Time to Prepare" value={formData.timeToPrepare} onChange={handleChange} /><br/>
        <button type="submit">Add Item</button>
      </form>
    </div>
  );
};

export default AddMenuItem;
