import dayjs from "dayjs";

// Formatear fecha para inputs tipo "date" (YYYY-MM-DD)
export const formatearFechaInput = (fecha) => {
  if (!fecha) return "";
  return dayjs(fecha).format("YYYY-MM-DD");
};

// Formatear fecha para mostrar en pantalla (DD/MM/YYYY)
export const formatearFechaMostrar = (fecha) => {
  if (!fecha) return "";
  return dayjs(fecha).format("DD/MM/YYYY");
};

// Comparar dos fechas: retorna true si fecha1 es posterior a fecha2
export const esFechaPosterior = (fecha1, fecha2) => {
  return dayjs(fecha1).isAfter(dayjs(fecha2));
};

// Obtener fecha actual en formato YYYY-MM-DD
export const obtenerFechaHoy = () => {
  return dayjs().format("YYYY-MM-DD");
};