// src/pages/CartPage.jsx
import React from "react";
import { useCart } from "../context/CartContext";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./CartDrawer.css";
import ViewMenuNavbar from "./ViewMenuNavbar";

export default function CartPage() {
  const { cart, table, clearCart, updateQty } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + (item.qty || 0) * (item.price || 0),
    0
  );

  const placeOrder = async () => {
    if (cart.length === 0) return;
    const orderData = {
      cart,
      table: table || null,
      total,
      createdAt: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(collection(db, "orders"), orderData);
      clearCart();
      navigate("/order-success", {
        state: { ...orderData, orderId: docRef.id },
      });
    } catch (err) {
      console.error("Error saving order:", err);
      alert("Failed to place order. Try again.");
    }
  };

  return (
    <>
    <ViewMenuNavbar/>
    <div className="cart-drawer cart-drawer-page" role="dialog" aria-label="Cart drawer">

      <h3>🧾 Order for Table {table || "-"}</h3>

      {cart.length === 0 ? (
        <div className="cart-empty">No items in cart.</div>
      ) : (
        <>
          <ul className="cart-list" aria-live="polite">
            {cart.map((item, idx) => (
              <li className="cart-item" key={`${item.name}-${idx}`}>
                <div className="cart-compact-row">
                  <strong>{item.name}</strong>
                  <span className="item-price">
                    ₹{(item.qty || 0) * (item.price || 0)}
                  </span>
                </div>

                <div className="cart-controls">
                  <button
                    className="qty-btn-drawer"
                    onClick={() => updateQty(item.name, -1)}
                    title="Decrease"
                  >
                    ➖
                  </button>

                  <div className="qty-display">{item.qty || 0}</div>

                  <button
                    className="qty-btn-drawer"
                    onClick={() => updateQty(item.name, 1)}
                    title="Increase"
                  >
                    ➕
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="cart-total">
            <span>Total</span>
            <strong>₹{total}</strong>
          </div>

          <button
            onClick={placeOrder}
            className="place-order"
            disabled={cart.length === 0}
          >
            ✅ Place Order
          </button>
        </>
      )}
    </div>
    </>
  );
}
