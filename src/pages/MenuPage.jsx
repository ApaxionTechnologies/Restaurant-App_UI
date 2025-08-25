
import React, { useEffect, useState } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useRestaurant } from "../context/RestaurantContext";
import ViewMenuNavbar from "../components/ViewMenuNavbar";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import {
  FaHeart,
  FaRegHeart,
  FaStar,
  FaRegStar,
  FaList,
  FaTh,
  FaThLarge,
  FaPlus,
  FaMinus,
} from "react-icons/fa";
import "../styles/global.css";
import "../styles/MenuCard.css";


export default function MenuPage() {
  const navigate = useNavigate();

  const { cart, addToCart, updateQty } = useCart();
  const { restaurant, setRestaurant, setTable } = useRestaurant();
  const [searchParams] = useSearchParams();const { restaurantId: restaurantIdFromParams } = useParams();

const restaurantIdFromQuery =
  searchParams.get("restaurantId") ||
  searchParams.get("restaurant") ||
  searchParams.get("id") ||
  searchParams.get("rest") ||
  null;

const restaurantId = restaurantIdFromParams || restaurantIdFromQuery;
const table = searchParams.get("table") || searchParams.get("tableNumber") || localStorage.getItem("tableNumber") || "1";
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
    finalTable = localStorage.getItem("tableNumber") || "1";
  }

  if (!finalRestaurantId) {
    console.error("Restaurant ID missing! Redirecting to scan.");
    navigate("/scan");
    return;
  }

  setRestaurant(finalRestaurantId);
  setTable(finalTable);
  localStorage.setItem("restaurantId", finalRestaurantId);
  localStorage.setItem("tableNumber", finalTable);
}, [restaurantId, table, navigate, setRestaurant, setTable]);


useEffect(() => {
  if (!restaurantId) return;


  const fetchMenu = async () => {
    
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5001/api/menu/${restaurantId}`);
      console.log("Fetched Menu Items:", res.data); 
      const items = Array.isArray(res.data) ? res.data : [];
      setDishes(items);
      setMenuMap(buildMenuMap(items));
      console.log("menuMap after build:", buildMenuMap(items)); 
    } catch (err) {
      console.error(err);
      setMenuMap(defaultMenu);
    } finally {
      setLoading(false);
    }
  };

  fetchMenu();
}, [restaurantId]);   

useEffect(() => {
  console.log("menuMap (changed):", menuMap);
}, [menuMap]);


const buildMenuMap = (items) => {
  const map = {};
  if (!Array.isArray(items)) return map;
  items.forEach((it) => {
    let cat = (it.category || "Uncategorized").trim();
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

  const getQty = (name) => {
    const found = cart.find((item) => item.name === name);
    return found ? found.qty : 0;
  };

const categories = ["All", ...Object.keys(menuMap)];


  return (
    <>

    
      <ViewMenuNavbar />
      <div className="page-center fade-in">
        <div style={{ maxWidth: "1000px", width: "100%", padding: "0.5rem 1rem", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>📋 Here's the Menu</h2>

          <input
            type="text"
            placeholder="🔍 Search dishes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "0.4rem 0.8rem",
              fontSize: "0.9rem",
              margin: "0.5rem 0 1.5rem",
              width: "60%",
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
              border: "1px solid #ddd",
              borderRadius: "50px",
              outline: "none",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
              transition: "all 0.3s ease",
            }}
            onFocus={(e) => (e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.3)")}
            onBlur={(e) => (e.target.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.05)")}
          />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ textAlign: "left", flexGrow: 1 }}>
              {categories.map((category) => {
                const count = category === "All" ? Object.values(menuMap).flat().length : (menuMap[category]?.length || 0);
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    style={{
                      margin: "0.3rem",
                      padding: "0.4rem 0.8rem",
                      borderRadius: "20px",
                      border: selectedCategory === category ? "2px solid #3b82f6" : "1px solid #ccc",
                      background: selectedCategory === category ? "#eff6ff" : "#fff",
                      color: selectedCategory === category ? "#1d4ed8" : "#333",
                      fontWeight: "bold",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {category} ({count})
                  </button>
                );
              })}
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginBottom: "10px" }}>
              <div className="layout-toggle" role="toolbar" aria-label="Layout toggle">
                <button onClick={() => setLayout("list")} className={layout === "list" ? "active" : ""} title="List View"><FaList /></button>
                <button onClick={() => setLayout("grid-2")} className={layout === "grid-2" ? "active" : ""} title="2 Columns"><FaTh /></button>
                <button onClick={() => setLayout("grid-3")} className={layout === "grid-3" ? "active" : ""} title="3 Columns"><FaThLarge /></button>
              </div>
            </div>
          </div>

          {loading && <p style={{ textAlign: "center" }}>Loading menu...</p>}

          {Object.entries(menuMap)
            .filter(([category]) => selectedCategory === "All" || selectedCategory === category)
            .map(([category, items]) => {
              const filteredDishes = items.filter((dish) => dish.name.toLowerCase().includes(search.toLowerCase()));

              console.log('Filtered Dishes:', filteredDishes);

              if (filteredDishes.length === 0) return null;

              return (
                <div key={category} style={{ marginBottom: "2rem" }}>
                  <h3 style={{ marginBottom: "1rem" }}>🍽️ {category}</h3>
                  <div className={`menu-grid ${layout}`}>
                    {filteredDishes.map((item, index) => {
                      const qty = getQty(item.name);
                    const imgSrc = item.image
  ? (item.image.startsWith("http")
      ? item.image
      : `http://localhost:5001/uploads/${item.image}`)
  : "";
          return (
                        <div className="menu-card" key={item._id || index} data-aos="fade-up">
                          {imgSrc && <img src={imgSrc} alt={item.name} />}
                          <div className="menu-card-content">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <h3>{item.name}</h3>
                              <p className="price">₹{item.price}</p>
                              <span onClick={() => toggleFavorite(item.name)} className="heart-icon" style={{ cursor: "pointer" }}>
                                {favorites[item.name] ? <FaHeart color="#ef4444" /> : <FaRegHeart />}
                              </span>
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem" }}>
                             
                              <div className="menu-stars" aria-hidden>
                                {[...Array(5)].map((_, i) => i < (item.rating || 4) ? <FaStar key={i} color="#fbbf24" size={14} /> : <FaRegStar key={i} color="#fbbf24" size={14} />)}
                              </div>
                            </div>

                            <div className="menu-details">
                              <span>{item.cuisine || "🍴"}</span>
                              <span>•</span>
                              <span>⏱️ {item.prepTime || item.timeToPrepare || "—"}</span>
                            </div>

                            {qty === 0 ? (
                              <button className="add-btn" onClick={() => addToCart(item)}>Add</button>
                            ) : (
                              <div className="qty-controls">
                                <button className="qty-btn" onClick={() => updateQty(item.name, -1)}><FaMinus /></button>
                                <div className="qty-display">{qty}</div>
                                <button className="qty-btn" onClick={() => updateQty(item.name, 1)}><FaPlus /></button>
                              </div>
                            )}
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
    </>
  );
}