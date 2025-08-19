import React, { createContext, useContext, useState, useEffect } from "react";

// Context
const RestaurantContext = createContext();

// Custom hook for easy usage
export const useRestaurant = () => useContext(RestaurantContext);

export const RestaurantProvider = ({ children }) => {
  const [restaurant, setRestaurant] = useState("");
  const [table, setTable] = useState("");

  // Step 2: Load from localStorage on first mount
  useEffect(() => {
    const savedRestaurant = localStorage.getItem("restaurant");
    const savedTable = localStorage.getItem("table");

    if (savedRestaurant && savedTable) {
      setRestaurant(savedRestaurant);
      setTable(savedTable);
    }
  }, []);

  // Step 3: Save to localStorage whenever it changes
  useEffect(() => {
    if (restaurant) localStorage.setItem("restaurant", restaurant);
    if (table) localStorage.setItem("table", table);
  }, [restaurant, table]);

  return (
    <RestaurantContext.Provider
      value={{ restaurant, setRestaurant, table, setTable }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};
