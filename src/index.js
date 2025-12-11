
import React, { Suspense } from "react";

import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./styles/global.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";


import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./store"; 
import "./config/i18n";
import { I18nextProvider } from "react-i18next";
import i18n from "./config/i18n";
import "./index.css";

const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <I18nextProvider i18n={i18n}>
          <Suspense fallback={<div>Loading…</div>}>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <CartProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </CartProvider>
        </GoogleOAuthProvider>
            </Suspense>
        </I18nextProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
