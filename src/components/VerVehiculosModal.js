import React, { useEffect, useState } from "react";
import api from "../api";
import "./VerVehiculosModal.css";
import VerVehiculoModal from "../components/VehiculoModal";
import NuevoVehiculoModal from "./NuevoVehiculoModal"; // Asegúrate de importar el modal
// Asegúrate de que la ruta sea correcta

import { toast } from "react-toastify"; // ✅ Importamos react-toastify
import "react-toastify/dist/ReactToastify.css";


const VerVehiculosModal = ({ cerrarModal, clienteSeleccionado , actualizarServicios}) => {

    const [vehiculos, setVehiculos] = useState([]);
    const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
    const [nuevoVehiculoModalAbierto, setNuevoVehiculoModalAbierto] = useState(false);
    const [ClienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [serviciosVehiculo, setServiciosVehiculo] = useState([]);





    useEffect(() => {
        if (clienteSeleccionado && clienteSeleccionado.id) {
            api
                .get(`/vehiculos/cliente/${clienteSeleccionado.id}`)
                .then((response) => {
                    setVehiculos(response.data);
                })
                .catch((error) => {
                    console.error("Error al cargar los vehículos:", error);
                });
        }
    }, [clienteSeleccionado]);

    const eliminarVehiculo = (id) => {
        // 🔥 Muestra un toast de confirmación antes de eliminar
        const confirmToastId = toast.warn(
            <div>
                <strong>⚠️ ¿Estás seguro?</strong>
                <p>Se eliminará el vehículo y sus servicios asociados.</p>
                <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                    <button
                        onClick={() => {
                            toast.dismiss(confirmToastId); // 🔥 Cierra el toast de confirmación
                            
                            api.delete(`/vehiculos/${id}`)
                                .then(() => {
                                    setVehiculos((prev) => prev.filter((vehiculo) => vehiculo.id !== id));
                                    toast.success("✅ Vehículo eliminado correctamente", { autoClose: 2000 });

                                    // 🔥 Cierra el modal después de 2 segundos
                                    setTimeout(() => cerrarModal(), 2000);
                                })
                                .catch((error) => {
                                    console.error("❌ Error al eliminar el vehículo:", error);
                                    toast.error("❌ Hubo un error al eliminar el vehículo.");
                                });
                        }}
                        style={{
                            backgroundColor: "#e74c3c",
                            color: "white",
                            border: "none",
                            padding: "8px 12px",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                    >
                        Eliminar
                    </button>

                    <button
                        onClick={() => toast.dismiss(confirmToastId)}
                        style={{
                            backgroundColor: "#2ecc71",
                            color: "white",
                            border: "none",
                            padding: "8px 12px",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                    >
                        Cancelar
                    </button>
                </div>
            </div>,
            { autoClose: false, position: "top-center" }
        );
    };

    const verDetalles = (vehiculo) => {
        setVehiculoSeleccionado(vehiculo);

    };

    
   

    const actualizarVehiculos = (vehiculoActualizado) => {
        setVehiculos(prevVehiculos => {
            const index = prevVehiculos.findIndex(v => v.id === vehiculoActualizado.id);
            if (index !== -1) {
                const updatedVehiculos = [...prevVehiculos];
                updatedVehiculos[index] = vehiculoActualizado;
                return updatedVehiculos;
            }
            return [...prevVehiculos, vehiculoActualizado];
        });
        api.put(`/vehiculos/${vehiculoActualizado.id}`, vehiculoActualizado)
            .then((response) => {
                
            })
            .catch((error) => {
                console.error("Error al actualizar el vehículo:", error);

            });
    };

    // Cerrar VerVehiculosModal
    const cerrarVerVehiculosModal = () => {
        cerrarModal(); // Cierra el modal de VerVehiculosModal
    };

    return (
        <div className="modal-verVehiculos">
            <div className="modal-content">
                <h2 className="cliente-vehiculos">Cliente: {clienteSeleccionado ? `${clienteSeleccionado.nombre} ${clienteSeleccionado.apellido}` : "No asignado"}</h2>

                {vehiculos.length === 0 ? (
                    <p>No hay vehículos registrados para este cliente.</p>
                ) : (
                    <div className="contenedor-vehiculo">
                        {vehiculos.map((vehiculo) => (
                            <div key={vehiculo.id} className="vehiculo-item">
                                <div className="vehiculo-info">
                                    <p>
                                        <strong>{vehiculo.marca}</strong> {vehiculo.modelo} ({vehiculo.anio})
                                    </p>
                                </div>
                                <div className="vehiculo-buttons">
                                    <button
                                        className="btn-verDetalles"
                                        onClick={() => verDetalles(vehiculo)} // No necesitamos pasar clienteSeleccionado
                                    >
                                        Ver Detalles
                                    </button>
                                    <button
                                        className="btn-eliminar-vehiculo"
                                        onClick={() => eliminarVehiculo(vehiculo.id)}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {vehiculoSeleccionado && (
                    <VerVehiculoModal
                        vehiculo={vehiculoSeleccionado}
                        setVehiculoSeleccionado={setVehiculoSeleccionado}
                        clienteSeleccionado={clienteSeleccionado}
                        actualizarVehiculos={actualizarVehiculos}
                        serviciosVehiculo={serviciosVehiculo} // 🔹 PASAMOS ESTO
                        setServiciosVehiculo={setServiciosVehiculo}
                        setClienteSeleccionado={setClienteSeleccionado}
                        actualizarServicios={actualizarServicios}  // 👈 Asegúrate de que esta línea está aquí
                        cerrarVerVehiculosModal={cerrarVerVehiculosModal} 
                        
                        cerrarModal={() => setVehiculoSeleccionado(null)}


                    />
                )}

                {nuevoVehiculoModalAbierto && (
                    <NuevoVehiculoModal
                        clienteSeleccionado={clienteSeleccionado}
                        cerrarModal={() => setNuevoVehiculoModalAbierto(false)}
                        actualizarVehiculos={actualizarVehiculos}
                        cerrarVerVehiculosModal={cerrarVerVehiculosModal}
                    />
                )}


                <div className="modal-footer-vehiculos">
                    <button className="btnCerrar-vehiculo" onClick={cerrarModal}>Cerrar</button>
                    <button
                        className="btnNuevo-vehiculo"
                        onClick={() => setNuevoVehiculoModalAbierto(true)} // Abre el modal
                    >
                        Nuevo Vehículo
                    </button>

                </div>
            </div>
        </div>
    );
};

export default VerVehiculosModal;