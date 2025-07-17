// src/components/MenuManager.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function MenuManager({ restaurantEmail }) {
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', price: '' });

  useEffect(() => {
    axios
      .get(`http://localhost:5001/api/menu?email=${restaurantEmail}`)
      .then((res) => setMenuItems(res.data))
      .catch((err) => console.error('Error fetching menu:', err));
  }, [restaurantEmail]);

  const addItem = () => {
    axios
      .post('http://localhost:5001/api/menu/add', {
        email: restaurantEmail,
        item: newItem,
      })
      .then((res) => {
        setMenuItems([...menuItems, res.data]);
        setNewItem({ name: '', price: '' });
      })
      .catch((err) => console.error('Error adding item:', err));
  };

  const deleteItem = (id) => {
    axios
      .delete(`http://localhost:5001/api/menu/delete/${id}`)
      .then(() => {
        setMenuItems(menuItems.filter((item) => item._id !== id));
      })
      .catch((err) => console.error('Error deleting item:', err));
  };

  return (
    <div className="mb-4">
      <h4>Manage Menu</h4>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Item Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          type="number"
          className="form-control"
          placeholder="Price"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
        />
        <button className="btn btn-success" onClick={addItem}>
          Add Item
        </button>
      </div>

      <ul className="list-group">
        {menuItems.map((item) => (
          <li key={item._id} className="list-group-item d-flex justify-content-between align-items-center">
            {item.name} - ₹{item.price}
            <button className="btn btn-sm btn-danger" onClick={() => deleteItem(item._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
