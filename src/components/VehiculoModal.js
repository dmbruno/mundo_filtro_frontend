import React, { useState, useEffect } from "react";
import "./VehiculoModal.css";
import ReasignarVehiculoModal from "./ReasignarVehiculosModal";
import api from "../api";
import ListaServiciosModal from "./ListaServiciosModal";



const VehiculoModal = ({
    vehiculo,
    modoVista,
    clientes,
    cerrarModal,
    actualizarVehiculos,
    actualizarServicios,
    clienteSeleccionado,
    setClienteSeleccionado,
    modoEdicionInicial = false,
    abrirListaServicios,  // 📌 Recibimos la función para abrir ListaServiciosModal
    modalAbierto,  // 📌 Recibimos el estado del modal
    setModalAbierto,
    vehiculoSeleccionado,
    cerrarVerVehiculosModal,
    setVehiculoSeleccionado,
    serviciosVehiculo,
    setServiciosVehiculo }) => {



    const [modoEdicion, setModoEdicion] = useState(modoEdicionInicial);
    const [datosVehiculo, setDatosVehiculo] = useState({ ...vehiculo });
    const [reasignarModalAbierto, setReasignarModalAbierto] = useState(false);
    const [listaServiciosModalAbierto, setListaServiciosModalAbierto] = useState(false); // ✅ Nuevo estado

    


    if (!vehiculo) return null;

    // Manejar cambios en los inputs
    const handleChange = (e) => {
        setDatosVehiculo({
            ...datosVehiculo,
            [e.target.name]: e.target.value,
        });
    };

    // Guardar cambios
    const guardarCambios = () => {
        const vehiculoActualizado = { ...datosVehiculo };
        actualizarVehiculos(vehiculoActualizado);
        setModoEdicion(false);
    };
    const abrirReasignarModal = () => {
        setReasignarModalAbierto(true);
    };

    const abrirListaServiciosDesdeVehiculoModal = async (
        vehiculo,  // 👈 Ahora lo recibimos como parámetro!
        setVehiculoSeleccionado,
        setClienteSeleccionado,
        setServiciosVehiculo,
        setListaServiciosModalAbierto
    ) => {
        

        try {
            const response = await api.get(`/servicios/vehiculo/${vehiculo.id}`);
            const serviciosDelVehiculo = response.data;
            

            // 🔹 Ahora usamos directamente el vehiculo pasado como argumento
            const vehiculoInfo = {
                id: vehiculo.id,
                dominio: vehiculo.dominio,
                marca: vehiculo.marca,
                modelo: vehiculo.modelo
            };


            setVehiculoSeleccionado(vehiculoInfo);
            setServiciosVehiculo(serviciosDelVehiculo);

            let clienteInfo = null;

            if (serviciosDelVehiculo.length > 0) {
                clienteInfo = {
                    id: serviciosDelVehiculo[0].cliente.id,
                    nombre: serviciosDelVehiculo[0].cliente.nombre,
                    apellido: serviciosDelVehiculo[0].cliente.apellido
                };
            } else {
                try {
                    const clienteResponse = await api.get(`/clientes/vehiculo/${vehiculo.dominio}`);
                    if (clienteResponse.data) {
                        clienteInfo = {
                            id: clienteResponse.data.id,
                            nombre: clienteResponse.data.nombre,
                            apellido: clienteResponse.data.apellido
                        };
                    }
                } catch (error) {
                    console.error("❌ Error al buscar cliente en la API:", error);
                }
            }

            if (!clienteInfo) {
                clienteInfo = { id: null, nombre: "Cliente desconocido", apellido: "" };
            }

            setClienteSeleccionado(clienteInfo);

            // 🔥 Abrimos el modal con un pequeño delay para asegurar que React haya actualizado los estados
            setTimeout(() => {
                
                setListaServiciosModalAbierto(true);
            }, 500);

        } catch (error) {
            console.error("❌ Error al obtener servicios o cliente:", error);
        }
    };



    return (
        <div className="modal-vehiculo">
            <div className="modal-vehiculo-content">
                <div className="modal-vehiculo-header">
                    <div className="modal-vehiculo-notch"></div>
                    <h2 className="modal-vehiculo-title">
                        Cliente:
                        {modoVista === "detalle" ? (
                            ` ${vehiculo.cliente}`
                        ) : (
                            ` ${clienteSeleccionado.nombre} ${clienteSeleccionado.apellido}` // En caso de "lupa" solo mostramos el nombre del cliente
                        )}
                        <br />
                        <span>Vehículo Seleccionado: {vehiculo.marca} {vehiculo.modelo}</span>
                    </h2>
                </div>

                <div className="modal-vehiculo-body">
                    <div className="input-group-vehiculo">
                        <label className="modal-vehiculo-label">Marca:</label>
                        <input
                            type="text"
                            name="marca"
                            value={datosVehiculo.marca}
                            onChange={handleChange}
                            readOnly={!modoEdicion}
                        />
                    </div>

                    <div className="input-group-vehiculo">
                        <label className="modal-vehiculo-label">Modelo:</label>
                        <input
                            type="text"
                            name="modelo"
                            value={datosVehiculo.modelo}
                            onChange={handleChange}
                            readOnly={!modoEdicion}
                        />
                    </div>

                    <div className="input-group-vehiculo">
                        <label className="modal-vehiculo-label">Dominio:</label>
                        <input
                            type="text"
                            name="dominio"
                            value={datosVehiculo.dominio}
                            onChange={handleChange}
                            readOnly={!modoEdicion}
                        />
                    </div>
                    <div className={`modal-vehiculo-footer ${modoEdicion ? "modo-edicion" : "modo-normal"}`}>
                        {modoEdicion ? (
                            <>
                                
                                <button className="botonServicios"
                                    onClick={() =>
                                        abrirListaServiciosDesdeVehiculoModal(
                                            vehiculo,
                                            setVehiculoSeleccionado,
                                            setClienteSeleccionado,
                                            setServiciosVehiculo,
                                            setListaServiciosModalAbierto
                                        )
                                    }
                                >
                                    Ver Servicios
                                </button>

                                <button className="btn-guardar-vehiculo" onClick={abrirReasignarModal}>
                                    Reasignar Vehículo
                                </button>

                                <div className="fila-secundaria">
                                    <button className="btn-cancelar-vehiculo" onClick={() => setModoEdicion(false)}>
                                        Cancelar
                                    </button>
                                    <button className="btn-guardar-vehiculo" onClick={guardarCambios}>
                                        Guardar
                                    </button>
                                    <button className="btn-close-vehiculo" onClick={cerrarModal}>
                                        Cerrar
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <button className="botonServicios"
                                    onClick={() =>
                                        abrirListaServiciosDesdeVehiculoModal(
                                            vehiculo,
                                            setVehiculoSeleccionado,
                                            setClienteSeleccionado,
                                            setServiciosVehiculo,
                                            setListaServiciosModalAbierto
                                        )
                                    }
                                >
                                    Ver Servicios
                                </button>
                                <button className="btn-guardar-vehiculo" onClick={abrirReasignarModal}>
                                    Reasignar Vehículo
                                </button>
                                <button className="btn-editar-vehiculo" onClick={() => setModoEdicion(true)}>
                                    Editar
                                </button>
                                <button className="btn-close-vehiculo" onClick={cerrarModal}>
                                    Cerrar
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            {reasignarModalAbierto && (
                <ReasignarVehiculoModal
                    vehiculo={vehiculo}
                    clientes={clientes}
                    cerrarModal={() => setReasignarModalAbierto(false)} 
                    cerrarVerVehiculosModal={cerrarVerVehiculosModal}
                    actualizarVehiculos={actualizarVehiculos}
                    clienteSeleccionado={clienteSeleccionado}
                    titularNombre={vehiculo.cliente}
                />
            )}
            {listaServiciosModalAbierto && (
                <ListaServiciosModal
                    cliente={clienteSeleccionado}
                    vehiculo={vehiculo}
                    servicios={serviciosVehiculo}
                    cerrarModal={() => setListaServiciosModalAbierto(false)} // ✅ Cerramos solo este modal
                    actualizarServicios={actualizarServicios}
                    
                />
            )}

        </div>
    );
};

export default VehiculoModal;




