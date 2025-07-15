import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartDrawer from "../components/CartDrawer";
import "../styles/global.css";
import "../styles/MenuCard.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaHeart, FaRegHeart, FaStar, FaRegStar } from "react-icons/fa";
//import Header from './components/Header'; // ✅ correct if in same folder as src/components

export default function MenuPage() {
  const [searchParams] = useSearchParams();
  const { cart, addToCart, updateQty, setTable } = useCart();
  const table = searchParams.get("table");
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    setTable(table);
    AOS.init({ duration: 600 });
  }, [table, setTable]);

  const toggleFavorite = (name) => {
    setFavorites((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const commonMenu = {
    Starters: [
      {
        name: "Paneer Tikka",
        price: 180,
        rating: 4,
        image: "https://virtualtaste.com/wp-content/uploads/2024/08/Paneer-Tikka.jpg",
      },
      {
        name: "Chicken Lollipop",
        price: 220,
        rating: 5,
        image:
          "https://img.freepik.com/premium-photo/chicken-lollipop-schezwan-is-indian-chinese-appetizer-served-wooden-rustic-background_726363-1287.jpg?w=740",
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
        image:
          "https://tse4.mm.bing.net/th/id/OIP.Ly1UPzZZ-_WOgd8OjQLRtwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
      },
      {
        name: "Shahi Paneer",
        price: 190,
        rating: 4,
        image:
          "https://recipesblob.oetker.in/assets/6c0ac2f3ce204d3d9bb1df9709fc06c9/1272x764/shahi-paneer.jpg",
      },
    ],
    Desserts: [
      {
        name: "Gulab Jamun",
        price: 50,
        rating: 5,
        image:
          "https://www.bing.com/th/id/OIP.B32bansRI7RS3yfbUSEBNwHaHa?w=197&h=185&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2",
      },
      {
        name: "Rasmalai",
        price: 70,
        rating: 5,
        image:
          "https://www.cookclickndevour.com/wp-content/uploads/2017/08/rasmalai-recipe-d.jpg",
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
    ],
  };

  const menuData = {
    1: commonMenu,
    2: commonMenu,
    3: commonMenu,
    4: commonMenu,
    5: commonMenu,
  };

  const items = menuData[table] || {};

  const getQty = (name) => {
    const found = cart.find((item) => item.name === name);
    return found ? found.qty : 0;
  };

  return (
    <div className="page-center fade-in">
      <div style={{ maxWidth: "800px", width: "100%", padding: "1rem" }}>
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          📋 Welcome! Here's the Menu for Table {table}
        </h2>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search for a dish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "0.6rem 1rem",
            fontSize: "1rem",
            margin: "1rem 0 2rem",
            width: "100%",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        />

        {Object.entries(items).map(([category, dishes]) => {
          const filteredDishes = dishes.filter((dish) =>
            dish.name.toLowerCase().includes(search.toLowerCase())
          );

          if (filteredDishes.length === 0) return null;

          return (
            <div key={category} style={{ marginBottom: "2rem" }}>
              <h3 style={{ marginBottom: "1rem" }}>🍽️ {category}</h3>
              <div className="menu-grid">
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
                          >
                            {favorites[item.name] ? (
                              <FaHeart color="red" />
                            ) : (
                              <FaRegHeart />
                            )}
                          </span>
                        </div>
                        <p>₹{item.price}</p>

                        {/* Star Ratings */}
                        <div className="menu-stars">
                          {[...Array(5)].map((_, i) =>
                            i < (item.rating || 4) ? (
                              <FaStar key={i} color="#fbbf24" size={14} />
                            ) : (
                              <FaRegStar key={i} color="#fbbf24" size={14} />
                            )
                          )}
                        </div>

                        <div className="menu-details">
                          <span>🍴 Indian</span>
                          <span>•</span>
                          <span>⏱️ 30 mins</span>
                        </div>

                        {qty === 0 ? (
                          <button onClick={() => addToCart(item)}>➕ Add</button>
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <button onClick={() => updateQty(item.name, -1)}>➖</button>
                            <span>{qty}</span>
                            <button onClick={() => updateQty(item.name, 1)}>➕</button>
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

        <CartDrawer />
      </div>
    </div>
  );
}
