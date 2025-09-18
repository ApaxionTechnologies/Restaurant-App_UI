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
import { Trash2, X } from "lucide-react";
import { getMyRestaurant, getMenuByRestaurant ,updateMenuStatus,deleteMenuItem,} from "../services/apiService.js";

import { useConfirmationModal } from "../context/ConfirmationModalContext";
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
  const { showModal } = useConfirmationModal();
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
      const idToUse = localStorage.getItem("restaurantId") || restaurantId;

      if (!idToUse) {
        setError("Restaurant ID not found");
        setLoading(false);
        return;
      }

      const [restaurantRes, menuRes] = await Promise.all([
        getMyRestaurant(),
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

 const handleDeleteClick = (menuItemId, menuItemName) => {
    showModal({
      title: "Delete Menu Item",
      message: `Are you sure you want to delete "${menuItemName}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: () => handleDeleteConfirm(menuItemId)
    });
  };

  const handleDeleteConfirm = async (menuItemId) => {
    try {
      await deleteMenuItem(menuItemId);
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
      await updateMenuStatus(menuItemId, newStatus);

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
    localStorage.removeItem("restaurantId")
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
 <button
                    className="btn-delete-circular"
                    onClick={() => handleDeleteClick(item._id, item.name)}
                    aria-label="Delete menu item"
                  >
                    <X size={16} />
                  </button>
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
                   <div className="cuisine-time mt-3">
    <span>{item.cuisine || "🍴"}</span> • ⏱️{item.prepTime || item.timeToPrepare || "—"}

  </div>
                  <div className="card-footer d-flex justify-content-between align-items-center">
  

  <div className="d-flex ">
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
            
            </div>
            ))
          )}
        </div>

      </div>

      <footer className="footer"><Footer /></footer>
    </>
  );
};

export default ViewMenu;
