import React, { useState, useEffect } from "react";

const Inventario = () => {
    const [syncResults, setSyncResults] = useState({
        status: "",
        totalProcessed: 0,
        totalUpdated: 0,
        notFound: [],
        errors: [],
        updated: [],
    });
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalItems = Array.isArray(syncResults.notFound) ? syncResults.notFound.length : 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
 
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const fetchResults = async () => {
        setLoading(true);
        try {
            const response = await fetch("https://34.169.26.104/shopify/lastSyncResults");
            const data = await response.json();
            console.log("Datos obtenidos del backend:", data);

            if (data && data.status === "success") {
                setSyncResults(data);
            } else {
                setSyncResults({
                    status: "",
                    totalProcessed: 0,
                    totalUpdated: 0,
                    notFound: [],
                    errors: [],
                    updated: [],
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
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResults();
    }, []);

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
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: 'numeric', 
            minute: 'numeric', 
            second: 'numeric' 
        };
        return new Intl.DateTimeFormat('es-MX', options).format(new Date(isoString));
    };

    const currentErrors = Array.isArray(syncResults.updateErrorCount)

    const currentNotFoundItems = Array.isArray(syncResults.notFound)
        ? syncResults.notFound.slice(indexOfFirstItem, indexOfLastItem)
        : [];

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
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
                    Última sincronización: <span className="font-bold">{syncResults.lastUpdated ? formatDateTime(syncResults.lastUpdated) : 'Sin información'}</span>
                </p>
            </div>

            <h2 className="text-xl font-semibold text-gray-700 mt-6">Errores en la Actualización</h2>

            {/* Tabla de errores */}
            <div className="overflow-x-auto mt-4">
                <table className="table-auto w-2/3 mx-auto border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 px-4 py-2 text-left">#</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Código de Barras</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentNotFoundItems.length > 0 ? (
                            currentNotFoundItems.map((error, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="border border-gray-300 px-4 py-2">
                                        {indexOfFirstItem + index + 1}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {error.barcode}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2" className="text-center text-gray-500 py-4">
                                    No hay errores registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            <div className="flex w-2/3 mx-auto justify-between items-center mt-4">
                <button
                    className={`px-4 py-2 bg-gray-300 rounded ${
                        currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-400 text-gray-800"
                    }`}
                    disabled={currentPage === 1}
                    onClick={handlePreviousPage}
                >
                    Anterior
                </button>
                <span className="text-gray-600">
                    Página {currentPage} de {totalPages}
                </span>
                <button
                    className={`px-4 py-2 bg-gray-300 rounded ${
                        currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-400 text-gray-800"
                    }`}
                    disabled={currentPage === totalPages}
                    onClick={handleNextPage}
                >
                    Siguiente
                </button>
            </div>

            
            {/* Tabla de errores */}
            <div className="overflow-x-auto mt-4">
                <table
                  className={`${currentErrors.length > 0 ? "table-auto w-full border-collapse border border-gray-300": "hidden"}`}
                >
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 px-4 py-2 text-left">Mensaje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentErrors.length > 0 ? (
                            currentErrors.map((error, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="border border-gray-300 px-4 py-2">
                                        {indexOfFirstItem + index + 1}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {error.message}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2" className="text-center text-gray-500 py-4">
                                    No hay errores registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Inventario;
