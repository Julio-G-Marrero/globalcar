import React, { useEffect, useState } from "react";
import axios from "axios";

function PerformanceLogs() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get("https://www.backorders.chickenkiller.com/shopify/lastSyncResults");
        setLogs(response.data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  if (isLoading) {
    return <div>Cargando logs...</div>;
  }

  if (error) {
    return <div>Error al cargar los logs: {error}</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Logs de Rendimiento</h1>
      {logs.length === 0 ? (
        <p>No hay logs disponibles.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Tipo</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Consulta</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Duración (ms)</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Estado</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Mensaje de Error</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff" }}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{log.type}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{log.searchQuery || "N/A"}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{log.duration}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{log.status}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{log.errorMessage || "N/A"}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{formatTimestamp(log.timestamp)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PerformanceLogs;
