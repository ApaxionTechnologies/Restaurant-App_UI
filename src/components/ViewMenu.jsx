// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate, useParams } from "react-router-dom";
// import Footer from "../components/Footer.jsx";
// import HomeHeader from "../components/HomeHeader.jsx";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min';
// import * as bootstrap from 'bootstrap';
// import "../styles/global.css";
// import "../styles/ViewMenu.css";

// const ViewMenu = () => {
//   const navigate = useNavigate();
//   const { restaurantId } = useParams();

//   const [filter, setFilter] = useState("All");
//   const [restaurantName, setRestaurantName] = useState(localStorage.getItem("restaurantName") || "My Restaurant");
//   const [adminEmail, setAdminEmail] = useState("");
//   const [restaurant, setRestaurant] = useState(null);
//   const [menuItems, setMenuItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
//     const tooltips = [...tooltipTriggerList].map(el => new bootstrap.Tooltip(el));
    
//     return () => {
//       tooltips.forEach(tooltip => tooltip.dispose());
//     };
//   }, [menuItems]);

//   useEffect(() => {
//     const storedEmail = localStorage.getItem("adminEmail");
//     if (!storedEmail) navigate("/");
//     else setAdminEmail(storedEmail);
//   }, [navigate]);

//   useEffect(() => {
//     if (restaurantId) {
//       fetchData();
//     }
//   }, [restaurantId]);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
      
//       const [restaurantRes, menuRes] = await Promise.all([
//         axios.get("http://localhost:5001/api/restaurants/me", {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         axios.get(`http://localhost:5001/api/menu/${restaurantId}`)
//       ]);

//       setRestaurant(restaurantRes.data.restaurant);
//       const fetchedMenu = (menuRes.data.menu || [])
//         .filter(item => {
//           if (!item._id) {
//             console.warn("Menu item missing _id, skipping:", item);
//             return false;
//           }
//           return true;
//         })
//         .map(item => ({
//           ...item,
//           statusNormalized: (item.status || "draft").toLowerCase(),
//           status: item.status === "Published" ? "Published" : "Draft",
//         }));

//       setMenuItems(fetchedMenu);
//       setError("");
//     } catch (err) {
//       console.error("Error fetching data:", err);
//       setError("Failed to load data. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

// const handleStatusChange = async (menuItemId, newStatus) => {
//   if (!menuItemId) {
//     console.warn("No ID provided for status change");
//     alert("This menu item doesn't have a valid ID. Please refresh the page and try again.");
//     return;
//   }
//   try {
//     const token = localStorage.getItem("token");
//     const response = await axios.put(`http://localhost:5001/api/menu/${menuItemId}/status`, {
//       status: newStatus,
//     }, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
    
//     setMenuItems(prev =>
//       prev.map(item =>
//         item._id === menuItemId
//           ? { ...item, status: newStatus, statusNormalized: newStatus.toLowerCase() }
//           : item
//       )
//     );
//   } catch (err) {
//     console.error(`Failed to change status to ${newStatus}`, err);
//     console.error("Error response:", err.response?.data);
//     alert(`Failed to update item status. Please try again. Error: ${err.response?.data?.message || err.message}`);
//   }
// };

//   const handleLogout = () => {
//     localStorage.removeItem("adminEmail");
//     localStorage.removeItem("restaurantName");
//     localStorage.removeItem("token");
//     navigate("/");
//   };

//   const filteredItems = menuItems.filter(item => {
//     if (filter === "All") return true;
//     return item.status === filter;
//   });

//   if (loading) return <div className="loading">Loading menu...</div>;
//   if (error) return <div className="error">{error}</div>;

//   return (
//     <>
//       <HomeHeader
//         isAdminDashboard={true}
//         restaurantName={restaurantName}
//         adminEmail={adminEmail}
//         onLogout={handleLogout}
//         restaurant={restaurant}
//       />

//       <div className="view-menu-page p-6">
//         <div className="filter-row">
//           {["All", "Published", "Draft"].map(option => (
//             <button
//               key={option}
//               onClick={() => setFilter(option)}
//               className={`btn-global filter-btn ${filter === option ? "active" : ""}`}
//             >
//               {option}
//             </button>
//           ))}
//         </div>

//         <div className="menu-grid grid-3">
//           {filteredItems.length === 0 ? (
//             <p className="no-items-text">No items found for this filter.</p>
//           ) : (
//             filteredItems.map(item => (
//               <div key={item._id} className="card">
//                 <img src={item.image} alt={item.name} onError={(e) => {
//                   e.target.src = "/placeholder-food.jpg";
//                 }} />
//                 <div className="card-content">
//                   <div className="menu-title-price">
//                     <span className={`veg-indicator ${item.type?.toLowerCase() || "veg"}`}></span>
//                     <h3 className="card-title">{item.name}</h3>
//                     <span className="card-price">₹{item.price}</span>
//                   </div>

//                   <p className="card-description">
//                     {item.description?.length > 80
//                       ? <>
//                           {item.description.slice(0, 80)}...
//                           <span
//                             className="read-more"
//                             data-bs-toggle="tooltip"
//                             data-bs-placement="top"
//                             title={item.description}
//                           >
//                             Read More
//                           </span>
//                         </>
//                       : item.description
//                     }
//                   </p>

//                   <div className="card-footer">
//                     <div className="cuisine-time">
//                       <span>{item.cuisine || "🍴"}</span>
//                       <span>•</span>
//                       <span>⏱️ {item.prepTime || item.timeToPrepare || "—"}</span>
//                     </div>
//                     <div className="footer-actions">
//                       {item.status === "Published" ? (
//                         <button className="btn-global" onClick={() => handleStatusChange(item._id, "Draft")}>
//                           Move to Draft
//                         </button>
//                       ) : (
//                         <button className="btn-global" onClick={() => handleStatusChange(item._id, "Published")}>
//                           Move to Published
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>

//       <footer className="footer">
//         <Footer />
//       </footer>
//     </>
//   );
// };

// export default ViewMenu;






// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams ,useLocation} from "react-router-dom";
// import Footer from "../components/Footer.jsx";
// import HomeHeader from "../components/HomeHeader.jsx";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min';
// import * as bootstrap from 'bootstrap';
// import "../styles/global.css";
// import "../styles/ViewMenu.css";
// import toast from "react-hot-toast";
// import { getMyRestaurant, getMenuByRestaurant ,updateMenuStatus,deleteMenuItem,} from "../services/apiService.js";
// const ViewMenu = () => {
//   const navigate = useNavigate();
//   const { restaurantId } = useParams();
  
//   const location = useLocation();

//   const [filter, setFilter] = useState("All");
//   const [restaurantName, setRestaurantName] = useState(localStorage.getItem("restaurantName") || "My Restaurant");
//   const [adminEmail, setAdminEmail] = useState("");
//   const [restaurant, setRestaurant] = useState(null);
//   const [menuItems, setMenuItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

  

// useEffect(() => {
//   if (restaurantId) fetchData();
// }, [restaurantId, location.state?.reload]);

//   useEffect(() => {
//     const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
//     const tooltips = [...tooltipTriggerList].map(el => new bootstrap.Tooltip(el));
//     return () => tooltips.forEach(tooltip => tooltip.dispose());
//   }, [menuItems]);

//   useEffect(() => {
//     const storedEmail = localStorage.getItem("adminEmail");
//     if (!storedEmail) navigate("/");
//     else setAdminEmail(storedEmail);
//   }, [navigate]);

//   useEffect(() => { if (restaurantId) fetchData(); }, [restaurantId]);

//   const fetchData = async () => {
//     try {
//            setLoading(true);
//       const token = localStorage.getItem("token");

//       const [restaurantRes, menuRes] = await Promise.all([
//         getMyRestaurant(token),
//         getMenuByRestaurant(restaurantId),
//       ]);

//       setRestaurant(restaurantRes.restaurant);
//       const fetchedMenu = (menuRes.menu || [])
//         .filter(item => {
//           if (!item._id) {
//             console.warn("Menu item missing _id, skipping:", item);
//             return false;
//           }
//           return true;
//         })
//         .map(item => ({
//           ...item,
//           statusNormalized: (item.status || "draft").toLowerCase(),
//           status: item.status === "Published" ? "Published" : "Draft",
//         }));

//       setMenuItems(fetchedMenu);
//       setError("");
//     } catch (err) {
//       console.error("Error fetching data:", err);
//       setError("Failed to load data. Please try again later.");
//     } finally { setLoading(false); }
//   };

//   const handleDelete = async (menuItemId) => {
//     if (!window.confirm("Are you sure you want to delete this item?")) return;

//     try {
//       const token = localStorage.getItem("token");
//       await deleteMenuItem(menuItemId, token);

//       setMenuItems((prev) => prev.filter((m) => m._id !== menuItemId));
//       toast.success("Item deleted successfully!");
//     } catch (err) {
//       toast.error(`Delete failed: ${err.message}`);
//     }
//   };

// const handleStatusChange = async (menuItemId, newStatus) => {
//   if (!menuItemId) {
//     console.warn("No ID provided for status change");
//     toast.error("This menu item doesn't have a valid ID. Please refresh the page and try again.");
//     return;
//   }
//   try {
   
//       const token = localStorage.getItem("token");
//       await updateMenuStatus(menuItemId, newStatus, token);
    
//     setMenuItems(prev =>
//       prev.map(item =>
//         item._id === menuItemId
//           ? { ...item, status: newStatus, statusNormalized: newStatus.toLowerCase() }
//           : item
//       )
//     );
//   } catch (err) {
//     console.error(`Failed to change status to ${newStatus}`, err);
//     console.error("Error response:", err.response?.data);
//     toast.error(`Failed to update item status. Please try again. Error: ${err.response?.data?.message || err.message}`);
//   }
// };

//   const handleLogout = () => {
//     localStorage.removeItem("adminEmail");
//     localStorage.removeItem("restaurantName");
//     localStorage.removeItem("token");
//     navigate("/");
//   };

//   const filteredItems = menuItems.filter(item => filter === "All" || item.status === filter);

//   if (loading) return <div className="loading">Loading menu...</div>;
//   if (error) return <div className="error">{error}</div>;

//   return (
//     <>
//       <HomeHeader
//         isAdminDashboard={true}
//         restaurantName={restaurantName}
//         adminEmail={adminEmail}
//         onLogout={handleLogout}
//         restaurant={restaurant}
//       />

//       <div className="view-menu-page p-6">
//         <div className="filter-row">
//           {["All", "Published", "Draft"].map(option => (
//             <button key={option} onClick={() => setFilter(option)} className={`btn-global filter-btn ${filter === option ? "active" : ""}`}>
//               {option}
//             </button>
//           ))}
//         </div>

//         <div className="menu-grid grid-3">
//           {filteredItems.length === 0 ? (
//             <p className="no-items-text">No items found for this filter.</p>
//           ) : (
//             filteredItems.map(item => (
//               <div key={item._id} className="card">
//                 <img src={item.image} alt={item.name} onError={e => e.target.src = "/placeholder-food.jpg"} />
//                 <div className="card-content">
//                   <div className="menu-title-price">
//                     <span className={`veg-indicator ${item.type?.toLowerCase() || "veg"}`}></span>
//                     <h3 className="card-title">{item.name}</h3>
//                     <span className="card-price">₹{item.price}</span>
//                   </div>

//                   <p className="card-description">
//                     {item.description?.length > 80
//                       ? <>
//                           {item.description.slice(0, 80)}...
//                           <span className="read-more" data-bs-toggle="tooltip" title={item.description}>Read More</span>
//                         </>
//                       : item.description
//                     }
//                   </p>

//                   <div className="card-footer">
//                     {/* <button
//   className="btn btn-sm btn-outline-primary"
//   onClick={() => navigate(`/edit-menu/${item._id}`, { state: { itemToEdit: item } })}
// >
//   ✏️ Edit
// </button> */}
//                   <div className="card-footer d-flex justify-content-between align-items-center">
//   <div className="cuisine-time">
//     <span>{item.cuisine || "🍴"}</span> •{" "}
//     <span>⏱️ {item.prepTime || item.timeToPrepare || "—"}</span>
//   </div>

