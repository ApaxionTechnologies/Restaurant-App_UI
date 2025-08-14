// src/components/CartDrawer.jsx
import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./CartDrawer.css";

export default function CartDrawer() {
  const { cart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="navbar-cart" aria-live="polite">
      <button
        onClick={() => navigate("/cart")}
        className={`cart-toggle ${cart.length > 0 ? "highlight" : ""}`}
        aria-label="Go to cart"
      >
        Cart
        {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
      </button>
    </div>
  );
}
