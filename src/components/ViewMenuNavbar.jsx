// import React, { useState, useEffect, useRef } from "react";
// import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
// import { Link, useLocation } from "react-router-dom";
// import "./ViewMenuNavbar.css";
// import CartDrawer from "./CartDrawer";
// import { useRestaurant } from "../context/RestaurantContext";

// const defaultTabs = [
//   { key: "choose", label: "Choose Food", path: "/menu" },
//   { key: "feedback", label: "Give Feedback", path: "/feedback" },
// ];

// const ViewMenuNavbar = () => {
//   const location = useLocation();
//   const { restaurant, table } = useRestaurant(); 
//   const [active, setActive] = useState("choose");
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const mobileRef = useRef();

//   useEffect(() => {
//     if (location.pathname.includes("/feedback")) setActive("feedback");
//     else if (location.pathname.includes("/cart")) setActive("cart");
//     else setActive("choose");
//   }, [location.pathname]);


//   useEffect(() => {
//     const handler = (e) => {
//       if (mobileRef.current && !mobileRef.current.contains(e.target)) setMobileOpen(false);
//     };
//     if (mobileOpen) document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, [mobileOpen]);

 
//   const getRestaurantId = (r) => {
//     if (!r) return "";
//     if (typeof r === "string") return r;
  
//     return r._id || r.id || "";
//   };

//   const restaurantIdValue =
//   getRestaurantId(restaurant) || localStorage.getItem("restaurantId") || "";

// const tableValue =
//   table || localStorage.getItem("tableNumber") || "";

// let query = "";
// if (restaurantIdValue) {
//   query = `?restaurantId=${encodeURIComponent(restaurantIdValue)}`;
//   if (tableValue) {
//     query += `&table=${encodeURIComponent(tableValue)}`;
//   }
// }
//   return (
//     <>
//       <nav className="vm-navbar">
//         <div className="vm-navbar-inner">
   
//           <div className="vm-left">
//             <button
//               className="vm-hamburger"
//               aria-label="Open menu"
//               aria-expanded={mobileOpen}
//               onClick={() => setMobileOpen((s) => !s)}
//             >
//               {mobileOpen ? <FaTimes /> : <FaBars />}
//             </button>
//           </div>

//           <div className="vm-brand">MENU</div>

         
//           <ul className="vm-nav">
//             {defaultTabs.map((tab) => (
//               <li key={tab.key} className="vm-nav-item vm-nav-desktop-only">
//                 <Link
//                   to={`${tab.path}${query}`} 
//                   className={`vm-nav-link ${active === tab.key ? "active" : ""}`}
//                   onClick={() => setMobileOpen(false)}
//                 >
//                   {tab.label}
//                 </Link>
//               </li>
//             ))}

//           {tableValue && (
//   <>
//     <li className="vm-divider" />
//     <li className="vm-nav-item vm-nav-desktop-only">
//       <Link
//         to={`/cart${query}`}
//         className={`vm-nav-link icon-btn ${active === "cart" ? "active" : ""}`}
//         onClick={() => setMobileOpen(false)}
//       >
//         <FaShoppingCart className="cart-icon" />
//       </Link>
//     </li>
//     <CartDrawer />
//   </>
// )}

// </ul>
//         </div>
//       </nav>

//       <div
//         ref={mobileRef}
//         className={`vm-mobile-panel ${mobileOpen ? "open" : ""}`}
//         role="menu"
//         aria-hidden={!mobileOpen}
//       >
//         <ul className="vm-mobile-list">
//           {defaultTabs.map((tab) => (
//             <li key={tab.key} className="vm-mobile-item">
//               <Link
//                 to={`${tab.path}${query}`}
//                 className={`vm-mobile-link ${active === tab.key ? "active" : ""}`}
//                 onClick={() => setMobileOpen(false)}
//               >
//                 {tab.label}
//               </Link>
//             </li>
//           ))}
//             {tableValue && (
//   <li className="vm-mobile-item">
//     <Link
//       to={`/cart${query}`}
//       className={`vm-mobile-link ${active === "cart" ? "active" : ""}`}
//       onClick={() => setMobileOpen(false)}
//     >
//       <FaShoppingCart className="cart-icon" />
//     </Link>
//   </li>
// )}

