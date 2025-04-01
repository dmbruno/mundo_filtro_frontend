import React, { useEffect, useState } from "react";
import api from "../api";
import "./UsuariosPage.css";
import logo from "../assets/background.jpg";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


// ... imports
const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    is_admin: false,
  });

  const usuarioActual = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = () => {
    api
      .get("/usuarios/")
      .then((res) => setUsuarios(res.data))
      .catch((err) => console.error("❌ Error al cargar usuarios:", err));
  };

  const abrirModal = (usuario = null) => {
    setModalVisible(true);
    if (usuario) {
      setEditando(usuario.id);
      setForm({ ...usuario, password: "" });
    } else {
      setEditando(null);
      setForm({ nombre: "", email: "", password: "", is_admin: false });
    }
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setEditando(null);
    setForm({ nombre: "", email: "", password: "", is_admin: false });
  };

  const handleSubmit = () => {
    if (!form.nombre || !form.email || (!editando && !form.password)) {
        toast.warning("⚠️ Todos los campos son obligatorios (menos contraseña en edición)");
        return;
    }

    const payload = {
        nombre: form.nombre,
        email: form.email,
        is_admin: !!form.is_admin,
        ...(form.password && { password: form.password }), // solo si se cargó
    };

    const request = editando
        ? api.put(`/usuarios/${editando}`, payload)
        : api.post("/usuarios/", payload);

    request
        .then(() => {
            const mensaje = editando 
                ? "Usuario actualizado correctamente" 
                : "Usuario agregado correctamente";  // 🔥 Mensaje dinámico

            toast.success(mensaje, { 
                autoClose: 2000,  // 🔥 Se cierra en 2 segundos
                onClose: () => cerrarModal()  // 🔥 Cierra el modal después del toast
            });

            cargarUsuarios(); // 🔄 Recarga la lista de usuarios
        })
        .catch((err) => {
            console.error("❌ Error al guardar usuario:", err);
            toast.error("❌ Hubo un error al guardar el usuario.");
        });
};
 
  
  const handleEliminar = (id) => {
    toast.warn(
      <div>
        <p>¿Estás seguro de que deseas eliminar este usuario?</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          {/* Botón para confirmar eliminación */}
          <button
            style={{ 
              backgroundColor: "red", 
              color: "white", 
              border: "none", 
              padding: "8px", 
              borderRadius: "5px", 
              cursor: "pointer" 
            }}
            onClick={() => {
              eliminarUsuario(id);  // Llamamos la función que elimina
              toast.dismiss(); // Cerramos el toast después de eliminar
            }}
          >
            Sí, eliminar
          </button>
  
          {/* Botón para cancelar */}
          <button
            style={{ 
              backgroundColor: "gray", 
              color: "white", 
              border: "none", 
              padding: "8px", 
              borderRadius: "5px", 
              cursor: "pointer" 
            }}
            onClick={() => toast.dismiss()} // Solo cierra el toast
          >
            Cancelar
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false, // No se cierra automáticamente
        closeOnClick: false,
        draggable: false,
        closeButton: false, // Quitamos el botón de cerrar para obligar a decidir
      }
    );
  };
  
  // ✅ Función para eliminar usuario
  const eliminarUsuario = (id) => {
    api
      .delete(`/usuarios/${id}`)
      .then(() => {
        toast.success("Usuario eliminado correctamente", { position: "top-center" });
        cargarUsuarios(); // Recargar la lista después de eliminar
      })
      .catch((err) => {
        toast.error("❌ Error al eliminar usuario", { position: "top-center" });
        console.error("❌ Error al eliminar:", err);
      });
  };

  return (
    <div className="usuarios-page">
      <img src={logo} alt="Mundo Filtro" className="logo" />

      <div className="usuarios-header">
        <h2 className="titulo">👥 Gestión de Usuarios</h2>
        <button className="usuarios-btn crear" onClick={() => abrirModal(null)}>
          ➕ Alta de usuario
        </button>
      </div>

      <table className="usuarios-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Admin</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.nombre}</td>
              <td>{u.email}</td>
              <td>{u.is_admin ? "✅" : "❌"}</td>
              <td>
                <button
                  className="usuarios-btn editar"
                  onClick={() => abrirModal(u)}
                >
                  ✏️
                </button>
                {u.id !== usuarioActual.id && (
                  <button
                    className="usuarios-btn eliminar"
                    onClick={() => handleEliminar(u.id)}
                  >
                    🗑️
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalVisible && (
        <div className="usuarios-modal">
          <div className="usuarios-modal-content">
            <div className="usuarios-notch"></div>
            <h3>{editando ? "✏️ Editar usuario" : "➕ Nuevo usuario"}</h3>

            <label>Nombre:</label>
            <input
              type="text"
              placeholder="Nombre"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />

            <label>Email:</label>
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <label>Contraseña:</label>
            <input
              type="password"
              placeholder={editando ? "No editable" : "Contraseña"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              disabled={editando}
            />
            {editando && (
              <p style={{ fontSize: "13px", color: "#777" }}>
                No se puede modificar la contraseña desde aquí.
              </p>
            )}

            <div className="usuarios-checkbox">
              <input
                type="checkbox"
                checked={form.is_admin}
                onChange={(e) =>
                  setForm({ ...form, is_admin: e.target.checked })
                }
              />
              Es admin
            </div>

            <div className="usuarios-modal-buttons">
              <button className="btn-salir-usuarios" onClick={cerrarModal}>
                Salir
              </button>
              <button className="btn-guardar-usuarios" onClick={handleSubmit}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuariosPage;