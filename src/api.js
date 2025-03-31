import axios from "axios";

const isLocalhost =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

const API_URL = isLocalhost
  ? "http://localhost:5002" // ⚙️ Local Flask backend
  : "https://mundo-filtro.onrender.com"; // 🌐 Producción

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // solo si necesitás cookies cross-origin
});

// ✅ Inyectamos el token JWT si está en localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`; // Muy importante
  }
  return config;
});

export default api;