//   <div className="d-flex gap-2">
//     <button
//       className="btn btn-sm btn-success action-btn"
//       onClick={() =>
//         navigate(`/edit-menu/${item._id}`, { state: { itemToEdit: item } })
//       }
//     >
//       ✏️Edit
//     </button>
//                         <button
//                         className="btn btn-sm btn-danger action-btn"
//                         onClick={() => handleDelete(item._id)}
//                          >
//                         🗑️ Delete
//                        </button>
//                      </div>
//                     </div>
//                     <div className="footer-actions">
//                       {item.status === "Published"
//                         ? <button className="btn-global" onClick={() => handleStatusChange(item._id, "Draft")}>Move to Draft</button>
//                         : <button className="btn-global" onClick={() => handleStatusChange(item._id, "Published")}>Move to Published</button>
//                       }
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         {/* Add Menu Item button */}
//         <div className="mt-4">
//           <button className="btn btn-success w-100" onClick={() => navigate("/add-menu")}>➕ Add Menu Item</button>
//         </div>
//       </div>

//       <footer className="footer"><Footer /></footer>
//     </>
//   );
// };

// export default ViewMenu;


// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// import Footer from "../components/Footer.jsx";
// import HomeHeader from "../components/HomeHeader.jsx";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min';
// import * as bootstrap from 'bootstrap';
// import "../styles/global.css";
// import "../styles/ViewMenu.css";
// import toast from "react-hot-toast";
// import { getMyRestaurant, getMenuByRestaurant, updateMenuStatus, deleteMenuItem } from "../services/apiService.js";

// const ViewMenu = () => {
//   const navigate = useNavigate();
//   const { restaurantId } = useParams();
//   const location = useLocation();

//   const [filter, setFilter] = useState("All");
//   const [restaurantName, setRestaurantName] = useState(localStorage.getItem("restaurantName") || "My Restaurant");
//   const [adminEmail, setAdminEmail] = useState("");
//   const [restaurant, setRestaurant] = useState(null);
//   const [menuItems, setMenuItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
//     const tooltips = [...tooltipTriggerList].map(el => new bootstrap.Tooltip(el));
//     return () => tooltips.forEach(tooltip => tooltip.dispose());
//   }, [menuItems]);

//   useEffect(() => {
//     const storedEmail = localStorage.getItem("adminEmail");
//     if (!storedEmail) navigate("/");
//     else setAdminEmail(storedEmail);
//   }, [navigate]);

//   useEffect(() => {
//     fetchData();
//   }, [restaurantId]);

//   // Check for updates when the component mounts or location state changes
//   useEffect(() => {
//     if (location.state?.updatedItem) {
//       // Update the specific item that was edited
//       setMenuItems(prev => 
//         prev.map(item => 
//           item._id === location.state.updatedItem._id 
//             ? { 
//                 ...location.state.updatedItem, 
//                 statusNormalized: (location.state.updatedItem.status || "draft").toLowerCase(),
//                 status: location.state.updatedItem.status === "Published" ? "Published" : "Draft"
//               } 
//             : item
//         )
//       );
      
//       // Clear the state to prevent repeated updates
//       navigate(location.pathname, { replace: true, state: {} });
//     }
    
//     if (location.state?.newItem) {
//       // Add the new item that was created
//       setMenuItems(prev => [
//         ...prev, 
//         { 
//           ...location.state.newItem, 
//           statusNormalized: (location.state.newItem.status || "draft").toLowerCase(),
//           status: location.state.newItem.status === "Published" ? "Published" : "Draft"
//         }
//       ]);
      
//       // Clear the state to prevent repeated additions
//       navigate(location.pathname, { replace: true, state: {} });
//     }
//   }, [location.state, navigate, location.pathname]);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       // Get restaurant ID from localStorage or params
//       const idToUse = localStorage.getItem("restaurantId") || restaurantId;
      
//       if (!idToUse) {
//         setError("Restaurant ID not found");
//         setLoading(false);
//         return;
//       }

