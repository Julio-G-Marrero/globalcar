import React, { useState } from "react";

const ErrorLogConsole = ({ logs }) => {
    const [isClearing, setIsClearing] = useState(false);

    const handleClearLogs = async () => {
        setIsClearing(true);
        try {
            const response = await fetch("https://www.backorders.chickenkiller.com/shopify/clearLogs", {
                method: "DELETE",
            });
            const result = await response.json();

            if (result.status === "success") {
                alert("Logs eliminados exitosamente.");
            } else {
                alert(`Error al limpiar logs: ${result.message}`);
            }
        } catch (error) {
            console.error("Error al limpiar logs:", error);
            alert("Ocurrió un error al intentar limpiar los logs.");
        } finally {
            setIsClearing(false);
        }
    };

    return (
        <div className="bg-gray-800 text-white p-4 rounded-md text-left" >
            <h2 className="text-lg font-bold mb-4">Consola de Logs</h2>
      
            <div className="mt-4 max-h-64 overflow-y-auto">
                {logs.length > 0 ? (
                    logs.map((log, index) => (
                        <p key={index} className="text-sm font-mono whitespace-pre-wrap text-yellow-300">
                            {log}
                        </p>
                    ))
                ) : (
                    <p className="text-gray-400">No hay logs disponibles.</p>
                )}
            </div>
            <button
                className={`px-4 py-2 rounded mt-4 ${
                    isClearing
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600"
                }`}
                onClick={handleClearLogs}
                disabled={isClearing}
            >
                {isClearing ? "Limpiando..." : "Limpiar Logs"}
            </button>
        </div>
    );
};

export default ErrorLogConsole;
