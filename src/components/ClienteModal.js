import React, { useState } from "react";
import "./ClienteModal.css";
import api from "../api";
import { toast } from "react-toastify";

const ClienteModal = ({ cliente, cerrarModal, actualizarCliente, modoEdicion, setModoEdicion, abrirNuevoVehiculoModal, verVehiculos, actualizarServicios }) => {
  const [formData, setFormData] = useState({
    nombre: cliente.nombre,
    apellido: cliente.apellido,
    telefono: cliente.telefono,
    cuit: cliente.cuit || "No disponible",
    email: cliente.email,
  });

  

  if (!cliente) return null;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    api
      .put(`/clientes/${cliente.id}`, formData)
      .then((response) => {
        
        actualizarCliente({ ...cliente, ...formData });
        setModoEdicion(false);
        toast.success("✅ Cliente actualizado correctamente", { autoClose: 3000 });
      })
      .catch((error) => {
        console.error("Error al actualizar el cliente:", error);
        toast.error("❌ Error al actualizar el cliente", { autoClose: 3000 }); // 🔥 Muestra un toast de error si falla
      });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-notch"></div>
          <h2 className="modal-title">
            Ficha del cliente {formData.nombre} {formData.apellido}
          </h2>
        </div>

        <div className="modal-body">
          <div className="input-group">
            <label className="modal-label">Nombre:</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} readOnly={!modoEdicion} />
          </div>

          <div className="input-group">
            <label className="modal-label">Apellido:</label>
            <input type="text" name="apellido" value={formData.apellido} onChange={handleInputChange} readOnly={!modoEdicion} />
          </div>

          <div className="input-group">
            <label className="modal-label">Teléfono:</label>
            <input type="text" name="telefono" value={formData.telefono} onChange={handleInputChange} readOnly={!modoEdicion} />
          </div>

          <div className="input-group">
            <label className="modal-label">CUIT:</label>
            <input type="text" name="cuit" value={formData.cuit} onChange={handleInputChange} readOnly={!modoEdicion} />
          </div>

          <div className="input-group">
            <label className="modal-label">Correo Electrónico:</label>
            <input type="text" name="email" value={formData.email} onChange={handleInputChange} readOnly={!modoEdicion} />
          </div>

          <div className="buttons-container">
            <div className="buttons-group">
              <button className="btn btn-view" onClick={() => verVehiculos(cliente, actualizarServicios)}>Ver Vehículos</button>
              <button className="btn new" onClick={() => abrirNuevoVehiculoModal(cliente)}>Nuevo Vehículo</button>
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn close" onClick={cerrarModal}>Cerrar</button>
            {modoEdicion ? (
              <>
                <button className="btn close" onClick={() => setModoEdicion(false)}>Cancelar</button>
                <button className="btn edit" onClick={handleSave}>Guardar</button>
              </>
            ) : (
              <button className="btn edit" onClick={() => setModoEdicion(true)}>Editar</button>
            )}
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default ClienteModal;