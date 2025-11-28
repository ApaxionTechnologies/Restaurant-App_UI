import API from "./api";

// Auth
export const adminLogin = async (credentials) => {
  try {
    const res = await API.post("/auth/login", credentials);
    const token = res.data?.token;
    if (!token) throw new Error("Token not found");
    localStorage.setItem("token", token);
    return res.data; // { token, restaurant }
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const registerRestaurant = async (formData) =>
  API.post("/auth/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const logoutRestaurant = async () => API.post("/auth/logout");

export const forgotPassword = async (email) =>
  API.post("/auth/forgot-password", { email });

export const resetPassword = async (token, newPassword) =>
  API.post(`/auth/reset-password/${token}`, { password: newPassword });
