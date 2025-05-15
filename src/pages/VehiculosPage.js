import React, { useEffect, useState } from "react";
import api from "../api";
import VehiculoModal from "../components/VehiculoModal"; // Importar el modal del vehiculo
import "./VehiculosPage.css";
import logo from "../assets/background.jpg";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const VehiculosPage = () => {
    const [vehiculos, setVehiculos] = useState([]);
    const [filtroMarca, setFiltroMarca] = useState("");
    const [filtroModelo, setFiltroModelo] = useState("");
    const [filtroDominio, setFiltroDominio] = useState("");
    const [filtroCliente, setFiltroCliente] = useState("");
    const [modalAbierto, setModalAbierto] = useState(false);
    const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Agregado: estado de carga
    const [clientes, setClientes] = useState([]); // Declaramos el estado para los clientes
    const [isClienteLoading, setIsClienteLoading] = useState(true);  // Estado para manejar la carga del cliente
    const [modoVista, setModoVista] = useState("detalle"); // Agregamos el estado para el modoVista

    const [serviciosVehiculo, setServiciosVehiculo] = useState([]); // 📌 Agregado


    const cargarVehiculos = () => {
        setIsLoading(true); // Setea la carga como verdadera
        api
            .get("/vehiculos/")
            .then((response) => {

                setVehiculos(response.data);
                setIsLoading(false); // Al terminar la carga, se cambia el estado
            })
            .catch((error) => {
                console.error("Error al obtener los vehículos:", error);
                setIsLoading(false); // En caso de error, también cambia el estado
            });
    };

    useEffect(() => {
        cargarVehiculos();
    }, []);

    useEffect(() => {
        if (!isClienteLoading && clienteSeleccionado) {

        }
    }, [isClienteLoading, clienteSeleccionado]); // Este efecto se ejecuta cuando el cliente ha sido cargado

    const cargarClientes = () => {
        setIsLoading(true); // Setea la carga como verdadera
        api
            .get("/clientes")
            .then((response) => {

                setClientes(response.data);
                setIsLoading(false); // Al terminar la carga, se cambia el estado
            })
            .catch((error) => {
                console.error("Error al obtener los vehículos:", error);
                setIsLoading(false); // En caso de error, también cambia el estado
            });
    };


    useEffect(() => {
        cargarClientes();
    }, []);



    const eliminarVehiculo = (vehiculoId) => {
        const toastId = `confirm-delete-${vehiculoId}`;
        const eliminar = () => {
            api.delete(`/vehiculos/${vehiculoId}`)
                .then(() => {
                    setVehiculos((prevVehiculos) =>
                        prevVehiculos.filter((vehiculo) => vehiculo.id !== vehiculoId)
                    );
                    toast.dismiss(toastId);
                    toast.success("✅ Vehículo y servicios eliminados correctamente");
                })
                .catch((error) => {
                    console.error("Error al eliminar el vehículo:", error);
                    toast.error("❌ Error al eliminar el vehículo");
                });
        };

        toast.warn(
            <div style={{ textAlign: "center" }}>
                🚗 <strong>Si eliminas este vehículo, también se borrarán los servicios asociados.</strong><br />
                <div style={{ marginTop: "10px", display: "flex", justifyContent: "center", gap: "10px" }}>
                    <button
                        style={{
                            backgroundColor: "#ff4444",
                            color: "white",
                            border: "none",
                            padding: "8px 15px",
                            borderRadius: "5px",
                            cursor: "pointer"
                        }}
                        onClick={eliminar}
                    >
                        🗑️ Eliminar
                    </button>
                    <button
                        style={{
                            backgroundColor: "#cccccc",
                            color: "#333",
                            border: "none",
                            padding: "8px 15px",
                            borderRadius: "5px",
                            cursor: "pointer"
                        }}
                        onClick={() => toast.dismiss()}
                    >
                        ❌ Cancelar
                    </button>
                </div>
            </div>,
            {
                position: "top-center",
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                closeButton: false,
                toastId: `confirm-delete-${vehiculoId}`
            }
        );
    };

    const eliminarServiciosAsociados = (vehiculoId) => {
        api
            .delete(`/servicios/${vehiculoId}`)
            .then(() => {

            })
            .catch((error) => {
                console.error("Error al eliminar los servicios:", error);
            });
    };

    const vehiculosFiltrados = vehiculos.filter((vehiculo) =>
        (filtroMarca
            ? vehiculo.marca.toLowerCase().includes(filtroMarca.toLowerCase())
            : true) &&
        (filtroModelo
            ? vehiculo.modelo.toLowerCase().includes(filtroModelo.toLowerCase())
            : true) &&
        (filtroDominio
            ? vehiculo.dominio.toLowerCase().includes(filtroDominio.toLowerCase())
            : true) &&
        (filtroCliente
            ? vehiculo.cliente.toLowerCase().includes(filtroCliente.toLowerCase())
            : true)
    );
    const abrirModal = (vehiculo, editar = false, modoVista = "detalle") => {

        setVehiculoSeleccionado(vehiculo);
        setModoEdicion(editar);
        setModalAbierto(true);
        setModoVista(modoVista); // Agregamos el modoVista para manejar el comportamiento del modal
    };


    const cerrarModal = () => {
        setModalAbierto(false);
        setVehiculoSeleccionado(null);
        setModoEdicion(false);
    };

    const actualizarVehiculo = (vehiculoActualizado) => {
        // Actualiza el vehículo en el estado de vehiculos
        setVehiculos((prevVehiculos) => {
            // Encuentra el índice del vehículo en el array
            const index = prevVehiculos.findIndex((vehiculo) => vehiculo.id === vehiculoActualizado.id);

            if (index !== -1) {
                // Si el vehículo ya existe en la lista, lo actualizamos
                const updatedVehiculos = [...prevVehiculos];
                updatedVehiculos[index] = vehiculoActualizado;
                return updatedVehiculos;
            } else {
                // Si el vehículo no se encuentra en el array, lo agregamos (aunque no debería ser el caso aquí)
                return [...prevVehiculos, vehiculoActualizado];
            }
        });
    };

    const abrirListaServicios = async (vehiculo, setVehiculoSeleccionado, setClienteSeleccionado, setServiciosVehiculo) => {


        try {
            const response = await api.get(`/servicios/vehiculo/${vehiculo.id}`);
            const serviciosDelVehiculo = response.data;



            setVehiculoSeleccionado({
                id: vehiculo.id,
                dominio: vehiculo.dominio,
                marca: vehiculo.marca,
                modelo: vehiculo.modelo
            });

            // 📌 Aquí corregimos para obtener el cliente del vehículo si no hay servicios
            setClienteSeleccionado(
                serviciosDelVehiculo.length > 0
                    ? {
                        id: serviciosDelVehiculo[0].cliente.id,
                        nombre: serviciosDelVehiculo[0].cliente.nombre,
                        apellido: serviciosDelVehiculo[0].cliente.apellido
                    }
                    : {
                        id: vehiculo.cliente.id, // 🔥 Ahora tomamos el dueño del vehículo
                        nombre: vehiculo.cliente.nombre,
                        apellido: vehiculo.cliente.apellido
                    }
            );

            setServiciosVehiculo(serviciosDelVehiculo);
        } catch (error) {
            console.error("Error al obtener servicios del vehículo:", error);
        }
    };


    const actualizarServicios = () => {


        cargarVehiculos(); // ✅ Vuelve a cargar los vehículos y servicios actualizados
    };



    return (
        <div className="vehiculos-container">
            <img src={logo} alt="Mundo Filtro" className="logoVehiculos" />
            <h1 className="titulo">🚗 Vehículos</h1>

            <div className="filtro-container">
                <input
                    type="text"
                    placeholder="Marca..."
                    value={filtroMarca}
                    onChange={(e) => setFiltroMarca(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Modelo..."
                    value={filtroModelo}
                    onChange={(e) => setFiltroModelo(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Dominio..."
                    value={filtroDominio}
                    onChange={(e) => setFiltroDominio(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Cliente..."
                    value={filtroCliente}
                    onChange={(e) => setFiltroCliente(e.target.value)}
                />

            </div>

            <div className="tabla-scroll-container-vehiculos">
                <table className="vehiculos-table">
                    <thead>
                        <tr className="encabezado">
                            <th>Marca</th>
                            <th>Modelo</th>
                            <th>Dominio</th>
                            <th>Cliente</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? ( // Agregado: Control de carga
                            <tr>
                                <td colSpan="5">Cargando...</td>
                            </tr>
                        ) : (
                            vehiculosFiltrados.map((vehiculo) => (
                                <tr key={vehiculo.id}>
                                    <td>{vehiculo.marca}</td>
                                    <td>{vehiculo.modelo}</td>
                                    <td>{vehiculo.dominio}</td>
                                    <td>{vehiculo.cliente}</td>
                                    <td className="acciones-cell">
                                        <button
                                            className="btn-ver"
                                            onClick={() => abrirModal(vehiculo)}
                                        >
                                            🔍
                                        </button>
                                        <button
                                            onClick={() => abrirModal(vehiculo, true)}
                                            className="btn-editar"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className="btn-eliminar"
                                            onClick={() => eliminarVehiculo(vehiculo.id)} // Llamar a la función de eliminar
                                        >
                                            🗑️

                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {modalAbierto && (
                <VehiculoModal
                    vehiculo={vehiculoSeleccionado}
                    clienteSeleccionado={clienteSeleccionado}
                    actualizarVehiculos={actualizarVehiculo}
                    actualizarServicios={actualizarServicios}
                    modoEdicionInicial={modoEdicion}
                    modoVista={modoVista}
                    abrirListaServicios={abrirListaServicios}
                    modalAbierto={modalAbierto}                // 🔹 ESTADO DEL MODAL
                    setModalAbierto={setModalAbierto}          // 🔹 FUNCIÓN PARA ABRIR/CERRAR
                    vehiculoSeleccionado={vehiculoSeleccionado} // 🔹 VEHÍCULO SELECCIONADO
                    setVehiculoSeleccionado={setVehiculoSeleccionado}
                    setClienteSeleccionado={setClienteSeleccionado}
                    serviciosVehiculo={serviciosVehiculo}
                    setServiciosVehiculo={setServiciosVehiculo}
                    cerrarModal={cerrarModal}
                    cerrarVerVehiculosModal={() => setModalAbierto(false)}

                />
            )}
        </div>
    );
};

export default VehiculosPage;