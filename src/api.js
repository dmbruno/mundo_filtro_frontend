import axios from "axios";

const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

const API_URL = isLocalhost
  ? "http://localhost:5001" // Local
  : "https://mundo-filtro.onrender.com"; // Producción

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
  }
  return config;
});

export default api;