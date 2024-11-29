import React from "react";
import DashboardAside from "./DashboardAside";
import HeaderApp from "./HeaderApp";
import PopupClientCreate from "./PopupClientCreate";
import api from "../utilis/api";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useHistory } from "react-router";

function ClientPage(props) {
  const [clientes, setClientes] = React.useState([]);
  const [file, setFile] = React.useState(null); // Estado para el archivo CSV
  const [fileName, setFileName] = React.useState(""); // Estado para el nombre del archivo
  const [isLoading, setIsLoading] = React.useState(false); // Estado para el indicador de carga
  const history = useHistory();

  const MySwal = withReactContent(Swal);

  React.useEffect(() => {
    fetchClients();
  }, []);

  function fetchClients() {
    setIsLoading(true);
    fetch(`${api.addressEndpoints}/clients`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${props.jwt}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          MySwal.fire({
            title: `Ocurrió un error, contacte con soporte`,
            confirmButtonText: "Ok",
          }).then((result) => {
            if (result.isConfirmed) {
              localStorage.clear();
              props.setIsLoggedIn(false);
              history.push("globalcar/");
              history.go(0);
            }
          });
        } else {
          setClientes(data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      MySwal.fire("Error", "Por favor selecciona un archivo primero.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("csv", file);

    setIsLoading(true);
    try {
      const response = await fetch(`${api.addressEndpoints}/clients/import`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${props.jwt}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        MySwal.fire(
          "Éxito",
          `Se importaron ${data.importedCount} clientes correctamente.`,
          "success"
        );
        fetchClients();
        setFileName(""); // Limpiar el nombre del archivo
      } else {
        const errorText = await response.text();
        MySwal.fire("Error", `Error al subir el archivo: ${errorText}`, "error");
      }
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      MySwal.fire("Error", "Ocurrió un error al subir el archivo.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  function handleOpenPopup() {
    props.setPopupCreateClient(true);
    props.setOverlay(true);
  }

  function handleSearchClients(e) {
    fetch(`${api.addressEndpoints}/clients/search/all?value=${e.target.value}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${props.jwt}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
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
        } else {
          setClientes(data.clients);
        }
      })
      .catch((err) => console.error(err));
  }

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-4 border-white rounded-full animate-spin"></div>
            <p className="mt-4 text-white font-semibold">Procesando...</p>
          </div>
        </div>
      )}
      <div className="dashboard">
        <div className="dashboard__aside">
          <DashboardAside setIsLoggedIn={props.setIsLoggedIn} />
        </div>
        <div className="dashboard__component">
          <HeaderApp page="Clientes" />
          <div className="dashboard__table mt-10">
            <div className="dashboardTable">
              <div className="dashboardTable__header">
                <div className="flex items-center gap-4">
                <button class="dashboardTable__button"
                    onClick={handleOpenPopup}
                        >
                        <span class="dashboardTable__titleButton">Agregar Cliente</span>
                        <svg class="dashboardTable__svg" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path fill-rule="evenodd" d="M9 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H7Zm8-1a1 1 0 0 1 1-1h1v-1a1 1 0 1 1 2 0v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 0 1-1-1Z" clip-rule="evenodd"/>
                        </svg>
                    </button>

                  <label
                    htmlFor="file-input"
                    className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition"
                  >
                    Importar archivo CSV
                  </label>
                  <input
                    type="file"
                    id="file-input"
                    accept=".csv"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  {fileName && <span className="text-gray-700 font-medium">{fileName}</span>}
                  <button
                    onClick={handleUpload}
                    className="bg-green-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-700 transition"
                  >
                    Subir Archivo
                  </button>
                </div>
                <div className="ml-20 w-80">
                  <input
                    className="dashboardTable__input"
                    placeholder="Busqueda General..."
                    onChange={handleSearchClients}
                  />
                </div>
              </div>
              <div className="dashboardTable__orders">
                <table className="dashboardTable__table">
                  <thead>
                    <tr>
                      <th className="p-2">Nombre Cliente</th>
                      <th className="p-2">Dirección</th>
                      <th className="p-2">Teléfono</th>
                      <th className="p-2">Correo Electrónico</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientes.reverse().map((cliente) => (
                      <tr class="element"  key={cliente.email}>
                        <td class="element__content">
                            <p class="block font-semibold text-sm text-slate-800">{cliente.nombre}</p>
                        </td>
                        <td class="element__content">
                            <p class="block font-semibold text-sm text-slate-800">{cliente.direccion}</p>
                        </td>
                        <td class="element__content">
                            <p class="block font-semibold text-sm text-slate-800">{cliente.telefono}</p>
                        </td>
                        <td class="element__content">
                            <p class="block font-semibold text-sm text-slate-800">{cliente.email}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <PopupClientCreate
          isOpenPopup={props.popupCreatClient}
          overlay={props.overlay}
          closeAllPopups={props.closeAllPopups}
          jwt={props.jwt}
        />
        <div
          className={props.overlay ? "overlay" : "overlay hidden"}
          onClick={props.closeAllPopups}
        ></div>
      </div>
    </>
  );
}

export default ClientPage;
