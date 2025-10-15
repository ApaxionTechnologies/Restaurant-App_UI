import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import * as bootstrap from "bootstrap";
import "../styles/global.css";
import "../styles/ViewMenu.css";
import toast from "react-hot-toast";
import {  X, Search } from "lucide-react";
import {
  getMyRestaurant,
  getMenuByRestaurant,
  updateMenuStatus,
  deleteMenuItem,
} from "../services/apiService.js";

import { useConfirmationModal } from "../context/ConfirmationModalContext";
const ViewMenu = () => {
  const navigate = useNavigate();
  const { restaurantId } = useParams();
  const location = useLocation();
  
  const [vegFilter, setVegFilter] = useState("All");

  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurantName, setRestaurantName] = useState(
    localStorage.getItem("restaurantName") || "My Restaurant"
  );
  const [adminEmail, setAdminEmail] = useState("");
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { showModal } = useConfirmationModal();
  const [scrolled, setScrolled] = useState(() => {
    return sessionStorage.getItem("headerScrolled") === "true";
  });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    const tooltips = [...tooltipTriggerList].map(
      (el) => new bootstrap.Tooltip(el)
    );
    return () => tooltips.forEach((tt) => tt.dispose());
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
      setMenuItems((prevItems) =>
        prevItems.map((item) =>
          item._id === updatedItem._id ? updatedItem : item
        )
      );
    }

    if (newItem) {
      setMenuItems((prevItems) => [...prevItems, newItem]);
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
        getMenuByRestaurant(idToUse),
      ]);

      setRestaurant(restaurantRes.restaurant);
      if (restaurantRes.restaurant?._id)
        localStorage.setItem("restaurantId", restaurantRes.restaurant._id);

      const fetchedMenu = (menuRes.menu || [])
        .filter((item) => item._id)
        .map((item) => ({
          ...item,
          statusNormalized: (item.status || "draft").toLowerCase(),
          status: item.status === "Published" ? "Published" : "Draft",
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
      onConfirm: () => handleDeleteConfirm(menuItemId),
    });
  };

  const handleDeleteConfirm = async (menuItemId) => {
    try {
      await deleteMenuItem(menuItemId);
      setMenuItems((prev) => prev.filter((m) => m._id !== menuItemId));
      toast.success("Item deleted successfully!");
    } catch (err) {
      toast.error(`Delete failed: ${err.message}`);
    }
  };

  const handleStatusChange = async (menuItemId, newStatus) => {
    if (!menuItemId) {
      toast.error(
        "This menu item doesn't have a valid ID. Please refresh and try again."
      );
      return;
    }
    try {
      await updateMenuStatus(menuItemId, newStatus);

      setMenuItems((prev) =>
        prev.map((item) =>
          item._id === menuItemId
            ? {
                ...item,
                status: newStatus,
                statusNormalized: newStatus.toLowerCase(),
              }
            : item
        )
      );

      toast.success(`Item moved to ${newStatus} successfully!`);
    } catch (err) {
      console.error("Failed to change status:", err);
      toast.error(
        `Failed to update item status. ${
          err.response?.data?.message || err.message
        }`
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("restaurantName");
    localStorage.removeItem("token");
    localStorage.removeItem("restaurantId");
    navigate("/");
  };

  const handleEdit = (item) => {
    navigate(`/edit-menu/${item._id}`, { state: { itemToEdit: item } });
  };

  const handleAddMenuItem = () => {
    navigate("/add-menu");
  };

  const searchItems = useMemo(() => {
    if (!searchQuery) return menuItems;

    const query = searchQuery.toLowerCase();
    return menuItems.filter((item) => {
      return (
        item.name?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.cuisine?.toLowerCase().includes(query) ||
        item.price?.toString().includes(query) ||
        item.type?.toLowerCase().includes(query) ||
        item.prepTime?.toLowerCase().includes(query) ||
        item.timeToPrepare?.toLowerCase().includes(query)
      );
    });
  }, [menuItems, searchQuery]);

const filteredItems = searchItems
  .filter((item) => {
    if (filter === "Published") return item.status === "Published";
    if (filter === "Draft") return item.status === "Draft";
    return true;
  })
  .filter((item) => {
    if (vegFilter === "Veg") return item.type?.toLowerCase() === "veg";
    if (vegFilter === "Non-Veg") return item.type?.toLowerCase() === "non-veg";
    return true;
  });

  if (loading) return <div className="loading">Loading menu...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <div className="view-menu-page">
        <div className={`view-menu-header ${scrolled ? "scrolled" : ""}`}>
          <div className="d-flex gap-2">
            {["All", "Published", "Draft"].map((option) => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={`btn-global filter-btn ${
                  filter === option ? "active" : ""
                } ${scrolled ? "btn-scrolled" : ""}`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="search-filter-wrapper">
  <div className="search-container">
    <Search size={18} className="search-icon" />
    <input
      type="text"
      placeholder="Search by name, price, cuisine, Veg, Non, Non-Veg type..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="search-input"
    />
    {searchQuery && (
      <button
        className="btn-clear-search"
        onClick={() => setSearchQuery("")}
        aria-label="Clear search"
      >
        <X size={16} />
      </button>
    )}
  </div>

 {/* <div className={`veg-toggle ${vegFilter === "Non-Veg" ? "non-veg" : ""}`}>
    {[ "Veg"].map((type) => (
      <button
        key={type}
        className={`veg-toggle-btn ${vegFilter === type ? "active" : ""}`}
        onClick={() => setVegFilter(type)}
      >
        {type}
      </button>
    ))}

    {[ "Non-Veg"].map((type) => (
      <button
        key={type}
        className={`non-veg-toggle-btn ${vegFilter === type ? "active" : ""}`}
        onClick={() => setVegFilter(type)}
      >
        {type}
      </button>
    ))}
  </div> */}

  <div className="veg-toggle-container">
  <label className="veg-switch">
    <input
      type="checkbox"
      checked={vegFilter === "Veg"}
      onChange={() => setVegFilter(vegFilter === "Veg" ? "Non-Veg" : "Veg")}
    />
    <span className="slider"></span>
  </label>
  <span className={`veg-status ${vegFilter === "Veg" ? "veg" : "non-veg"}`}>
    {vegFilter === "Veg" ? "Veg" : "Non-Veg"}
  </span>
</div>
</div>
        </div>

        <div className="menu-grid">
          {filteredItems.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🍽️</div>

              <p>
                {searchQuery
                  ? `No items match your search for "${searchQuery}"`
                  : `No ${
                      filter === "All" ? "" : filter.toLowerCase() + " "
                    }items available`}
              </p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div key={item._id} className="card">
                <div className="card-img-wrapper">
                  <img
                    src={item.image}
                    alt={item.name}
                    
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
                        item.type?.toLowerCase() === "non-veg"
                          ? "non-veg"
                          : "veg"
                      }`}
                    ></span>

                    <h3 className="card-title">{item.name}</h3>
                    <span className="card-price">₹{item.price}</span>
                  </div>

                  <p className="card-description">
                    {item.description?.length > 80 ? (
                      <>
                        {item.description.slice(0, 80)}...
                        <span
                          className="read-more"
                          data-bs-toggle="tooltip"
                          title={item.description}
                        >
                          Read More
                        </span>
                      </>
                    ) : (
                      item.description
                    )}
                  </p>

                  <div className="cuisine-time">
                    <span>{item.cuisine || "Generic"}</span> •
                    <span>
                      ⏱️ {item.prepTime || item.timeToPrepare || "—"} mins
                    </span>
                  </div>

                  <div className="button-row">
                    <button
                      className="btn-global btn-edit"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>

                    {item.status === "Published" ? (
                      <button
                        className="btn-global btn-status"
                        onClick={() => handleStatusChange(item._id, "Draft")}
                      >
                        Draft
                      </button>
                    ) : (
                      <button
                        className="btn-global btn-status"
                        onClick={() =>
                          handleStatusChange(item._id, "Published")
                        }
                      >
                        Publish
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default ViewMenu;
