
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartDrawer from "../components/CartDrawer";
import "../styles/global.css";
import "../styles/MenuCard.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaHeart, FaRegHeart, FaStar, FaRegStar } from "react-icons/fa";
import axios from "axios";
 
 
export default function MenuPage() {
  const [searchParams] = useSearchParams();
  const { cart, addToCart, updateQty, setTable } = useCart();
  const table = searchParams.get("table");
  const restaurantId = searchParams.get("restaurant");
  const [search, setSearch] = useState("");
  const [menu, setMenu] = useState({});
  const [favorites, setFavorites] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("All");
 
 
  // ✅ Default fallback menu if API fails or is empty
  const defaultMenu = {
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
        image: "https://img.freepik.com/premium-photo/chicken-lollipop-schezwan-is-indian-chinese-appetizer-served-wooden-rustic-background_726363-1287.jpg?w=740",
      },
      {
        name: "Veg Spring Rolls",
        price: 120,
        rating: 4,
        image: "https://t3.ftcdn.net/jpg/00/89/95/08/360_F_89950874_LVsh6xkVvHEPZUqH60qZRkUq5VNfsba3.jpg",
      },
      {
        name: "Hakka Noodles",
        price: 150,
        rating: 4,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHI6vHr6V8yiVoYNezh3ViC4ZcCD7U_0kuuw&s",
      },
      {
        name: "French Fries",
        price: 80,
        rating: 3,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8ae8p5fO5SDVCFj-xEWTJaECdaCkzSx0jsA&s",
      },
      {
        name: "Onion Rings",
        price: 90,
        rating: 4,
        image: "https://t3.ftcdn.net/jpg/01/02/34/08/360_F_102340800_0b1c5d8f2e6f7a9c8b1c5d8f2e6f7a9c.jpg",
      },
    ],
    Mains: [
      {
        name: "Butter Chicken",
        price: 250,
        rating: 5,
        image: "https://media.istockphoto.com/photos/indian-butter-chicken-horizontal-photo-picture-id1170729895?k=6&m=1170729895&s=170667a&w=0&h=Ij9sXGKylXILqOvos4tWhydqdiWzqpGVMzSPHHTFY18=",
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
        image: "https://recipesblob.oetker.in/assets/6c0ac2f3ce204d3d9bb1df9709fc06c9/1272x764/shahi-paneer.jpg",
      },
      {
        name: "Dal Makhani",
        price: 160,
        rating: 4,
        image: "https://media.istockphoto.com/id/1170374719/photo/dal-makhani-at-dark-background.jpg?s=612x612&w=0&k=20&c=49yLaUAE2apakVk2AAiRQimZd98WtSjIQ0hzCzWsmns=",
      },
      {
        name: "Veg Biryani",
        price: 200,
        rating: 4,
        image: "https://t4.ftcdn.net/jpg/05/70/58/65/360_F_570586537_TnIgWdCnaTYpgg9gsTyloz5bnvfCtdLl.jpg",
      },
      {
        name: "Paneer Butter Masala",
        price: 220,
        rating: 5,
        image: "https://www.vegrecipesofindia.com/wp-content/uploads/2020/01/paneer-butter-masala-5.jpg",
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
        image: "https://www.cookclickndevour.com/wp-content/uploads/2017/08/rasmalai-recipe-d.jpg",
      },
      {
        name: "Kheer",
        price: 60,
        rating: 4,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgLss255oTBYWS4wQf-LdkQ8xuwIgosnGXrA&s",
      },
      {
        name: "Jalebi",
        price: 40,
        rating: 4,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrON2qFBUb-7ad3yo-vW9GHoc0WKUmf28wWw&s",
      },
      {
        name: "Rasgulla",
        price: 50,
        rating: 5,
        image: "data:image/jpeg;base64,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",
      },
      {
        name: "Kesar Pista Kulfi",
        price: 80,
        rating: 5,
        image: "https://thumbs.dreamstime.com/b/saffron-pistachio-coconut-rice-pudding-5946390.jpg",
      },
    ],
    Beverages: [
      {
        name: "Masala Chai",
        price: 30,
        rating: 4,
        image: "https://www.indianveggiedelight.com/wp-content/uploads/2022/10/masala-chai-6-768x1024.jpg",
      },
      {
        name: "Sweet Lassi",
        price: 60,
        rating: 5,
        image: "https://img.freepik.com/premium-photo/photo-laban-ayran-drink-isolated-flat-white-background_847439-69088.jpg",
      },
      {
        name: "Mango Lassi",
        price: 70,
        rating: 5,
        image: "https://www.anediblemosaic.com/wp-content/uploads//2021/09/mango-lassi-featured-image.jpg",
      },
      {
        name: "Coconut Water",
        price: 40,
        rating: 4,
        image: "https://t3.ftcdn.net/jpg/03/06/32/50/360_F_306325086_rRHmFccHKptOs8OjbqMg2Fbn4mWJJRZ0.jpg",
      },
      {
        name: "Thums Up",
        price: 30,
        rating: 4,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTU5lsCxc6oqRzRG0VcxM_UdELu6uUycKFvEQ&s",
      },
      {
        name: "Coca Cola",
        price: 30,
        rating: 4,
        image: "https://media.istockphoto.com/id/157726102/photo/classical-coca-cola-bottle.jpg?s=612x612&w=0&k=20&c=7s9UKO9O8ti8ELyt0A6-Rek-WITTG2m9y6joO8ETx8s=",
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
        const res = await axios.get(`http://localhost:5001/api/menu/${restaurantId}`);
        const data = res.data;
 
        // Use default if data is invalid or empty
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
    <div className="page-center fade-in">
      <div style={{ maxWidth: "1000px", width: "100%", padding: "0.5rem 1rem", margin: "0 auto" }}>
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
  onFocus={(e) => (e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.3)")}
  onBlur={(e) => (e.target.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.05)")}
/>
     
     <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
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
 
 
 
        {/* {Object.entries(menu).map(([category, dishes]) => { */}
        {Object.entries(menu)
  .filter(([category]) => selectedCategory === "All" || selectedCategory === category)
  .map(([category, dishes]) => {
 
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
                          <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
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
