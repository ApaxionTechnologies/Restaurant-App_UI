import API from "./api";

export const getMyRestaurant = async () => API.get("/restaurants/me");

// export const getMyRestaurant = async () => {
//   try {
//     const res = await API.get("/restaurants/me");
    
//     console.log("🔍 SERVICE RETURN:", res);
//     return res;
//   } catch (error) {
//     throw error.response?.data || error.message;
//   }
// };
// export const updateRestaurantProfile = async (formData) =>
//   API.put("/restaurants/profile", formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
export const updateRestaurantProfile = async (formData) => {
  try {
    const response = await API.put("/restaurants/profile", formData);
    return response;
  } catch (error) {
    console.error("Update profile error:", error);
    throw error.response?.data || error;
  }
};

export const updateRestaurantTables = async (tables) =>
  API.post("/tables", { tables });

export const flipCuisineStatus = async (payload) =>
  API.post("/restaurants/flipCuisineStatus", payload);
