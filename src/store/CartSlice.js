// src/store/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },
  reducers: {
    addItem: (state, action) => {
      const existingItem = state.items.find(item => item.name === action.payload.name);
      if (existingItem) {
        existingItem.qty += 1;
      } else {
        state.items.push({ ...action.payload, qty: 1 });
      }
    },
    updateQty: (state, action) => {
      const { name, change } = action.payload;
      const item = state.items.find(item => item.name === name);
      if (item) {
        item.qty += change;
        if (item.qty <= 0) {
          state.items = state.items.filter(i => i.name !== name);
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.name !== action.payload);
    },
  },
});

export const { addItem, updateQty, clearCart, removeItem } = cartSlice.actions;
export default cartSlice.reducer;