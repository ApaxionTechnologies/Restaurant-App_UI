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

export const getConfigList = async (params) => {
  try {
    const res = await API.get("/config/getItemConfig",{
      params: params,
    });
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

// Add new tax slab
export const addTaxSlab = async (slabData) => {
  try {
    const res = await API.post("/tax-slabs", slabData, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get all tax slabs
export const getTaxSlabs = async () => {
  try {
    const res = await API.get("/tax-slabs");
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
    
   
// Update a tax slab
export const updateTaxSlab = async (slabId, slabData) => {
  try {
    const res = await API.put(`/tax-slabs/${slabId}`, slabData, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const calculateBillPreview = async (items) => {
  try {
    const res = await axios.post("/api/orders/calculate", { items });
    return res.data;
  } catch (error) {
    console.error("Error fetching bill preview:", error);
    throw error;
  }
};
export const deleteOrder = async (orderId) => {
  try {
    const res = await API.delete(`/orders/${orderId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
    
export const addConfigItem = async (payload) => {
  try {
    const res = await API.post("/config/addItemConfig", payload);

    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const configItemAction = async (payload) => {
  try {
    const res = await API.post("/config/itemConfigAction", payload);

    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const editConfigItemDetails = async (payload) => {
  try {
    const res = await API.post("/config/updateItemDetails", payload);

    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const flipCuisineStatus = async (payload) => {
  try {
    const res = await API.post("/restaurants/flipCuisineStatus", payload);

    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getTaxConfigList = async (params) => {
  try {
    const res = await API.get("/config/getTaxConfigList");
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const addTaxConfigList = async (payload) => {
  try {
    const res = await API.post("/config/addTaxConfig", payload);

    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const taxConfigAction = async (payload) => {
  try {
    const res = await API.post("/config/taxConfigAction", payload);

    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateTaxDefault = async (payload) => {
  try {
    const res = await API.post("/config/updateDefaultTaxConfig", payload);

    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};