import React, { useEffect, useState } from "react";
import api from "../api";
import ClienteModal from "../components/ClienteModal"; // Importa el modal
import "./ClientesPage.css";
import logo from "../assets/background.jpg";
import NuevoClienteModal from "../components/NuevoClienteModal";
import NuevoVehiculoModal from "../components/NuevoVehiculoModal";
import VerVehiculosModal from "../components/VerVehiculosModal"; // Nuevo modal para ver vehículos
import ReasignarVehiculoModal from "../components/ReasignarVehiculosModal"; // Importamos el modal de reasignación de vehículo

import { toast } from "react-toastify"; // 📌 Importamos react-toastify
import "react-toastify/dist/ReactToastify.css";

const ClientesPage = () => {
  const [clientes, setClientes] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroApellido, setFiltroApellido] = useState("");
  const [filtroCUIT, setFiltroCUIT] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [nuevoClienteModalAbierto, setNuevoClienteModalAbierto] = useState(false);
  const [nuevoVehiculoModalAbierto, setNuevoVehiculoModalAbierto] = useState(false);
  const [verVehiculosModalAbierto, setVerVehiculosModalAbierto] = useState(false); // Nuevo estado para el modal
  const [vehiculos, setVehiculos] = useState([]);
  const [reasignarVehiculoModalAbierto, setReasignarVehiculoModalAbierto] = useState(false);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  const [serviciosVehiculo, setServiciosVehiculo] = useState([]);



  // Función para cargar los clientes desde la API
  const cargarClientes = () => {
    api
      .get("/clientes/")
      .then((response) => {
        
        setClientes(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los clientes:", error);
      });
  };

  useEffect(() => {
    // Cargar los clientes al inicio
    cargarClientes();
  }, []);

  // Función para filtrar clientes
  const clientesFiltrados = clientes.filter((cliente) =>
    (filtroNombre ? cliente.nombre.toLowerCase().includes(filtroNombre.toLowerCase()) : true) &&
    (filtroApellido ? cliente.apellido.toLowerCase().includes(filtroApellido.toLowerCase()) : true) &&
    (filtroCUIT ? cliente.cuit?.toString().includes(filtroCUIT) : true) // Asegura que cuit es string antes de buscar
  );

  const verVehiculos = (cliente) => {
    if (cliente && cliente.id) {
        setClienteSeleccionado(cliente);

        api.get(`/vehiculos/cliente/${cliente.id}`)
            .then((response) => {
                setVehiculos(response.data);
                setVerVehiculosModalAbierto(true);
            })
            .catch((error) => {
                console.error("Error al obtener los vehículos:", error);
            });
    }
};

  const cerrarVerVehiculosModal = () => {
    setVerVehiculosModalAbierto(false);
  };

  const abrirNuevoVehiculoModal = (cliente) => {
    setClienteSeleccionado(cliente);
    setNuevoVehiculoModalAbierto(true);
  };

  const cerrarNuevoVehiculoModal = () => {
    setNuevoVehiculoModalAbierto(false);
  };

  const actualizarVehiculos = (vehiculoActualizado) => {
    setVehiculos((prevVehiculos) => {
      const index = prevVehiculos.findIndex((v) => v.id === vehiculoActualizado.id);

      if (index !== -1) {
        const updatedVehiculos = [...prevVehiculos];
        updatedVehiculos[index] = vehiculoActualizado;
        return updatedVehiculos;
      } else {
        return [...prevVehiculos, vehiculoActualizado];
      }
    });
  };



  // Función para cerrar todos los modales
  const cerrarTodosLosModales = () => {
    setVerVehiculosModalAbierto(false);
    setNuevoVehiculoModalAbierto(false);
    setModalAbierto(false);
    setClienteSeleccionado(null);
    setModoEdicion(false);
    setReasignarVehiculoModalAbierto(false);  // Cerrar modal de reasignación
  };

  const verDetalle = (cliente) => {
    setClienteSeleccionado(cliente);
    setModalAbierto(true);
    setModoEdicion(false);
  };

  const editarCliente = (cliente) => {
    setClienteSeleccionado(cliente);
    setModalAbierto(true);
    setModoEdicion(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setClienteSeleccionado(null);
    setModoEdicion(false);
  };

  const actualizarCliente = (clienteActualizado) => {
    setClientes((prevClientes) =>
      prevClientes.map((cliente) =>
        cliente.id === clienteActualizado.id ? clienteActualizado : cliente
      )
    );
  };


  const eliminarCliente = (id) => {
    const confirmToastId = toast.warn(
      <div>
        <strong>⚠️ ¿Estás seguro?</strong>
        <p>Se eliminarán también sus vehículos asociados.</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <button
            onClick={() => {
              toast.dismiss(confirmToastId); // 🔥 Cierra el toast de confirmación
              api
                .delete(`/clientes/${id}`)
                .then(() => {
                  setClientes(clientes.filter((cliente) => cliente.id !== id));
                  toast.success("✅ Cliente eliminado correctamente", { autoClose: 3000 });
                })
                .catch((error) => {
                  toast.error("❌ Error al eliminar cliente", { autoClose: 3000 });
                  console.error("Error al eliminar cliente:", error);
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
            onClick={() => toast.dismiss(confirmToastId)} // 🔥 Ahora cierra el toast si se cancela
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

const actualizarServicios = () => {
  
  cargarClientes(); // ✅ Recarga los clientes para reflejar los cambios
};



  return (
    <div className="clientes-container">
      <img src={logo} alt="Mundo Filtro" className="logo" />
      <h1>Clientes</h1>
      <div className="filtro-container">
        <input type="text" placeholder="Nombre..." value={filtroNombre} onChange={(e) => setFiltroNombre(e.target.value)} />
        <input type="text" placeholder="Apellido..." value={filtroApellido} onChange={(e) => setFiltroApellido(e.target.value)} />
        <input type="text" placeholder="CUIT..." value={filtroCUIT} onChange={(e) => setFiltroCUIT(e.target.value)} />
        <button onClick={() => setNuevoClienteModalAbierto(true)}>Nuevo Cliente</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr className="encabezado">
              <th>Id</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>CUIT</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.id}</td>
                <td>{cliente.nombre}</td>
                <td>{cliente.apellido}</td>
                <td>{cliente.cuit ? cliente.cuit : "No disponible"}</td>
                <td>
                  <button onClick={() => verDetalle(cliente)} className="btn-ver">🔍</button>
                  <button onClick={() => editarCliente(cliente)} className="btn-editar">✏️</button>
                  <button onClick={() => eliminarCliente(cliente.id)} className="btn-eliminar">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalAbierto && (
        <ClienteModal
          cliente={clienteSeleccionado}
          cerrarModal={cerrarModal}
          actualizarCliente={actualizarCliente}
          modoEdicion={modoEdicion}
          setModoEdicion={setModoEdicion}
          actualizarServicios={actualizarServicios}
          abrirNuevoVehiculoModal={abrirNuevoVehiculoModal}
          verVehiculos={verVehiculos}
        />
      )}
      {nuevoClienteModalAbierto && (
        <NuevoClienteModal
          actualizarClientes={cargarClientes} // Función que recarga los clientes
          cerrarModal={() => setNuevoClienteModalAbierto(false)} // Función para cerrar el modal
        />
      )}
      {nuevoVehiculoModalAbierto && (
        <NuevoVehiculoModal
          clienteSeleccionado={clienteSeleccionado}
          clienteId={clienteSeleccionado.id} // Pasamos el clienteId
          cerrarModal={cerrarNuevoVehiculoModal}
          actualizarVehiculos={actualizarVehiculos}
        />
      )}
      {verVehiculosModalAbierto && (
        <VerVehiculosModal
          clienteSeleccionado={clienteSeleccionado}
          vehiculos={vehiculos}
          actualizarVehiculos={actualizarVehiculos}
          cerrarModal={() => setVerVehiculosModalAbierto(false)}
          setVehiculoSeleccionado={setVehiculoSeleccionado}
          serviciosVehiculo={serviciosVehiculo} // 🔹 PASAMOS ESTO
          setServiciosVehiculo={setServiciosVehiculo}
          actualizarServicios={actualizarServicios}
          setClienteSeleccionado={setClienteSeleccionado}
        />
      )}
      {reasignarVehiculoModalAbierto && (
        <ReasignarVehiculoModal
          vehiculo={vehiculos}
          clientes={clientes}
          cerrarModal={cerrarModal}
          actualizarVehiculos={actualizarVehiculos}
          clienteSeleccionado={clienteSeleccionado}
          cerrarVerVehiculosModal={cerrarVerVehiculosModal}
          cerrarTodosLosModales={cerrarTodosLosModales} // Agrega esta prop


        />
      )}
    </div>
  );
};

export default ClientesPage;