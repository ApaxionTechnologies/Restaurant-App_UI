import API from "./api";

export const getOrders = () => API.get("/orders");

export const getOrdersByDateRange = (startDate, endDate) =>
  API.get("/orders", { params: { startDate, endDate } });

export const updateOrderStatus = (orderId, status) =>
  API.put(`/orders/${orderId}`, { status });

export const updateOrderItems = (orderId, items) =>
  API.put(`/orders/edit/${orderId}`, { items });

export const createOrder = (orderData) => API.post("/orders", orderData);

export const deleteOrder = (orderId) => API.delete(`/orders/${orderId}`);

export const generateBill = (payload) => API.post("/bill/generate-bill", payload);
export const getBill = (params) => API.get("/bill/fetchBill", { params });

export const calculateBillPreview = (items, restaurantId) =>
  API.post("/orders/calculate", { items, restaurantId });
