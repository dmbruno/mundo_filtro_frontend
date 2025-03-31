import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ClientesPage from "./pages/ClientesPage";
import VehiculosPage from "./pages/VehiculosPage";
import ServiciosPage from "./pages/ServiciosPage";
import AccionesPage from "./pages/AccionesPage";
import LoginPage from "../src/components/login/LoginPage";
import PrivateRoute from "../src/components/login/PrivateRoute";
import "./App.css";
import UsuariosPage from "./pages/UsuariosPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <div className="container">
        {token && <Sidebar />}
        <div className="content">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/usuarios" element={<UsuariosPage />} />

            {/* Rutas protegidas */}
            <Route
              path="/clientes"
              element={
                <PrivateRoute>
                  <ClientesPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/vehiculos"
              element={
                <PrivateRoute>
                  <VehiculosPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/servicios"
              element={
                <PrivateRoute>
                  <ServiciosPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/acciones"
              element={
                <PrivateRoute>
                  <AccionesPage />
                </PrivateRoute>
              }
            />

            {/* Redirección por defecto */}
            <Route path="*" element={<LoginPage />} />
          </Routes>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;