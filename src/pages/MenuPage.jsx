import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartDrawer from "../components/CartDrawer";
import "../styles/global.css";
import "../styles/MenuCard.css";
import AOS from "aos";
import "aos/dist/aos.css";
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
import axios from "axios";
import ViewMenuNavbar from "../components/ViewMenuNavbar";

export default function MenuPage() {
  const [searchParams] = useSearchParams();
  const { cart, addToCart, updateQty, setTable } = useCart();
  const table = searchParams.get("table");
  const restaurantId = searchParams.get("restaurant");
  const [search, setSearch] = useState("");
  const [menu, setMenu] = useState({});
  const [favorites, setFavorites] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [layout, setLayout] = useState("grid-3");

  // defaultMenu (same as before)...
  const defaultMenu = {
    Starters: [
      {
        name: "Paneer Tikka",
        price: 180,
        rating: 4,
        image:
          "https://virtualtaste.com/wp-content/uploads/2024/08/Paneer-Tikka.jpg",
      },
      {
        name: "Chicken Lollipop",
        price: 220,
        rating: 5,
        image:
          "https://img.freepik.com/premium-photo/chicken-lollipop-schezwan-is-indian-chinese-appetizer-served-wooden-rustic-background_726363-1287.jpg?w=740",
      },
      {
        name: "Veg Spring Rolls",
        price: 120,
        rating: 4,
        image:
          "https://t3.ftcdn.net/jpg/00/89/95/08/360_F_89950874_LVsh6xkVvHEPZUqH60qZRkUq5VNfsba3.jpg",
      },
      {
        name: "Hakka Noodles",
        price: 150,
        rating: 4,
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHI6vHr6V8yiVoYNezh3ViC4ZcCD7U_0kuuw&s",
      },
      {
        name: "French Fries",
        price: 80,
        rating: 3,
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8ae8p5fO5SDVCFj-xEWTJaECdaCkzSx0jsA&s",
      },
      {
        name: "Onion Rings",
        price: 90,
        rating: 4,
        image:
          "https://t3.ftcdn.net/jpg/01/02/34/08/360_F_102340800_0b1c5d8f2e6f7a9c8b1c5d8f2e6f7a9c.jpg",
      },
    ],
    Mains: [
      {
        name: "Butter Chicken",
        price: 250,
        rating: 5,
        image:
          "https://media.istockphoto.com/photos/indian-butter-chicken-horizontal-photo-picture-id1170729895?k=6&m=1170729895&s=170667a&w=0&h=Ij9sXGKylXILqOvos4tWhydqdiWzqpGVMzSPHHTFY18=",
      },
      {
        name: "Garlic Naan",
        price: 40,
        rating: 4,
        image: "https://tse4.mm.bing.net/th/id/OIP.Ly1UPzZZ-_WOgd8OjQLRtwHaHa",
      },
      {
        name: "Shahi Paneer",
        price: 190,
        rating: 4,
        image:
          "https://recipesblob.oetker.in/assets/6c0ac2f3ce204d3d9bb1df9709fc06c9/1272x764/shahi-paneer.jpg",
      },
      {
        name: "Dal Makhani",
        price: 160,
        rating: 4,
        image:
          "https://media.istockphoto.com/id/1170374719/photo/dal-makhani-at-dark-background.jpg?s=612x612&w=0&k=20&c=49yLaUAE2apakVk2AAiRQimZd98WtSjIQ0hzCzWsmns=",
      },
      {
        name: "Veg Biryani",
        price: 200,
        rating: 4,
        image:
          "https://t4.ftcdn.net/jpg/05/70/58/65/360_F_570586537_TnIgWdCnaTYpgg9gsTyloz5bnvfCtdLl.jpg",
      },
      {
        name: "Paneer Butter Masala",
        price: 220,
        rating: 5,
        image:
          "https://www.vegrecipesofindia.com/wp-content/uploads/2020/01/paneer-butter-masala-5.jpg",
      },
    ],
    Desserts: [
      {
        name: "Gulab Jamun",
        price: 50,
        rating: 5,
        image: "https://www.bing.com/th/id/OIP.B32bansRI7RS3yfbUSEBNwHaHa",
      },
      {
        name: "Rasmalai",
        price: 70,
        rating: 5,
        image:
          "https://www.cookclickndevour.com/wp-content/uploads/2017/08/rasmalai-recipe-d.jpg",
      },
      {
        name: "Kheer",
        price: 60,
        rating: 4,
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgLss255oTBYWS4wQf-LdkQ8xuwIgosnGXrA&s",
      },
      {
        name: "Jalebi",
        price: 40,
        rating: 4,
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrON2qFBUb-7ad3yo-vW9GHoc0WKUmf28wWw&s",
      },
      {
        name: "Rasgulla",
        price: 50,
        rating: 5,
        image:
          "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAlAMBIgACEQEDEQH/...",
      },
      {
        name: "Kesar Pista Kulfi",
        price: 80,
        rating: 5,
        image:
          "https://thumbs.dreamstime.com/b/saffron-pistachio-coconut-rice-pudding-5946390.jpg",
      },
    ],
    Beverages: [
      {
        name: "Masala Chai",
        price: 30,
        rating: 4,
        image:
          "https://www.indianveggiedelight.com/wp-content/uploads/2022/10/masala-chai-6-768x1024.jpg",
      },
      {
        name: "Sweet Lassi",
        price: 60,
        rating: 5,
        image:
          "https://img.freepik.com/premium-photo/photo-laban-ayran-drink-isolated-flat-white-background_847439-69088.jpg",
      },
      {
        name: "Mango Lassi",
        price: 70,
        rating: 5,
        image:
          "https://www.anediblemosaic.com/wp-content/uploads//2021/09/mango-lassi-featured-image.jpg",
      },
      {
        name: "Coconut Water",
        price: 40,
        rating: 4,
        image:
          "https://t3.ftcdn.net/jpg/03/06/32/50/360_F_306325086_rRHmFccHKptOs8OjbqMg2Fbn4mWJJRZ0.jpg",
      },
      {
        name: "Thums Up",
        price: 30,
        rating: 4,
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTU5lsCxc6oqRzRG0VcxM_UdELu6uUycKFvEQ&s",
      },
      {
        name: "Coca Cola",
        price: 30,
        rating: 4,
        image:
          "https://media.istockphoto.com/id/157726102/photo/classical-coca-cola-bottle.jpg?s=612x612&w=0&k=20&c=7s9UKO9O8ti8ELyt0A6-Rek-WITTG2m9y6joO8ETx8s=",
      },
    ],
  };

  useEffect(() => {
    setTable(table);
    AOS.init({ duration: 600 });
  }, [table, setTable]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/api/menu/${restaurantId}`
        );
        const data = res.data;
        if (!data || Object.keys(data).length === 0) {
          setMenu(defaultMenu);
        } else {
          setMenu(data);
        }
      } catch (err) {
        console.error("Failed to fetch menu, loading default menu:", err);
        setMenu(defaultMenu);
      }
    };

    if (restaurantId) fetchMenu();
    else setMenu(defaultMenu);
  }, [restaurantId]);

  const toggleFavorite = (name) => {
    setFavorites((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const getQty = (name) => {
    const found = cart.find((item) => item.name === name);
    return found ? found.qty : 0;
  };

  return (
    <>
      <ViewMenuNavbar />
      <div className="page-center fade-in">
        <div
          style={{
            maxWidth: "1000px",
            width: "100%",
            padding: "0.5rem 1rem",
            margin: "0 auto",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            📋 Here's the Menu
          </h2>

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
            onFocus={(e) =>
              (e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.3)")
            }
            onBlur={(e) =>
              (e.target.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.05)")
            }
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <div style={{ textAlign: "left", flexGrow: 1 }}>
              {["All", ...Object.keys(menu)].map((category) => {
                const count =
                  category === "All"
                    ? Object.values(menu).flat().length
                    : menu[category]?.length || 0;

                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    style={{
                      margin: "0.3rem",
                      padding: "0.4rem 0.8rem",
                      borderRadius: "20px",
                      border:
                        selectedCategory === category
                          ? "2px solid #3b82f6"
                          : "1px solid #ccc",
                      background:
                        selectedCategory === category ? "#eff6ff" : "#fff",
                      color:
                        selectedCategory === category ? "#1d4ed8" : "#333",
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

          {Object.entries(menu)
            .filter(
              ([category]) => selectedCategory === "All" || selectedCategory === category
            )
            .map(([category, dishes]) => {
              const filteredDishes = dishes.filter((dish) =>
                dish.name.toLowerCase().includes(search.toLowerCase())
              );

              if (filteredDishes.length === 0) return null;

              return (
                <div key={category} style={{ marginBottom: "2rem" }}>
                  <h3 style={{ marginBottom: "1rem" }}>🍽️ {category}</h3>

                  <div className={`menu-grid ${layout}`}>
                    {filteredDishes.map((item, index) => {
                      const qty = getQty(item.name);
                      return (
                        <div className="menu-card" key={index} data-aos="fade-up">
                          <img src={item.image} alt={item.name} />
                          <div className="menu-card-content">
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <h3>{item.name}</h3>
                              <span
                                onClick={() => toggleFavorite(item.name)}
                                className="heart-icon"
                                style={{ cursor: "pointer" }}
                                aria-label={`favorite ${item.name}`}
                              >
                                {favorites[item.name] ? (
                                  <FaHeart color="#ef4444" />
                                ) : (
                                  <FaRegHeart />
                                )}
                              </span>
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem" }}>
                              <p className="price">₹{item.price}</p>

                              <div className="menu-stars" aria-hidden>
                                {[...Array(5)].map((_, i) =>
                                  i < (item.rating || 4) ? (
                                    <FaStar key={i} color="#fbbf24" size={14} />
                                  ) : (
                                    <FaRegStar key={i} color="#fbbf24" size={14} />
                                  )
                                )}
                              </div>
                            </div>

                            <div className="menu-details">
                              <span>🍴 Indian</span>
                              <span>•</span>
                              <span>⏱️ 30 mins</span>
                            </div>

                            {/* NEW: nicer add / qty UI */}
                            {qty === 0 ? (
                              <button
                                className="add-btn"
                                onClick={() => addToCart(item)}
                                aria-label={`Add ${item.name} to cart`}
                              >
                                <div class="action-row">
  <div class="qty-controls" data-qty="0">
    <button class="qty-btn">−</button>
    <span class="qty-number">0</span>
    <button class="qty-btn">+</button>
  </div>
</div>
                              </button>
                            ) : (
                              <div className="qty-controls" role="group" aria-label={`${item.name} quantity controls`}>
                                <button
                                  className="qty-btn"
                                  onClick={() => updateQty(item.name, -1)}
                                  aria-label={`Decrease ${item.name}`}
                                >
                                  <FaMinus />
                                </button>
                                <div className="qty-display">{qty}</div>
                                <button
                                  className="qty-btn"
                                  onClick={() => updateQty(item.name, 1)}
                                  aria-label={`Increase ${item.name}`}
                                >
                                  <FaPlus />
                                </button>
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
