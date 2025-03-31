import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import {
  FaUser,
  FaCar,
  FaWrench,
  FaEnvelope,
  FaUsersCog,
  FaSignOutAlt
} from "react-icons/fa";

const Sidebar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/clientes">
            <FaUser size={20} />
            <span>Clientes</span>
          </Link>
        </li>
        <li>
          <Link to="/vehiculos">
            <FaCar size={20} />
            <span>Vehículos</span>
          </Link>
        </li>
        <li>
          <Link to="/servicios">
            <FaWrench size={20} />
            <span>Servicios</span>
          </Link>
        </li>
        <li>
          <Link to="/acciones">
            <FaEnvelope size={20} />
            <span>Acciones</span>
          </Link>
        </li>

        {user?.is_admin && (
          <li>
            <Link to="/usuarios">
              <FaUsersCog size={20} />
              <span>Usuarios</span>
            </Link>
          </li>
        )}
      </ul>

      {/* Logout visualmente igual y con hover propio */}
      <div className="logout-wrapper">
        <div className="logout-item" onClick={handleLogout}>
          <FaSignOutAlt size={20} />
          <span>Cerrar sesión</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;