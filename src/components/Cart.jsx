// src/components/Cart.jsx
import React, { useState } from "react";
import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";

export default function Cart({ cart = [], table = null }) {
  const [loading, setLoading] = useState(false);
  const total = cart.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 0), 0);

  const handleOrder = async (payOnline) => {
    if (cart.length === 0) {
      toast.error("Cart is empty.");
      return;
    }
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
        toast.error("Redirecting to payment gateway (not implemented)...");
      } else {
        toast.success(`Order placed! Receipt ID: ${receiptId}`);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: 16 }}>
      <h3>Your Cart</h3>

      {cart.length === 0 ? (
        <p>No items added yet.</p>
      ) : (
        <>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {cart.map((it, i) => (
              <li key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #eee" }}>
                <div>{it.name} (x{it.qty})</div>
                <div>₹{(it.price || 0) * (it.qty || 0)}</div>
              </li>
            ))}
          </ul>

          <h4 style={{ textAlign: "right", marginTop: 12 }}>Total: ₹{total}</h4>

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button onClick={() => handleOrder(true)} disabled={loading} style={{ padding: "10px 14px", background: "#dc2626", color: "#fff", border: "none", borderRadius: 8 }}>
              {loading ? "Processing..." : "💳 Pay Online"}
            </button>
            <button onClick={() => handleOrder(false)} disabled={loading} style={{ padding: "10px 14px", background: "#16a34a", color: "#fff", border: "none", borderRadius: 8 }}>
              {loading ? "Processing..." : "✅ Pay at Counter"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
