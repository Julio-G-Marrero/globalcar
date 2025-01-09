import React, { useState, useEffect } from 'react';

const Inventario = () => {
    const [syncResults, setSyncResults] = useState(null); // Estado inicial null
    const [loading, setLoading] = useState(true); // Estado de carga

    // Función para obtener los resultados desde el backend
    const fetchResults = async () => {
        setLoading(true);
        try {
            const response = await fetch('/shopify/lastSyncResults'); // Endpoint para últimos resultados
            const data = await response.json();
            setSyncResults(data);
        } catch (error) {
            console.error('Error al obtener los resultados:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResults(); // Llama la función al montar el componente
    }, []);

    // Mostrar spinner si está cargando
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-500"></div>
                <p className="ml-4 text-gray-600">Cargando resultados de sincronización...</p>
            </div>
        );
    }

    // Si no hay resultados (por ejemplo, en la primera sincronización)
    if (!syncResults) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-600">No hay resultados disponibles en este momento.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow-md rounded-md">
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
                    <span className="font-bold">Errores:</span> {syncResults.errors.length}
                </p>
            </div>

            <h2 className="text-xl font-semibold text-gray-700 mt-6">Detalles</h2>
            <div className="overflow-x-auto mt-4">
                <table className="table-auto w-full border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 px-4 py-2">#</th>
                            <th className="border border-gray-300 px-4 py-2">Producto</th>
                            <th className="border border-gray-300 px-4 py-2">Estado</th>
                            <th className="border border-gray-300 px-4 py-2">Mensaje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {syncResults.updated.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-100">
                                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.barcode}</td>
                                <td className="border border-gray-300 px-4 py-2 text-green-600 font-bold">Actualizado</td>
                                <td className="border border-gray-300 px-4 py-2">Cantidad: {item.quantity}</td>
                            </tr>
                        ))}
                        {syncResults.notFound.map((item, index) => (
                            <tr key={syncResults.updated.length + index} className="hover:bg-gray-100">
                                <td className="border border-gray-300 px-4 py-2">{syncResults.updated.length + index + 1}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.barcode}</td>
                                <td className="border border-gray-300 px-4 py-2 text-yellow-600 font-bold">No encontrado</td>
                                <td className="border border-gray-300 px-4 py-2">{item.message}</td>
                            </tr>
                        ))}
                        {syncResults.errors.map((item, index) => (
                            <tr key={syncResults.updated.length + syncResults.notFound.length + index} className="hover:bg-gray-100">
                                <td className="border border-gray-300 px-4 py-2">
                                    {syncResults.updated.length + syncResults.notFound.length + index + 1}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">{item.barcode}</td>
                                <td className="border border-gray-300 px-4 py-2 text-red-600 font-bold">Error</td>
                                <td className="border border-gray-300 px-4 py-2">{item.message}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Inventario;
