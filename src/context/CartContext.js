// import React, { createContext, useContext, useState } from "react";

// const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState([]);
//   const [table, setTable] = useState(null);

//   // ➕ Add item to cart
//   const addToCart = (item) => {
//     setCart((prev) => {
//       const exists = prev.find((i) => i.name === item.name);
//       if (exists) {
//         return prev.map((i) =>
//           i.name === item.name ? { ...i, qty: i.qty + 1 } : i
//         );
//       }
//       return [...prev, { ...item, qty: 1 }];
//     });
//   };

//   // ➖ Remove 1 quantity or item completely
//   const removeFromCart = (itemName) => {
//     setCart((prev) =>
//       prev
//         .map((i) =>
//           i.name === itemName ? { ...i, qty: i.qty - 1 } : i
//         )
//         .filter((i) => i.qty > 0)
//     );
//   };

//   // ❌ Clear entire cart
//   const clearCart = () => setCart([]);

//   return (
//     <CartContext.Provider
//       value={{
//         cart,
//         addToCart,
//         removeFromCart,
//         clearCart,
//         table,
//         setTable,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// // Custom hook
// export const useCart = () => useContext(CartContext);



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
const savediscount=async()=>{
  try{
    const restaurantId = localStorage.getItem("restaurantId");
    const {data}=await axios.post('/api/restaurants/restaurantdiscount',{discount:discountPercentage},{restaurantId: restaurantId})
    if(data.success) {
      console.log(data.discount)
      setDiscountPercentage(data.discount)
    }
    else {
      console.log(data.error)
    }

  }
  catch(error) {
    console.log(error)
  }
}
 
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
