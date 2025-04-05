import React, { useState, useEffect } from "react";
import api from "../../api";
import "./VerServicio.css";
import { toast } from "react-toastify";
import ModalPortal from "../ModalPortal";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
// ✅ Formatea fecha para input type="date"


const VerServicio = ({ servicio, cliente, vehiculo, cerrarModal, actualizarServicioLocal, cerrarListaServicios }) => {
    const navigate = useNavigate();
    const [modoEdicion, setModoEdicion] = useState(false);

    // Estado inicial vacío
    const [datosServicio, setDatosServicio] = useState({
        cambio_aceite: "",
        fecha_servicio: "",
        kms: "",
        tipo_servicio: "",
        filtro_aceite: false,
        filtro_aire: false,
        filtro_combustible: false,
        filtro_habitaculo: false,
        otros_servicios: "",
        notas: "",
    });


    const limpiarFecha = (fechaString) => {
        if (!fechaString) return "";
        const fecha = new Date(fechaString);
        return fecha.toISOString().split("T")[0]; // Devuelve yyyy-MM-dd
      };

    // ✅ Cuando llega el servicio, llenamos los datos
    useEffect(() => {
        if (servicio) {
            setDatosServicio({
                cambio_aceite: servicio.cambio_aceite || "",
                fecha_servicio: limpiarFecha(servicio.fecha_servicio),
                kms: servicio.kms !== undefined ? servicio.kms : "",
                tipo_servicio: servicio.tipo_servicio !== undefined ? servicio.tipo_servicio : "",
                filtro_aceite: servicio.filtro_aceite || false,
                filtro_aire: servicio.filtro_aire || false,
                filtro_combustible: servicio.filtro_combustible || false,
                filtro_habitaculo: servicio.filtro_habitaculo || false,
                otros_servicios: servicio.otros_servicios || "",
                notas: servicio.notas || "",
            });
        }
    }, [servicio]);

    // Bloquea scroll de fondo
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    if (!servicio) return null;

    // ✅ Manejo de cambios en inputs de texto y fecha
    const handleChange = (e) => {
        const { name, value } = e.target;
        setDatosServicio((prevState) => ({
            ...prevState,
            [name]: name === "kms" ? parseInt(value) || 0 : value,
        }));
    };

    // ✅ Manejo de cambios en checkboxes
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setDatosServicio((prevState) => ({
            ...prevState,
            [name]: checked,
        }));
    };

    // ✅ Guardar cambios en backend
    const guardarCambios = async () => {
        try {
            console.log("📦 Datos enviados:", datosServicio);  // 👈 seguimos viendo el log
            const payload = {
                cambio_aceite: datosServicio.cambio_aceite || "",
                fecha_servicio: datosServicio.fecha_servicio || null,  // 👈 aseguramos que algo se envía
                kms: datosServicio.kms || 0,
                tipo_servicio: datosServicio.tipo_servicio || "",
                filtro_aceite: datosServicio.filtro_aceite || false,
                filtro_aire: datosServicio.filtro_aire || false,
                filtro_combustible: datosServicio.filtro_combustible || false,
                filtro_habitaculo: datosServicio.filtro_habitaculo || false,
                otros_servicios: datosServicio.otros_servicios || "",
                notas: datosServicio.notas || "",
            };
    
            const response = await api.put(`/servicios/${servicio.id}`, payload);
    
            toast.success("✅ Servicio actualizado correctamente", { autoClose: 3000 });
            
            setTimeout(() => {
                navigate(0); // 🔥 Refrescamos solo la ruta actual, no toda la app
            }, 2000);

            if (typeof actualizarServicioLocal === "function") {
                actualizarServicioLocal(response.data.servicio);
            } else {
                console.error("❌ Error: actualizarServicioLocal no es una función");
            }
    
            cerrarModal();
            cerrarListaServicios();
        } catch (error) {
            console.error("❌ Error al actualizar el servicio:", error.response?.data || error.message);
            console.error("❌ Error al actualizar el servicio:", error);
        }
    };

    return (
        <ModalPortal>
            <div className="ver-servicio-overlay">
                <div className="ver-servicio-content">
                    <div className="ver-servicio-notch"></div>
                    <h3 className="ver-servicio-title">Servicio seleccionado</h3>
                    <h4 className="ver-servicio-subtitle"><em>Cliente: {cliente?.nombre} {cliente?.apellido}</em></h4>
                    <h4 className="ver-servicio-subtitle-otro"><em>Vehículo: {vehiculo?.marca} {vehiculo?.modelo}</em></h4>

                    <div className="ver-servicio-info">
                        <div className="ver-servicio-grid">
                            <div className="ver-servicio-col">
                                <div className="ver-servicio-row">
                                    <span>Servicio:</span>
                                    <input type="text" name="cambio_aceite" value={datosServicio.cambio_aceite} onChange={handleChange} readOnly={!modoEdicion} />
                                </div>

                                <div className="ver-servicio-row">
                                    <span>KMs:</span>
                                    <input type="text" name="kms" value={datosServicio.kms} onChange={handleChange} readOnly={!modoEdicion} />
                                </div>

                                <div className="ver-servicio-row">
                                    <span>Fecha:</span>
                                    <input
                                        type="date"
                                        name="fecha_servicio"
                                        value={datosServicio.fecha_servicio}
                                        onChange={handleChange}
                                        readOnly={!modoEdicion}
                                    />
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
                                        value={datosServicio.tipo_servicio}
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
                            <textarea name="otros_servicios" value={datosServicio.otros_servicios} onChange={handleChange} readOnly={!modoEdicion} />
                        </div>

                        <div className="ver-servicio-row">
                            <span>Notas:</span>
                            <textarea name="notas" value={datosServicio.notas} onChange={handleChange} readOnly={!modoEdicion} />
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