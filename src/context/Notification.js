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

  // Fetch unseen order count from backend
  const fetchNotificationCount = useCallback(async () => {
    if (!restaurantId) return;  // Skip if no restaurantId available

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

  // Mark all as seen
  const clearNotifications = useCallback(async () => {
    try {
      await fetch("http://localhost:5001/api/orders/mark-seen", { method: "PATCH" });
      setNotificationCount(0);
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  }, []);

  // Fetch once on load + auto-poll every 30 seconds
  useEffect(() => {
    if (!restaurantId) return;  // Only fetch if restaurantId exists

    fetchNotificationCount();  // Initial fetch

    const interval = setInterval(() => {
      fetchNotificationCount();
    }, 30000);  // Poll every 30 sec

    return () => clearInterval(interval);  // Cleanup on unmount
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

