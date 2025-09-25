import axios from "axios";
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



// Place an order
export const placeOrder = async (orderData) => {
  try {
    const res = await API.post("/orders", orderData, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Fetch all orders for this restaurant
export const getOrders = async (restaurantId) => {
  try {
    const res = await API.get(`/orders`, {
      params: { restaurantId },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update order status
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const res = await API.put(`/orders/${orderId}`, { status: newStatus });
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Edit an order (tableNo, items, status)
export const editOrder = async (orderId, updatedData) => {
  try {
    const res = await API.put(`/orders/edit/${orderId}`, updatedData, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteOrder = async (orderId) => {
  try {
    const res = await API.delete(`/orders/delete/${orderId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Fetch single order by ID
export const getOrderById = async (orderId) => {
  try {
    const res = await API.get(`/orders/${orderId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
