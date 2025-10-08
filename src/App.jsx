import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import HomePage from "./pages/HomePage";
import RegisterRestaurant from "./pages/RegisterRestaurant";
import AdminLogin from "./pages/AdminLogin";
import MenuPage from "./pages/MenuPage";
import OrderSuccess from "./pages/OrderSuccess";
import AdminDashboard from "./pages/AdminDashboard";
import GenerateQR from "./pages/GenerateQR";
import CurrentMenu from "./pages/CurrentMenu";
import FeedbackPage from "./pages/Feedbackpage";
import ForgotPassword from "./pages/forgotPassword";
import EditRestaurantProfile from "./pages/EditRestaurantProfile";
import ResetPasswordPage from "./pages/ResetPasswordForm";
import GenerateMenuQR from "./pages/GenerateMenuQR";


import TaxSlabManagement from "./components/TaxSlabManagement";

import AddMenuItem from "./components/AddMenuItem";
import TableManager from "./components/TableManager";
import ViewMenu from "./components/ViewMenu";
import CartPage from "./components/cartpage";
import ScannerPage from "./components/ScannerPage";
import ProtectedRoute from "./components/ProtectRoute";
import OrderManagement from "./components/OrderManagement";
import { BulkItemUpload } from "./pages/BulkItemUpload";
import { ConfirmationModalProvider } from "./context/ConfirmationModalContext";
import { RestaurantProvider } from "./context/RestaurantContext";


import { NotificationProvider } from './context/Notification'
import { AuthProvider } from "./context/AuthContext";

import "./styles/global.css";
import "./styles/MenuCard.css";
import "./styles/QRFileUploader.css";

import './styles/ViewMenu.css';


import { Toaster } from "react-hot-toast";
import Config from "./pages/config/Config";


import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function App() {
  const location = useLocation();
  const state = location.state || {};

 return (
  <ConfirmationModalProvider>
     <AuthProvider>
    <RestaurantProvider>
     
      <NotificationProvider>
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
      <ToastContainer position="top-right" autoClose={3000} />
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

         
          <Route path="/registerrestaurant" element={<RegisterRestaurant />} />
          <Route path="/admin-login" element={<AdminLogin />} />             
<Route path ="/edit-restaurant-profile" element={<EditRestaurantProfile/>}/>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

        
        <Route path="/add-item" element={<AddMenuItem />} /> 
        <Route path="/edit-menu/:itemId" element={<AddMenuItem />} />

        <Route path="/menu/:restaurantId" element={<ViewMenu />} />
        <Route path="/generate-qr" element={<GenerateQR />} />
        <Route path="/generate-menu-qr" element={<GenerateMenuQR />} />
        <Route path="/current-menu" element={<CurrentMenu />} />
        <Route path="/order-management" element={<OrderManagement />} />
        <Route path="/tax-management" element={<TaxSlabManagement />} />

        
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/add-bulk-items" element={<BulkItemUpload />} />
        <Route path="/config" element={<Config />} />

              
              <Route path="/table-manager" element={<TableManager />} />

          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
       
      </>
      </NotificationProvider>
     
    </RestaurantProvider>
    </AuthProvider>
     </ConfirmationModalProvider>
  );
}
