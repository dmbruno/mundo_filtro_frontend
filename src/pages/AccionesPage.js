import React, { useEffect, useState } from "react";
import api from "../api";
import "./AccionesPage.css";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import logo from "../assets/background.jpg"; // Logo de Mundo Filtro
import { FaWhatsapp } from "react-icons/fa";

const AccionesPage = () => {
    const [vehiculos, setVehiculos] = useState([]);
    const [filtroNombre, setFiltroNombre] = useState("");
    const [soloPendientes, setSoloPendientes] = useState(false);

    const [modalAbierto, setModalAbierto] = useState(false);
    const [mensajePersonalizado, setMensajePersonalizado] = useState("");
    const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("/acciones/vehiculos-con-ultimo-servicio");
                setVehiculos(response.data);
            } catch (error) {
                console.error("❌ Error al obtener vehículos con último servicio:", error);
            }
        };

        fetchData();
    }, []);

    const calcularMeses = (fecha) => {
        if (!fecha) return null;
        return dayjs().diff(dayjs(fecha), 'month');
    };

    const vehiculosFiltrados = vehiculos
        .filter((v) =>
            (`${v.nombre} ${v.apellido}`.toLowerCase().includes(filtroNombre.toLowerCase()))
        )
        .filter((v) => {
            if (!soloPendientes) return true;
            const meses = calcularMeses(v.ultimo_servicio);
            return meses === null || meses >= 6;
        });

    const abrirModal = (vehiculo) => {
        setVehiculoSeleccionado(vehiculo);
        const meses = calcularMeses(vehiculo.ultimo_servicio);
        setMensajePersonalizado(
            `Hola ${vehiculo.nombre}, te recordamos que hace ${meses ?? "varios"} meses no realizás un servicio al vehículo ${vehiculo.marca} ${vehiculo.modelo} (${vehiculo.dominio}). Te esperamos en Mundo Filtro 🚗🔧`
        );
        setModalAbierto(true); 
    };

    const cerrarModal = () => {
        setModalAbierto(false);
        setVehiculoSeleccionado(null);
        setMensajePersonalizado("");
    };

    const enviarWhatsApp = () => {
        if (!vehiculoSeleccionado || !vehiculoSeleccionado.telefono) return;
      
        const tel = vehiculoSeleccionado.telefono.replace(/\D/g, "");
        const mensajeCodificado = encodeURIComponent(mensajePersonalizado);
      
        window.open(`https://wa.me/54${tel}?text=${mensajeCodificado}`, "_blank");
        cerrarModal();
      };

    const exportarExcel = async () => {
        try {
            const response = await api.get("/acciones/exportar-datos");
            const hoja = XLSX.utils.json_to_sheet(response.data);
            const libro = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(libro, hoja, "Base Completa");
            const buffer = XLSX.write(libro, { bookType: "xlsx", type: "array" });
            const blob = new Blob([buffer], { type: "application/octet-stream" });
            saveAs(blob, "mundo-filtro-base-completa.xlsx");
        } catch (error) {
            console.error("❌ Error al generar el Excel:", error);
            alert("Hubo un error al intentar generar el archivo.");
        }
    };

    return (
        <div className="acciones-page">
            <img src={logo} alt="Mundo Filtro" className="logo" />
            <h2 className="acciones-title">📲 Recordatorios por WhatsApp </h2>

            <div className="acciones-contenido">
                <div className="filtros-clientes">
                    <input
                    className="input-filtro"
                        type="text"
                        placeholder="Nombre o Apellido..."
                        value={filtroNombre}
                        onChange={(e) => setFiltroNombre(e.target.value)}
                    />
                    <label>
                        <input
                            type="checkbox"
                            checked={soloPendientes}
                            onChange={() => setSoloPendientes(!soloPendientes)}
                        />
                        Solo pendientes (6+ meses)
                    </label>
                    <button onClick={exportarExcel}>📥 Descargar Excel</button>
                </div>

                <div className="tabla-scroll">
                    <table className="tabla-clientes">
                        <thead>
                            <tr>
                                <th>Nombre y Apellido</th>
                                <th>Teléfono</th>
                                <th>Vehículo</th>
                                <th>Dominio</th>
                                <th>Último Servicio</th>
                                <th>Hace</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vehiculosFiltrados.map((v) => {
                                const meses = calcularMeses(v.ultimo_servicio);
                                return (
                                    <tr key={v.vehiculo_id} className={meses >= 6 || !v.ultimo_servicio ? "pendiente" : ""}>
                                        <td>{v.nombre} {v.apellido}</td>
                                        <td>{v.telefono}</td>
                                        <td>{v.marca} {v.modelo}</td>
                                        <td>{v.dominio}</td>
                                        <td>{v.ultimo_servicio ? dayjs(v.ultimo_servicio).format("DD/MM/YYYY") : "—"}</td>
                                        <td>{meses !== null ? `${meses} meses` : "Sin registro"}</td>
                                        <td>
                                            <button className="btn-whatsapp" onClick={() => abrirModal(v)}>
                                                <FaWhatsapp />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {modalAbierto && (
                    <div className="modal-overlay">
                        <div className="modal-content-mensaje">
                            <h3 className="titulo-mensje">✍️ Personalizar Mensaje</h3>
                            <p>
                                Cliente: <strong>{vehiculoSeleccionado.nombre} {vehiculoSeleccionado.apellido}</strong><br />
                                Vehículo: <strong>{vehiculoSeleccionado.marca} {vehiculoSeleccionado.modelo} ({vehiculoSeleccionado.dominio})</strong>
                            </p>
                            <textarea
                                value={mensajePersonalizado}
                                onChange={(e) => setMensajePersonalizado(e.target.value)}
                                rows="6"
                            ></textarea>
                            <div className="modal-buttons">
                                <button className="btn-cancelar" onClick={cerrarModal}>Cancelar</button>
                                <button className="btn-enviar" onClick={enviarWhatsApp}>Enviar</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccionesPage;