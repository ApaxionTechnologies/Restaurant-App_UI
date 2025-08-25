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

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [table, setTable] = useState(null);


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


 
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, clearCart, updateQty, table, setTable }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
