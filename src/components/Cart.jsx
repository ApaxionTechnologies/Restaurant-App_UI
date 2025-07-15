// src/components/Cart.jsx
import React, { useState } from "react";
import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export default function Cart({ cart, table }) {
  const [loading, setLoading] = useState(false);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0); // handles qty

  const handleOrder = async (payOnline) => {
    const receiptId = uuidv4().slice(0, 8);
    setLoading(true);
    try {
      await addDoc(collection(db, "orders"), {
        table,
        cart,
        total,
        receiptId,
        payOnline,
        status: "pending",
        createdAt: new Date(),
      });

      if (payOnline) {
        alert("Redirecting to payment gateway (not implemented)...");
      } else {
        alert(`Order placed! Show this Receipt ID at counter: ${receiptId}`);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-drawer">
      <h4 className="mb-3 text-center">🛒 Your Cart</h4>

      {cart.length === 0 ? (
        <p className="text-center text-muted">No items added yet.</p>
      ) : (
        <>
          <ul className="list-group mb-3">
            {cart.map((item, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between">
                <span>{item.name} (x{item.qty})</span>
                <span>₹{item.price * item.qty}</span>
              </li>
            ))}
          </ul>

          <h5 className="text-end mb-3">Total: ₹{total}</h5>

          <div className="d-grid gap-2">
            <button
              onClick={() => handleOrder(true)}
              className="btn btn-danger"
              disabled={loading}
            >
              {loading ? "Processing..." : "💳 Pay Online"}
            </button>

            <button
              onClick={() => handleOrder(false)}
              className="btn btn-success"
              disabled={loading}
            >
              {loading ? "Processing..." : "✅ Pay at Counter"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
