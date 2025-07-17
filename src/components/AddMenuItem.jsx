import React, { useState } from 'react';
import axios from 'axios';

export default function AddMenuItem({ restaurantEmail }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || !imageFile) {
      alert('Please fill all fields and select an image');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('email', restaurantEmail);
    formData.append('image', imageFile);

    try {
      const res = await axios.post('http://localhost:5001/api/menu/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('✅ Item added!');
      setName('');
      setPrice('');
      setImageFile(null);
    } catch (err) {
      console.error(err);
      alert('❌ Failed to add item');
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="text-center mb-4">Add Menu Item</h4>
      <form onSubmit={handleSubmit} className="border p-4 rounded bg-light shadow">
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

        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Price (₹)</label>
            <input
              type="number"
              className="form-control"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
              required
            />
          </div>
          <div className="col">
            <label className="form-label">Item Image</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => setImageFile(e.target.files[0])}
              accept="image/*"
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-100">Add Item</button>
      </form>
    </div>
  );
}