// </ul>
//       </div>
//     </>
//   );
// };

// export default ViewMenuNavbar;

import React, { useState, useEffect, useRef } from "react";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import "./ViewMenuNavbar.css";
import CartDrawer from "./CartDrawer";
import { useRestaurant } from "../context/RestaurantContext";
import { useSelector } from "react-redux"; // Redux se useSelector import karein

const defaultTabs = [
  { key: "choose", label: "Choose Food", path: "/menu" },
  { key: "feedback", label: "Give Feedback", path: "/feedback" },
];

const ViewMenuNavbar = () => {
  const location = useLocation();
  const { restaurant, table } = useRestaurant(); 
  const [active, setActive] = useState("choose");
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileRef = useRef();
  
  // Redux store se cart items access karein
  const cartItems = useSelector((state) => state.cart.items);
  // Cart items ki total count calculate karein
  const cartCount = cartItems.reduce((sum, item) => sum + (item.qty || 0), 0);

  useEffect(() => {
    if (location.pathname.includes("/feedback")) setActive("feedback");
    else if (location.pathname.includes("/cart")) setActive("cart");
    else setActive("choose");
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (mobileRef.current && !mobileRef.current.contains(e.target)) setMobileOpen(false);
    };
    if (mobileOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [mobileOpen]);

  const getRestaurantId = (r) => {
    if (!r) return "";
    if (typeof r === "string") return r;
  
    return r._id || r.id || "";
  };

  const restaurantIdValue =
  getRestaurantId(restaurant) || localStorage.getItem("restaurantId") || "";

const tableValue =
  table || localStorage.getItem("tableNumber") || "";

let query = "";
if (restaurantIdValue) {
  query = `?restaurantId=${encodeURIComponent(restaurantIdValue)}`;
  if (tableValue) {
    query += `&table=${encodeURIComponent(tableValue)}`;
  }
}
  return (
    <>
      <nav className="vm-navbar">
        <div className="vm-navbar-inner">
   
          <div className="vm-left">
            <button
              className="vm-hamburger"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((s) => !s)}
            >
              {mobileOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          <div className="vm-brand">MENU</div>

         
          <ul className="vm-nav">
            {defaultTabs.map((tab) => (
              <li key={tab.key} className="vm-nav-item vm-nav-desktop-only">
                <Link
                  to={`${tab.path}${query}`} 
                  className={`vm-nav-link ${active === tab.key ? "active" : ""}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {tab.label}
                </Link>
              </li>
            ))}

          {tableValue && (
  <>
    <li className="vm-divider" />
    <li className="vm-nav-item vm-nav-desktop-only">
      <Link
        to={`/cart${query}`}
        className={`vm-nav-link icon-btn ${active === "cart" ? "active" : ""}`}
        onClick={() => setMobileOpen(false)}
      >
        <div className="cart-icon-container">
          <FaShoppingCart className="cart-icon" />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </div>
      </Link>
    </li>
    <CartDrawer />
  </>
)}

</ul>
        </div>
      </nav>

      <div
        ref={mobileRef}
        className={`vm-mobile-panel ${mobileOpen ? "open" : ""}`}
        role="menu"
        aria-hidden={!mobileOpen}
      >
        <ul className="vm-mobile-list">
          {defaultTabs.map((tab) => (
            <li key={tab.key} className="vm-mobile-item">
              <Link
                to={`${tab.path}${query}`}
                className={`vm-mobile-link ${active === tab.key ? "active" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                {tab.label}
              </Link>
            </li>
          ))}
      

</ul>
      </div>
    </>
  );
};

export default ViewMenuNavbar;