// import axios from "axios";
// const API = axios.create({
//   baseURL: "http://localhost:5001/api",
//   withCredentials: true,
//   timeout: 1000 * 50,
// });

// export const registerRestaurant = async (formDataToSend) => {
//   try {
//     const response = await API.post("/restaurants/register", formDataToSend, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || error;
//   }
// };

// export const adminLogin = async (credentials) => {
//   try {
//     const response = await API.post("/restaurants/login", credentials, {
//       headers: { "Content-Type": "application/json" },
//     });
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || error;
//   }
// };


// export const getMyRestaurant = async (token) => {
//   try {
//     const res = await API.get("/restaurants/me", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return res.data;
//   } catch (error) {
//     throw error.response?.data || error.message;
//   }
// };
// export const getMenuByRestaurant = async (restaurantId) => {
//   try {
//     const res = await API.get(`/menu/${restaurantId}`);
//     return res.data;
//   } catch (error) {
//     throw error.response?.data || error.message;
//   }
// };

// export const updateMenuStatus = async (menuItemId, newStatus, token) => {
//   try {
//     const res = await API.put(
//       `/menu/${menuItemId}/status`,
//       { status: newStatus },
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );
//     return res.data;
//   } catch (error) {
//     throw error.response?.data || error.message;
//   }
// };
// export const addMenuItem = async (data, token) => {
//   try {
//     const res = await API.post("/menu/add", data, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return res.data;
//   } catch (error) {
//     throw error.response?.data || error.message;
//   }
// };

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

// export const logoutRestaurant = async () => {
//   try {
//     const res = await API.post("/auth/logout");
//     return res.data; 
//   } catch (error) {
//     throw error.response?.data || error.message;
//   }
// };


//   // const handleStatusChange = async (menuItemId, newStatus) => {
//   //   if (!menuItemId) {
//   //     console.warn("No ID provided for status change");
//   //     alert("This menu item doesn't have a valid ID. Please refresh the page and try again.");
//   //     return;
//   //   }
//   //   try {
//   //     const token = localStorage.getItem("token");
//   //     const response = await axios.put(`http://localhost:5001/api/menu/${menuItemId}/status`, {
//   //       status: newStatus,
//   //     }, {
//   //       headers: { Authorization: `Bearer ${token}` }
//   //     });
      
//   //     setMenuItems(prev =>
//   //       prev.map(item =>
//   //         item._id === menuItemId
//   //           ? { ...item, status: newStatus, statusNormalized: newStatus.toLowerCase() }
//   //           : item
//   //       )
//   //     );
//   //   } catch (err) {
//   //     console.error(`Failed to change status to ${newStatus}`, err);
//   //     console.error("Error response:", err.response?.data);
//   //     alert(`Failed to update item status. Please try again. Error: ${err.response?.data?.message || err.message}`);
//   //   }
//   // };

//   // const handleEdit = (item) => {
//   //   setEditingItem(item);
//   //   setEditFormData({
//   //     name: item.name || "",
//   //     price: item.price || "",
//   //     category: item.category || "Starter",
//   //     cuisine: item.cuisine || "Indian",
//   //     prepTime: item.prepTime || item.timeToPrepare || "",
//   //     ingredients: Array.isArray(item.ingredients) ? item.ingredients.join(", ") : item.ingredients || "",
//   //     description: item.description || "",
//   //     status: item.status || "Published",
//   //     type: item.type || "veg",
//   //     discount: item.discount || ""
//   //   });
//   //   setShowEditModal(true);
//   // };

//   // const handleEditSubmit = async (e) => {
//   //   e.preventDefault();
//   //   try {
//   //     const token = localStorage.getItem("token");
//   //     const formData = new FormData();
      
//   //     Object.keys(editFormData).forEach(key => {
//   //       formData.append(key, editFormData[key]);
//   //     });

//   //     const response = await axios.put(`http://localhost:5001/api/menu/${editingItem._id}`, formData, {
//   //       headers: {
//   //         Authorization: `Bearer ${token}`,
//   //         'Content-Type': 'multipart/form-data'
//   //       }
//   //     });

//   //     setMenuItems(prev =>
//   //       prev.map(item =>
//   //         item._id === editingItem._id
//   //           ? { ...item, ...response.data.menuItem }
//   //           : item
//   //       )
//   //     );

//   //     setShowEditModal(false);
//   //     setEditingItem(null);
//   //     alert("Menu item updated successfully!");
//   //   } catch (err) {
//   //     console.error("Error updating menu item:", err);
//   //     alert(`Failed to update menu item: ${err.response?.data?.message || err.message}`);
//   //   }
//   // };

//   // const handleDelete = async (menuItemId) => {
//   //   if (!window.confirm("Are you sure you want to delete this menu item?")) {
//   //     return;
//   //   }

//   //   try {
//   //     const token = localStorage.getItem("token");
//   //     await axios.delete(`http://localhost:5001/api/menu/${menuItemId}`, {
//   //       headers: { Authorization: `Bearer ${token}` }
//   //     });

//   //     setMenuItems(prev => prev.filter(item => item._id !== menuItemId));
//   //     alert("Menu item deleted successfully!");
//   //   } catch (err) {
//   //     console.error("Error deleting menu item:", err);
//   //     alert(`Failed to delete menu item: ${err.response?.data?.message || err.message}`);
//   //   }
//   // };


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

export const updateMenuItem = async (menuItemId, data, token) => {
  try {
    const res = await API.put(
      `/menu/${menuItemId}`,
      data,
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      }
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteMenuItem = async (menuItemId, token) => {
  try {
    const res = await API.delete(
      `/menu/${menuItemId}`,
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