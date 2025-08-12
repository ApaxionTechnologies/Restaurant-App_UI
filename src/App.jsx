// import React from "react";
// import { Routes, Route } from "react-router-dom";

// // ✅ Pages
// import HomePage from "./pages/HomePage";
// import RegisterRestaurant from "./pages/RegisterRestaurant";
// import AdminLogin from "./pages/AdminLogin";
// import Login from "./pages/Login";
// import MenuPage from "./pages/MenuPage"; // ✅ Ensure default export
// import OrderSuccess from "./pages/OrderSuccess";
// import AdminDashboard from "./pages/AdminDashboard";
// import GenerateQR from "./pages/GenerateQR";
// import RemoveItem from "./pages/RemoveItem";
// // import CurrentMenu from "./pages/CurrentMenu"; // ✅ Ensure default export
// import MenuView from "./pages/MenuView";

// // ✅ Components
// import AddMenuItem from "./components/AddMenuItem"; // ✅ Ensure default export
// import QRScanner from "./components/QRScanner";     // ✅ Ensure default export
// import TableManager from "./components/TableManager"; // Correct import path

// // ✅ QR File Uploader from src
// import QRFileUploader from "./QRFileUploader";       // ✅ Ensure default export

// // ✅ Styles
// import "./styles/global.css";
// import "./styles/MenuCard.css";
// import "./styles/QRFileUploader.css";

// export default function App() {
//   return (
//     <Routes>
//       {/* ✅ Public Routes */}
//       <Route path="/" element={<HomePage />} />
//       <Route path="/login" element={<Login />} />

//       {/* ✅ Restaurant & Admin Routes */}
//       <Route path="/register" element={<RegisterRestaurant />} />
//       <Route path="/admin-login" element={<AdminLogin />} />
//       <Route path="/admin-dashboard" element={<AdminDashboard />} />
//       <Route path="/add-item" element={<AddMenuItem />} />
//       <Route path="/view-menu" element={<MenuView />} />
//       <Route path="/remove-item" element={<RemoveItem />} />
//       <Route path="/generate-qr" element={<GenerateQR />} />
     

//       {/* ✅ Customer QR Options */}
//       <Route path="/scanner" element={<QRScanner />} />
//       <Route path="/upload-qr" element={<QRFileUploader />} />

//       {/* ✅ Customer Menu & Order */}
//       <Route path="/menu" element={<MenuPage />} />
//       <Route path="/order-success" element={<OrderSuccess />} />

//       {/* ✅ Admin Manage Tables */}
//       <Route path="/table-manager" element={<TableManager />} /> {/* Add this route */}
//     </Routes>
//   );
// }

import React from "react";
import { Routes, Route } from "react-router-dom";

// ✅ Pages
import HomePage from "./pages/HomePage";
import RegisterRestaurant from "./pages/RegisterRestaurant";
import AdminLogin from "./pages/AdminLogin";
import Login from "./pages/Login";
import MenuPage from "./pages/MenuPage"; // ✅ Ensure default export
import OrderSuccess from "./pages/OrderSuccess";
import AdminDashboard from "./pages/AdminDashboard";
import GenerateQR from "./pages/GenerateQR";
import RemoveItem from "./pages/RemoveItem";
import CurrentMenu from "./pages/CurrentMenu"; // ✅ Used instead of MenuView

// ✅ Components
import AddMenuItem from "./components/AddMenuItem";
import QRScanner from "./components/QRScanner";
import TableManager from "./components/TableManager";
import ViewMenu from "./components/ViewMenu";

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
      <Route path="/view-menu" element={<ViewMenu />} />
      <Route path="/remove-item" element={<RemoveItem />} />
      <Route path="/generate-qr" element={<GenerateQR />} />
      <Route path="/current-menu" element={<CurrentMenu />} />

      {/* ✅ Customer QR Options */}
      <Route path="/scanner" element={<QRScanner />} />
      <Route path="/upload-qr" element={<QRFileUploader />} />

      {/* ✅ Customer Menu & Order */}
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/order-success" element={<OrderSuccess />} />

      {/* ✅ Admin Manage Tables */}
      <Route path="/table-manager" element={<TableManager />} />
    </Routes>
  );
}
