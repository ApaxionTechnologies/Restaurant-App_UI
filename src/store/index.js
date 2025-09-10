import { configureStore, combineReducers } from "@reduxjs/toolkit";
import formReducer from "./formSlice";
import storageSession from "redux-persist/lib/storage/session"; 
import {
  persistStore,
  persistReducer,
  createTransform,
} from "redux-persist";

const removeSensitiveTransform = createTransform(
  (inboundState, key) => {
    if (!inboundState) return inboundState;
    const { password, confirmPassword, ...rest } = inboundState;
    return rest;
  },
  (outboundState, key) => outboundState,
  { whitelist: ["form"] }
);

const rootReducer = combineReducers({
  form: formReducer,
});

const persistConfig = {
  key: "root",
  storage: storageSession, 
  transforms: [removeSensitiveTransform],
  whitelist: ["form"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefault) => getDefault(),
});

export const persistor = persistStore(store);

export default store;
