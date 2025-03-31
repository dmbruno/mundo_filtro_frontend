import React, { useState } from "react";
import api from "../../api";
import "./VerServicio.css";
import { toast } from "react-toastify";


import ModalPortal from "../ModalPortal"; // ajustá ruta si está en otro lugar

const VerServicio = ({ servicio, cliente, vehiculo, cerrarModal, actualizarServicioLocal, cerrarListaServicios }) => {
    const [modoEdicion, setModoEdicion] = useState(false);
    const [datosServicio, setDatosServicio] = useState({
        cambio_aceite: servicio.cambio_aceite || "",
        kms: servicio.kms !== undefined ? servicio.kms : "", // ✅ Asegurar que kms no sea undefined
        tipo_servicio: servicio.tipo_servicio !== undefined ? servicio.tipo_servicio : "", // ✅ Asegurar tipo_servicio
        filtro_aceite: servicio.filtro_aceite || false,
        filtro_aire: servicio.filtro_aire || false,
        filtro_combustible: servicio.filtro_combustible || false,
        filtro_habitaculo: servicio.filtro_habitaculo || false,
        otros_servicios: servicio.otros_servicios || "",
        notas: servicio.notas || "",
    });

    if (!servicio) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;

        setDatosServicio({
            ...datosServicio,
            [name]: name === "kms" ? parseInt(value) || 0 : value,  // ✅ Convertir kms a número
        });
    };

    // Manejar cambios en los checkboxes
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setDatosServicio({
            ...datosServicio,
            [name]: checked,
        });
    };

    // **📌 Enviar los cambios al backend**
    const guardarCambios = async () => {

        try {
            const response = await api.put(`/servicios/${servicio.id}`, {
                ...datosServicio,
                kms: datosServicio.kms || 0,  // ✅ Convertir kms a número si es necesario
                tipo_servicio: datosServicio.tipo_servicio || "",  // ✅ Asegurar que tipo_servicio no sea undefined
            });

            toast.success("✅ Servicio actualizado correctamente", { autoClose: 3000 }); // 🔥 Mensaje de éxito



            if (typeof actualizarServicioLocal === "function") {
                actualizarServicioLocal(response.data.servicio);

            } else {
                console.error("❌ Error: actualizarServicioLocal no está definido o no es una función");
            }

            cerrarModal();
            cerrarListaServicios();

        } catch (error) {
            console.error("❌ Error al actualizar el servicio:", error);
        }
    };

    return (
        <ModalPortal>

            <div className="ver-servicio-overlay">
                <div className="ver-servicio-content">
                    <div className="ver-servicio-notch"></div>
                    <h3 className="ver-servicio-title">Servicio seleccionado</h3>

                    <h4 className="ver-servicio-subtitle">
                        <em>Cliente: {cliente?.nombre} {cliente?.apellido}</em>
                    </h4>

                    <h4 className="ver-servicio-subtitle">
                        <em>Vehículo: {vehiculo?.marca} {vehiculo?.modelo}</em>
                    </h4>

                    <div className="ver-servicio-info">
                        <div className="ver-servicio-grid">
                            <div className="ver-servicio-col">
                                <div className="ver-servicio-row">
                                    <span>Servicio:</span>
                                    <input type="text" name="cambio_aceite" value={datosServicio.cambio_aceite || ""} onChange={handleChange} readOnly={!modoEdicion} />
                                </div>

                                <div className="ver-servicio-row">
                                    <span>KMs:</span>
                                    <input type="text" name="kms" value={datosServicio.kms || ""} onChange={handleChange} readOnly={!modoEdicion} />
                                </div>

                                <div className="ver-servicio-row">
                                    <span>Fecha:</span>
                                    <input type="text" value={new Date(servicio.fecha_servicio).toLocaleDateString()} readOnly />
                                </div>

                                <div className="ver-servicio-row">
                                    <span>Dominio:</span>
                                    <input type="text" value={vehiculo?.dominio || ""} readOnly />
                                </div>
                            </div>

                            <div className="ver-servicio-col">
                                <div className="ver-servicio-row">
                                    <span>Tipo de Servicio:</span>
                                    <input
                                        type="text"
                                        name="tipo_servicio"
                                        value={datosServicio.tipo_servicio || ""}
                                        onChange={handleChange}
                                        readOnly={!modoEdicion}
                                    />
                                </div>

                                <div className="ver-servicio-filtros">
                                    <span className="ver-servicio-filtros-title">Filtros Cambiados:</span>
                                    <label><input type="checkbox" name="filtro_aceite" checked={datosServicio.filtro_aceite} onChange={handleCheckboxChange} disabled={!modoEdicion} /> Filtro de Aceite</label>
                                    <label><input type="checkbox" name="filtro_aire" checked={datosServicio.filtro_aire} onChange={handleCheckboxChange} disabled={!modoEdicion} /> Filtro de Aire</label>
                                    <label><input type="checkbox" name="filtro_combustible" checked={datosServicio.filtro_combustible} onChange={handleCheckboxChange} disabled={!modoEdicion} /> Filtro de Combustible</label>
                                    <label><input type="checkbox" name="filtro_habitaculo" checked={datosServicio.filtro_habitaculo} onChange={handleCheckboxChange} disabled={!modoEdicion} /> Filtro de Habitáculo</label>
                                </div>
                            </div>
                        </div>

                        <div className="ver-servicio-row">
                            <span>Otros Servicios:</span>
                            <textarea name="otros_servicios" value={datosServicio.otros_servicios || ""} onChange={handleChange} readOnly={!modoEdicion} />
                        </div>

                        <div className="ver-servicio-row">
                            <span>Notas:</span>
                            <textarea name="notas" value={datosServicio.notas || ""} onChange={handleChange} readOnly={!modoEdicion} />
                        </div>
                    </div>

                    <div className="ver-servicio-actions">
                        <button className="ver-servicio-btn-cerrar" onClick={cerrarModal}>Cerrar</button>
                        {modoEdicion ? (
                            <>
                                <button className="ver-servicio-btn-guardar" onClick={guardarCambios}>Guardar</button>
                                <button className="ver-servicio-btn-cancelar" onClick={() => setModoEdicion(false)}>Cancelar</button>
                            </>
                        ) : (
                            <button className="ver-servicio-btn-editar" onClick={() => setModoEdicion(true)}>Editar</button>
                        )}
                    </div>
                </div>
            </div>
        </ModalPortal>
    );
};

export default VerServicio;