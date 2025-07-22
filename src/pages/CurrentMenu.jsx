import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CurrentMenu() {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5001/api/menu")
      .then((res) => setMenuItems(res.data))
      .catch((err) => console.error("Failed to fetch menu:", err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Current Menu</h2>
      <ul className="space-y-3">
        {menuItems.map((item) => (
          <li key={item._id} className="p-3 bg-white shadow rounded">
            <h3 className="font-semibold">{item.name}</h3>
            <p>Price: ₹{item.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
