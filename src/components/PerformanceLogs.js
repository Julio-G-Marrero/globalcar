import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import clearLogs from "./clearlogs" // Ruta de la función

function PerformanceLogs() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);
  const [errorLogsConsole, setErrorLogsConsole] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get("https://www.backorders.chickenkiller.com/logs/performance");
        const fetchedLogs = response.data.logs; // Asegúrate de que `logs` esté dentro de `data`
        setLogs(Array.isArray(fetchedLogs) ? fetchedLogs : []); // Valida si es un array
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };
    
    const fetchResults = async () => {
      try {
        const response = await fetch("https://www.backorders.chickenkiller.com/logs/errors-performance");
        const data = await response.json();
        setErrorLogsConsole(Array.isArray(data.logs) ? data.logs : []); // Asegúrate de que sea un array
      } catch (error) {
        console.error("Error al obtener los resultados:", error);
        setErrorLogsConsole([]); // En caso de error, inicializa como array vacío
      }
    };
    fetchResults();
    fetchLogs();
  }, []);

  const handleClearLogs = async () => {
    await clearLogs();
    // Aquí puedes realizar otras acciones después de limpiar los logs, como actualizar la UI
  };
  
  const processLogs = (logs) => {
    // Asegúrate de que logs sea un array válido
    if (!Array.isArray(logs) || logs.length === 0) {
      return []; // Retorna un array vacío si logs no es válido
    }
  
    const groupedLogs = logs.reduce(
      (acc, log) => {
        const type = log.type || "unknown";
        if (!acc[type]) {
          acc[type] = {
            totalDuration: 0,
            count: 0,
            successCount: 0,
            errorCount: 0,
            errorMessages: {},
          };
        }
        acc[type].totalDuration += log.duration || 0;
        acc[type].count += 1;
        if (log.status === "success") {
          acc[type].successCount += 1;
        } else if (log.status === "error") {
          acc[type].errorCount += 1;
          if (log.errorMessage) {
            acc[type].errorMessages[log.errorMessage] = (acc[type].errorMessages[log.errorMessage] || 0) + 1;
          }
        }
        return acc;
      },
      {}
    );
  
    return Object.entries(groupedLogs).map(([type, data]) => ({
      type,
      averageDuration: data.totalDuration / data.count,
      successCount: data.successCount,
      errorCount: data.errorCount,
      totalRequests: data.count, // Total de solicitudes
      errorPercentage: ((data.errorCount / data.count) * 100).toFixed(2),
      commonErrors: Object.entries(data.errorMessages)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3), // Top 3 errores
    }));
  };
  

  const createChartData = (groupedLogs) => {
    return {
      labels: groupedLogs.map((log) => log.type),
      datasets: [
        {
          label: "Duración Promedio (ms)",
          data: groupedLogs.map((log) => log.averageDuration),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
      ],
    };
  };

  if (isLoading) {
    return <div className="text-center text-lg">Cargando logs...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 text-lg">Error al cargar los logs: {error}</div>;
  }

  const groupedLogs = processLogs(logs);
  const barChartData = createChartData(groupedLogs);

  if (!groupedLogs.length) {
    return <p className="text-center text-gray-600">No hay logs disponibles.</p>;
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard de Logs de Rendimiento</h1>
      {groupedLogs.length === 0 ? (
        <p className="text-center text-gray-600">No hay logs disponibles.</p>
      ) : (
      <div>
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div class="md:col-span-2 lg:col-span-1">
                <div class="h-full py-8 px-6 space-y-6 rounded-xl border border-gray-200 bg-white flex justify-center">
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Estado de Consultas</h2>
                        {groupedLogs.map((log, index) => (
                            <div key={index} className="mb-4">
                            <h3 className="text-lg font-medium mb-2">{log.type}</h3>
                            <Doughnut
                                data={{
                                labels: ["Correctas", "Errores"],
                                datasets: [
                                    {
                                    label: log.type,
                                    data: [log.successCount, log.errorCount],
                                    backgroundColor: ["#36A2EB", "#FF6384"],
                                    },
                                ],
                                }}
                            />
                        </div>
                    ))}
                    </div>
                </div>
            </div>
            <div class="md:col-span-2 lg:col-span-1">
                <div class=" p-5 bg-white">
                    <div className="">
                        <h2 className="text-xl font-semibold mb-4">Duración Promedio por Tipo</h2>
                        <Bar data={barChartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                    </div>
                    <div className="mt-2">
                        <h2 className="text-xl font-semibold mb-4">Solicitudes Totales por Tipo</h2>
                        <table className="table-auto w-full bg-white shadow-md rounded-lg overflow-hidden">
                            <thead className="bg-gray-200">
                            <tr>
                                <th className="px-4 py-2 text-left">Tipo</th>
                                <th className="px-4 py-2 text-left">Solicitudes Totales</th>
                            </tr>
                            </thead>
                            <tbody>
                            {groupedLogs.map((log, index) => (
                                <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                                <td className="px-4 py-2 border-t border-gray-200">{log.type}</td>
                                <td className="px-4 py-2 border-t border-gray-200">{log.totalRequests}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4">
                        <h2 className="text-xl font-semibold mb-4">Errores Más Comunes</h2>
                        {groupedLogs.map((log, index) => (
                            <div key={index} className="mb-8">
                            <h3 className="text-lg font-medium mb-2">{log.type}</h3>
                            <table className="table-auto w-full bg-white shadow-md rounded-lg overflow-hidden">
                                <thead className="bg-gray-200">
                                <tr>
                                    <th className="px-4 py-2 text-left">Mensaje de Error</th>
                                    <th className="px-4 py-2 text-left">Ocurrencias</th>
                                </tr>
                                </thead>
                                <tbody>
                                {log.commonErrors.map(([message, count], idx) => (
                                    <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                                    <td className="px-4 py-2 border-t border-gray-200">{message}</td>
                                    <td className="px-4 py-2 border-t border-gray-200">{count}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div class="md:col-span-2 lg:col-span-1">
              <div class=" p-5 bg-white min-h-screen">
                {/* Consola de Logs */}
                <div className="h-full flex items-center justify-center mt-8">
                <div className=" bg-gray-800 text-white p-4 rounded-md text-left" >
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold mb-4">Consola de Logs</h2>
                    <button
                        onClick={handleClearLogs}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Limpiar Logs
                      </button>
                  </div>
                  <div className=" min-h-screen mt-4 max-h-64 overflow-y-auto w-full pr-5">
                  {errorLogsConsole && errorLogsConsole.length > 0 ? (
                      errorLogsConsole.map((log, index) => (
                        <div
                          key={index}
                          className="text-sm font-mono whitespace-pre-wrap text-yellow-400 mb-4 border-b border-gray-600 pb-2"
                        >
                          <p>
                            <span className="font-bold text-blue-400">Timestamp:</span> {log.timestamp}
                          </p>
                          <p>
                            <span className="font-bold text-blue-400">Level:</span> {log.level}
                          </p>
                          <p>
                            <span className="font-bold text-blue-400">Type:</span> {log.message.type}
                          </p>
                          <p>
                            <span className="font-bold text-blue-400">Status:</span> {log.message.status}
                          </p>
                          <p>
                            <span className="font-bold text-blue-400">Duration:</span> {log.message.duration} ms
                          </p>
                          <p>
                            <span className="font-bold text-blue-400">Search Query:</span> {log.message.searchQuery}
                          </p>
                          {log.message.errorMessage && (
                            <p>
                              <span className="font-bold text-red-400">Error Message:</span> {log.message.errorMessage}
                            </p>
                          )}
                        </div>
                        
                      ))
                    ) : (
                      <p className="text-gray-400">No hay logs disponibles.</p>
                    )}
              
                  </div>
                </div>
                </div>
              </div>
            </div>
 
        </div>
      </div>
        
      )}
    </div>
  );
}

export default PerformanceLogs;