//       const [restaurantRes, menuRes] = await Promise.all([
//         getMyRestaurant(token),
//         getMenuByRestaurant(idToUse),
//       ]);

//       setRestaurant(restaurantRes.restaurant);
      
//       // Store restaurant ID for future use
//       if (restaurantRes.restaurant?._id) {
//         localStorage.setItem("restaurantId", restaurantRes.restaurant._id);
//       }

//       const fetchedMenu = (menuRes.menu || [])
//         .filter(item => {
//           if (!item._id) {
//             console.warn("Menu item missing _id, skipping:", item);
//             return false;
//           }
//           return true;
//         })
//         .map(item => ({
//           ...item,
//           statusNormalized: (item.status || "draft").toLowerCase(),
//           status: item.status === "Published" ? "Published" : "Draft",
//         }));

//       setMenuItems(fetchedMenu);
//       setError("");
//     } catch (err) {
//       console.error("Error fetching data:", err);
//       setError("Failed to load data. Please try again later.");
//     } finally { 
//       setLoading(false); 
//     }
//   };

//   const handleDelete = async (menuItemId) => {
//     if (!window.confirm("Are you sure you want to delete this item?")) return;

//     try {
//       const token = localStorage.getItem("token");
//       await deleteMenuItem(menuItemId, token);

//       setMenuItems((prev) => prev.filter((m) => m._id !== menuItemId));
//       toast.success("Item deleted successfully!");
//     } catch (err) {
//       toast.error(`Delete failed: ${err.message}`);
//     }
//   };

//   const handleStatusChange = async (menuItemId, newStatus) => {
//     if (!menuItemId) {
//       console.warn("No ID provided for status change");
//       toast.error("This menu item doesn't have a valid ID. Please refresh the page and try again.");
//       return;
//     }
//     try {
//       const token = localStorage.getItem("token");
//       await updateMenuStatus(menuItemId, newStatus, token);
    
//       setMenuItems(prev =>
//         prev.map(item =>
//           item._id === menuItemId
//             ? { ...item, status: newStatus, statusNormalized: newStatus.toLowerCase() }
//             : item
//         )
//       );
//       toast.success(`Item ${newStatus.toLowerCase()} successfully!`);
//     } catch (err) {
//       console.error(`Failed to change status to ${newStatus}`, err);
//       console.error("Error response:", err.response?.data);
//       toast.error(`Failed to update item status. Please try again. Error: ${err.response?.data?.message || err.message}`);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("adminEmail");
//     localStorage.removeItem("restaurantName");
//     localStorage.removeItem("token");
//     navigate("/");
//   };

//   const handleEdit = (item) => {
//     navigate(`/edit-menu/${item._id}`, { 
//       state: { itemToEdit: item } 
//     });
//   };

//   const handleAddMenuItem = () => {
//     navigate("/add-menu");
//   };

//   const filteredItems = menuItems.filter(item => filter === "All" || item.status === filter);

//   if (loading) return <div className="loading">Loading menu...</div>;
//   if (error) return <div className="error">{error}</div>;

//   return (
//     <>
//       <HomeHeader
//         isAdminDashboard={true}
//         restaurantName={restaurantName}
//         adminEmail={adminEmail}
//         onLogout={handleLogout}
//         restaurant={restaurant}
//       />

//       <div className="view-menu-page p-6">
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <div className="filter-row">
//             {["All", "Published", "Draft"].map(option => (
//               <button key={option} onClick={() => setFilter(option)} className={`btn-global filter-btn ${filter === option ? "active" : ""}`}>
//                 {option}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="menu-grid grid-3">
//           {filteredItems.length === 0 ? (
//             <p className="no-items-text">No items found for this filter.</p>
//           ) : (
//             filteredItems.map(item => (
//               <div key={item._id} className="card">
//                 <img src={item.image} alt={item.name} onError={e => e.target.src = "/placeholder-food.jpg"} />
//                 <div className="card-content">
//                   <div className="menu-title-price">
//                     <span className={`veg-indicator ${item.type?.toLowerCase() || "veg"}`}></span>
//                     <h3 className="card-title">{item.name}</h3>
//                     <span className="card-price">₹{item.price}</span>
//                   </div>

