import API from "./api.js"; 

export const getCategories = async () => {
  return await API.get("/categories"); 
};

export const getCategoryById = async (id) => {
  return await API.get(`/categories/${id}`);
};

export const addCategory = async (data) => {
  return await API.post("/categories", data);
};

export const updateCategory = async (id, data) => {
  return await API.put(`/categories/${id}`, data);
};

export const deleteCategory = async (id) => {
  return await API.delete(`/categories/${id}`);
};
