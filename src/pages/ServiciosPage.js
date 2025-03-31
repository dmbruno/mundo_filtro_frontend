import React, { useEffect, useState } from "react";
import api from "../api";
import "./ServiciosPage.css";
import logo from "../assets/background.jpg";
import ListaServiciosModal from "../components/ListaServiciosModal";

const ServiciosPage = () => {
    const [servicios, setServicios] = useState([]);
    const [filtroFechaDesde, setFiltroFechaDesde] = useState("");
    const [filtroFechaHasta, setFiltroFechaHasta] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [vehiculos, setVehiculos] = useState([]);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [serviciosVehiculo, setServiciosVehiculo] = useState([]);

    

    useEffect(() => {
        cargarServicios();
    }, []);

    const cargarServicios = () => {
        setIsLoading(true);
        api.get("/servicios/")
            .then((response) => {
                
                setServicios(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error al obtener los servicios:", error);
                setIsLoading(false);
            });
    };

    // 🔹 Agrupar servicios por VEHÍCULO (no solo por dominio)
    const obtenerUltimosServicios = () => {
        const serviciosPorVehiculo = {};

        servicios.forEach((servicio) => {
            const vehiculoId = servicio.vehiculo?.dominio; // Usamos el dominio como clave ÚNICA
            if (!vehiculoId) return;

            // Si no hay un servicio guardado o la fecha es más reciente, lo reemplazamos
            if (!serviciosPorVehiculo[vehiculoId] ||
                new Date(servicio.fecha_servicio) > new Date(serviciosPorVehiculo[vehiculoId].fecha_servicio)) {
                serviciosPorVehiculo[vehiculoId] = servicio;
            }
        });

        return Object.values(serviciosPorVehiculo);
    };

    const aplicarFiltros = () => {
        const desde = filtroFechaDesde ? new Date(filtroFechaDesde) : null;
        const hasta = filtroFechaHasta ? new Date(filtroFechaHasta) : null;

        if (!desde && !hasta) {
            cargarServicios();
            return;
        }

        const filtrados = servicios.filter(servicio => {
            const fechaServicio = new Date(servicio.fecha_servicio);
            return (!desde || fechaServicio >= desde) && (!hasta || fechaServicio <= hasta);
        });

        setServicios(filtrados);
    };

    const serviciosFiltrados = obtenerUltimosServicios();

    const abrirListaServicios = async (vehiculo) => {
        
    
        try {
            // Llamada a la API para obtener TODOS los servicios del vehículo
            const response = await api.get(`/servicios/vehiculo/${vehiculo.id}`);
            const serviciosDelVehiculo = response.data;
    
            
    
            // 📌 Guardar vehículo seleccionado
            setVehiculoSeleccionado({
                id: vehiculo.id,
                dominio: vehiculo.dominio,
                marca: vehiculo.marca,
                modelo: vehiculo.modelo
            });
    
            // 📌 Si el vehículo tiene servicios, tomamos el cliente de ahí
            // 📌 Si no tiene servicios, tomamos el cliente del mismo `vehiculo`
            const clienteInfo =
                serviciosDelVehiculo.length > 0
                    ? {
                          id: serviciosDelVehiculo[0].cliente.id,
                          nombre: serviciosDelVehiculo[0].cliente.nombre,
                          apellido: serviciosDelVehiculo[0].cliente.apellido
                      }
                    : {
                          id: vehiculo.cliente_id || null,  // Asegurarnos de pasar un ID
                          nombre: vehiculo.cliente?.nombre || "Cliente desconocido",
                          apellido: vehiculo.cliente?.apellido || ""
                      };
    
            
            setClienteSeleccionado(clienteInfo);
    
            // 📌 Guardar lista de servicios
            setServiciosVehiculo(serviciosDelVehiculo);
    
            // 📌 Abrir modal
            setModalAbierto(true);
        } catch (error) {
            console.error("Error al obtener servicios del vehículo:", error);
        }
    };

    const cerrarListaServicios = () => {
        
        setModalAbierto(false);
    };


    const actualizarServicios = () => {
        cargarServicios(); // ✅ Llama a la función que recarga los datos desde el backend
    };

    return (
        <div className="servicios-container">
            <img src={logo} alt="Mundo Filtro" className="logo" />
            <h1>Servicios</h1>

            <div className="filtro-container">
                <input
                    type="date"
                    value={filtroFechaDesde}
                    onChange={(e) => setFiltroFechaDesde(e.target.value)}
                />
                <input
                    type="date"
                    value={filtroFechaHasta}
                    onChange={(e) => setFiltroFechaHasta(e.target.value)}
                />
                <button className="btn-filtrar" onClick={aplicarFiltros}>Aplicar filtros</button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr className="encabezado">
                            <th>Dominio</th>
                            <th>Marca</th>
                            <th>Modelo</th>
                            <th>Cliente</th>
                            <th>Último Servicio</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="6">Cargando...</td>
                            </tr>
                        ) : serviciosFiltrados.length > 0 ? (
                            serviciosFiltrados.map((servicio) => {
                                const { vehiculo, cliente, fecha_servicio } = servicio;
                                return (
                                    <tr key={vehiculo.dominio}>
                                        <td>{vehiculo.dominio}</td>
                                        <td>{vehiculo.marca}</td>
                                        <td>{vehiculo.modelo}</td>
                                        <td>{cliente ? `${cliente.nombre} ${cliente.apellido}` : "Sin Cliente"}</td>
                                        <td>{new Date(fecha_servicio).toLocaleDateString()}</td>
                                        <td>
                                            <button className="btn-ver-servicio" onClick={() => abrirListaServicios(vehiculo)}>🔍</button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="6">No hay servicios registrados</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* Modal de lista de servicios */}
            {modalAbierto && (
                <ListaServiciosModal
                    cliente={clienteSeleccionado}
                    vehiculo={vehiculoSeleccionado}
                    actualizarServicios={actualizarServicios}
                    servicios={serviciosVehiculo}
                    cerrarModal={cerrarListaServicios}
                    
                    
                />
            )}
        </div>
    );
};

export default ServiciosPage;