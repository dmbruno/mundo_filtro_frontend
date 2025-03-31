import React, { useState } from "react";
import api from "../api"; // Asegúrate de tener la conexión API configurada
import "./NuevoVehiculoModal.css";
import { toast } from "react-toastify";

const NuevoVehiculoModal = ({ cerrarModal, clienteSeleccionado, actualizarVehiculos, cerrarVerVehiculosModal }) => {
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [dominio, setDominio] = useState('');
  const [anio, setAnio] = useState('');

  const handleSubmit = () => {
    const vehiculoData = { marca, modelo, dominio, anio, cliente_id: clienteSeleccionado.id };

    // Crear nuevo vehículo
    api.post("/vehiculos/", vehiculoData)
      .then((response) => {
        actualizarVehiculos(response.data);  // Actualiza la lista de vehículos
        toast.success("✅ Vehículo agregado correctamente", { autoClose: 3000 }); 
        cerrarModal();  // Cierra el modal de nuevo vehículo
        cerrarVerVehiculosModal();  // Cierra el modal de ver vehículos también
      })
      .catch((error) => {
        console.error("Error al agregar vehículo:", error);
        // 🔥 Muestra un mensaje de error si falla


      });
  };

  return (
    <div className="modal-nuevoServicio">
      <div className="modal-content">
        <h2>Nuevo Vehículo</h2>
        <p>Cliente: {clienteSeleccionado ? `${clienteSeleccionado.nombre} ${clienteSeleccionado.apellido}` : "Cliente no seleccionado"}</p>
        <input type="text" value={marca} onChange={(e) => setMarca(e.target.value)} placeholder="Marca" />
        <input type="text" value={modelo} onChange={(e) => setModelo(e.target.value)} placeholder="Modelo" />
        <input type="text" value={dominio} onChange={(e) => setDominio(e.target.value)} placeholder="Dominio" />
        <input type="number" value={anio} onChange={(e) => setAnio(e.target.value)} placeholder="Año" />

        <div className="botones">
          <button className="btnCerrar-new" onClick={cerrarModal}>Cerrar</button>
          <button className="btn-guardar-new" onClick={handleSubmit}>Guardar</button>
        </div>
      </div>
    </div>
  );
};

export default NuevoVehiculoModal;