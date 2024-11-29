import React from "react";
import DashboardAside from "./DashboardAside";
import HeaderApp from "./HeaderApp";
import ProductsTable from "./ProductsTable";
import PopupProductCreate from "./PopupProductCreate";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useHistory } from "react-router-dom";
import api from "../utilis/api";
import axios from 'axios';


function ProductPage(props) {
    const MySwal = withReactContent(Swal);
    const [productos, setProductos] = React.useState([]);
    const [file, setFile] = React.useState(null);
    const [fileName, setFileName] = React.useState(""); // Estado para guardar el nombre del archivo
    const [isLoading, setIsLoading] = React.useState(false);
  
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB máximo
    const history = useHistory();
  
    React.useEffect(() => {
      fetchProductos();
    }, []);
  
    function fetchProductos() {
      fetch(`${api.addressEndpoints}/products`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.jwt}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            handleSessionExpired();
          } else {
            setProductos(data.products);
          }
        })
        .catch((err) => console.log(err));
    }
  
    function handleSessionExpired() {
      MySwal.fire({
        title: `Ocurrió un error, contacte con soporte`,
        confirmButtonText: "Ok",
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.clear();
          props.setIsLoggedIn(false);
          history.push("globalcar/");
        }
      });
    }
  
    const handleFileChange = (e) => {
      const selectedFile = e.target.files[0];
      if (selectedFile) {
        if (selectedFile.type !== "text/csv") {
          MySwal.fire("Error", "Por favor selecciona un archivo CSV válido.", "error");
          setFile(null);
          setFileName(""); // Limpia el nombre del archivo si hay un error
          return;
        }
        if (selectedFile.size > MAX_FILE_SIZE) {
          MySwal.fire("Error", "El archivo excede el tamaño máximo permitido de 5 MB.", "error");
          setFile(null);
          setFileName(""); // Limpia el nombre del archivo si hay un error
          return;
        }
        setFile(selectedFile);
        setFileName(selectedFile.name); // Guarda el nombre del archivo seleccionado
      }
    };

    const ImportCSV = async () => {
      const [file, setFile] = React.useState(null);
    
      const handleFileChange = (event) => {
        setFile(event.target.files[0]);
      };
    
      const handleFileUpload = async () => {
        if (!file) {
          alert('Por favor, selecciona un archivo CSV.');
          return;
        }
        const formData = new FormData();
        formData.append('file', file);
    
        try {
          const response = await axios.post('http://localhost:3000/api/products/import', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          alert(response.data.message);
        } catch (error) {
          console.error('Error al subir el archivo:', error);
          alert('Hubo un error al importar el archivo CSV.');
        }
      };
    
      return (
        <div>
          <input type="file" accept=".csv" onChange={handleFileChange} />
          <button onClick={handleFileUpload}>Importar CSV</button>
        </div>
      );
    };
  
    return (
      <>
        {isLoading && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-t-4 border-white rounded-full animate-spin"></div>
              <p className="mt-4 text-white font-semibold">Importando datos, por favor espera...</p>
            </div>
          </div>
        )}
        <div className="dashboard">
          <div className="dashboard__aside">
            <DashboardAside setIsLoggedIn={props.setIsLoggedIn} />
          </div>
          <div className="dashboard__component">
            <HeaderApp page="Productos" />
            <div className="dashboard__table mt-10">
              <div className="dashboardTable">
                <div className="dashboardTable__header">
                  <div className="">
                    <div className="dashboardTable__containerButton flex items-center gap-4">
                      <button
                        className="dashboardTable__button"
                        onClick={() => props.setPopupCreateProduct(true)}
                      >
                        <span className="dashboardTable__titleButton">Agregar Producto</span>
                      </button>
                      <div className="flex items-center gap-4">
                        {/* Input file oculto */}
                        <input
                          type="file"
                          accept=".csv"
                          id="file-input"
                          onChange={handleFileChange}
                          className="hidden"
                        />
  
                        {/* Botón estilizado que dispara el input file */}
                        <label
                          htmlFor="file-input"
                          className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition"
                        >
                          Importar archivo CSV
                        </label>
  
                        {/* Nombre del archivo seleccionado */}
                        {fileName && (
                          <span className="text-gray-700 font-medium">{fileName}</span>
                        )}
  
                        {/* Botón para subir el archivo */}
                        <button
                          onClick={ImportCSV}
                          className="bg-green-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-700 transition"
                        >
                          Subir Archivo
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="dashboardTable__orders">
                  <table className="dashboardTable__table">
                    <thead>
                      <tr>
                        <th className="p-3">Código de Barras</th>
                        <th className="p-3">Código Interno</th>
                        <th className="p-3">Descripción</th>
                        <th className="p-3">Precio</th>
                        <th className="p-3">Sub Familia</th>
                        <th className="p-3">Familia</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productos.reverse().map((producto) => (
                        <ProductsTable key={producto.codigo_barras} producto={producto} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
}
  
export default ProductPage;
