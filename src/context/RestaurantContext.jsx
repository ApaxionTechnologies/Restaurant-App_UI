import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";

const RestaurantContext = createContext();

export const useRestaurant = () => useContext(RestaurantContext);

export const RestaurantProvider = ({ children }) => {
  const location = useLocation();
  const params = useParams();

  const [restaurant, setRestaurant] = useState(null); 
  const [table, setTable] = useState("");

  useEffect(() => {
    let rId = params.restaurantId || null;

    const query = new URLSearchParams(location.search);
    if (!rId && query.get("restaurantId")) rId = query.get("restaurantId");
    const tNum = query.get("table") || query.get("tableNumber");

    const savedRestaurant = localStorage.getItem("restaurantId");
    const savedTable = localStorage.getItem("tableNumber");

    if (rId) setRestaurant(rId);
    else if (savedRestaurant) setRestaurant(savedRestaurant);

    if (tNum) setTable(tNum);
    else if (savedTable) setTable(savedTable);
  }, [params.restaurantId, location.search]);

  useEffect(() => {
    if (restaurant) {
      const rid =
        typeof restaurant === "object"
          ? restaurant._id || restaurant.id
          : restaurant;

      if (rid) localStorage.setItem("restaurantId", rid);
    }

    if (table) localStorage.setItem("tableNumber", table);
  }, [restaurant, table]);

  return (
    <RestaurantContext.Provider
      value={{ restaurant, setRestaurant, table, setTable }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};
