import React, { useState } from "react";
import "./ServicioModal.css";

const ServicioModal = ({ servicio, cerrarModal, actualizarServicio, modoEdicionInicial = false }) => {
  const [modoEdicion, setModoEdicion] = useState(modoEdicionInicial);
  const [datosServicio, setDatosServicio] = useState({ ...servicio });

  if (!servicio) return null;

  const handleChange = (e) => {
    setDatosServicio({
      ...datosServicio,
      [e.target.name]: e.target.value,
    });
  };

  const guardarCambios = () => {
    actualizarServicio(datosServicio);
    setModoEdicion(false);
  };

  return (
    <div className="modal-servicio">
      <div className="modal-content-servicio">
        <div className="modal-header-servicio">
          <div className="modal-notch-servicio"></div>
          <h2 className="modal-title-servicio">
            Cliente {servicio.cliente_nombre}
            <br />
            <span>Vehículo {servicio.vehiculo_nombre}</span>
          </h2>
        </div>

        <div className="modal-body-servicio">
          <div className="input-group-servicio">
            <label className="modal-label-servicio">Tipo de Servicio:</label>
            <input type="text" name="cambio_aceite" value={datosServicio.cambio_aceite} onChange={handleChange} readOnly={!modoEdicion} />
          </div>

          <div className="input-group-servicio">
            <label className="modal-label-servicio">KMs:</label>
            <input type="text" name="kms" value={datosServicio.kms} onChange={handleChange} readOnly={!modoEdicion} />
          </div>

          <div className="input-group-servicio">
            <label className="modal-label-servicio">Fecha:</label>
            <input type="date" name="fecha_servicio" value={datosServicio.fecha_servicio} onChange={handleChange} readOnly={!modoEdicion} />
          </div>

          <div className="input-group-servicio">
            <label className="modal-label-servicio">Dominio:</label>
            <input type="text" name="dominio" value={datosServicio.dominio} readOnly />
          </div>

          <div className="input-group-servicio">
            <label className="modal-label-servicio">Observaciones:</label>
            <textarea name="notas" value={datosServicio.notas} onChange={handleChange} readOnly={!modoEdicion}></textarea>
          </div>
        </div>

        <div className="modal-footer-servicio">
          <button className="btn-salir-servicio" onClick={cerrarModal}>Salir</button>
          {modoEdicion ? (
            <>
              <button className="btn-cancelar-servicio" onClick={() => setModoEdicion(false)}>Cancelar</button>
              <button className="btn-guardar-servicio" onClick={guardarCambios}>Guardar</button>
            </>
          ) : (
            <button className="btn-editar-servicio" onClick={() => setModoEdicion(true)}>Editar</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServicioModal;