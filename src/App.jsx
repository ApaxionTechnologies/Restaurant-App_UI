import React from "react";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";

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
import CurrentMenu from "./pages/CurrentMenu";
import ViewMenu from "./components/ViewMenu";
import FeedbackPage from "./pages/Feedbackpage";
// ✅ Components
import AddMenuItem from "./components/AddMenuItem";
import QRScanner from "./components/QRScanner";
import TableManager from "./components/TableManager";
import QRFileUploader from "./QRFileUploader";
import Cart from "./components/Cart";
import CartPage from "./components/cartpage";
// ✅ Styles
import "./styles/global.css";
import "./styles/MenuCard.css";
import "./styles/QRFileUploader.css";

export default function App() {

  const Navigate=useNavigate("")
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterRestaurant />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/add-item" element={<AddMenuItem />} />
      <Route path="/remove-item" element={<RemoveItem />} />
      <Route path="/generate-qr" element={<GenerateQR />} />
      <Route path="/view-menu" element={<CurrentMenu />} />
      <Route path="/current-menu" element={<CurrentMenu />} />
      <Route path="/scanner" element={<QRScanner />} />
      <Route path="/upload-qr" element={<QRFileUploader />} />
       <Route path="/" element={<Navigate to="/menu" />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        
       <Route path="/cart" element={<CartPage />} />
      <Route path="/order-success" element={<OrderSuccess />} />
      <Route path="/view-all-items" element={<ViewMenu />} />
      <Route path="/table-manager" element={<TableManager />} />
    </Routes>
  );
}



