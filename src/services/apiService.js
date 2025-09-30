import axios from "axios";
import { toast } from "react-toastify"; 

const API = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true,
  timeout: 1000 * 50,
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const registerRestaurant = async (formDataToSend) => {
  try {
    const response = await API.post("/auth/register", formDataToSend, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const adminLogin = async (credentials) => {
  try {
    const response = await API.post("/auth/login", credentials, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};


export const getMyRestaurant = async () => {
  try {
    const res = await API.get("/restaurants/me");
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
export const getMenuByRestaurant = async (restaurantId) => {
  try {
    const res = await API.get(`/menu/${restaurantId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateMenuStatus = async (menuItemId, newStatus) => {
  try {
    const res = await API.put(
      `/menu/${menuItemId}/status`,
      { status: newStatus }
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
export const addMenuItem = async (data) => {
  try {
    const res = await API.post("/menu/add", data, {
    headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// export const fetchMe = async (token) => {
//   try {
//     const res = await API.get("/auth/me", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return res.data;
//   } catch (error) {
//     throw error.response?.data || error.message;
//   }
// };

export const logoutRestaurant = async () => {
  try {
    const res = await API.post("/auth/logout");
    return res.data; 
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
export const updateRestaurantProfile = async (formData) => {
  try {
    const response = await API.put("/restaurants/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error.response?.data || error;
  }
};


export const updateMenuItem = async (menuItemId, formData) => {
  try {
    const res = await API.put(`/menu/${menuItemId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteMenuItem = async (menuItemId) => {
  try {
    const res = await API.delete(`/menu/${menuItemId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateRestaurantTables = async ( tableCount) => {
  try {
    const response = await API.put(
      "/restaurants/tables",  
      { tables: tableCount },
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to update tables");
  }
};

export const uploadBulkMenuItems = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await API.post("/menu/bulkAddMenuItem", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await API.post("/auth/forgot-password", { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await API.post(`/auth/reset-password/${token}`, {
      password: newPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createOrder = async (orderData) => {
  try {
    const res = await API.post("/orders", orderData, {
      headers: { "Content-Type": "application/json" },
    });
    toast.success("✅ Order placed successfully!");
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
export const getOrders = async () => {
  try {
    const res = await API.get("/orders");
    return res.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error.response?.data || error.message;
  }
};
export const updateOrderStatus = async (orderId, status) => {
  try {
    const res = await API.put(`/orders/${orderId}`, { status });
    return res.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error.response?.data || error.message;
  }
};
export const updateOrderItems = async (orderId, items) => {
  try {
    const response = await API.put(`/orders/edit/${orderId}`, { items });
    return response.data;
  } catch (error) {
    console.error("Update order items failed:", error);
    throw error;
  }
};