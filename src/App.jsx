
import React from "react";  
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// ✅ Pages
import HomePage from "./pages/HomePage";
import RegisterRestaurant from "./pages/RegisterRestaurant";
import AdminLogin from "./pages/AdminLogin";
//import Login from "./pages/Login";
import MenuPage from "./pages/MenuPage"; 
import OrderSuccess from "./pages/OrderSuccess";
import AdminDashboard from "./pages/AdminDashboard";
import GenerateQR from "./pages/GenerateQR";
import RemoveItem from "./pages/RemoveItem";
import CurrentMenu from "./pages/CurrentMenu";
import FeedbackPage from "./pages/Feedbackpage";
import ForgotPassword from "./pages/forgotPassword";
import EditRestaurantProfile from "./pages/EditRestaurantProfile";
import ResetPasswordPage from "./pages/ResetPasswordForm";
import GenerateMenuQR from "./pages/GenerateMenuQR";

// ✅ Components
import AddMenuItem from "./components/AddMenuItem";
import QRScanner from "./components/QRScanner";
import TableManager from "./components/TableManager";
import ViewMenu from "./components/ViewMenu";
import QRFileUploader from "./QRFileUploader";
import CartPage from "./components/cartpage";
import ScannerPage from "./components/ScannerPage";
import ProtectedRoute from "./components/ProtectRoute";
import OrderManagement from "./components/OrderManagement";

// ✅ Styles
import "./styles/global.css";
import "./styles/MenuCard.css";
import "./styles/QRFileUploader.css";
import './styles/theme.css';
import './styles/ViewMenu.css';

import { RestaurantProvider } from "./context/RestaurantContext";
import { BulkItemUpload } from "./pages/BulkItemUpload";
import { ConfirmationModalProvider } from "./context/ConfirmationModalContext";
import { Toaster } from "react-hot-toast";
export default function App() {
  const location = useLocation();
  const state = location.state || {};

 return (
  <ConfirmationModalProvider>
    <RestaurantProvider>
      <> <Toaster
        position="top-center" 
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            fontSize: "14px",
            textAlign: "center", 
          },
        }}
      />
      
        <Routes>
          {/* ✅ Public Routes */}
          <Route
            path="/"
            element={
              <>
                <HomePage />
                {state.showAdminLogin && <AdminLogin />}
              </>
            }
          />
         
          <Route path="/scanner" element={<ScannerPage />} />

          {/* ✅ Restaurant & Admin Routes */}
          <Route path="/registerrestaurant" element={<RegisterRestaurant />} />
          <Route path="/admin-login" element={<AdminLogin />} />             
<Route path ="/edit-restaurant-profile" element={<EditRestaurantProfile/>}/>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
<Route path="/reset-password" element={<ResetPasswordPage />} />
          {/* Protected Admin Dashboard */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

        {/* ✅ Menu & Admin Components */}
        <Route path="/add-item" element={<AddMenuItem />} /> 
        <Route path="/edit-menu/:itemId" element={<AddMenuItem />} />

        <Route path="/menu/:restaurantId" element={<ViewMenu />} />
        <Route path="/remove-item" element={<RemoveItem />} />
        <Route path="/generate-qr" element={<GenerateQR />} />
        <Route path="/generate-menu-qr" element={<GenerateMenuQR />} />
        <Route path="/current-menu" element={<CurrentMenu />} />
        <Route path="/order-management" element={<OrderManagement />} />

          {/* ✅ Customer QR Options */}
          <Route path="/qr-scanner" element={<QRScanner />} />
          <Route path="/upload-qr" element={<QRFileUploader />} />

        {/* ✅ Customer Menu & Order */}
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/add-bulk-items" element={<BulkItemUpload />} />


          {/* ✅ Admin Manage Tables */}
          <Route path="/table-manager" element={<TableManager />} />

          {/* ✅ Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </>
    </RestaurantProvider>
     </ConfirmationModalProvider>
  );
}
