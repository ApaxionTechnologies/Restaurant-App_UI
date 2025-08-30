// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import "../styles/MenuView.css";

// // const MenuView = () => {
// //   const [menuItems, setMenuItems] = useState([]);

// //   useEffect(() => {
// //     const fetchMenu = async () => {
// //       try {
// //         const response = await axios.get("http://localhost:5001/api/menu");
// //         setMenuItems(response.data);
// //       } catch (error) {
// //         console.error("Failed to fetch menu:", error);
// //       }
// //     };

// //     fetchMenu();
// //   }, []);

// //   return (
// //     <div className="menu-view-container">
// //       <h2 className="menu-title">Current Menu</h2>
// //       <div className="menu-grid">
// //         {menuItems.map((item, index) => (
// //           <div className="menu-card" key={index}>
// //             <img src={item.image} alt={item.name} className="menu-img" />
// //             <div className="menu-info">
// //               <h3>{item.name}</h3>
// //               <p>₹{item.price}</p>
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// // export default MenuView;

// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import "../styles/ViewMenu.css";

// // const ViewMenu = () => {
// //   const [menuItems, setMenuItems] = useState([]);

// //   useEffect(() => {
// //     const fetchMenu = async () => {
// //       try {
// //         const res = await axios.get("http://localhost:5001/api/menu/all");
// //         setMenuItems(res.data);
// //       } catch (err) {
// //         console.error("Error fetching menu:", err.message);
// //       }
// //     };
// //     fetchMenu();
// //   }, []);

// //   return (
// //     <div className="view-menu-container">
// //       <h2>View Menu</h2>
// //       <ul>
// //         {menuItems.map((item) => (
// //           <li key={item._id}>
// //             <strong>{item.name}</strong> - ₹{item.price} | {item.category} | {item.timeToPrepare}
// //           </li>
// //         ))}
// //       </ul>
// //     </div>
// //   );
// // };
// // export default ViewMenu;
// ///////////////


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "../styles/ViewMenu.css";
// import { FaThList, FaThLarge, FaTh } from "react-icons/fa";
// import "../styles/MenuCard.css";
// import Footer from "../components/Footer.jsx";
// import HomeHeader from "../components/HomeHeader.jsx";
// import { useNavigate } from "react-router-dom"; // <-- Add this

// const ViewMenu = () => {
//   const navigate = useNavigate(); // <-- Add this
//   const [restaurantName, setRestaurantName] = useState(localStorage.getItem("restaurantName") || "My Restaurant"); // <-- Add this
//   const [adminEmail, setAdminEmail] = useState(""); // <-- Add this

//   useEffect(() => {
//     const storedEmail = localStorage.getItem("adminEmail");
//     if (!storedEmail) {
//       navigate("/");
//     } else {
//       setAdminEmail(storedEmail);
//     }
//   }, [navigate]);

//   const handleLogout = () => {
//     localStorage.removeItem("adminEmail");
//     localStorage.removeItem("restaurantName");
//     navigate("/");
//   };

//   const [menuItems, setMenuItems] = useState([]);
//   const [layout, setLayout] = useState("grid-2");
//   const [filterEmail, setFilterEmail] = useState("");
//   const [editingItemId, setEditingItemId] = useState(null);
//   const [editData, setEditData] = useState({
//     name: "",
//     price: "",
//     category: "",
//     timeToPrepare: ""
//   });

//   const [restaurant, setRestaurant] = useState(null);
  
  
//   useEffect(() => {
//     const fetchMe = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get("http://localhost:5001/api/restaurants/me", {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setRestaurant(res.data.restaurant);
//       } catch (err) {
//         console.error("Fetch /me failed -", err.response?.status, err.response?.data);
//       }
//     };
//     fetchMe();
//   }, []);
  

//  const fetchMenu = async () => {
//   try {
//     const res = await axios.get("http://localhost:5001/api/menu/all");
//     console.log("Menu API response:", res.data); 

//     setMenuItems(res.data.menu || res.data);
//   } catch (err) {
//     console.error("Fetch error:", err.message);
//   }
// };

//   const handleDelete = async (id) => {
//     const confirmed = window.confirm("Are you sure you want to delete this item?");
//     if (!confirmed) return;

//     try {
//       await axios.delete(`http://localhost:5001/api/menu/${id}`);
//       alert("Item deleted!");
//       fetchMenu();
//     } catch (err) {
//       console.error("Delete failed:", err.message);
//       alert("Delete failed");
//     }
//   };

//   const handleEditClick = (item) => {
//     setEditingItemId(item._id);
//     setEditData({
//       name: item.name,
//       price: item.price,
//       category: item.category,
//       timeToPrepare: item.timeToPrepare
//     });
//   };

//   const handleEditChange = (e) => {
//     setEditData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   const handleEditSave = async () => {
//     try {
//       const res = await axios.put(`http://localhost:5001/api/menu/${editingItemId}`, editData);
//       alert("Item updated!");
//       setEditingItemId(null);
//       fetchMenu();
//     } catch (err) {
//       console.error("Update failed:", err.message);
//       alert("Update failed");
//     }
//   };

