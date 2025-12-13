import React, { useEffect } from "react";
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

import Sidebar from './components/Sidebar'
import TaxSlabManagement from "./components/TaxSlabManagement";
import AddMenuItem from "./components/AddMenuItem";
import QRScanner from "./components/QRScanner";
import TableManager from "./components/TableManager";
import ViewMenu from "./components/ViewMenu";
import QRFileUploader from "./QRFileUploader";
import CartPage from "./components/cartpage";
import ScannerPage from "./components/ScannerPage";
import ProtectedRoute from "./components/ProtectRoute";
import OrderManagement from "./components/OrderManagement";
import Reports from "./components/Reports"; // ✅ Added Reports component
import { BulkItemUpload } from "./pages/BulkItemUpload";
import { ConfirmationModalProvider } from "./context/ConfirmationModalContext";
import { RestaurantProvider } from "./context/RestaurantContext";


import { NotificationProvider } from "./context/Notification";
import { AuthProvider } from "./context/AuthContext";

import "./styles/MenuCard.css";
import "./styles/QRFileUploader.css";
import "./styles/Reports.css"; // ✅ Added Reports CSS

import "./styles/ViewMenu.css";

import { Toaster } from "react-hot-toast";
import Config from "./pages/config/Config";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TopBarWrapper from "./components/TopBarWrapper";
import HomeHeader from "./components/HomeHeader";
import AdminLayout from "./components/AdminLayout";
export default function App() {
  const location = useLocation();
  const state = location.state || {};

  useEffect(() => {
    const timeout = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <ConfirmationModalProvider>
      <AuthProvider>
        <RestaurantProvider>
          <NotificationProvider>
            <>
              {" "}
              <Toaster
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

               
                <Route
                  path="/registerrestaurant"
                  element={<RegisterRestaurant />}
                />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route
                  path="/edit-restaurant-profile"
                  element={<EditRestaurantProfile />}
                />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route
                  path="/reset-password/:token"
                  element={<ResetPasswordPage />}
                />

                
                <Route path="/qr-scanner" element={<QRScanner />} />
                <Route path="/upload-qr" element={<QRFileUploader />} />
                <Route path="/tax-management" element={<TaxSlabManagement />} />

                
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/feedback" element={<FeedbackPage />} />
                <Route path="/header" element={<HomeHeader />} />
                <Route path="/sidebar" element={<Sidebar />} />
                <Route path="/admin-layout" element={<AdminLayout />} />

                <Route element={<TopBarWrapper />}>
                
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
                <Route path="/reports" element={<Reports />} /> {/* ✅ Added Reports route */}
                
                {/* ✅ Customer QR Options */}
                <Route path="/qr-scanner" element={<QRScanner />} />
                <Route path="/upload-qr" element={<QRFileUploader />} />

                {/* ✅ Customer Menu & Order */}
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/feedback" element={<FeedbackPage />} />
                <Route path="/add-bulk-items" element={<BulkItemUpload />} />
                <Route path="/config" element={<Config />} />

                  
                  <Route path="/table-manager" element={<TableManager />} />
                </Route>

               
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </>
          </NotificationProvider>
        </RestaurantProvider>
      </AuthProvider>
    </ConfirmationModalProvider>
  );
}