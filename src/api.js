import axios from "axios";

const API_URL = "http://127.0.0.1:5000"; // URL del backend Flask

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ⛔️ Interceptor para agregar el token JWT a cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // 🔐 Recuperamos el token si existe
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;