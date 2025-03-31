import React, { useState, useEffect } from "react";
import api from "../api"; // Asegúrate de tener la conexión API configurada
import "./ReasignarVehiculosModal.css";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ReasignarVehiculoModal = ({ vehiculo, cerrarModal, actualizarVehiculos, titularNombre, clienteSeleccionado, cerrarVerVehiculosModal, cerrarTodosLosModales }) => {
    const [nuevoTitular, setNuevoTitular] = useState(null);
    const [clientes, setClientes] = useState([]); // Para almacenar los clientes obtenidos
    const [loading, setLoading] = useState(true); // Para manejar el estado de carga

    // Llamamos a la API para obtener los clientes cuando el modal se abre
    useEffect(() => {
        api
            .get("/clientes/") // Cambiar esta URL si es necesario para obtener los clientes
            .then((response) => {
                setClientes(response.data); // Guardamos los clientes obtenidos en el estado
                setLoading(false); // Terminamos de cargar
            })
            .catch((error) => {
                console.error("Error al obtener los clientes:", error);
                toast.error("❌ Error al cargar los clientes");
                setLoading(false); // Terminamos de cargar incluso si hubo un error
            });
    }, []); // El array vacío asegura que solo se ejecuta al abrir el modal

    const handleReasignar = () => {
        if (!nuevoTitular) {
            toast.warning("⚠️ Por favor, selecciona un nuevo titular.");
            return;
        }

        const vehiculoActualizado = {
            ...vehiculo,
            cliente_id: nuevoTitular.id,
        };

        api.put(`/vehiculos/${vehiculo.id}`, vehiculoActualizado)
            .then((response) => {
                cerrarModal(); // 🔥 Cierra el modal actual
                cerrarVerVehiculosModal(); // 🔥 Cierra el modal de VerVehiculos

                toast.success("✅ Vehículo reasignado correctamente", {
                    autoClose: 2000, // Se cierra en 2 segundos
                    onClose: () => window.location.reload() // 🔥 Recarga la página después del toast
                });

                actualizarVehiculos(response.data);
            })
            .catch((error) => {
                console.error("❌ Error al reasignar vehículo:", error);
                toast.error("❌ Hubo un error al reasignar el vehículo.");
            });
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Reasignar Vehículo</h2>
                <p className="titular-reasignar">
                    Cliente Titular:{" "}
                    {titularNombre
                        ? titularNombre
                        : `${clienteSeleccionado.nombre} ${clienteSeleccionado.apellido}`}
                </p>

                <div>
                    <label className="label-servicios-reasignar">Nuevo Titular:</label>
                    {loading ? (
                        <p>Cargando clientes...</p>
                    ) : (
                        <select
                            onChange={(e) =>
                                setNuevoTitular(clientes.find(client => client.id === parseInt(e.target.value)))
                            }
                        >
                            <option value="">Seleccionar</option>
                            {clientes.length > 0 ? (
                                clientes.map((cliente) => (
                                    <option key={cliente.id} value={cliente.id}>
                                        {cliente.nombre} {cliente.apellido}
                                    </option>
                                ))
                            ) : (
                                <option value="">No hay clientes disponibles</option>
                            )}
                        </select>
                    )}
                </div>

                <div className="botones">
                    <button className="btnCerrar-reasignar" onClick={cerrarModal}>Salir</button>
                    <button className="btnGuardar-reasignar" onClick={handleReasignar}>Guardar</button>
                </div>
            </div>
        </div>
    );
};

export default ReasignarVehiculoModal;