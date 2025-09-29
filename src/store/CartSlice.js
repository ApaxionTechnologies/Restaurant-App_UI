import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const { menuItemId, name, price, type } = action.payload;
      const existingItem = state.items.find((item) => item.menuItemId === menuItemId);

      if (existingItem) {
        existingItem.qty += 1;
      } else {
        state.items.push({
          menuItemId,
          name,
          price,
          type,
          qty: 1,
        });
      }
    },
    updateQty: (state, action) => {
      const { menuItemId, change } = action.payload;
      const item = state.items.find((item) => item.menuItemId === menuItemId);
      if (item) {
        item.qty += change;
        if (item.qty <= 0) {
          state.items = state.items.filter((i) => i.menuItemId !== menuItemId);
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.menuItemId !== action.payload);
    },
  },
});

export const { addToCart, updateQty, clearCart, removeItem } = cartSlice.actions;
export default cartSlice.reducer;
