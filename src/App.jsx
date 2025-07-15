import React from "react";
import { Routes, Route } from "react-router-dom";

// Pages & Components
import HomePage from "./pages/HomePage";
import RegisterRestaurant from "./pages/RegisterRestaurant";
import AdminLogin from "./pages/AdminLogin";
import Login from "./pages/Login";
import MenuPage from "./pages/MenuPage";
import OrderSuccess from "./pages/OrderSuccess";
import QRFileUploader from "./QRFileUploader"; // QR Generator
import QRScanner from "./components/QRScanner"; // QR Scanner

// Global Styles
import "./styles/MenuCard.css";

export default function App() {
  return (
    <Routes>
      {/* ✅ Home Route */}
      <Route path="/" element={<HomePage />} />

      {/* ✅ Admin/Restaurant Routes */}
      <Route path="/register" element={<RegisterRestaurant />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/login" element={<Login />} />

      {/* ✅ Customer/QR Routes */}
      <Route path="/scanner" element={<QRScanner />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/order-success" element={<OrderSuccess />} />

      {/* ✅ QR File Upload for Admins */}
      <Route path="/upload-qr" element={<QRFileUploader />} />
    </Routes>
  );
} 