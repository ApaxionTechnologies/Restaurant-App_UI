
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";




export default function OrderSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const cart = state?.cart || [];
  const table = state?.table || "Unknown";
  const total = state?.total || 0;
  const orderId = state?.orderId || null;


  return (
    <div className="page-center fade-in">
      <div style={{ textAlign: "center", background: "#fff", padding: "2rem", borderRadius: "12px", boxShadow: "0 2px 12px rgba(0,0,0,0.1)" }}>
        <h2 style={{ color: "#28a745" }}>✅ Order Placed</h2>
        <p>Your order was placed successfully.</p>
        <button onClick={() => navigate("/")} className="btn blue" style={{ marginLeft: "1rem" }}>🔁 Scan Again</button>
      </div>
    </div>
  );
}
