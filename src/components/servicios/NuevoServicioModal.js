import React, { useState, useEffect } from "react";
import api from "../../api"; // API para interactuar con el backend
import "./NuevoServicioModal.css"; // Estilos del modal
import { toast } from "react-toastify";


const NuevoServicioModal = ({ 
    vehiculo, 
    cliente, 
    servicio,  // ✅ Aseguramos que se recibe correctamente
    cerrarModal, 
    cerrarListaServicios, 
    actualizarServicios 
}) => {
    // 📌 Estado inicial de un servicio nuevo o edición
    const [datosServicio, setDatosServicio] = useState({
        cambio_aceite: "",
        filtro_aceite: false,
        filtro_aire: false,
        filtro_combustible: false,
        filtro_habitaculo: false,
        otros_servicios: "",
        kms: "",
        notas: "",
        tipo_servicio: "",
    });

    // 📌 Si estamos editando, cargamos los datos del servicio seleccionado
    useEffect(() => {
        if (servicio) {
            setDatosServicio({
                cambio_aceite: servicio.cambio_aceite || "",
                filtro_aceite: servicio.filtro_aceite || false,
                filtro_aire: servicio.filtro_aire || false,
                filtro_combustible: servicio.filtro_combustible || false,
                filtro_habitaculo: servicio.filtro_habitaculo || false,
                otros_servicios: servicio.otros_servicios || "",
                kms: servicio.kms || "",
                notas: servicio.notas || "",
                tipo_servicio: servicio.tipo_servicio || "",
            });
        }
    }, [servicio]);

    const clienteFinal = cliente?.id ? cliente.id : vehiculo.cliente_id;

    // 🔹 Manejo de cambios en los inputs
    const handleChange = (e) => {
        setDatosServicio({
            ...datosServicio,
            [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
        });
    };

    // 🔹 Guardar un nuevo servicio
    const guardarServicio = async () => {
        try {
            await api.post("/servicios/", {
                vehiculo_id: vehiculo.id,
                cliente_id: clienteFinal,
                ...datosServicio,
            });

            toast.success("✅ Servicio guardado correctamente", { autoClose: 3000 }); // 🔥 Mensaje de éxito

            cerrarModal();
            actualizarServicios(); 
            cerrarListaServicios();
        } catch (error) {
            console.error("❌ Error al guardar el servicio:", error);
        }
    };

    // 🔹 Actualizar un servicio existente
    const guardarCambiosNuevo = async () => {
        try {
            await api.put(`/servicios/${servicio.id}`, datosServicio);

            toast.success("✅ Servicio actualizado correctamente", { autoClose: 3000 }); // 🔥 Mensaje de éxito

            actualizarServicios();
            cerrarModal(); // ❌ Cierra modal de edición
            cerrarListaServicios(); // ✅ Cierra ListaServiciosModal
        } catch (error) {
            console.error("❌ Error al actualizar el servicio:", error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content-servicios">
                <div className="modal-notch-servicios"></div>
                <h2 className="modal-title">
                    {servicio ? "Editar Servicio" : "Nuevo Servicio"}
                </h2>
                <p className="modal-subtitle">Cliente: {cliente?.nombre} {cliente?.apellido}</p>
                <p className="modal-subtitle">Vehículo: {vehiculo?.marca} {vehiculo?.modelo}</p>

                <div className="form-group-servicios">
                    <label>Descripción del servicio</label>
                    <input
                        type="text"
                        name="cambio_aceite"
                        value={datosServicio.cambio_aceite}
                        onChange={handleChange}
                        placeholder="Ej: Cambio de aceite y filtros"
                    />
                </div>

                <div className="form-group-servicios">
                    <label>Tipo de Servicio</label>
                    <input
                        type="text"
                        name="tipo_servicio"
                        value={datosServicio.tipo_servicio}
                        onChange={handleChange}
                        placeholder="Ej: Mantenimiento general"
                    />
                </div>

                <div className="form-group-servicios">
                    <label>KMs del Vehículo</label>
                    <input
                        type="number"
                        name="kms"
                        value={datosServicio.kms}
                        onChange={handleChange}
                        placeholder="Ej: 75000"
                    />
                </div>

                <div className="checkbox-group-servicios">
                    <h4 className="checkbox-group-title">Filtros Cambiados:</h4>
                    <label>
                        <input type="checkbox" name="filtro_aceite" checked={datosServicio.filtro_aceite} onChange={handleChange} />
                        Filtro de Aceite
                    </label>
                    <label>
                        <input type="checkbox" name="filtro_aire" checked={datosServicio.filtro_aire} onChange={handleChange} />
                        Filtro de Aire
                    </label>
                    <label>
                        <input type="checkbox" name="filtro_combustible" checked={datosServicio.filtro_combustible} onChange={handleChange} />
                        Filtro de Combustible
                    </label>
                    <label>
                        <input type="checkbox" name="filtro_habitaculo" checked={datosServicio.filtro_habitaculo} onChange={handleChange} />
                        Filtro de Habitáculo
                    </label>
                </div>

                <div className="form-group-servicios">
                    <label className="label-servicios">Otros Servicios</label>
                    <textarea
                        name="otros_servicios"
                        value={datosServicio.otros_servicios}
                        onChange={handleChange}
                        placeholder="Ej: Cambio de pastillas de freno"
                    />
                </div>

                <div className="form-group-servicios">
                    <label className="label-servicios">Notas</label>
                    <textarea
                        name="notas"
                        value={datosServicio.notas}
                        onChange={handleChange}
                        placeholder="Comentarios adicionales..."
                    />
                </div>

                <div className="modal-actions">
                    <button className="btn-cerrar-servicio" onClick={cerrarModal}>Cancelar</button>
                    <button className="btn-guardar-servicio" onClick={servicio ? guardarCambiosNuevo : guardarServicio}>
                        {servicio ? "Actualizar Servicio" : "Guardar Servicio"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NuevoServicioModal;