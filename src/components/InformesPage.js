import React from "react";
import DashboardAside from "./DashboardAside";
import HeaderApp from "./HeaderApp";
import api from "../utilis/api";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useHistory } from 'react-router'
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from '../images/logo.png';


function InformesPage(props) {
    const [productosAutorizados,setProductosAutorizados] = React.useState([])
    const [productosDenegados,setProductosDenegados] = React.useState([])
    const [allProducts,setAllProducts] = React.useState([])
    React.useEffect(() => {
        fetchProductosAutorizados()
        fetchProductosDenegados()
        fetchAllProductos()
    },[])
    const history = useHistory()

    const MySwal = withReactContent(Swal)
    const Toast = MySwal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = MySwal.stopTimer;
          toast.onmouseleave = MySwal.resumeTimer;
        }
    });

    function fetchProductosAutorizados() {
        fetch(`${api.addressEndpoints}/orders/informes-autorizados`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${props.jwt}`,
            }
          })
          .then((response) => response.json())
          .then((data) => {
                setProductosAutorizados(data.productosAutorizados)
            })
          .catch((err) => console.log(err));
    }

    function fetchProductosDenegados() {
        fetch(`${api.addressEndpoints}/orders/informes-denegados`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${props.jwt}`,
            }
          })
          .then((response) => response.json())
          .then((data) => {
                setProductosDenegados(data.productosDenegados)
                console.log(data.productosDenegados)
            })
          .catch((err) => console.log(err));
    }

    function fetchAllProductos() {
        fetch(`${api.addressEndpoints}/orders/informes-todos`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${props.jwt}`,
            }
          })
          .then((response) => response.json())
          .then((data) => {
            setAllProducts(data)
            console.log(data)
            })
          .catch((err) => console.log(err));
    }


    const loadImageToBase64 = (imagePath) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = imagePath;
            img.crossOrigin = "Anonymous"; // Asegúrate de evitar problemas de CORS
        
            img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
        
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
        
            // Obtener la imagen en Base64
            const base64String = canvas.toDataURL("image/png");
            resolve(base64String);
            };
        
            img.onerror = (error) => {
            reject("Error al cargar la imagen: " + error);
            };
        });
    };


    const formatoMoneda = (monto) => {
        return new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
        }).format(Number(monto));
    };

    const reporteSimplificadoAutorizados = productosAutorizados
    .filter((item) => parseFloat(item.montoAutorizado) > 0) // Excluir registros con montoAutorizado = 0
    .map((item) => {
      const productosFlattened = item.productos.flat(); // Aplana los productos
      return {
        clienteNombre: item.clienteNombre,
        productos: productosFlattened.map((producto) => ({
          idProducto: producto.idProducto,
          descripcion: producto.descripcion,
          cantidad: producto.cantidad,
          precio: producto.precio,
        })),
        montoAutorizado: item.montoAutorizado,
      };
    });
  

    const generarReportePDFAutorizados = async () => {
        const doc = new jsPDF();
        
        // Logo del negocio (se requiere un archivo base64 o una imagen cargada)
        const logoBase64 = await loadImageToBase64(`${logo}`);
        doc.addImage(logoBase64, "PNG", 15, 12, 25, 25); // Ajusta posición y tamaño (x, y, width, height)
        
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
      
        // Información del negocio alineada a la derecha
        const pageWidth = doc.internal.pageSize.getWidth();
        const marginRight = 10;
      
        // Nombre del negocio (en negritas)
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        const nombreNegocio = "FSP GLOBAL TOOLS";
        const nombreNegocioWidth = doc.getTextWidth(nombreNegocio);
        doc.text(nombreNegocio, pageWidth - nombreNegocioWidth - marginRight, 15);
      
        // Resto de la información (en fuente normal)
        doc.setFont("helvetica", "normal");
        const infoNegocio = [
          "Calle egipto 610, CP:25230, Saltillo Coahuila",
          "Teléfono: +52 123 456 7890",
          "Email: contacto@globalcar.mx",
        ];
      
        infoNegocio.forEach((linea, index) => {
          const textWidth = doc.getTextWidth(linea);
          doc.text(linea, pageWidth - textWidth - marginRight, 22 + index * 7); // Ajustar 'y' con un offset
        });
      
        // Línea divisoria
        doc.line(10, 45, 200, 45); // Línea de separación (x1, y1, x2, y2)
      
        // Título principal
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Reporte de Productos Autorizados", 10, 55);
      
        // Contenido del reporte
        let yPosition = 65; // Inicia la posición Y un poco más abajo para evitar que se empalme
        reporteSimplificadoAutorizados.forEach((cliente, index) => {
          const montoAutorizado = formatoMoneda(cliente.montoAutorizado);
          
          // Título por cliente
          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          doc.text(`Cliente: ${cliente.clienteNombre}`, 14, yPosition);
          
          yPosition += 10; // Espacio adicional después del nombre del cliente
      
          // Tabla para los productos
          const productos = cliente.productos.map((producto) => [
            producto.descripcion,
            producto.cantidad,
            producto.precio,
          ]);
      
          doc.autoTable({
            startY: yPosition,
            head: [["Producto", "Cantidad", "Precio"]],
            body: productos,
          });
      
          yPosition = doc.lastAutoTable.finalY + 10; // Ajustar la posición Y después de la tabla
      
          // Monto autorizado
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          doc.text(`Monto Autorizado: ${montoAutorizado}`, 14, yPosition);
          yPosition += 20; // Espacio adicional después del monto autorizado
      
          // Número de página en todas las páginas
          const totalPages = doc.internal.pages.length;
          const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
      
          // Aseguramos que el número de página esté en todas las páginas
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.text(
            `Página ${currentPage} de ${totalPages}`,
            pageWidth - 30,
            doc.internal.pageSize.height - 10
          );
        });
      
        // Calcular el total de todos los montos autorizados
        let totalMontoAutorizado = 0;
        productosAutorizados.forEach(cliente => {
          totalMontoAutorizado += parseFloat(cliente.montoAutorizado);
        });
      
        // Formatear el monto total como dinero
        const totalMontoFormateado = new Intl.NumberFormat('es-MX', {
          style: 'currency',
          currency: 'MXN',
        }).format(totalMontoAutorizado);
      
        // Mostrar el total de los montos autorizados en formato de dinero
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`Total de Monto Autorizado: ${totalMontoFormateado}`, 10, yPosition);
      
        // Descargar el PDF
        doc.save("reporte_productos_autorizados.pdf");
      };

    const generarReporteDenegadosPDF = async () => {
        const doc = new jsPDF();
        
        // Logo del negocio (se requiere un archivo base64 o una imagen cargada)
        const logoBase64 = await loadImageToBase64(`${logo}`);
        doc.addImage(logoBase64, "PNG", 15, 12, 25, 25); // Ajusta posición y tamaño (x, y, width, height)
    
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
    
        // Información del negocio alineada a la derecha
        const pageWidth = doc.internal.pageSize.getWidth();
        const marginRight = 10;
    
        // Nombre del negocio (en negritas)
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        const nombreNegocio = "FSP GLOBAL TOOLS";
        const nombreNegocioWidth = doc.getTextWidth(nombreNegocio);
        doc.text(nombreNegocio, pageWidth - nombreNegocioWidth - marginRight, 15);
    
        // Resto de la información (en fuente normal)
        doc.setFont("helvetica", "normal");
        const infoNegocio = [
            "Calle egipto 610, CP:25230, Saltillo Coahuila",
            "Teléfono: +52 123 456 7890",
            "Email: contacto@globalcar.mx",
        ];
    
        infoNegocio.forEach((linea, index) => {
            const textWidth = doc.getTextWidth(linea);
            doc.text(linea, pageWidth - textWidth - marginRight, 22 + index * 7); // Ajustar 'y' con un offset
        });
    
        // Línea divisoria
        doc.line(10, 45, 200, 45); // Línea de separación (x1, y1, x2, y2)
    
        // Título principal
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Reporte de Productos Denegados", 10, 55);
    
        // Filtrar y mapear los productos denegados (solo aquellos con productos denegados no vacíos)
        const reporteSimplificado = productosDenegados
            .filter((item) => item.productosDenegados && item.productosDenegados.length > 0) // Filtrar solo aquellos con productos denegados no vacíos
            .map((item) => {
                // Aplanar los productos denegados
                const productosDenegadosFlattened = item.productosDenegados.flat();
    
                // Calcular el monto denegado total por cliente
                const montoDenegado = productosDenegadosFlattened.reduce((total, producto) => {
                    // Convertir precio a número
                    const precioNumerico = parseFloat(producto.precio.replace(',', '.'));
                    return total + (producto.cantidad * precioNumerico); // Sumar cantidad * precio de cada producto
                }, 0);
                
                return {
                    clienteNombre: item.clienteNombre,
                    productosDenegados: productosDenegadosFlattened.map((producto) => ({
                        idProducto: producto.idProducto,
                        descripcion: producto.descripcion,
                        cantidad: producto.cantidad,
                        precio: producto.precio,
                    })),
                    montoDenegado, // Agregar el monto total denegado
                };
            });
    
        // Si no hay productos denegados, salimos de la función sin generar el PDF
        if (reporteSimplificado.length === 0) {
            doc.text("No hay productos denegados para mostrar.", 10, 70);
            doc.save("reporte_productos_denegados.pdf");
            return;
        }
    
        // Contenido del reporte
        let yPosition = 65;
        reporteSimplificado.forEach((cliente, index) => {
            const montoDenegado = formatoMoneda(cliente.montoDenegado);
    
            // Título por cliente
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text(`Cliente: ${cliente.clienteNombre}`, 14, yPosition);
    
            // Tabla para los productos denegados
            const productosDenegados = cliente.productosDenegados.map((producto) => [
                producto.descripcion,
                producto.cantidad,
                producto.precio,
            ]);
    
            doc.autoTable({
                startY: yPosition + 7,
                head: [["Producto", "Cantidad", "Precio"]],
                body: productosDenegados,
            });
    
            // Monto denegado
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(
                `Monto Denegado: ${montoDenegado}`,
                14,
                doc.lastAutoTable.finalY + 10
            );
    
            // Actualizar la posición Y para el siguiente cliente
            yPosition = doc.lastAutoTable.finalY + 20;
        });
    
        // Calcular el total de todos los montos denegados
        let totalMontoDenegado = 0;
        reporteSimplificado.forEach(cliente => {
            totalMontoDenegado += parseFloat(cliente.montoDenegado);
        });
    
        // Formatear el monto total como dinero
        const totalMontoFormateado = new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(totalMontoDenegado);
    
        // Mostrar el total de los montos denegados en formato de dinero
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`Total de Monto Denegado: ${totalMontoFormateado}`, 10, doc.internal.pageSize.height - 30);
    
        // Agregar el número de página al final de la página
        const totalPages = doc.internal.pages.length;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(
            `Página ${doc.internal.getCurrentPageInfo().pageNumber} de ${totalPages}`,
            pageWidth - 30,
            doc.internal.pageSize.height - 10
        );
    
        // Descargar el PDF
        doc.save("reporte_productos_denegados.pdf");
    };
        
    const generarReporteSolicitadosPDF = async () => {
        const doc = new jsPDF();
        
        // Logo del negocio (requiere un archivo base64 o imagen cargada)
        const logoBase64 = await loadImageToBase64(`${logo}`);  // Cambia 'logo' con la ruta de tu logo
        doc.addImage(logoBase64, "PNG", 15, 12, 25, 25); // Ajusta posición y tamaño (x, y, width, height)
    
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
    
        // Información del negocio alineada a la derecha
        const pageWidth = doc.internal.pageSize.getWidth();
        const marginRight = 10;
    
        // Nombre del negocio (en negritas)
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        const nombreNegocio = "FSP GLOBAL TOOLS";
        const nombreNegocioWidth = doc.getTextWidth(nombreNegocio);
        doc.text(nombreNegocio, pageWidth - nombreNegocioWidth - marginRight, 15);
    
        // Resto de la información (en fuente normal)
        doc.setFont("helvetica", "normal");
        const infoNegocio = [
            "Calle egipto 610, CP:25230, Saltillo Coahuila",
            "Teléfono: +52 123 456 7890",
            "Email: contacto@globalcar.mx",
        ];
    
        infoNegocio.forEach((linea, index) => {
            const textWidth = doc.getTextWidth(linea);
            doc.text(linea, pageWidth - textWidth - marginRight, 22 + index * 7); // Ajustar 'y' con un offset
        });
    
        // Línea divisoria
        doc.line(10, 45, 200, 45); // Línea de separación (x1, y1, x2, y2)
    
        // Título principal
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Reporte de Productos Solicitados", 10, 55);
    
        // Filtrar y mapear los productos solicitados
        const reporteSimplificado = allProducts
            .filter((item) => item.productos && item.productos.length > 0) // Filtrar solo aquellos con productos
            .map((item) => {
                // Aplanar los productos solicitados
                const productosSolicitadosFlattened = item.productos.flat();
    
                // Calcular el monto total solicitado por cliente
                const montoTotal = productosSolicitadosFlattened.reduce((total, producto) => {
                    // Convertir precio a número
                    const precioNumerico = parseFloat(producto.precio.replace(',', '.'));
                    return total + (producto.cantidad * precioNumerico); // Sumar cantidad * precio de cada producto
                }, 0);
    
                return {
                    clienteNombre: item.cliente_nombre,
                    productosSolicitados: productosSolicitadosFlattened.map((producto) => ({
                        descripcion: producto.descripcion,
                        cantidad: producto.cantidad,
                        precio: producto.precio,
                    })),
                    montoTotal, // Agregar el monto total solicitado
                };
            });
    
        // Si no hay productos solicitados, salimos de la función sin generar el PDF
        if (reporteSimplificado.length === 0) {
            doc.text("No hay productos solicitados para mostrar.", 10, 70);
            doc.save("reporte_productos_solicitados.pdf");
            return;
        }
    
        // Contenido del reporte
        let yPosition = 65;
        reporteSimplificado.forEach((cliente, index) => {
            const montoTotal = formatoMoneda(cliente.montoTotal);
    
            // Título por cliente
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text(`Cliente: ${cliente.clienteNombre}`, 14, yPosition);
    
            // Tabla para los productos solicitados
            const productosSolicitados = cliente.productosSolicitados.map((producto) => [
                producto.descripcion,
                producto.cantidad,
                producto.precio,
            ]);
    
            doc.autoTable({
                startY: yPosition + 7,
                head: [["Producto", "Cantidad", "Precio"]],
                body: productosSolicitados,
            });
    
            // Monto total solicitado
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(
                `Monto Total: ${montoTotal}`,
                14,
                doc.lastAutoTable.finalY + 10
            );
    
            // Actualizar la posición Y para el siguiente cliente
            yPosition = doc.lastAutoTable.finalY + 20;
        });
    
        // Calcular el total de todos los montos solicitados
        let totalMontoSolicitado = 0;
        reporteSimplificado.forEach(cliente => {
            totalMontoSolicitado += parseFloat(cliente.montoTotal);
        });
    
        // Formatear el monto total como dinero
        const totalMontoFormateado = new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(totalMontoSolicitado);
    
        // Mostrar el total de los montos solicitados en formato de dinero
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`Total de Monto Solicitado: ${totalMontoFormateado}`, 10, doc.internal.pageSize.height - 30);
    
        // Agregar el número de página al final de la página
        const totalPages = doc.internal.pages.length;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(
            `Página ${doc.internal.getCurrentPageInfo().pageNumber} de ${totalPages}`,
            pageWidth - 30,
            doc.internal.pageSize.height - 10
        );
    
        // Descargar el PDF
        doc.save("reporte_productos_solicitados.pdf");
    };
    
    return(
        <>
        <div className="dashboard">
            <div className="dashboard__aside">
                <DashboardAside
                    setIsLoggedIn={props.setIsLoggedIn}/>
            </div>
            <div className="dashboard__component">
                <HeaderApp
                    page="Informes"/>
                <div className="dashboard__table mt-10">
                    <section class="mb-8">
                        <h2 class="text-2xl font-semibold mb-10">
                            Reportes Disponibles
                        </h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 w-8/12 mx-auto">
                            <div class="bg-white p-4 rounded-lg shadow-md items-center flex justify-center">
                                <svg class="aside__icon w-16 h-16" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fill-rule="evenodd" d="M9 7V2.221a2 2 0 0 0-.5.365L4.586 6.5a2 2 0 0 0-.365.5H9Zm2 0V2h7a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9h5a2 2 0 0 0 2-2Zm-1 9a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0v-2Zm2-5a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1Zm4 4a1 1 0 1 0-2 0v3a1 1 0 1 0 2 0v-3Z" clip-rule="evenodd"/>
                                </svg>
                                <div className="ml-6">
                                    <h3 class="text-lg font-semibold">
                                        Productos Autorizados
                                    </h3>
                                    <p class="text-gray-600 max-w-80 h-12">
                                        Reprote de todos los productos autorizados de todo el historial de ordenes.
                                    </p>
                                    <button class="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    onClick={generarReportePDFAutorizados}>
                                        Descargar PDF
                                    </button>
                                </div>
                            </div>
                            <div class="bg-white p-4 rounded-lg shadow-md flex items-center justify-center">
                                <svg class="aside__icon w-16 h-16" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fill-rule="evenodd" d="M9 7V2.221a2 2 0 0 0-.5.365L4.586 6.5a2 2 0 0 0-.365.5H9Zm2 0V2h7a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9h5a2 2 0 0 0 2-2Zm-1 9a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0v-2Zm2-5a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1Zm4 4a1 1 0 1 0-2 0v3a1 1 0 1 0 2 0v-3Z" clip-rule="evenodd"/>
                                </svg>
                                <div className="ml-6">
                                    <h3 class="text-lg font-semibold">
                                        Productos Denegados
                                    </h3>
                                    <p class="text-gray-600 max-w-80 h-12">
                                         Reprote de productos que no fueron autorizados para surtir.
                                    </p>
                                    <button class="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    onClick={generarReporteDenegadosPDF}>
                                        Descargar PDF
                                    </button>
                                </div>
                            </div>
                            <div class="bg-white p-4 rounded-lg shadow-md flex items-center justify-center">
                                <svg class="aside__icon w-16 h-16" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fill-rule="evenodd" d="M9 7V2.221a2 2 0 0 0-.5.365L4.586 6.5a2 2 0 0 0-.365.5H9Zm2 0V2h7a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9h5a2 2 0 0 0 2-2Zm-1 9a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0v-2Zm2-5a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1Zm4 4a1 1 0 1 0-2 0v3a1 1 0 1 0 2 0v-3Z" clip-rule="evenodd"/>
                                </svg>
                                <div className="ml-6">
                                    <h3 class="text-lg font-semibold">
                                        Productos Solicitados
                                    </h3>
                                    <p class="text-gray-600 max-w-80 h-12">
                                        Reporte de todos los productos Solicitados a lo largo del historial de ordenes.
                                    </p>
                                    <button class="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    onClick={generarReporteSolicitadosPDF}>
                                        Descargar PDF
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
        </>
    )
}

export default InformesPage