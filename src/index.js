// src/index.js
// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import { CartProvider } from "./context/CartContext";
// import './styles/global.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';
// // ✅ Setup routes (basic)
// const router = createBrowserRouter([
//   {
//     path: "/*", // Catch-all for nested routes inside App
//     element: <App />,
//   },
// ]);

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <React.StrictMode>
//     <CartProvider>
//       <RouterProvider
//         router={router}
//         future={{
//           v7_startTransition: true,
//           v7_relativeSplatPath: true,
//         }}
//       />
//     </CartProvider>
//   </React.StrictMode>
// );



// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { GoogleOAuthProvider } from "@react-oauth/google"; // ✅ Add this
import './styles/global.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// ✅ Replace this with your actual Google OAuth Client ID
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

// ✅ Setup routes
const router = createBrowserRouter([
  {
    path: "/*", // Catch-all for nested routes inside App
    element: <App />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <CartProvider>
        <RouterProvider
          router={router}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        />
      </CartProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
