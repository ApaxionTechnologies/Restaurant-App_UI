import React from "react";
import { Routes, Route } from "react-router-dom";

// ✅ Pages
import HomePage from "./pages/HomePage";
import RegisterRestaurant from "./pages/RegisterRestaurant";
import AdminLogin from "./pages/AdminLogin";
import Login from "./pages/Login";
import MenuPage from "./pages/MenuPage";
import OrderSuccess from "./pages/OrderSuccess";
import AdminDashboard from "./pages/AdminDashboard";
import GenerateQR from "./pages/GenerateQR";
import RemoveItem from "./pages/RemoveItem";

// ✅ Components
import AddMenuItem from "./components/AddMenuItem";
import QRScanner from "./components/QRScanner";

// ✅ QR File Uploader from src
import QRFileUploader from "./QRFileUploader";

// ✅ Styles
import "./styles/global.css";
import "./styles/MenuCard.css";
import "./styles/QRFileUploader.css";

export default function App() {
  return (
    <Routes>
      {/* ✅ Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />

      {/* ✅ Restaurant & Admin Routes */}
      <Route path="/register" element={<RegisterRestaurant />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/add-item" element={<AddMenuItem />} />
      <Route path="/remove-item" element={<RemoveItem />} />
      <Route path="/generate-qr" element={<GenerateQR />} />

      {/* ✅ Customer QR Options */}
      <Route path="/scanner" element={<QRScanner />} /> {/* Camera Scanner */}
      <Route path="/upload-qr" element={<QRFileUploader />} /> {/* Upload QR File */}

      {/* ✅ Customer Menu & Order */}
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/order-success" element={<OrderSuccess />} />
    </Routes>
  );
}
