// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "../styles/MenuView.css";

// const MenuView = () => {
//   const [menuItems, setMenuItems] = useState([]);

//   useEffect(() => {
//     const fetchMenu = async () => {
//       try {
//         const response = await axios.get("http://localhost:5001/api/menu");
//         setMenuItems(response.data);
//       } catch (error) {
//         console.error("Failed to fetch menu:", error);
//       }
//     };

//     fetchMenu();
//   }, []);

//   return (
//     <div className="menu-view-container">
//       <h2 className="menu-title">Current Menu</h2>
//       <div className="menu-grid">
//         {menuItems.map((item, index) => (
//           <div className="menu-card" key={index}>
//             <img src={item.image} alt={item.name} className="menu-img" />
//             <div className="menu-info">
//               <h3>{item.name}</h3>
//               <p>₹{item.price}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MenuView;


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "../styles/MenuView.css";
// import AdminLayout from "./AdminLayout";

// const ViewMenuItems = ({ refreshMenu }) => {
//   const [menuItems, setMenuItems] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Fetch the menu items whenever the refreshMenu prop changes
//   useEffect(() => {
//     const fetchMenuItems = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get("http://localhost:5001/api/menu");
//         setMenuItems(response.data); // Assuming data is an array of menu items
//       } catch (error) {
//         console.error("Error fetching menu items:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMenuItems();
//   }, [refreshMenu]); // Dependency on refreshMenu prop

//   return (
//     <AdminLayout> 
//     <div className="menu-items-container">
//       <h2>Menu Items</h2>
//       {loading ? (
//         <p>Loading menu items...</p>
//       ) : (
//         <div className="menu-items-grid">
//           {menuItems.length > 0 ? (
//             menuItems.map((item, index) => (
//               <div key={index} className="menu-item-card">
//                 <img
//                   src={item.image ? item.image : "/default-image.jpg"}
//                   alt={item.name}
//                   className="menu-item-image"
//                 />
//                 <div className="menu-item-details">
//                   <h3>{item.name}</h3>
//                   <p>Price: ฿{item.price}</p>
//                   <p>Time to Prepare: {item.timeToPrepare} minutes</p>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p>No menu items available.</p>
//           )}
//         </div>
//       )}
//     </div>
//     </AdminLayout>
//   );
// };
// export default ViewMenuItems;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaThList, FaThLarge, FaTh } from "react-icons/fa"; // icons for toggle
import "../styles/MenuCard.css";

const ViewMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [layout, setLayout] = useState("grid-2"); // default 2 cards

  useEffect(() => {
    const fetchMenu = async () => {
      const restaurantEmail = localStorage.getItem("adminEmail");
      try {
        const res = await axios.get(`http://localhost:5001/api/menu/all/${restaurantEmail}`);
        setMenuItems(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMenu();
  }, []);

  return (
    <div className="view-menu-page">
  <div className={`menu-grid ${layout}`}>
    {menuItems.map((item) => (
      <div className="menu-card" key={item._id}>
        <img
          src={`http://localhost:5001${item.imageUrl}`}
          alt={item.name}
        />
        <div className="menu-card-content">
          <h3>{item.name}</h3>
          <p>Category: {item.category}</p>
          <p>Price: ฿{item.price}</p>
          <p>Time: {item.timeToPrepare} mins</p>
        </div>
      </div>
    ))}
  </div>
</div>

  );
};

export default ViewMenu;
