import React, { useEffect, useState } from "react";
import "./ListaServiciosModal.css";
import api from "../api";
import NuevoServicioModal from "./servicios/NuevoServicioModal";
import VerServicio from "./servicios/VerServicio";

import { toast } from "react-toastify"; // ✅ Importamos React-Toastify
import "react-toastify/dist/ReactToastify.css";


const ListaServiciosModal = ({ cliente, vehiculo, servicios, cerrarModal, actualizarServicios, cerrarListaServicios }) => {

    

    const [nuevoServicioModalAbierto, setNuevoServicioModalAbierto] = useState(false);
    const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
    const [ServiciosVehiculo, setServiciosVehiculo] = useState(servicios);

    const abrirVerServicioModal = (servicio) => {
        setServicioSeleccionado(servicio);
    };

    const cerrarVerServicioModal = () => {
        setServicioSeleccionado(null);
    };

    const abrirNuevoServicioModal = () => {

        setNuevoServicioModalAbierto(true);
    };

    const cerrarNuevoServicioModal = () => {
        setNuevoServicioModalAbierto(false);
    };

    const cerrarTodosLosModales = () => {

        
        setNuevoServicioModalAbierto(false); // ✅ Cierra `NuevoServicioModal`
        cerrarModal(); // ✅ Cierra `ListaServiciosModal`
    };




    const eliminarServicio = async (servicioId) => {
        const toastId = toast.warn(
            <div style={{ textAlign: "center" }}>
                <p>⚠️ <strong>¿Estás seguro?</strong></p>
                <p>Se eliminará el servicio permanentemente.</p>
                <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "10px" }}>
                    <button
                        style={{ backgroundColor: "#d9534f", color: "white", padding: "8px", borderRadius: "5px", border: "none", cursor: "pointer" }}
                        onClick={async () => {
                            try {
                                toast.dismiss(toastId);
                                await api.delete(`/servicios/${servicioId}`);

                                toast.success("✅ Servicio eliminado correctamente", { autoClose: 2000 });
                                actualizarServicios();

                                cerrarModal();
                                
                            } catch (error) {
                                console.error("❌ Error al eliminar el servicio:", error);
                                toast.error("❌ Error al eliminar el servicio", { autoClose: 3000 });
                            }
                        }}>
                        Eliminar
                    </button>
                    <button
                        style={{ backgroundColor: "#5bc0de", color: "white", padding: "8px", borderRadius: "5px", border: "none", cursor: "pointer" }}
                        onClick={() => toast.dismiss(toastId)}>
                        Cancelar
                    </button>
                </div>
            </div>,
            {
                autoClose: false,
                position: "top-center",
                style: { marginTop: "50px" },
            }
        );
    };


    const clienteFinal = cliente?.id
        ? cliente  // Si tiene ID, usamos este cliente
        : {
            id: vehiculo.cliente_id || null,
            nombre: vehiculo.cliente || "Cliente desconocido",
            apellido: ""
        };


    const actualizarServicioLocal = (servicioActualizado) => {
        setServiciosVehiculo(prevServicios =>
            prevServicios.map(servicio =>
                servicio.id === servicioActualizado.id ? servicioActualizado : servicio
            )
        );
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-title">
                    Servicios de: {cliente?.nombre} {cliente?.apellido}

                </h2>
                <p className="modal-subtitle">
                    Vehículo: {vehiculo?.marca} {vehiculo?.modelo}
                </p>


                <div className="lista-servicios">
                    {servicios.length > 0 ? (
                        servicios.map((servicio) => (
                            <div key={servicio.id} className="servicio-card">
                                <div className="servicio-info">
                                    <span className="servicio-icon">🛠️</span>
                                    <div className="servicio-details-text">
                                        <strong>Servicio {servicio.id}</strong>
                                        <p>{new Date(servicio.fecha_servicio).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                {/* 🔍 Botón para ver detalles y 🗑️ para eliminar */}
                                <div className="servicio-actions">
                                    <button className="btn-ver-vehiculo" onClick={() => abrirVerServicioModal(servicio)}>🔍</button>
                                    <button className="btn-eliminar-vehiculos" onClick={() => eliminarServicio(servicio.id)}>🗑️</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-servicios">No hay servicios registrados.</p>
                    )}
                </div>

                {/* 📌 Botones en la parte inferior */}
                <div className="modal-actions">
                    <button className="btn-cerrar-vehiculos" onClick={cerrarModal}>Cerrar</button>
                    <button className="btn-nuevo" onClick={abrirNuevoServicioModal}>
                        Nuevo Servicio
                    </button>
                </div>
            </div>


            {servicioSeleccionado && (
                <VerServicio
                    servicio={servicioSeleccionado}
                    cliente={cliente}
                    vehiculo={vehiculo}
                    cerrarModal={cerrarVerServicioModal}
                    actualizarServicioLocal={actualizarServicioLocal}
                    cerrarListaServicios={cerrarModal}
                />
            )}

            {nuevoServicioModalAbierto && (
                <NuevoServicioModal
                    vehiculo={vehiculo}
                    cliente={clienteFinal}
                    cerrarListaServicios={cerrarModal}
                    servicio={servicioSeleccionado}
                    cerrarModal={cerrarTodosLosModales}
                    actualizarServicios={actualizarServicios}

                />
            )}
        </div>
    );
};

export default ListaServiciosModal;