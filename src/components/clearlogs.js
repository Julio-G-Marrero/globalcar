import axios from "axios";

// Función para limpiar los logs
const clearLogs = async () => {
  try {
    const response = await axios.delete("https://www.backorders.chickenkiller.com/logs/errors-performance");
    alert("Logs limpiados exitosamente");
    return response.data;
  } catch (error) {
    console.error("Error al limpiar los logs:", error);
    alert("Error al intentar limpiar los logs");
  }
};

export default clearLogs;
