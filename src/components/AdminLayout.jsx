// src/components/AdminLayout.jsx
import React from "react";
import Header3 from "../components/Header3.jsx";
import Footer from "./Footer";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header3 />
      <main style={{ flex: 1, padding: "20px" }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}