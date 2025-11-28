import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api/v1",
  withCredentials: true,
  timeout: 1000 * 50,
});

// Request interceptor to add token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
API.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export default API;
