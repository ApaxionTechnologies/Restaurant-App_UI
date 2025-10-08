import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { AuthContext } from '../context/AuthContext';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { restaurantId } = useContext(AuthContext);
  const [notificationCount, setNotificationCount] = useState(0);


  const fetchNotificationCount = useCallback(async () => {
    if (!restaurantId) return;  

    try {
      const res = await fetch(`http://localhost:5001/api/orders/unseen-count?restaurantId=${restaurantId}`);
      if (!res.ok) {
        console.error("Failed to fetch notification count, status:", res.status);
        return;
      }
      const data = await res.json();
      if (data.success) {
        setNotificationCount(data.count);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, [restaurantId]);

 
  const clearNotifications = useCallback(async () => {
    try {
      await fetch("http://localhost:5001/api/orders/mark-seen", { method: "PATCH" });
      setNotificationCount(0);
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  }, []);

  
  useEffect(() => {
    if (!restaurantId) return;  
    fetchNotificationCount();  

    const interval = setInterval(() => {
      fetchNotificationCount();
    }, 30000);  

    return () => clearInterval(interval);  
  }, [fetchNotificationCount, restaurantId]);

  const value = {
    notificationCount,
    fetchNotificationCount,
    clearNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

