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






import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import HomeHeader from "../components/HomeHeader.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import * as bootstrap from 'bootstrap';
import "../styles/global.css";
import "../styles/ViewMenu.css";

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

  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltips = [...tooltipTriggerList].map(el => new bootstrap.Tooltip(el));
    return () => tooltips.forEach(tooltip => tooltip.dispose());
  }, [menuItems]);

  useEffect(() => {
    const storedEmail = localStorage.getItem("adminEmail");
    if (!storedEmail) navigate("/");
    else setAdminEmail(storedEmail);
  }, [navigate]);

  useEffect(() => { if (restaurantId) fetchData(); }, [restaurantId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const [restaurantRes, menuRes] = await Promise.all([
        axios.get("http://localhost:5001/api/restaurants/me", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`http://localhost:5001/api/menu/${restaurantId}`)
      ]);

      setRestaurant(restaurantRes.data.restaurant);
      const fetchedMenu = (menuRes.data.menu || [])
        .filter(item => !!item._id)
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
    } finally { setLoading(false); }
  };

  const handleStatusChange = async (menuItemId, newStatus) => {
    if (!menuItemId) return alert("Menu item ID missing. Refresh the page.");
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5001/api/menu/${menuItemId}/status`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });

      setMenuItems(prev => prev.map(item =>
        item._id === menuItemId ? { ...item, status: newStatus, statusNormalized: newStatus.toLowerCase() } : item
      ));
    } catch (err) {
      console.error("Failed to change status:", err);
      alert(`Failed to update item status. Error: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("restaurantName");
    localStorage.removeItem("token");
    navigate("/");
  };

  const filteredItems = menuItems.filter(item => filter === "All" || item.status === filter);

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
            <button key={option} onClick={() => setFilter(option)} className={`btn-global filter-btn ${filter === option ? "active" : ""}`}>
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
                <img src={item.image} alt={item.name} onError={e => e.target.src = "/placeholder-food.jpg"} />
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
                          <span className="read-more" data-bs-toggle="tooltip" title={item.description}>Read More</span>
                        </>
                      : item.description
                    }
                  </p>

                  <div className="card-footer">
                    <button
  className="btn btn-sm btn-outline-primary"
  onClick={() => navigate(`/edit-menu/${item._id}`, { state: { itemToEdit: item } })}
>
  ✏️ Edit
</button>

                    <div className="cuisine-time">
                      <span>{item.cuisine || "🍴"}</span> • <span>⏱️ {item.prepTime || item.timeToPrepare || "—"}</span>
                    </div>
                    <div className="footer-actions">
                      {item.status === "Published"
                        ? <button className="btn-global" onClick={() => handleStatusChange(item._id, "Draft")}>Move to Draft</button>
                        : <button className="btn-global" onClick={() => handleStatusChange(item._id, "Published")}>Move to Published</button>
                      }
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Menu Item button */}
        <div className="mt-4">
          <button className="btn btn-success w-100" onClick={() => navigate("/add-menu")}>➕ Add Menu Item</button>
        </div>
      </div>

      <footer className="footer"><Footer /></footer>
    </>
  );
};

export default ViewMenu;


