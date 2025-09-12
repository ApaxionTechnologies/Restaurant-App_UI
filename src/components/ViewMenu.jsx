import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import HomeHeader from "../components/HomeHeader.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import * as bootstrap from 'bootstrap';
import "../styles/global.css";
import "../styles/ViewMenu.css";
import toast from "react-hot-toast";
import { 
  getMyRestaurant, 
  getMenuByRestaurant, 
  updateMenuStatus, 
  updateMenuItem, 
  deleteMenuItem 
} from "../services/apiService.js";

const ViewMenu = () => {
  const navigate = useNavigate();
  const { restaurantId } = useParams();

  const [filter, setFilter] = useState("All");
  const [restaurantName, setRestaurantName] = useState(localStorage.getItem("restaurantName") || "My Restaurant");
  const [adminEmail, setAdminEmail] = useState("");
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    price: "",
    category: "",
    cuisine: "",
    prepTime: "",
    ingredients: "",
    description: "",
    status: "Published",
    type: "veg",
    discount: ""
  });

  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltips = [...tooltipTriggerList].map(el => new bootstrap.Tooltip(el));
    
    return () => {
      tooltips.forEach(tooltip => tooltip.dispose());
    };
  }, [menuItems]);

  useEffect(() => {
    const storedEmail = localStorage.getItem("adminEmail");
    if (!storedEmail) navigate("/");
    else setAdminEmail(storedEmail);
  }, [navigate]);

  useEffect(() => {
    if (restaurantId) {
      fetchData();
    }
  }, [restaurantId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const [restaurantRes, menuRes] = await Promise.all([
        getMyRestaurant(token),
        getMenuByRestaurant(restaurantId),
      ]);

      setRestaurant(restaurantRes.restaurant);
      const fetchedMenu = (menuRes.menu || [])
        .filter(item => {
          if (!item._id) {
            console.warn("Menu item missing _id, skipping:", item);
            return false;
          }
          return true;
        })
        .map(item => ({
          ...item,
          statusNormalized: (item.status || "draft").toLowerCase(),
          status: item.status === "Published" ? "Published" : "Draft",
        }));

      setMenuItems(fetchedMenu);
      setError("");
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again later.");
      toast.error("Failed to load menu items");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (menuItemId, newStatus) => {
    if (!menuItemId) {
      console.warn("No ID provided for status change");
      toast.error("This menu item doesn't have a valid ID. Please refresh the page and try again.");
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
      toast.success(`Item status updated to ${newStatus}`);
    } catch (err) {
      console.error(`Failed to change status to ${newStatus}`, err);
      console.error("Error response:", err.response?.data);
      toast.error(`Failed to update item status. Please try again. Error: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("restaurantName");
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setEditFormData({
      name: item.name || "",
      price: item.price || "",
      category: item.category || "Starter",
      cuisine: item.cuisine || "Indian",
      prepTime: item.prepTime || item.timeToPrepare || "",
      ingredients: Array.isArray(item.ingredients) ? item.ingredients.join(", ") : item.ingredients || "",
      description: item.description || "",
      status: item.status || "Published",
      type: item.type || "veg",
      discount: item.discount || ""
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      
      // Prepare the data for API call
      const updatedData = {
        ...editFormData,
        // Convert comma-separated ingredients back to array
        ingredients: editFormData.ingredients.split(',').map(i => i.trim()).filter(i => i)
      };

      // Call the API to update the menu item
      const response = await updateMenuItem(editingItem._id, updatedData, token);

      // Update the local state with the updated item
      setMenuItems(prev =>
        prev.map(item =>
          item._id === editingItem._id
            ? { ...item, ...response.menuItem }
            : item
        )
      );

      setShowEditModal(false);
      setEditingItem(null);
      toast.success("Menu item updated successfully!");
    } catch (err) {
      console.error("Error updating menu item:", err);
      toast.error(`Failed to update menu item: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDelete = async (menuItemId) => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await deleteMenuItem(menuItemId, token);

      setMenuItems(prev => prev.filter(item => item._id !== menuItemId));
      toast.success("Menu item deleted successfully!");
    } catch (err) {
      console.error("Error deleting menu item:", err);
      toast.error(`Failed to delete menu item: ${err.response?.data?.message || err.message}`);
    }
  };

  const filteredItems = menuItems.filter(item => {
    if (filter === "All") return true;
    return item.status === filter;
  });

  if (loading) return <div className="loading">Loading menu...</div>;
  if (error) return <div className="error">{error}</div>;

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

        <div className="menu-grid grid-3">
          {filteredItems.length === 0 ? (
            <p className="no-items-text">No items found for this filter.</p>
          ) : (
            filteredItems.map(item => (
              <div key={item._id} className="card">
                <img src={item.image} alt={item.name} onError={(e) => {
                  e.target.src = "/placeholder-food.jpg";
                }} />
                <div className="card-content">
                  <div className="menu-title-price">
                    <span className={`veg-indicator ${item.type?.toLowerCase() || "veg"}`}></span>
                    <h3 className="card-title">{item.name}</h3>
                    <span className="card-price">₹{item.price}</span>
                  </div>

                  <p className="card-description">
                    {item.description?.length > 80
                      ? <>
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
                      <button 
                        className="btn-global btn-edit"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn-global btn-delete"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </button>
                      {item.status === "Published" ? (
                        <button className="btn-global" onClick={() => handleStatusChange(item._id, "Draft")}>
                          Draft
                        </button>
                      ) : (
                        <button className="btn-global" onClick={() => handleStatusChange(item._id, "Published")}>
                          Publish
                      </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Edit Modal */}
        {showEditModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Edit Menu Item</h3>
                <button onClick={() => setShowEditModal(false)} className="modal-close">×</button>
              </div>
              <form onSubmit={handleEditSubmit} className="modal-body">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    value={editFormData.price}
                    onChange={(e) => setEditFormData({...editFormData, price: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({...editFormData, category: e.target.value})}
                  >
                    <option value="Starter">Starter</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Drinks">Drinks</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Cuisine</label>
                  <select
                    value={editFormData.cuisine}
                    onChange={(e) => setEditFormData({...editFormData, cuisine: e.target.value})}
                  >
                    <option value="Indian">Indian</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Italian">Italian</option>
                    <option value="Mexican">Mexican</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Preparation Time (mins)</label>
                  <input
                    type="number"
                    value={editFormData.prepTime}
                    onChange={(e) => setEditFormData({...editFormData, prepTime: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Ingredients (comma separated)</label>
                  <input
                    type="text"
                    value={editFormData.ingredients}
                    onChange={(e) => setEditFormData({...editFormData, ingredients: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select
                    value={editFormData.type}
                    onChange={(e) => setEditFormData({...editFormData, type: e.target.value})}
                  >
                    <option value="veg">Veg</option>
                    <option value="non-veg">Non-Veg</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Discount (%)</label>
                  <input
                    type="number"
                    value={editFormData.discount}
                    onChange={(e) => setEditFormData({...editFormData, discount: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn-global">Save Changes</button>
                  <button type="button" onClick={() => setShowEditModal(false)} className="btn-global btn-cancel">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <footer className="footer">
        <Footer />
      </footer>
    </>
  );
};

export default ViewMenu;

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
// import toast from "react-hot-toast";
// import { getMyRestaurant, getMenuByRestaurant ,updateMenuStatus } from "../services/apiService.js";
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
//   const [editingItem, setEditingItem] = useState(null);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editFormData, setEditFormData] = useState({
//     name: "",
//     price: "",
//     category: "",
//     cuisine: "",
//     prepTime: "",
//     ingredients: "",
//     description: "",
//     status: "Published",
//     type: "veg",
//     discount: ""
//   });

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
//     } finally {
//       setLoading(false);
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
//                       <button 
//                         className="btn-global btn-edit"
//                         onClick={() => handleEdit(item)}
//                       >
//                         Edit
//                       </button>
//                       <button 
//                         className="btn-global btn-delete"
//                         onClick={() => handleDelete(item._id)}
//                       >
//                         Delete
//                       </button>
//                       {item.status === "Published" ? (
//                         <button className="btn-global" onClick={() => handleStatusChange(item._id, "Draft")}>
//                           Draft
//                         </button>
//                       ) : (
//                         <button className="btn-global" onClick={() => handleStatusChange(item._id, "Published")}>
//                           Publish
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         {/* Edit Modal */}
//         {showEditModal && (
//           <div className="modal-overlay">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h3>Edit Menu Item</h3>
//                 <button onClick={() => setShowEditModal(false)} className="modal-close">×</button>
//               </div>
//               <form onSubmit={handleEditSubmit} className="modal-body">
//                 <div className="form-group">
//                   <label>Name</label>
//                   <input
//                     type="text"
//                     value={editFormData.name}
//                     onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
//                     required
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Price</label>
//                   <input
//                     type="number"
//                     value={editFormData.price}
//                     onChange={(e) => setEditFormData({...editFormData, price: e.target.value})}
//                     required
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Category</label>
//                   <select
//                     value={editFormData.category}
//                     onChange={(e) => setEditFormData({...editFormData, category: e.target.value})}
//                   >
//                     <option value="Starter">Starter</option>
//                     <option value="Main Course">Main Course</option>
//                     <option value="Dessert">Dessert</option>
//                     <option value="Drinks">Drinks</option>
//                   </select>
//                 </div>
//                 <div className="form-group">
//                   <label>Cuisine</label>
//                   <select
//                     value={editFormData.cuisine}
//                     onChange={(e) => setEditFormData({...editFormData, cuisine: e.target.value})}
//                   >
//                     <option value="Indian">Indian</option>
//                     <option value="Japanese">Japanese</option>
//                     <option value="Chinese">Chinese</option>
//                     <option value="Italian">Italian</option>
//                     <option value="Mexican">Mexican</option>
//                   </select>
//                 </div>
//                 <div className="form-group">
//                   <label>Preparation Time (mins)</label>
//                   <input
//                     type="number"
//                     value={editFormData.prepTime}
//                     onChange={(e) => setEditFormData({...editFormData, prepTime: e.target.value})}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Ingredients (comma separated)</label>
//                   <input
//                     type="text"
//                     value={editFormData.ingredients}
//                     onChange={(e) => setEditFormData({...editFormData, ingredients: e.target.value})}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Description</label>
//                   <textarea
//                     value={editFormData.description}
//                     onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Type</label>
//                   <select
//                     value={editFormData.type}
//                     onChange={(e) => setEditFormData({...editFormData, type: e.target.value})}
//                   >
//                     <option value="veg">Veg</option>
//                     <option value="non-veg">Non-Veg</option>
//                   </select>
//                 </div>
//                 <div className="form-group">
//                   <label>Discount (%)</label>
//                   <input
//                     type="number"
//                     value={editFormData.discount}
//                     onChange={(e) => setEditFormData({...editFormData, discount: e.target.value})}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Status</label>
//                   <select
//                     value={editFormData.status}
//                     onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
//                   >
//                     <option value="Published">Published</option>
//                     <option value="Draft">Draft</option>
//                   </select>
//                 </div>
//                 <div className="modal-actions">
//                   <button type="submit" className="btn-global">Save Changes</button>
//                   <button type="button" onClick={() => setShowEditModal(false)} className="btn-global btn-cancel">
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>

//       <footer className="footer">
//         <Footer />
//       </footer>
//     </>
//   );
// };

// export default ViewMenu;