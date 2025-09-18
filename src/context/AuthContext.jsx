import React, { createContext, useState, useEffect } from "react";
import { getMyRestaurant, logoutRestaurant } from "../services/apiService.js";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const res = await getMyRestaurant();
        setUser(res.restaurant || null);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await logoutRestaurant(); 
    } catch (err) {
      console.warn("Logout API error ignored:", err);
    } finally {
    
      localStorage.removeItem("token");
      localStorage.removeItem("restaurantId");
      localStorage.removeItem("tableNumber");
      localStorage.removeItem("adminEmail");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
