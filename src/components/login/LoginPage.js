import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "./LoginPage.css";
import logo from "../../assets/background.jpg"; // Asegurate de tener este archivo

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      // 🔐 Paso 1: Login
      const response = await api.post("/auth/login", {
        email,
        password,
      });
  
      const token = response.data.access_token;
      localStorage.setItem("token", token);
  
      // 🔎 Paso 2: Obtener info de usuario (incluye is_admin)
      const userInfo = await api.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // 💾 Guardamos usuario completo en localStorage
      localStorage.setItem("user", JSON.stringify(userInfo.data));
  
      // ✅ Redirigir y recargar
      navigate("/clientes");
      window.location.reload();
    } catch (error) {
      console.error("Error en login:", error);
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div className="login-page">
      <img src={logo} alt="Mundo Filtro Logo" className="logo" />
      <div className="login-form">
        <h2>🔐 Iniciar Sesión</h2>
        <input
          type="text"
          placeholder="Email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn-ingresar-login" onClick={handleLogin}>Ingresar</button>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;