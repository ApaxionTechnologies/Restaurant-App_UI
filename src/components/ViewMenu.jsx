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
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// import "../styles/ViewMenu.css";
// import "../styles/global.css"; // 👈 global card css

// const ViewMenu = () => {
//   const [filter, setFilter] = useState("All");

//   const [menuItems, setMenuItems] = useState([
//     {
//       _id: 1,
//       name: "Paneer Butter Masala",
//       price: 220,
//       description: "Rich creamy tomato-based curry.",
//       image:
//         "https://www.cookwithmanali.com/wp-content/uploads/2021/07/Paneer-Butter-Masala-500x500.jpg",
//       status: "Published",
//     },
//     {
//       _id: 2,
//       name: "Veg Biryani",
//       price: 180,
//       description: "Aromatic basmati rice with spices.",
//       image:
//         "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/07/veg-biryani-recipe-500x500.jpg",
//       status: "Draft",
//     },
//     {
//       _id: 3,
//       name: "Cheese Pizza",
//       price: 350,
//       description: "Cheesy delight with fresh toppings.",
//       image:
//         "https://static.toiimg.com/thumb/53110049.cms?imgsize=218117&width=800&height=800",
//       status: "Published",
//     },
//   ]);

//   const handleEdit = (id) => {
//     alert(`Edit menu item: ${id}`);
//   };

//   const handleDelete = (id) => {
//     setMenuItems((prev) => prev.filter((item) => item._id !== id));
//   };

//   const filteredItems = menuItems.filter(
//     (item) => filter === "All" || item.status === filter
//   );

//   return (
//     <div className="view-menu-page p-6">
//       {/* Filter Dropdown */}
//       <div className="filter-row mb-4">
//         <label htmlFor="status-filter" className="mr-2 font-semibold">
//           Filter:
//         </label>
//         <select
//           id="status-filter"
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//           className="filter-select"
//         >
//           <option value="All">All</option>
//           <option value="Published">Published</option>
//           <option value="Draft">Draft</option>
//         </select>
//       </div>

//       {/* Menu Grid */}
//       <div className="menu-grid grid-3">
//         {filteredItems.map((item) => (
//           <div key={item._id} className="menu-card">
//             {/* Image */}
//             <img src={item.image} alt={item.name} className="menu-card-img" />

//             {/* Content */}
//             <div className="menu-card-content">
//               <div className="menu-title-price">
//                 <h3>{item.name}</h3>
//                 <span className="price">₹{item.price}</span>
//               </div>

//               <p className="menu-description">{item.description}</p>

//               {/* Status */}
//               <p className={`menu-status ${item.status.toLowerCase()}`}>
//                 {item.status}
//               </p>

//               {/* Action row */}
//               <div className="action-row">
//                 <button
//                   className="qty-btn"
//                   onClick={() => handleEdit(item._id)}
//                 >
//                   Edit
//                 </button>
//                 <button
//                   className="qty-btn"
//                   onClick={() => handleDelete(item._id)}
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}

//         {filteredItems.length === 0 && (
//           <p className="no-items-text">No items found for this filter.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ViewMenu;
import axios from "axios";
import "../styles/ViewMenu.css";
import { FaThList, FaThLarge, FaTh } from "react-icons/fa";
import Footer from "../components/Footer.jsx";
import HomeHeader from "../components/HomeHeader.jsx";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";
import "../styles/ViewMenu.css";
import { useEffect,useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import * as bootstrap from 'bootstrap'; 

const ViewMenu = () => {
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();
  const [restaurantName, setRestaurantName] = useState(
    localStorage.getItem("restaurantName") || "My Restaurant"
  );
  const [adminEmail, setAdminEmail] = useState("");
  const [restaurant, setRestaurant] = useState(null);
const [tooltip, setTooltip] = useState({ visible: false, title: "", text: "" });


const closeTooltip = () => setTooltip({ visible: false, title: "", text: "" });
useEffect(() => {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  tooltipTriggerList.forEach((el) => {
    new bootstrap.Tooltip(el);
  });
},); 

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

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5001/api/restaurants/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRestaurant(res.data.restaurant);
      } catch (err) {
        console.error("Fetch /me failed -", err.response?.status, err.response?.data);
      }
    };
    fetchMe();
  }, []);

