// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import jsPDF from "jspdf";
// import "./OrderSuccess.css"; // ✅ include this stylesheet

// export default function OrderSuccess() {
//   const { state } = useLocation();
//   const navigate = useNavigate();

//   const cart = state?.cart || [];
//   const table = state?.table || "Unknown";
//   const total = state?.total || 0;
//   const orderId = state?.orderId || null;

//   const generatePdf = () => {
//     const doc = new jsPDF();
//     doc.setFontSize(14);
//     doc.text("Apaxion Restaurant", 20, 20);
//     doc.text("Order Bill", 20, 30);
//     doc.text(`Table: ${table}`, 20, 40);
//     if (orderId) {
//       doc.text(`Order ID: ${orderId}`, 20, 50);
//     }

//     let y = orderId ? 65 : 55;
//     cart.forEach((item) => {
//       doc.text(`${item.name} x ${item.qty} - ₹${item.qty * item.price}`, 20, y);
//       y += 10;
//     });

//     doc.text(`\nTotal: ₹${total}`, 20, y + 10);
//     doc.save(`Table-${table}-Bill.pdf`);
//   };

//   return (
//     <div className="order-container">
//       <h2 className="order-title">✅ Order Placed!</h2>
//       <p>Your order has been received and is being prepared.</p>

//       <button onClick={generatePdf} className="btn btn-green">
//         📄 Download Bill as PDF
//       </button>

//       <button onClick={() => navigate("/")} className="btn btn-blue">
//         🔙 Back to Scanner
//       </button>
//     </div>
//   );
// }

// src/pages/OrderSuccess.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
//import Header from './components/Header'; // ✅ correct if in same folder as src/components



export default function OrderSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const cart = state?.cart || [];
  const table = state?.table || "Unknown";
  const total = state?.total || 0;
  const orderId = state?.orderId || null;

  const generatePdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Apaxion Restaurant", 20, 20);
    doc.text("Order Bill", 20, 30);
    doc.text(`Table: ${table}`, 20, 40);
    if (orderId) {
      doc.text(`Order ID: ${orderId}`, 20, 50);
    }
    let y = orderId ? 65 : 55;
    cart.forEach((item) => {
      doc.text(`${item.name} x ${item.qty} - ₹${item.qty * item.price}`, 20, y);
      y += 10;
    });
    doc.text(`Total: ₹${total}`, 20, y + 10);
    doc.save(`Table-${table}-Bill.pdf`);
  };

  return (
    <div className="page-center fade-in">
      <div style={{ textAlign: "center", background: "#fff", padding: "2rem", borderRadius: "12px", boxShadow: "0 2px 12px rgba(0,0,0,0.1)" }}>
        <h2 style={{ color: "#28a745" }}>✅ Order Placed</h2>
        <p>Your order was placed successfully.</p>
        <button onClick={generatePdf} className="btn green">📄 Download Bill</button>
        <button onClick={() => navigate("/")} className="btn blue" style={{ marginLeft: "1rem" }}>🔁 Scan Again</button>
      </div>
    </div>
  );
}
