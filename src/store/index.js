
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import formReducer from "./formSlice";
import cartReducer from "./CartSlice"; 
import storageSession from "redux-persist/lib/storage/session"; 
import {
  persistStore,
  persistReducer,
  createTransform,
} from "redux-persist";


const removeSensitiveTransform = createTransform(
  (inboundState, key) => {
    if (!inboundState) return inboundState;
    
 
    if (key === "form") {
      const { password, confirmPassword, ...rest } = inboundState;
      return rest;
    }
    
    
    return inboundState;
  },
  (outboundState, key) => outboundState,
  { whitelist: ["form", "cart"] } 
);


const rootReducer = combineReducers({
  form: formReducer,
  cart: cartReducer, 
});


const persistConfig = {
  key: "root",
  storage: storageSession, 
  transforms: [removeSensitiveTransform],
  whitelist: ["form", "cart"], 
};


const persistedReducer = persistReducer(persistConfig, rootReducer);


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