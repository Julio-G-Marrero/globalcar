import React from "react";
import DashboardAside from "./DashboardAside";
import HeaderApp from "./HeaderApp";
import logoIngco from "../images/ingco-logo.png";
import globalcarlogo from "../images/globalcarlogo.png";
import pinza from "../images/pinza.png";
import api from "../utilis/api";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function AlmacenPage(props) {
    const [isLoading, setIsLoading] = React.useState(false)
    const MySwal = withReactContent(Swal);
    
    function handleSincronizarInventarioIngco() {
        setIsLoading(true)
        // fetchSincronizarInvIngco()
    }
    function fetchSincronizarInvIngco() {
        fetch(`${api.addressEndpoints}/shopify/updateInventary`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${props.jwt}`,
            }
          })
          .then((response) => response.json())
          .then((data) => {
             if(data.status === "success"){
                MySwal.fire('Sincronizacion Exitosa', `Productos Sincronizados en abambas paginas: ${data.total_products_processed}`, 'success');
             }else {
                MySwal.fire("Error", "Consulte con soporte.", "error");
             }
             setIsLoading(false)
          })
          .catch((err) => console.log(err));
    }
    return(
        <>
        {isLoading && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-t-4 border-white rounded-full animate-spin"></div>
              <p className="mt-4 text-white font-semibold">Sincronizando Inventarios, consultado sistema y pagina, por favor espera...</p>
            </div>
          </div>
        )}
        <div className="">
            <div className="dashboard__component">
                <div className="dashboard__table mt-10">
                <div class="bg-white shadow-md rounded-lg p-6 w-10/12 mx-auto">
                    <h1 class="text-2xl font-bold mb-4">
                        Gestión de inventario
                    </h1>
                    <div className="flex justify-center gap-6">
                        <img src={logoIngco} className="w-28"/>
                        <img src={globalcarlogo} className="w-28"/>
                    </div>
                    <div class="flex items-center justify-between mb-4 max-lg:mt-6">
                        <div class="flex items-center">
                            <img alt="Placeholder image of a warehouse icon" class="w-20 h-auto mr-4 max-lg:hidden " height="50" src={pinza} width="50"/>
                            <div>
                                <h2 class="text-xl font-semibold max-lg:text-md max-lg:text-left ">
                                    Sincronizar Inventario Niux
                                </h2>
                                <p class="text-gray-600 text-left">
                                    Tienda Ingco.Lat y Globalcar.mx
                                </p>
                            </div>
                        </div>
                        <button class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex"
                        onClick={handleSincronizarInventarioIngco}
                        disabled={true}>
                            <i class="fas fa-sync-alt mr-2">
                                <svg class="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"/>
                                </svg>
                            </i>
                            Syncronizar Inventario
                        </button>
                    </div>
                
                </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default AlmacenPage