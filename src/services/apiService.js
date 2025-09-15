import axios from "axios";
const API = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true,
  timeout: 1000 * 50,
});

export const registerRestaurant = async (formDataToSend) => {
  try {
    const response = await API.post("/restaurants/register", formDataToSend, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const adminLogin = async (credentials) => {
  try {
    const response = await API.post("/restaurants/login", credentials, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};


export const getMyRestaurant = async (token) => {
  try {
    const res = await API.get("/restaurants/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
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

export const updateMenuStatus = async (menuItemId, newStatus, token) => {
  try {
    const res = await API.put(
      `/menu/${menuItemId}/status`,
      { status: newStatus },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
export const addMenuItem = async (data, token) => {
  try {
    const res = await API.post("/menu/add", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const fetchMe = async (token) => {
  try {
    const res = await API.get("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const logoutRestaurant = async () => {
  try {
    const res = await API.post("/auth/logout");
    return res.data; 
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
export const updateRestaurantProfile = async (formData, token) => {
  try {
    const response = await API.put("/restaurants/profile", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error.response?.data || error;
  }
};


export const updateMenuItem = async (menuItemId, formData, token) => {
  try {
    const res = await API.put(`/menu/${menuItemId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteMenuItem = async (menuItemId, token) => {
  try {
    const res = await API.delete(`/menu/${menuItemId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateRestaurantTables = async (token, tableCount) => {
  try {
    const response = await API.put(
      "/restaurants/tables",  
      { tables: tableCount },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to update tables");
  }
};
