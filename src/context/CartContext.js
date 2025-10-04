import React, { createContext, useContext, useState } from "react";
import axios from 'axios'
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [table, setTable] = useState(null);
  const[discountPercentage,setDiscountPercentage]=useState('');

  const addToCart = (item) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.name === item.name);
      if (exists) {
        return prev.map((i) =>
          i.name === item.name ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

 
  const updateQty = (name, delta) => {
  setCart((prev) =>
    prev
      .map((item) =>
        item.name === name
          ? { ...item, qty: item.qty + delta }
          : item
      )
      .filter((item) => item.qty > 0) 
  );
};
const savediscount = async () => {
  try {
    const { data } = await axios.post(
      '/api/restaurants/restaurantdiscount',
      { discount: discountPercentage },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (data.success) {
      console.log("Discount Saved:", data.discount);
      setDiscountPercentage(data.discount);
    } else {
      console.log(data.message);
    }
  } catch (error) {
    console.error("Save discount failed:", error);
  }
};
 
  const clearCart = () => setCart([]);


  return (
    <CartContext.Provider
      value={{ cart, addToCart, clearCart, updateQty, table, setTable,savediscount, discountPercentage, setDiscountPercentage }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
