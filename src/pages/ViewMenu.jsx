import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewMenu = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/menu/all");
        setMenuItems(res.data);
      } catch (err) {
        console.error("Error fetching menu:", err.message);
      }
    };
    fetchMenu();
  }, []);

  return (
    <div>
      <h2>View Menu</h2>
      <ul>
        {menuItems.map((item) => (
          <li key={item._id}>
            <strong>{item.name}</strong> - ₹{item.price} | {item.category} | {item.timeToPrepare}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewMenu;
