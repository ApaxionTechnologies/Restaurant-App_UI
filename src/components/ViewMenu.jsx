// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "../styles/MenuView.css";

// const MenuView = () => {
//   const [menuItems, setMenuItems] = useState([]);

//   useEffect(() => {
//     const fetchMenu = async () => {
//       try {
//         const response = await axios.get("http://localhost:5001/api/menu");
//         setMenuItems(response.data);
//       } catch (error) {
//         console.error("Failed to fetch menu:", error);
//       }
//     };

//     fetchMenu();
//   }, []);

//   return (
//     <div className="menu-view-container">
//       <h2 className="menu-title">Current Menu</h2>
//       <div className="menu-grid">
//         {menuItems.map((item, index) => (
//           <div className="menu-card" key={index}>
//             <img src={item.image} alt={item.name} className="menu-img" />
//             <div className="menu-info">
//               <h3>{item.name}</h3>
//               <p>₹{item.price}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MenuView;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "../styles/ViewMenu.css";

// const ViewMenu = () => {
//   const [menuItems, setMenuItems] = useState([]);

//   useEffect(() => {
//     const fetchMenu = async () => {
//       try {
//         const res = await axios.get("http://localhost:5001/api/menu/all");
//         setMenuItems(res.data);
//       } catch (err) {
//         console.error("Error fetching menu:", err.message);
//       }
//     };
//     fetchMenu();
//   }, []);

//   return (
//     <div className="view-menu-container">
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
///////////////
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ViewMenu.css";
import { FaThList, FaThLarge, FaTh } from "react-icons/fa";
import "../styles/MenuCard.css";
import Footer from "../components/Footer.jsx";
import HomeHeader from "../components/HomeHeader.jsx";
import { useNavigate } from "react-router-dom"; // <-- Add this

const ViewMenu = () => {
  const navigate = useNavigate(); // <-- Add this
  const [restaurantName, setRestaurantName] = useState(localStorage.getItem("restaurantName") || "My Restaurant"); // <-- Add this
  const [adminEmail, setAdminEmail] = useState(""); // <-- Add this

  useEffect(() => {
    const storedEmail = localStorage.getItem("adminEmail");
    if (!storedEmail) {
      navigate("/");
    } else {
      setAdminEmail(storedEmail);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("restaurantName");
    navigate("/");
  };

  const [menuItems, setMenuItems] = useState([]);
  const [layout, setLayout] = useState("grid-2");
  const [filterEmail, setFilterEmail] = useState("");
  const [editingItemId, setEditingItemId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    price: "",
    category: "",
    timeToPrepare: ""
  });

  const fetchMenu = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/menu/all");
      setMenuItems(res.data);
    } catch (err) {
      console.error("Fetch error:", err.message);
    }
  };
  useEffect(() => {
    fetchMenu();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:5001/api/menu/${id}`);
      alert("Item deleted!");
      fetchMenu();
    } catch (err) {
      console.error("Delete failed:", err.message);
      alert("Delete failed");
    }
  };

  const handleEditClick = (item) => {
    setEditingItemId(item._id);
    setEditData({
      name: item.name,
      price: item.price,
      category: item.category,
      timeToPrepare: item.timeToPrepare
    });
  };

  const handleEditChange = (e) => {
    setEditData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleEditSave = async () => {
    try {
      const res = await axios.put(`http://localhost:5001/api/menu/${editingItemId}`, editData);
      alert("Item updated!");
      setEditingItemId(null);
      fetchMenu();
    } catch (err) {
      console.error("Update failed:", err.message);
      alert("Update failed");
    }
  };

  const filteredItems = menuItems.filter(item =>
    filterEmail ? item.restaurantEmail === filterEmail : true
  );

  return (
    <>
      <HomeHeader
        isAdminDashboard={true}
        restaurantName={restaurantName}
        adminEmail={adminEmail}
        onLogout={handleLogout}
      />
      <div className="view-menu-container">
        <h2>View Menu</h2>
        <input
          type="email"
          placeholder="Filter by Restaurant Email"
          value={filterEmail}
          onChange={(e) => setFilterEmail(e.target.value)}
          className="filter-input"
        />

        <div className="menu-grid">
          {filteredItems.map((item) => (
            <div className="menu-card" key={item._id}>
              {editingItemId === item._id ? (
                <>
                  <input name="name" value={editData.name} onChange={handleEditChange} />
                  <input name="price" value={editData.price} onChange={handleEditChange} />
                  <input name="category" value={editData.category} onChange={handleEditChange} />
                  <input name="timeToPrepare" value={editData.timeToPrepare} onChange={handleEditChange} />
                  <div className="card-actions">
                    <button className="edit-btn" onClick={handleEditSave}>Save</button>
                    <button className="delete-btn" onClick={() => setEditingItemId(null)}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="menu-header">
                    <h3>{item.name}</h3>
                    <p>₹{item.price}</p>
                  </div>
                  <p><strong>Category:</strong> {item.category}</p>
                  <p><strong>Time:</strong> {item.timeToPrepare}</p>
                  <p className="restaurant-email">{item.restaurantEmail}</p>
                  <div className="card-actions">
                    <button className="edit-btn" onClick={() => handleEditClick(item)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(item._id)}>Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      <footer className="footer">
        <Footer />
      </footer>
    </>
  );
};

export default ViewMenu;

///////////////////