//   const filteredItems = menuItems.filter(item =>
//     filterEmail ? item.restaurantEmail === filterEmail : true
//   );

//   return (
//     <>
//       <HomeHeader
//         isAdminDashboard={true}
//         restaurantName={restaurantName}
//         adminEmail={adminEmail}
//         onLogout={handleLogout}
//         restaurant={restaurant} 
//       />
//       <div className="view-menu-container">
//         <h2>View Menu</h2>
//         <input
//           type="email"
//           placeholder="Filter by Restaurant Email"
//           value={filterEmail}
//           onChange={(e) => setFilterEmail(e.target.value)}
//           className="filter-input"
//         />

//         <div className="menu-grid">
//           {filteredItems.map((item) => (
//             <div className="menu-card" key={item._id}>
//               {editingItemId === item._id ? (
//                 <>
//                   <input name="name" value={editData.name} onChange={handleEditChange} />
//                   <input name="price" value={editData.price} onChange={handleEditChange} />
//                   <input name="category" value={editData.category} onChange={handleEditChange} />
//                   <input name="timeToPrepare" value={editData.timeToPrepare} onChange={handleEditChange} />
//                   <div className="card-actions">
//                     <button className="edit-btn" onClick={handleEditSave}>Save</button>
//                     <button className="delete-btn" onClick={() => setEditingItemId(null)}>Cancel</button>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <div className="menu-header">
//                     <h3>{item.name}</h3>
//                     <p>₹{item.price}</p>
//                   </div>
//                   <p><strong>Category:</strong> {item.category}</p>
//                   <p><strong>Time:</strong> {item.timeToPrepare}</p>
//                   <p className="restaurant-email">{item.restaurantEmail}</p>
//                   <div className="card-actions">
//                     <button className="edit-btn" onClick={() => handleEditClick(item)}>Edit</button>
//                     <button className="delete-btn" onClick={() => handleDelete(item._id)}>Delete</button>
//                   </div>
//                 </>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//       <footer className="footer">
//         <Footer />
//       </footer>
//     </>
//   );// src/pages/ViewMenu.jsx// src/pages/ViewMenu.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/ViewMenu.css";
import "../styles/global.css"; // 👈 global card css

const ViewMenu = () => {
  const [filter, setFilter] = useState("All");

  const [menuItems, setMenuItems] = useState([
    {
      _id: 1,
      name: "Paneer Butter Masala",
      price: 220,
      description: "Rich creamy tomato-based curry.",
      image:
        "https://www.cookwithmanali.com/wp-content/uploads/2021/07/Paneer-Butter-Masala-500x500.jpg",
      status: "Published",
    },
    {
      _id: 2,
      name: "Veg Biryani",
      price: 180,
      description: "Aromatic basmati rice with spices.",
      image:
        "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/07/veg-biryani-recipe-500x500.jpg",
      status: "Draft",
    },
    {
      _id: 3,
      name: "Cheese Pizza",
      price: 350,
      description: "Cheesy delight with fresh toppings.",
      image:
        "https://static.toiimg.com/thumb/53110049.cms?imgsize=218117&width=800&height=800",
      status: "Published",
    },
  ]);

  const handleEdit = (id) => {
    alert(`Edit menu item: ${id}`);
  };

  const handleDelete = (id) => {
    setMenuItems((prev) => prev.filter((item) => item._id !== id));
  };

  const filteredItems = menuItems.filter(
    (item) => filter === "All" || item.status === filter
  );

  return (
    <div className="view-menu-page p-6">
      {/* Filter Dropdown */}
      <div className="filter-row mb-4">
        <label htmlFor="status-filter" className="mr-2 font-semibold">
          Filter:
        </label>
        <select
          id="status-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="All">All</option>
          <option value="Published">Published</option>
          <option value="Draft">Draft</option>
        </select>
      </div>

      {/* Menu Grid */}
      <div className="menu-grid grid-3">
        {filteredItems.map((item) => (
          <div key={item._id} className="menu-card">
            {/* Image */}
            <img src={item.image} alt={item.name} className="menu-card-img" />

            {/* Content */}
            <div className="menu-card-content">
              <div className="menu-title-price">
                <h3>{item.name}</h3>
                <span className="price">₹{item.price}</span>
              </div>

              <p className="menu-description">{item.description}</p>

              {/* Status */}
              <p className={`menu-status ${item.status.toLowerCase()}`}>
                {item.status}
              </p>

              {/* Action row */}
              <div className="action-row">
                <button
                  className="qty-btn"
                  onClick={() => handleEdit(item._id)}
                >
                  Edit
                </button>
                <button
                  className="qty-btn"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <p className="no-items-text">No items found for this filter.</p>
        )}
      </div>
    </div>
  );
};

export default ViewMenu;
