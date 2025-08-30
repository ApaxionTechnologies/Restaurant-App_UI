// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const ViewMenu = () => {
//   const [menuItems, setMenuItems] = useState([]);

//   useEffect(() => {
//     const fetchMenu = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/menu/all");
//         setMenuItems(res.data);
//       } catch (err) {
//         console.error("Error fetching menu:", err.message);
//       }
//     };
//     fetchMenu();
//   }, []);

//   return (
//     <div>
//       <h2>View Menu</h2>
//       <ul>
//         {menuItems.map((item) => (
//           <li key={item._id}>
//             <strong>{item.name}</strong> - ₹{item.price} | {item.category} | {item.timeToPrepare}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ViewMenu;
import React, { useState } from "react";
import "../styles/global.css"; // 👈 wahi global card css

const ViewMenu = () => {
  const [filter, setFilter] = useState("published");

  // Dummy Data — aap backend se API call karke bhi laa sakte ho
  const publishedItems = [
    { id: 1, name: "Paneer Tikka", price: 220, img: "/paneer.jpg" },
    { id: 2, name: "Cheese Pizza", price: 350, img: "/pizza.jpg" },
  ];

  const draftItems = [
    { id: 3, name: "Spring Rolls", price: 180, img: "/springroll.jpg" },
    { id: 4, name: "Veg Burger", price: 200, img: "/burger.jpg" },
  ];

  const items = filter === "published" ? publishedItems : draftItems;

  return (
    <div className="p-6">
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">📖 View Menu</h1>

        {/* Filter Tabs */}
        <div className="flex gap-3">
          <button
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === "published"
                ? "bg-[#ff6b6b] text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setFilter("published")}
          >
            Published
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === "drafts"
                ? "bg-[#ff6b6b] text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setFilter("drafts")}
          >
            Drafts
          </button>
        </div>
      </div>

      {/* ===== Card Grid ===== */}
      <div className="card-grid grid-3">
        {items.map((item) => (
          <div className="card" key={item.id}>
            <img src={item.img} alt={item.name} />
            <div className="card-content">
              <div className="card-header">
                <h3 className="card-title">{item.name}</h3>
                <span className="card-price">₹{item.price}</span>
              </div>
              <p className="text-gray-600">
                {filter === "published"
                  ? "This item is live on the menu."
                  : "Draft — not visible to customers yet."}
              </p>
              <div className="card-action">
                <button className="add-btn">
                  {filter === "published" ? "Unpublish" : "Publish"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewMenu;