//                   <p className="card-description">
//                     {item.description?.length > 80
//                       ? <>
//                           {item.description.slice(0, 80)}...
//                           <span className="read-more" data-bs-toggle="tooltip" title={item.description}>Read More</span>
//                         </>
//                       : item.description
//                     }
//                   </p>

//                   <div className="card-footer">
//                     <div className="card-footer-top d-flex justify-content-between align-items-center">
//                       <div className="cuisine-time">
//                         <span>{item.cuisine || "🍴"}</span> •{" "}
//                         <span>⏱️ {item.prepTime || item.timeToPrepare || "—"}</span>
//                       </div>

//                       <div className="d-flex gap-2">
//                         <button
//                           className="btn btn-sm btn-success action-btn"
//                           onClick={() => handleEdit(item)}
//                         >
//                           ✏️Edit
//                         </button>
//                         <button
//                           className="btn btn-sm btn-danger action-btn"
//                           onClick={() => handleDelete(item._id)}
//                         >
//                           🗑️ Delete
//                         </button>
//                       </div>
//                     </div>
//                     <div className="footer-actions mt-2">
//                       {item.status === "Published"
//                         ? <button className="btn-global" onClick={() => handleStatusChange(item._id, "Draft")}>Move to Draft</button>
//                         : <button className="btn-global" onClick={() => handleStatusChange(item._id, "Published")}>Move to Published</button>
//                       }
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         {/* Add Menu Item button */}
//         <div className="mt-4">
//           <button className="btn btn-success w-100" onClick={handleAddMenuItem}>➕ Add Menu Item</button>
//         </div>
//       </div>

//       <footer className="footer"><Footer /></footer>
//     </>
//   );
// };

// export default ViewMenu;



