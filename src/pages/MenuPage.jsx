import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, updateQty } from "../store/CartSlice";
import { useRestaurant } from "../context/RestaurantContext";
import ViewMenuNavbar from "../components/ViewMenuNavbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import * as bootstrap from 'bootstrap';
import AOS from "aos";
import "aos/dist/aos.css";
import { getMenuByRestaurant } from "../services/apiService";
import {
  FaHeart,
  FaRegHeart,
  FaList,
  FaTh,
  FaThLarge,
  FaPlus,
  FaMinus,
  FaTimes,
} from "react-icons/fa";
import "../styles/global.css";
import "../styles/MenuCard.css";
import CartDrawer from "../components/CartDrawer";

export default function MenuPage() {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.items || []); 
  const dispatch = useDispatch();
  const { restaurant, setRestaurant, setTable } = useRestaurant();
  const [searchParams] = useSearchParams();
  const { restaurantId: restaurantIdFromParams } = useParams();

  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [expanded, setExpanded] = useState({});
  const tooltipRefs = useRef(new Map());
  const touchTimerRef = useRef(null);

  const restaurantIdFromQuery =
    searchParams.get("restaurantId") ||
    searchParams.get("restaurant") ||
    searchParams.get("id") ||
    searchParams.get("rest") ||
    null;

  const restaurantId = restaurantIdFromParams || restaurantIdFromQuery;

  const table =
    searchParams.get("table") ||
    searchParams.get("tableNumber") ||
    null;

  const [search, setSearch] = useState("");
  const [menuMap, setMenuMap] = useState({});
  const [favorites, setFavorites] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [layout, setLayout] = useState("grid-3");
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(false);

  const defaultMenu = {
    Starters: [],
    Mains: [],
    Desserts: [],
    Beverages: [],
  };


  useEffect(() => {
    let finalRestaurantId = restaurantId;
    let finalTable = table;

    if (!finalRestaurantId) {
      finalRestaurantId = localStorage.getItem("restaurantId");
    }

    if (!finalTable) {
      finalTable = null;
    }

    if (!finalRestaurantId) {
      console.error("Restaurant ID missing! Redirecting to scan.");
      navigate("/scan");
      return;
    }

    const ridForContext =
      typeof finalRestaurantId === "object"
        ? finalRestaurantId._id || finalRestaurantId.id || ""
        : finalRestaurantId;

    if (setRestaurant) setRestaurant(ridForContext);
    if (setTable) setTable(finalTable);

    if (ridForContext) localStorage.setItem("restaurantId", ridForContext);
    if (finalTable) localStorage.setItem("tableNumber", finalTable);
  }, [restaurantId, table, navigate, setRestaurant, setTable]);

  // Fetch menu
  useEffect(() => {
    if (!restaurantId) return;

    const fetchMenu = async () => {
      setLoading(true);
      try {
        const res = await getMenuByRestaurant(restaurantId);
      
        console.log("API response:", res);
        if (res.restaurant && setRestaurant) {
          setRestaurant(res.restaurant);
          const rid = res.restaurant._id || res.restaurant.id || restaurantId;
          if (rid) localStorage.setItem("restaurantId", rid);
        }

        const items = Array.isArray(res.menu)
          ? res.menu
              .filter((item) => {
                const status = (item.status || "").toString().trim().toLowerCase();
               
                return status === "published";
              })
              .map((item) => ({
                ...item,
                type: (item.type || "veg").toLowerCase(),
              }))
          : [];

        setDishes(items);
        setMenuMap(buildMenuMap(items));
      } catch (err) {
        console.error(err);
        setMenuMap(defaultMenu);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
   
  }, [restaurantId]);

  const buildMenuMap = (items) => {
    const map = {};
    if (!Array.isArray(items)) return map;
    items.forEach((it) => {
      let cat = (it.category || "Uncategorized").toString().trim();
      if (cat.length === 0) cat = "Uncategorized";
      cat = cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
      if (!map[cat]) map[cat] = [];
      map[cat].push(it);
    });
    return map;
  };

  
  useEffect(() => {
    AOS.init({ duration: 600, once: true });
  }, []);

  const toggleFavorite = (name) => {
    setFavorites((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const getQty = (menuItemId) => {
    const found = (cart || []).find((item) => item.menuItemId === menuItemId);
    return found ? found.qty : 0;
  };

  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isCategoryDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCategoryDrawerOpen]);

  const categories = ["All", ...Object.keys(menuMap)];

 
  useEffect(() => {
    const initializeTooltips = () => {
 
      tooltipRefs.current.forEach((tooltip) => {
        try {
          tooltip.dispose();
        } catch (e) {
          
        }
      });
      tooltipRefs.current.clear();

      const tooltipElements = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      tooltipElements.forEach((element) => {
     
        const tooltip = new bootstrap.Tooltip(element, {
          trigger: 'hover',
          placement: 'top',
          customClass: 'custom-tooltip',
          boundary: 'window',
        });
        tooltipRefs.current.set(element, tooltip);
      });
    };

    initializeTooltips();

    return () => {
      tooltipRefs.current.forEach((tooltip) => {
        try {
          tooltip.dispose();
        } catch (e) {
      
        }
      });
      tooltipRefs.current.clear();
    };
  }, [selectedCategory, layout, dishes]);


  useEffect(() => {
    const handleTouchStart = (e) => {
      const target = e.target;
      const readMoreElement = target.classList.contains('read-more')
        ? target
        : target.closest('.read-more');

      if (readMoreElement) {
        e.preventDefault();
        e.stopPropagation();

        const tooltip = bootstrap.Tooltip.getInstance(readMoreElement);

        if (tooltip) {
          if (touchTimerRef.current) {
            clearTimeout(touchTimerRef.current);
          }

          tooltip.show();

          touchTimerRef.current = setTimeout(() => {
            try {
              tooltip.hide();
            } catch (err) {
              
            }
          }, 3000);
        }
      }
    };

    if (isMobile) {
      document.addEventListener('touchstart', handleTouchStart, { passive: false });
    }

    return () => {
      if (touchTimerRef.current) {
        clearTimeout(touchTimerRef.current);
      }
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, [isMobile]);


  const handleAddToCart = (item) => {
    dispatch(addToCart({
      name: item.name,
      menuItemId: item._id,
      price: item.price,
      qty: 1
    }));
  };

  const handleUpdateQty = (item, change) => {
    dispatch(updateQty({ menuItemId: item._id, change }));
  };

  
  const imageUrl = (img) => {
    if (!img) return "";
    if (typeof img !== "string") return "";
    if (img.startsWith("http")) return img;
    
    return `http://localhost:5001/uploads/${img.replace(/^\/+/, "")}`;
  };

  return (
    <>
      <ViewMenuNavbar />
      <div className={restaurant?.image ? "restaurant-hero" : "default-cover"}>
        {restaurant?.image ? (
          <>
            <img
              src={restaurant.image && restaurant.image.startsWith("http") ? restaurant.image : imageUrl(restaurant.image)}
              alt={restaurant?.name || "Restaurant"}
            />
            <div className="restaurant-overlay">
              <h1>{restaurant?.name || "Loading..."}</h1>
              <p>{restaurant?.tagline || ""}</p>
            </div>
          </>
        ) : (
          <div className="overlay-text">
            <h1>{restaurant?.name || "Restaurant"}</h1>
            <p>{restaurant?.tagline || ""}</p>
          </div>
        )}
      </div>

      <div className="page-center fade-in">
        <div style={{ maxWidth: "1000px", width: "100%", padding: "2.5rem 1rem", margin: "0 auto" }}>

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
            gap: "1rem",
            flexWrap: "wrap",
          }}>
            <input
              type="text"
              placeholder="🔍 Search dishes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: "0.5rem 1rem",
                fontSize: "1rem",
                width: "60%",
                border: "1px solid #ddd",
                borderRadius: "50px",
                outline: "none",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
                transition: "all 0.3s ease",
                flexGrow: 1,
                maxWidth: "400px",
              }}
              onFocus={(e) => (e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.3)")}
              onBlur={(e) => (e.target.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.05)")}
            />
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}>
              {isMobile && (
                <button
                  onClick={() => setIsCategoryDrawerOpen(true)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    padding: "0.5rem 1rem",
                    border: "1px solid #ccc",
                    borderRadius: "25px",
                    background: "#fff",
                    fontWeight: "bold",
                    fontSize: "0.85rem",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {selectedCategory || "All"} ☰
                </button>
              )}

              <div className="layout-toggle" role="toolbar" aria-label="Layout toggle">
                <button
                  onClick={() => setLayout("list")}
                  className={layout === "list" ? "active" : ""}
                  title="List View"
                >
                  <FaList />
                </button>
                <button
                  onClick={() => setLayout("grid-2")}
                  className={layout === "grid-2" ? "active" : ""}
                  title="2 Columns"
                >
                  <FaTh />
                </button>
                <button
                  onClick={() => setLayout("grid-3")}
                  className={layout === "grid-3" ? "active" : ""}
                  title="3 Columns"
                >
                  <FaThLarge />
                </button>
              </div>
            </div>
          </div>

          {!isMobile && (
            <div style={{
              textAlign: "left",
              marginBottom: "1rem",
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}>
              {categories.map((category) => {
                const count =
                  category === "All"
                    ? Object.values(menuMap).flat().length
                    : (menuMap[category]?.length || 0);
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "25px",
                      border:
                        selectedCategory === category
                          ? "1px solid #3e2723"
                          : "1px solid #ccc",
                      background:
                        selectedCategory === category ? "#3e2723" : "#fff",
                      color: selectedCategory === category ? "#fff" : "#333",
                      fontWeight: "bold",
                      cursor: "pointer",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      transition: "all 0.2s ease",
                      whiteSpace: "nowrap",
                    }}
                    onMouseOver={(e) => {
                      if (selectedCategory !== category) {
                        e.target.style.background = "#f5f5f5";
                      }
                    }}
                    onMouseOut={(e) => {
                      if (selectedCategory !== category) {
                        e.target.style.background = "#fff";
                      }
                    }}
                  >
                    {category} ({count})
                  </button>
                );
              })}
            </div>
          )}

          {loading && <p style={{ textAlign: "center" }}>Loading menu...</p>}

          {Object.entries(menuMap)
            .filter(([category]) => selectedCategory === "All" || selectedCategory === category)
            .map(([category, items]) => {
              const filteredDishes = items.filter((dish) => dish.name.toLowerCase().includes(search.toLowerCase()));

              if (filteredDishes.length === 0) return null;

              return (
                <div key={category} style={{ marginBottom: "2rem" }}>
                  <h3 style={{ marginBottom: "1rem" }}>🍽 {category}</h3>
                  <div className={`menu-grid ${layout}`}>
                    {filteredDishes.map((item, index) => {
                      const qty = getQty(item._id || item.id);
                      const imgSrc = item.image ? imageUrl(item.image) : "";

                      return (
                        <div className="menu-card" key={item._id || index} data-aos="fade-up">
                          <img src={imgSrc} alt={item.name} />
                          <div className="menu-card-content">
                            <div className="menu-title-price">
                              <span className={`veg-indicator ${item.type?.toLowerCase() || "veg"}`}></span>

                              <h3>{item.name}</h3>
                              <p className="price">₹{item.price ?? "—"}</p>

                              <span
                                onClick={() => toggleFavorite(item.name)}
                                className="heart-icon"
                                style={{ cursor: "pointer" }}
                              >
                                {favorites[item.name] ? <FaHeart color="#ef4444" /> : <FaRegHeart />}
                              </span>
                            </div>

                            <p className="menu-description">
                              {item.description?.length > 80
                                ? (
                                  <>
                                    {item.description.slice(0, 80)}...
                                    <span
                                      className="read-more"
                                      data-bs-toggle="tooltip"
                                      title={item.description}
                                      data-bs-custom-class="custom-tooltip"
                                    >
                                      Read More
                                    </span>
                                  </>
                                )
                                : (item.description || "")
                              }
                            </p>

                            <div className="card-footer">
                              {table ? (
                                <div className="cuisine-time" style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                                  <div style={{ display: "flex", gap: "0.5rem" }}>
                                    <span>{item.cuisine || "🍴"}</span>
                                    <span>•</span>
                                    <span>⏱ {item.prepTime || item.timeToPrepare || "—"}</span>
                                  </div>

                                  <div className="qty-controls" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <button
                                      className="qty-btn"
                                      onClick={() => qty > 0 && handleUpdateQty(item, -1)}
                                      disabled={qty === 0}
                                    >
                                      <FaMinus />
                                    </button>

<div className="qty-display">{qty}</div>

                                    <button
                                      className="qty-btn"
                                      onClick={() => {
                                        if (qty === 0) {
                                          handleAddToCart(item);
                                        } else {
                                          handleUpdateQty(item, 1);
                                        }
                                      }}
                                    >
                                      <FaPlus />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="cuisine-time" style={{ display: "flex", justifyContent: "flex-end", width: "100%", gap: "0.5rem" }}>
                                  <span>{item.cuisine || "🍴"}</span>
                                  <span>•</span>
                                  <span>⏱ {item.prepTime || item.timeToPrepare || "—"}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {isMobile && isCategoryDrawerOpen && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              width: "65%",
              maxWidth: "220px",
              height: "auto",
              maxHeight: "80%",
              background: "#fff",
              boxShadow: "-2px 0 8px rgba(0,0,0,0.2)",
              zIndex: 9999,
              padding: "1rem",
              overflowY: "auto",
              borderRadius: "12px 0 0 12px",
              marginTop: "80px",
              marginRight: "10px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "600" }}>Categories</h3>
              <button
                onClick={() => setIsCategoryDrawerOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                  color: "#666"
                }}
              >
                <FaTimes />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {categories.map((category) => {
                const count =
                  category === "All"
                    ? Object.values(menuMap).flat().length
                    : (menuMap[category]?.length || 0);
                return (
                  <div
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsCategoryDrawerOpen(false);
                    }}
                    style={{
                      padding: "0.8rem 1rem",
                      cursor: "pointer",
                      fontWeight: selectedCategory === category ? "600" : "normal",
                      background:
                        selectedCategory === category ? "#f0f0f0" : "transparent",
                      color: selectedCategory === category ? "#3e2723" : "#333",
                      borderRadius: "8px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <span>{category}</span>
                    <span style={{
                      fontSize: "0.8rem",
                      background: selectedCategory === category ? "#3e2723" : "#f0f0f0",
                      color: selectedCategory === category ? "#fff" : "#666",
                      padding: "0.2rem 0.6rem",
                      borderRadius: "12px",
                      fontWeight: "500"
                    }}>
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.3)",
              zIndex: 9998,
            }}
            onClick={() => setIsCategoryDrawerOpen(false)}
          />
          <CartDrawer />
        </>
      )}
    </>
  );
}
