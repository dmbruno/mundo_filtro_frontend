import React, { useState } from "react";
import api from "../api"; // Utiliza el archivo donde tienes configurada la conexión con la API
import "./NuevoClienteModal.css";

import { toast } from "react-toastify"; // 📌 Importamos react-toastify
import "react-toastify/dist/ReactToastify.css";

const NuevoClienteModal = ({ cerrarModal, actualizarClientes }) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [cuit, setCuit] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    const clienteData = { nombre, apellido, cuit, telefono, email };
  
    // Crear nuevo cliente
    api.post("/clientes/", clienteData)
      .then((response) => {
        // Llamar a actualizarClientes para recargar la lista de clientes
        actualizarClientes(response.data); 
        toast.success("✅ Cliente creado exitosamente", {
          position: "top-center",
          autoClose: 3000, // ⏳ Dura 3 segundos
        }); // Ahora se utiliza actualizarClientes
        cerrarModal();  // Cierra el modal después de guardar
      })
      .catch((error) => {
        toast.error("❌ Error al crear cliente", { position: "top-center" });
        console.error("Error al agregar cliente:", error);
      });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Nuevo Cliente</h2>
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" />
        <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} placeholder="Apellido" />
        <input type="text" value={cuit} onChange={(e) => setCuit(e.target.value)} placeholder="CUIT" />
        <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Teléfono" />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo Electrónico" />
        <div className="botones">
          <button className="btnCerrar" onClick={cerrarModal}>Cerrar</button>
          <button className="btnNew" onClick={handleSubmit}>Crear Cliente</button>
        </div>
      </div>
    </div>
  );
};

export default NuevoClienteModal;