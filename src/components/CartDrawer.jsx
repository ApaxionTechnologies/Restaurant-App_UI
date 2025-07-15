// import React, { useState } from "react";
// import { useCart } from "../context/CartContext";
// import { useNavigate } from "react-router-dom";
// import { db } from "../firebase";
// import { collection, addDoc, serverTimestamp } from "firebase/firestore";
// // import "./CartDrawer.css"; // optional, if you're splitting styles

// export default function CartDrawer() {
//   const { cart, table, clearCart } = useCart();
//   const [open, setOpen] = useState(false);
//   const navigate = useNavigate();

//   const total = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

//   const placeOrder = async () => {
//     const orderData = {
//       cart,
//       table,
//       total,
//       createdAt: serverTimestamp(),
//     };

//     try {
//       const docRef = await addDoc(collection(db, "orders"), orderData);
//       clearCart();
//       navigate("/order-success", {
//         state: { ...orderData, orderId: docRef.id },
//       });
//     } catch (error) {
//       console.error("❌ Error saving order:", error);
//     }
//   };

//   return (
//     <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}>
//       <button onClick={() => setOpen(!open)} className="btn cart-toggle">
//         🛒 Cart ({cart.length})
//       </button>

//       {open && (
//         <div className="cart-drawer">
//           <h3>🧾 Table {table}</h3>
//           <ul style={{ padding: 0, listStyle: "none" }}>
//             {cart.map((item, idx) => (
//               <li key={idx} style={{ margin: "0.5rem 0" }}>
//                 {item.name} × {item.qty} = ₹{item.qty * item.price}
//               </li>
//             ))}
//           </ul>
//           <h4>Total: ₹{total}</h4>
//           <button onClick={placeOrder} className="btn place-order">
//             ✅ Place Order
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }


// src/components/CartDrawer.jsx
// src/components/CartDrawer.jsx
import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "../styles/global.css";

export default function CartDrawer() {
  const { cart, table, clearCart, updateQty } = useCart();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  const placeOrder = async () => {
    const orderData = {
      cart,
      table,
      total,
      createdAt: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(collection(db, "orders"), orderData);
      clearCart();
      setOpen(false); // ✅ Auto-close cart
      navigate("/order-success", {
        state: { ...orderData, orderId: docRef.id },
      });
    } catch (error) {
      console.error("❌ Error saving order:", error);
    }
  };

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 999 }}>
  <button
    onClick={() => setOpen(!open)}
    className={`cart-toggle ${cart.length > 0 ? "highlight" : ""}`}
  >
    🛒 Cart
    {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
  </button>

  {open && (
    <div className="cart-drawer">
      <h3>🧾 Order for Table {table}</h3>
      <ul style={{ padding: 0, listStyle: "none" }}>
        {cart.map((item, idx) => (
          <li key={idx} style={{ marginBottom: "1rem" }}>
            <strong>{item.name}</strong><br />
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <button onClick={() => updateQty(item.name, -1)} className="btn small">➖</button>
              <span>{item.qty}</span>
              <button onClick={() => updateQty(item.name, 1)} className="btn small">➕</button>
              <span style={{ marginLeft: "auto" }}>₹{item.qty * item.price}</span>
            </div>
          </li>
        ))}
      </ul>
      <h4>Total: ₹{total}</h4>
      <button onClick={placeOrder} className="btn place-order">
        ✅ Place Order
      </button>
    </div>
  )}
</div>

  );
}
