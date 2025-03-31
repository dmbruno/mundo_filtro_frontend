import React, { useState, useEffect } from "react";
import "./ServicioModal.css"; // Estilos adicionales

const ServicioModal = ({ servicio, cerrarModal, actualizarServicio }) => {
  // Estado para controlar el modo de edición (si es necesario)
  const [modoEdicion, setModoEdicion] = useState(false);

  // Llenar los campos con los datos del servicio recibido
  const [servicioDatos, setServicioDatos] = useState({
    tipoServicio: servicio?.cambio_aceite || "",
    km: servicio?.km || "",
    fecha: servicio?.fecha_servicio || "",
    dominio: servicio?.vehiculo?.dominio || "", // Asegúrate de que vehiculo no sea undefined
    observaciones: servicio?.observaciones || "",
  });

  // Control de cambio en los campos
  const handleChange = (e) => {
    setServicioDatos({
      ...servicioDatos,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    // Aquí puedes agregar lógica para guardar los cambios del servicio.
    actualizarServicio(servicioDatos);
    setModoEdicion(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Servicio {servicio.id}</h2>

        <div className="modal-info">
          <p>
            <strong>Cliente:</strong> {servicio.cliente?.nombre} {servicio.cliente?.apellido}
          </p>
          <p>
            <strong>Vehículo:</strong> {servicio.vehiculo?.marca} {servicio.vehiculo?.modelo}
          </p>
        </div>

        <div className="form-group">
          <label>Tipo de Servicio:</label>
          <input
            type="text"
            name="tipoServicio"
            value={servicioDatos.tipoServicio}
            onChange={handleChange}
            readOnly={!modoEdicion}
          />
        </div>

        <div className="form-group">
          <label>Kilómetros:</label>
          <input
            type="text"
            name="km"
            value={servicioDatos.km}
            onChange={handleChange}
            readOnly={!modoEdicion}
          />
        </div>

        <div className="form-group">
          <label>Fecha:</label>
          <input
            type="date"
            name="fecha"
            value={servicioDatos.fecha}
            onChange={handleChange}
            readOnly={!modoEdicion}
          />
        </div>

        <div className="form-group">
          <label>Dominio:</label>
          <input
            type="text"
            name="dominio"
            value={servicioDatos.dominio}
            onChange={handleChange}
            readOnly={!modoEdicion}
          />
        </div>

        <div className="form-group">
          <label>Observaciones:</label>
          <textarea
            name="observaciones"
            value={servicioDatos.observaciones}
            onChange={handleChange}
            readOnly={!modoEdicion}
          />
        </div>

        <div className="modal-actions">
          <button onClick={cerrarModal} className="btn-cerrar">
            Cerrar
          </button>

          {modoEdicion ? (
            <>
              <button onClick={() => setModoEdicion(false)} className="btn-cancelar">
                Cancelar
              </button>
              <button onClick={handleSave} className="btn-guardar">
                Guardar
              </button>
            </>
          ) : (
            <button onClick={() => setModoEdicion(true)} className="btn-editar">
              Editar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServicioModal;