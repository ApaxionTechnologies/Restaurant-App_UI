





// src/App.jsx


// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// // ✅ Import all components correctly (default vs named)
// import RegisterRestaurant from "./pages/RegisterRestaurant";
// import Login from "./pages/Login";
// import AdminLogin from "./pages/AdminLogin";
// import AdminDashboard from "./pages/AdminDashboard";
// import AddMenuItem from "./pages/AddMenuItem";
// import RemoveItem from "./pages/RemoveItem";
// import GenerateQR from "./pages/GenerateQR";
// import ViewMenu from "./pages/ViewMenu";
// import CurrentMenu from "./pages/CurrentMenu";
// import Scanner from "./pages/Scanner";
// import UploadQR from "./pages/UploadQR";
// import Menu from "./pages/Menu";
// import OrderSuccess from "./pages/OrderSuccess";
// import ViewAllItems from "./pages/ViewAllItems";
// import TableManager from "./pages/TableManager";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Default route */}
//         <Route path="/" element={<Login />} />

//         {/* Restaurant registration & login */}
//         <Route path="/register" element={<RegisterRestaurant />} />
//         <Route path="/login" element={<Login />} />

//         {/* Admin routes */}
//         <Route path="/admin-login" element={<AdminLogin />} />
//         <Route path="/admin-dashboard" element={<AdminDashboard />} />

//         {/* Menu routes */}
//         <Route path="/add-item" element={<AddMenuItem />} />
//         <Route path="/remove-item" element={<RemoveItem />} />
//         <Route path="/view-menu" element={<ViewMenu />} />
//         <Route path="/current-menu" element={<CurrentMenu />} />
//         <Route path="/view-all-items" element={<ViewAllItems />} />

//         {/* QR / Scanner */}
//         <Route path="/generate-qr" element={<GenerateQR />} />
//         <Route path="/upload-qr" element={<UploadQR />} />
//         <Route path="/scanner" element={<Scanner />} />

//         {/* Orders */}
//         <Route path="/menu" element={<Menu />} />
//         <Route path="/order-success" element={<OrderSuccess />} />

//         {/* Tables */}
//         <Route path="/table-manager" element={<TableManager />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


// // src/App.jsx
// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// // ✅ Pages
// import RegisterRestaurant from "./pages/RegisterRestaurant";
// import Login from "./pages/Login";
// import AdminLogin from "./pages/AdminLogin";
// import AdminDashboard from "./pages/AdminDashboard";
// import RemoveItem from "./pages/RemoveItem";
// import GenerateQR from "./pages/GenerateQR";
// import CurrentMenu from "./pages/CurrentMenu";
// import OrderSuccess from "./pages/OrderSuccess";
// import FeedbackPage from "./pages/Feedbackpage";
// import HomePage from "./pages/HomePage";
// import MenuPage from "./pages/MenuPage";

// // ✅ Components
// import AddMenuItem from "./components/AddMenuItem";
// import QRScanner from "./components/QRScanner";
// import TableManager from "./components/TableManager";
// import ViewMenu from "./components/ViewMenu";
// import CartPage from "./components/cartpage";
// import ScannerPage from "./components/ScannerPage";

// // ✅ Styles
// import "./styles/global.css";
// import "./styles/MenuCard.css";
// import "./styles/QRFileUploader.css";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Public routes */}
//         <Route path="/" element={<HomePage />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/scanner" element={<ScannerPage />} />

//         {/* Restaurant & Admin */}
//         <Route path="/registerrestaurant" element={<RegisterRestaurant />} />
//         <Route path="/admin-login" element={<AdminLogin />} />
//         <Route path="/admin-dashboard" element={<AdminDashboard />} />

//         {/* Menu Management */}
//         <Route path="/add-item" element={<AddMenuItem />} />
//         <Route path="/view-menu" element={<ViewMenu />} />
//         <Route path="/remove-item" element={<RemoveItem />} />
//         <Route path="/generate-qr" element={<GenerateQR />} />
//         <Route path="/current-menu" element={<CurrentMenu />} />

//         {/* QR Options */}
//         <Route path="/scanner" element={<QRScanner />} />

//         {/* Customer Menu & Orders */}
//         <Route path="/menu" element={<MenuPage />} />
//         <Route path="/feedback" element={<FeedbackPage />} />
//         <Route path="/cart" element={<CartPage />} />
//         <Route path="/order-success" element={<OrderSuccess />} />

//         {/* Tables */}
//         <Route path="/table-manager" element={<TableManager />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;



import React from "react"; 
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

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
import FeedbackPage from "./pages/Feedbackpage";

// ✅ Components
import AddMenuItem from "./components/AddMenuItem";
import QRScanner from "./components/QRScanner";
import TableManager from "./components/TableManager";
import ViewMenu from "./components/ViewMenu";
import QRFileUploader from "./QRFileUploader";
import CartPage from "./components/cartpage";
import ScannerPage from "./components/ScannerPage";
import ProtectedRoute from "./components/ProtectRoute";


// ✅ Styles
import "./styles/global.css";
import "./styles/MenuCard.css";
import "./styles/QRFileUploader.css";
import './styles/theme.css';
import './styles/ViewMenu.css';

import { RestaurantProvider } from "./context/RestaurantContext";

export default function App() {
  const location = useLocation();
  const state = location.state || {};

  return (
    <RestaurantProvider>
      <Routes>
        {/* ✅ Public Routes */}
        <Route
          path="/"
          element={
            <>
              <HomePage />
              {/* Show AdminLogin modal if redirected from ProtectedRoute */}
              {state.showAdminLogin && <AdminLogin />}
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/scanner" element={<ScannerPage />} />

        {/* ✅ Restaurant & Admin Routes */}
        <Route path="/registerrestaurant" element={<RegisterRestaurant />} />
        <Route path="/admin-login" element={<AdminLogin />} />

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
        <Route path="/view-menu" element={<ViewMenu />} />
        <Route path="/remove-item" element={<RemoveItem />} />
        <Route path="/generate-qr" element={<GenerateQR />} />
        <Route path="/current-menu" element={<CurrentMenu />} />

        {/* ✅ Customer QR Options */}
        <Route path="/qr-scanner" element={<QRScanner />} />
        <Route path="/upload-qr" element={<QRFileUploader />} />

        {/* ✅ Customer Menu & Order */}
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/feedback" element={<FeedbackPage />} />

        {/* ✅ Admin Manage Tables */}
        <Route path="/table-manager" element={<TableManager />} />

        {/* ✅ Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </RestaurantProvider>
  );
}
