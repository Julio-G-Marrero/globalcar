import React, { useState, useEffect } from "react";
import ErrorLogConsole from "./ErrorLogConsole";

const Inventario = () => {
    const [syncResults, setSyncResults] = useState({
        status: "",
        totalProcessed: 0,
        totalUpdated: 0,
        notFound: [],
        errors: [],
        updated: [],
        errorLogs: [],
    });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(""); // Para el término de búsqueda
    const [filteredResults, setFilteredResults] = useState([]); // Resultados filtrados

    const fetchResults = async () => {
        setLoading(true);
        try {
            const response = await fetch("https://www.backorders.chickenkiller.com/shopify/lastSyncResults");
            const data = await response.json();
            console.log("Datos obtenidos del backend:", data);

            if (data && data.status === "success") {
                setSyncResults(data);
                setFilteredResults([]); // Inicialmente vacío hasta que se realice una búsqueda
            } else {
                setSyncResults({
                    status: "",
                    totalProcessed: 0,
                    totalUpdated: 0,
                    notFound: [],
                    errors: [],
                    updated: [],
                    errorLogs: [],
                });
            }
        } catch (error) {
            console.error("Error al obtener los resultados:", error);
            setSyncResults({
                status: "",
                totalProcessed: 0,
                totalUpdated: 0,
                notFound: [],
                errors: [],
                updated: [],
                errorLogs: [],
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResults();
    }, []);

    useEffect(() => {
        // Filtrar resultados cada vez que cambia el término de búsqueda
        if (searchTerm) {
            const filtered = syncResults.notFound
                .filter((product) =>
                    product.barcode.toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
                .slice(0, 10); // Limitar a los primeros 10 resultados
            setFilteredResults(filtered);
        } else {
            setFilteredResults([]); // Si no hay búsqueda, no muestra nada
        }
    }, [searchTerm, syncResults.notFound]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-500"></div>
                <p className="ml-4 text-gray-600">Cargando resultados de sincronización...</p>
            </div>
        );
    }

    if (!syncResults || syncResults.status !== "success") {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-600">No hay resultados disponibles en este momento.</p>
            </div>
        );
    }

    const formatDateTime = (isoString) => {
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
        };
        return new Intl.DateTimeFormat("es-MX", options).format(new Date(isoString));
    };

    return (
        <div className="max-w-6xl mx-auto mt-8 p-6 bg-white shadow-md rounded-md">
            <h1 className="text-2xl font-bold text-gray-800 text-center">
                Resultados de la Sincronización de Inventarios
            </h1>

            <div className="mt-4 bg-gray-100 p-4 rounded-md">
                <p className="text-gray-600 text-lg">
                    <span className="font-bold">Total procesados:</span> {syncResults.totalProcessed}
                </p>
                <p className="text-gray-600 text-lg">
                    <span className="font-bold">Total actualizados:</span> {syncResults.totalUpdated}
                </p>
                <p className="text-gray-600 text-lg">
                    <span className="font-bold">No encontrados:</span> {syncResults.notFound.length}
                </p>
                <p className="text-gray-600 text-lg">
                    <span className="font-bold">Errores:</span>{" "}
                    {Array.isArray(syncResults.errors) ? syncResults.errors.length : 0}
                </p>
                <p className="text-gray-600 text-lg mt-4">
                    Última sincronización:{" "}
                    <span className="font-bold">
                        {syncResults.lastUpdated ? formatDateTime(syncResults.lastUpdated) : "Sin información"}
                    </span>
                </p>
            </div>

            {/* Input de búsqueda */}
            <div className="mt-6">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar código de barras..."
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <h2 className="text-xl font-semibold text-gray-700 mt-6">Buequeda de Productos en la Actualización</h2>

            {/* Tabla de errores */}
            {searchTerm && filteredResults.length > 0 ? (
                <div className="overflow-x-auto mt-4">
                    <table className="table-auto w-2/3 mx-auto border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 px-4 py-2 text-left">#</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Código de Barras</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredResults.map((item, index) => (
                                <tr key={item.barcode} className="hover:bg-gray-100">
                                    <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                                    <td className="border border-gray-300 px-4 py-2">{item.barcode}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : searchTerm ? (
                <div className="text-center mt-4 text-gray-500">No se encontraron resultados.</div>
            ) : null}

            {/* Consola de Logs */}
            <div className="bg-gray-100 flex items-center justify-center mt-8">
                <ErrorLogConsole logs={syncResults.errorLogs} />
            </div>
        </div>
    );
};

export default Inventario;
