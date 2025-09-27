// import { configureStore, combineReducers } from "@reduxjs/toolkit";
// import formReducer from "./formSlice";
// import storageSession from "redux-persist/lib/storage/session"; 
// import {
//   persistStore,
//   persistReducer,
//   createTransform,
// } from "redux-persist";

// const removeSensitiveTransform = createTransform(
//   (inboundState, key) => {
//     if (!inboundState) return inboundState;
//     const { password, confirmPassword, ...rest } = inboundState;
//     return rest;
//   },
//   (outboundState, key) => outboundState,
//   { whitelist: ["form"] }
// );

// const rootReducer = combineReducers({
//   form: formReducer,
// });

// const persistConfig = {
//   key: "root",
//   storage: storageSession, 
//   transforms: [removeSensitiveTransform],
//   whitelist: ["form"],
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefault) => getDefault(),
// });

// export const persistor = persistStore(store);

// export default store;

// store/index.js// src/store/index.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import formReducer from "./formSlice";
import cartReducer from "./CartSlice"; // Import your new cart slice
import storageSession from "redux-persist/lib/storage/session"; 
import {
  persistStore,
  persistReducer,
  createTransform,
} from "redux-persist";

// Create transform to remove sensitive data from form state
const removeSensitiveTransform = createTransform(
  (inboundState, key) => {
    if (!inboundState) return inboundState;
    
    // For form state, remove sensitive fields
    if (key === "form") {
      const { password, confirmPassword, ...rest } = inboundState;
      return rest;
    }
    
    // For cart state, no transformation needed
    return inboundState;
  },
  (outboundState, key) => outboundState,
  { whitelist: ["form", "cart"] } // Apply to both form and cart
);

// Combine reducers
const rootReducer = combineReducers({
  form: formReducer,
  cart: cartReducer, // Add cart reducer
});

// Persist configuration
const persistConfig = {
  key: "root",
  storage: storageSession, 
  transforms: [removeSensitiveTransform],
  whitelist: ["form", "cart"], // Persist both form and cart
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
export default store;