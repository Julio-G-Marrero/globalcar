import React from "react";
import DashboardAside from "./DashboardAside";
import HeaderApp from "./HeaderApp";
import api from "../utilis/api";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useHistory } from "react-router";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from "chart.js";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "../images/logo.png";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

function InformesPage(props) {
  const [productosAutorizados, setProductosAutorizados] = React.useState([]);
  const [productosDenegados, setProductosDenegados] = React.useState([]);
  const [allProducts, setAllProducts] = React.useState([]);
  const history = useHistory();

  React.useEffect(() => {
    fetchProductosAutorizados();
    fetchProductosDenegados();
    fetchAllProductos();
  }, []);

  const MySwal = withReactContent(Swal);

  const fetchProductosAutorizados = () => {
    fetch(`${api.addressEndpoints}/orders/informes-autorizados`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${props.jwt}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setProductosAutorizados(data.productosAutorizados))
      .catch((err) => console.log(err));
  };

  const fetchProductosDenegados = () => {
    fetch(`${api.addressEndpoints}/orders/informes-denegados`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${props.jwt}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setProductosDenegados(data.productosDenegados))
      .catch((err) => console.log(err));
  };

  const fetchAllProductos = () => {
    fetch(`${api.addressEndpoints}/orders/informes-todos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${props.jwt}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setAllProducts(data))
      .catch((err) => console.log(err));
  };
  console.log(allProducts)

  const totalAutorizados = productosAutorizados.length;
  const totalDenegados = productosDenegados.length;
  const totalSolicitados = allProducts.length;

  const barChartData = {
    labels: ["Autorizados", "Denegados", "Solicitados"],
    datasets: [
      {
        label: "Cantidad de Productos",
        data: [totalAutorizados, totalDenegados, totalSolicitados],
        backgroundColor: ["#4CAF50", "#F44336", "#2196F3"],
      },
    ],
  };

  const pieChartData = {
    labels: ["Autorizados", "Denegados"],
    datasets: [
      {
        label: "Proporción de Productos",
        data: [totalAutorizados, totalDenegados],
        backgroundColor: ["#4CAF50", "#F44336"],
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Proporción de Productos Autorizados y Denegados",
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Resumen de Productos",
      },
    },
  };

  const loadImageToBase64 = (imagePath) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imagePath;
      img.crossOrigin = "Anonymous";

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        resolve(canvas.toDataURL("image/png"));
      };

      img.onerror = (error) => reject("Error al cargar la imagen: " + error);
    });
  };
  const formatoMoneda = (monto) => {
    return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
    }).format(Number(monto));
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
  return (
    <>
      <div className="dashboard">
        <div className="dashboard__aside">
          <DashboardAside setIsLoggedIn={props.setIsLoggedIn} />
        </div>
        <div className="dashboard__component">
          <HeaderApp page="Informes" />
          <div className="dashboard__table mt-10">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-10">Reportes y Estadísticas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <Bar data={barChartData} options={barChartOptions} />
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <Pie data={pieChartData} options={pieChartOptions} />
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-center items-center">
                  <h3 className="text-lg font-semibold mb-4">Productos Autorizados</h3>
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={generarReporteSolicitadosPDF}
                  >
                    Descargar PDF
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

export default InformesPage;