import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import HomeHeader from "../components/HomeHeader.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import * as bootstrap from "bootstrap";
import "../styles/global.css";
import "../styles/ViewMenu.css";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import { getMyRestaurant, getMenuByRestaurant ,updateMenuStatus,deleteMenuItem,} from "../services/apiService.js";
const ViewMenu = () => {
  const navigate = useNavigate();
  const { restaurantId } = useParams();
  const location = useLocation();

  const [filter, setFilter] = useState("All");
  const [restaurantName, setRestaurantName] = useState(
    localStorage.getItem("restaurantName") || "My Restaurant"
  );
  const [adminEmail, setAdminEmail] = useState("");
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltips = [...tooltipTriggerList].map(el => new bootstrap.Tooltip(el));
    return () => tooltips.forEach(tt => tt.dispose());
  }, [menuItems]);
  useEffect(() => {
    const storedEmail = localStorage.getItem("adminEmail");
    if (!storedEmail) navigate("/");
    else setAdminEmail(storedEmail);
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [restaurantId]);

useEffect(() => {
  if (!location.state) return;

  const { updatedItem, newItem } = location.state;

  if (updatedItem) {
    setMenuItems(prevItems =>
      prevItems.map(item =>
        item._id === updatedItem._id ? updatedItem : item
      )
    );
  }

  if (newItem) {
   
    setMenuItems(prevItems => [...prevItems, newItem]);
  }
  if (updatedItem || newItem) {
    navigate(location.pathname, { replace: true, state: {} });
  }
}, [location.state, navigate, location.pathname]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const idToUse = localStorage.getItem("restaurantId") || restaurantId;

      if (!idToUse) {
        setError("Restaurant ID not found");
        setLoading(false);
        return;
      }

      const [restaurantRes, menuRes] = await Promise.all([
        getMyRestaurant(token),
        getMenuByRestaurant(idToUse)
      ]);

      setRestaurant(restaurantRes.restaurant);
      if (restaurantRes.restaurant?._id) localStorage.setItem("restaurantId", restaurantRes.restaurant._id);

      const fetchedMenu = (menuRes.menu || [])
        .filter(item => item._id)
        .map(item => ({
          ...item,
          statusNormalized: (item.status || "draft").toLowerCase(),
          status: item.status === "Published" ? "Published" : "Draft"
        }));

      setMenuItems(fetchedMenu);
      setError("");
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (menuItemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const token = localStorage.getItem("token");
      await deleteMenuItem(menuItemId, token);
      setMenuItems(prev => prev.filter(m => m._id !== menuItemId));
      toast.success("Item deleted successfully!");
    } catch (err) {
      toast.error(`Delete failed: ${err.message}`);
    }
  };

  const handleStatusChange = async (menuItemId, newStatus) => {
    if (!menuItemId) {
      toast.error("This menu item doesn't have a valid ID. Please refresh and try again.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await updateMenuStatus(menuItemId, newStatus, token);

      setMenuItems(prev =>
        prev.map(item =>
          item._id === menuItemId
            ? { ...item, status: newStatus, statusNormalized: newStatus.toLowerCase() }
            : item
        )
      );

      toast.success(`Item moved to ${newStatus} successfully!`);
    } catch (err) {
      console.error("Failed to change status:", err);
      toast.error(`Failed to update item status. ${err.response?.data?.message || err.message}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("restaurantName");
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleEdit = (item) => {
    navigate(`/edit-menu/${item._id}`, { state: { itemToEdit: item } });
  };

  const handleAddMenuItem = () => {
    navigate("/add-menu");
  };

  const filteredItems = menuItems.filter(item => filter === "All" || item.status === filter);

  if (loading) return <div className="loading">Loading menu...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <HomeHeader
        isAdminDashboard
        restaurantName={restaurantName}
        adminEmail={adminEmail}
        onLogout={handleLogout}
        restaurant={restaurant}
      />

      <div className="view-menu-page p-6">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="filter-row">
            {["All", "Published", "Draft"].map(option => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={`btn-global filter-btn ${filter === option ? "active" : ""}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="menu-grid grid-3">
          {filteredItems.length === 0 ? (
            <p className="no-items-text">No items found for this filter.</p>
          ) : (
            filteredItems.map((item) => (
              <div key={item._id} className="card">
                <div className="card-img-wrapper">
  <img
    src={item.image}
    alt={item.name}
    onError={(e) => (e.target.src = "/placeholder-food.jpg")}
  />
  </div>
                <div className="card-content">
                  <div className="menu-title-price">
                    <span
                      className={`veg-indicator ${
                        item.type?.toLowerCase() || "veg"
                      }`}
                    ></span>
                    <h3 className="card-title">{item.name}</h3>
                    <span className="card-price">₹{item.price}</span>
                  </div>

                  <p className="card-description">
                    {item.description?.length > 80 ? (
                      <>
                        {item.description.slice(0, 80)}...
                        <span className="read-more" data-bs-toggle="tooltip" title={item.description}>
                          Read More
                        </span>
                      </>
                    ) : item.description}
                  </p>

                  <div className="card-footer">
                  <div className="card-footer d-flex justify-content-between align-items-center">
  <div className="cuisine-time">
    <span>{item.cuisine || "🍴"}</span> •{" "}
    <span>⏱️ {item.prepTime || item.timeToPrepare || "—"}</span>
  </div>

  <div className="d-flex gap-2">
    <button
      className="btn-global btn-edit"
      onClick={() =>
        navigate(`/edit-menu/${item._id}`, { state: { itemToEdit: item } })
      }
    >
      Edit
    </button>
    
                </div>
                </div>
                <div className="footer-actions">
                {item.status === "Published"
                ? <button className="btn-global" onClick={() => handleStatusChange(item._id, "Draft")}> Draft</button>
                : <button className="btn-global" onClick={() => handleStatusChange(item._id, "Published")}> Published</button>
                  }
                </div>
                 </div>
              </div>
               <button
            className="btn-global btn-delete"
            onClick={() => handleDelete(item._id)}
           >
          <Trash2 size={16} />
          </button>
            </div>
            ))
          )}
        </div>

        <div className="mt-4">
          <button className="btn btn-success w-100" onClick={handleAddMenuItem}>
            ➕ Add Menu Item
          </button>
        </div>
      </div>

      <footer className="footer"><Footer /></footer>
    </>
  );
};

export default ViewMenu;
