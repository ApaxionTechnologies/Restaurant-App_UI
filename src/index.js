// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App";
// import { BrowserRouter } from "react-router-dom";
// import { CartProvider } from "./context/CartContext";
// import { GoogleOAuthProvider } from "@react-oauth/google";
// import './styles/global.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';

// const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <React.StrictMode>
//     <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
//       <CartProvider>
//         <BrowserRouter>
//           <App />
//         </BrowserRouter>
//       </CartProvider>
//     </GoogleOAuthProvider>
//   </React.StrictMode>
// );

// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

import "./styles/global.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// redux + persist
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./store"; // <- adjust path if your store file is elsewhere

const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* Redux provider + persisted gate */}
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* keep GoogleOAuth + CartProvider as before */}
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <CartProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </CartProvider>
        </GoogleOAuthProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
