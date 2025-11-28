import API from "./api";

export const getMenuByRestaurant = async (restaurantId) => {
  try {
    const res = await API.get(`/menu/${restaurantId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const addMenuItem = (data) =>
  API.post("/menu/add", data, { headers: { "Content-Type": "multipart/form-data" } });

export const updateMenuItem = (menuItemId, formData) =>
  API.put(`/menu/${menuItemId}`, formData, { headers: { "Content-Type": "multipart/form-data" } });

export const deleteMenuItem = (menuItemId) => API.delete(`/menu/${menuItemId}`);

export const updateMenuStatus = (menuItemId, status) =>
  API.put(`/menu/${menuItemId}/status`, { status });

export const uploadBulkMenuItems = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return API.post("/menu/bulkAddMenuItem", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
