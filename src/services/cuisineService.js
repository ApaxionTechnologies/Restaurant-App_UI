import API from "./api.js"; 

export const getCuisines = async () => {
  return await API.get("/cuisines"); 
};

export const getCuisineById = async (id) => {
  return await API.get(`/cuisines/${id}`);
};

export const addCuisine = async (data) => {
  return await API.post("/cuisines", data);
};

export const updateCuisine = async (id, data) => {
  return await API.put(`/cuisines/${id}`, data);
};

export const deleteCuisine = async (id) => {
  return await API.delete(`/cuisines/${id}`);
};