const [menuItems, setMenuItems] = useState([
  {
    _id: 1,
    name: "Paneer Butter Masala",
    price: 220,
    description: "Rich creamy tomato-based curry with soft paneer cubes.",
    image: "https://cdn.pixabay.com/photo/2018/06/18/16/05/biryani-3482749_960_720.jpg",
    status: "Published",
    type: "veg",
    cuisine: "Indian",
    prepTime: "25 mins"
  },
  {
    _id: 2,
    name: "Chicken Biryani",
    price: 280,
    description: "Aromatic basmati rice cooked with tender chicken and spices.",
    image: "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/12/chicken-biryani-recipe.jpg",
    status: "Published",
    type: "non-veg",
    cuisine: "Indian",
    prepTime: "35 mins"
  },
  {
    _id: 3,
    name: "Cheese Pizza",
    price: 350,
    description: "Cheesy delight with fresh toppings and a crispy crust.",
    image: "https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_960_720.jpg",
    status: "Published",
    type: "veg",
    cuisine: "Italian",
    prepTime: "20 mins"
  },
  {
    _id: 4,
    name: "Ras Malai",
    price: 150,
    description: "Soft paneer balls soaked in sweetened, flavored milk.",
  image: "/images.jpeg",
    status: "Published",
    type: "veg",
    cuisine: "Indian",
    prepTime: "25 mins"
  },
  {
    _id: 5,
    name: "Veg Manchurian",
    price: 200,
    description: "Deep-fried veggie balls tossed in a spicy Indo-Chinese sauce.",
    image: "/manchurian.png",
    status: "Draft",
    type: "veg",
    cuisine: "Chinese",
    prepTime: "30 mins"
  },
  {
    _id: 6,
    name: "Dino's Pizza",
    price: 320,
    description: "Classic Italian pizza topped with fresh mozzarella and basil.",
    image:"/image.png",
    status: "Draft",
    type: "veg",
    cuisine: "Italian",
    prepTime: "18 mins"
  },
  {
    _id: 7,
    name: "Butter Naan",
    price: 60,
    description: "Soft Indian flatbread brushed with butter.",
    image:  "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=500&q=60",
    status: "Published",
    type: "veg",
    cuisine: "Indian",
    prepTime: "15 mins"
  }
]);


 
  const handleDraft = (id) => {
    setMenuItems((prev) =>
      prev.map((item) => (item._id === id ? { ...item, status: "Draft" } : item))
    );
  };


  const handlePublish = (id) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, status: "Published" } : item
      )
    );
  };

  const filteredItems = menuItems.filter(
    (item) => filter === "All" || item.status === filter
  );

  return (
    <>
      <HomeHeader
        isAdminDashboard={true}
        restaurantName={restaurantName}
        adminEmail={adminEmail}
        onLogout={handleLogout}
        restaurant={restaurant}
      />

      <div className="view-menu-page p-6">
    
    <div className="filter-row">
  {["All", "Published", "Draft"].map((option) => (
    <button
      key={option}
      onClick={() => setFilter(option)}
      className={`btn-global filter-btn ${filter === option ? "active" : ""}`}
    >
      {option}
    </button>
  ))}
</div>


        <div className="menu-grid grid-3">
          {filteredItems.map((item) => (
            <div key={item._id} className="card">
          
              <img src={item.image} alt={item.name} />

            
              <div className="card-content">
                <div className="menu-title-price">
           
       <span className={`veg-indicator ${item.type?.toLowerCase() || "veg"}`}></span>

                  <h3 className="card-title">{item.name}</h3>
                  <span className="card-price">₹{item.price}</span>
                </div>
<p className="card-description">
  {item.description?.length > 80
    ? (
      <>
        {item.description.slice(0, 80)}...
        <span
          className="read-more"
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title={item.description}
        >
          Read More
        </span>
      </>
    )
    : item.description
  }
</p>


<div className="card-footer">
  <div className="cuisine-time">
    <span>{item.cuisine || "🍴"}</span>
    <span>•</span>
    <span>⏱️ {item.prepTime || item.timeToPrepare || "—"}</span>
  </div>

  <div className="footer-actions">
    {filter !== "All" && (
      item.status === "Published" ? (
        <button
          className="btn-global"
          onClick={() => handleDraft(item._id)}
        >
          Move to Draft
        </button>
      ) : (
        <button
          className="btn-global"
          onClick={() => handlePublish(item._id)}
        >
          Move to Published
        </button>
      )
    )}
  </div>
</div>




              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <p className="no-items-text">No items found for this filter.</p>
          )}
        </div>
      </div>

      <footer className="footer">
        <Footer />
      </footer>
    </>
  );
};

export default ViewMenu;
