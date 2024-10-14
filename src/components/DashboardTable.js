import React from "react";
import DashboardElementTable from "./DashboardElementTable";
import OrderPopupEdit from "./OrderPopupEdit";
import api from "../utilis/api";
import { useHistory } from 'react-router-dom';
import LoadingPage from "./LoadingPage.js"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

function DashboardTable(props) {
    const MySwal = withReactContent(Swal)

    const history = useHistory();
    const [isLoading, setIsLoading] = React.useState(true);
    const [pageIndex, setPageIndex] = React.useState(1);
    const [orderSelected, setOrderSelected] = React.useState([])
    const [indexsOrders,setIndexsOrders] = React.useState({})
    const [numeroDePaginas,setNumeroDePaginas] = React.useState(0)
    const [statusOrderFilter,setStatusOrderFilter] = React.useState(0)
    const [fetctInfo,setFetchInfo] = React.useState(false)
    React.useEffect(() => {
        setInterval(() => {
            setFetchInfo(true);
        }, 3000);
        if(props.jwt) {
            props.fetchOrders()
            props.fetchStats()
            fetchOrdersIndexs()
        }
        else{
            console.log('Acceos no autorizado')
            history.push('/globalcar/login')
            // history.go(0)
        }
    },[fetctInfo])
    setTimeout(() => {
        const indexsPgaes = Math.ceil(parseInt(indexsOrders['totalOrders']) / 7)
        setNumeroDePaginas(indexsPgaes)
        setIsLoading(false);
      }, 3000);

    function fetchOrdersIndexs() {
        fetch(`${api.addressEndpoints}/orders/indexs`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${props.jwt}`,
          }
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            if(data.message) {
                MySwal.fire({
                    title: `Ocurrio un error, contacte con soporte`,
                    confirmButtonText: "Ok",
                  }).then((result) => {
                    if (result.isConfirmed) {
                        localStorage.removeItem('jwt');
                        props.setIsLoggedIn(false)                
                        history.push('/globalcar/login')
                        // history.go(0)
                    } 
                  });
                setIndexsOrders(0)
            }
            setIndexsOrders(data)
        })
        .catch((err) => console.log(err));
    }

    function handleOrderPopup() {
        props.setPopupCreateOrder(true)
        props.setOverlay(!props.overlay)
    }

    function handleChangePageOrders(e){
        if(e.target.id == "Prev"){
            if(numeroDePaginas !== pageIndex) {
                fetch(`${api.addressEndpoints}/orders?page=${pageIndex - 1}&id=${props.user.id}&departament=${props.rol}`, {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      'Authorization': `Bearer ${props.jwt}`,
                    }
                  })
                  .then((response) => response.json())
                  .then((data) => {
                    if(data.message) {
                        MySwal.fire({
                            title: `Ocurrio un error, contacte con soporte`,
                            confirmButtonText: "Ok",
                          }).then((result) => {
                            if (result.isConfirmed) {
                                localStorage.removeItem('jwt');
                                props.setIsLoggedIn(false)                
                                history.push('/globalcar/login')
                                // history.go(0)
                            } 
                          });
                          props.setInitalOrders([])
                          props.setNumeroDeOrdenes(0)
                    }else {
                        console.log(data)
                        props.setInitalOrders(data.data)
                        props.setNumeroDeOrdenes(data.data.length)
                    }
                  })
                  .catch((err) => console.log(err));
                  if(pageIndex == 1) {
                        setPageIndex(1)
                    }else {
                        setPageIndex(pageIndex - 1)
                    }
            }

        }else if(e.target.id == "next"){ 
            if(numeroDePaginas !== pageIndex) {
                fetch(`${api.addressEndpoints}/orders?page=${pageIndex + 1}&id=${props.user.id}&departament=${props.rol}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${props.jwt}`,
                    }
                    })
                    .then((response) => response.json())
                    .then((data) => {
                        if(data.message) {
                            MySwal.fire({
                                title: `Ocurrio un error, contacte con soporte`,
                                confirmButtonText: "Ok",
                              }).then((result) => {
                                if (result.isConfirmed) {
                                    localStorage.removeItem('jwt');
                                    props.setIsLoggedIn(false)                
                                    history.push('/globalcar/login')
                                    // history.go(0)
                                } 
                              });
                              props.setInitalOrders([])
                              props.setNumeroDeOrdenes(0)
                        }else {
                            console.log(data)
                            props.setInitalOrders(data.data)
                            props.setNumeroDeOrdenes(data.data.length)
                        }
                    })
                    .catch((err) => console.log(err));
                    setPageIndex(pageIndex + 1)
    
                }
            }
    }
    function hanldeFetchOrderByStatus(e) {
        if(e.target.value == "pteRevison") {
            setStatusOrderFilter(1)
            fetch(`${api.addressEndpoints}/orders/idstatus?statusid=${1}&id=${props.user.id}&departament=${props.rol}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  'Authorization': `Bearer ${props.jwt}`,
                }
              })
              .then((response) => response.json())
              .then((data) => {
                if(data.message) {
                    MySwal.fire({
                        title: `Ocurrio un error, contacte con soporte`,
                        confirmButtonText: "Ok",
                      }).then((result) => {
                        if (result.isConfirmed) {
                            localStorage.removeItem('jwt');
                            props.setIsLoggedIn(false)                
                            history.push('/globalcar/login')
                            // history.go(0)
                        } 
                      });
                      props.setInitalOrders([])
                      props.setNumeroDeOrdenes(0)
                }else {
                    console.log(data)
                    props.setInitalOrders(data.data)
                    props.setNumeroDeOrdenes(data.data.length)
                }
              })
              .catch((err) => console.log(err));
        }else if(e.target.value == "pteSurtir") {
            setStatusOrderFilter(2)
            fetch(`${api.addressEndpoints}/orders/idstatus?statusid=${2}&id=${props.user.id}&departament=${props.rol}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  'Authorization': `Bearer ${props.jwt}`,
                }
              })
              .then((response) => response.json())
              .then((data) => {
                if(data.message) {
                    MySwal.fire({
                        title: `Ocurrio un error, contacte con soporte`,
                        confirmButtonText: "Ok",
                      }).then((result) => {
                        if (result.isConfirmed) {
                            localStorage.removeItem('jwt');
                            props.setIsLoggedIn(false)                
                            history.push('/globalcar/login')
                            // history.go(0)
                        } 
                      });
                      props.setInitalOrders([])
                      props.setNumeroDeOrdenes(0)
                }else {
                    console.log(data)
                    props.setInitalOrders(data.data)
                    props.setNumeroDeOrdenes(data.data.length)
                }
              })
              .catch((err) => console.log(err));
        }else if(e.target.value == "surtida") {
            setStatusOrderFilter(3)
            fetch(`${api.addressEndpoints}/orders/idstatus?statusid=${3}&id=${props.user.id}&departament=${props.rol}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  'Authorization': `Bearer ${props.jwt}`,
                }
              })
              .then((response) => response.json())
              .then((data) => {
                if(data.message) {
                    MySwal.fire({
                        title: `Ocurrio un error, contacte con soporte`,
                        confirmButtonText: "Ok",
                      }).then((result) => {
                        if (result.isConfirmed) {
                            localStorage.removeItem('jwt');
                            props.setIsLoggedIn(false)                
                            history.push('/globalcar/login')
                            // history.go(0)
                        } 
                      });
                      props.setInitalOrders([])
                      props.setNumeroDeOrdenes(0)
                }else {
                    console.log(data)
                    props.setInitalOrders(data.data)
                    props.setNumeroDeOrdenes(data.data.length)
                }
              })
              .catch((err) => console.log(err));
        }else if(e.target.value == "denegada") {
            setStatusOrderFilter(4)
            fetch(`${api.addressEndpoints}/orders/idstatus?statusid=${4}&id=${props.user.id}&departament=${props.rol}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  'Authorization': `Bearer ${props.jwt}`,
                }
              })
              .then((response) => response.json())
              .then((data) => {
                if(data.message) {
                    MySwal.fire({
                        title: `Ocurrio un error, contacte con soporte`,
                        confirmButtonText: "Ok",
                      }).then((result) => {
                        if (result.isConfirmed) {
                            localStorage.removeItem('jwt');
                            props.setIsLoggedIn(false)                
                            history.push('/globalcar/login')
                            // history.go(0)
                        } 
                      });
                      props.setInitalOrders([])
                      props.setNumeroDeOrdenes(0)
                }else {
                    console.log(data)
                    props.setInitalOrders(data.data)
                    props.setNumeroDeOrdenes(data.data.length)
                }
              })
              .catch((err) => console.log(err));
        }else if(e.target.value == "reiniciar") {
            props.fetchOrders()
            setStatusOrderFilter(0)
            
            var ele = document.getElementsByName("statusOrder");
            var inputSearch = document.getElementById("inputSearch");
            console.log(inputSearch.value)
            inputSearch.value = ""
            for(var i=0;i<ele.length;i++)
                ele[i].checked = false;
            }
    }
    function handleChangeSearchInput(e) {
        if(statusOrderFilter != 0) {
            fetch(`${api.addressEndpoints}/orders/search-status-value?value=${e.target.value}&status=${statusOrderFilter}&page=${pageIndex + 1}&id=${props.user.id}&departament=${props.rol}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  'Authorization': `Bearer ${props.jwt}`,
                }
              })
              .then((response) => response.json())
              .then((data) => {
                if(data.message) {
                    MySwal.fire({
                        title: `Ocurrio un error, contacte con soporte`,
                        confirmButtonText: "Ok",
                      }).then((result) => {
                        if (result.isConfirmed) {
                            localStorage.removeItem('jwt');
                            props.setIsLoggedIn(false)                
                            history.push('/globalcar/login')
                            // history.go(0)
                        } 
                      });
                      props.setInitalOrders([])
                      props.setNumeroDeOrdenes(0)
                }else {
                    console.log(data)
                    props.setInitalOrders(data.data)
                    props.setNumeroDeOrdenes(data.data.length)
                }
              })
              .catch((err) => console.log(err));
        }else {
            console.log('fetch')
            fetch(`${api.addressEndpoints}/orders/search/all?value=${e.target.value}&page=${pageIndex + 1}&id=${props.user.id}&departament=${props.rol}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  'Authorization': `Bearer ${props.jwt}`,
                }
              })
              .then((response) => response.json())
              .then((data) => {
                if(data.message) {
                    MySwal.fire({
                        title: `Ocurrio un error, contacte con soporte`,
                        confirmButtonText: "Ok",
                      }).then((result) => {
                        if (result.isConfirmed) {
                            localStorage.removeItem('jwt');
                            props.setIsLoggedIn(false)                
                            history.push('/globalcar/login')
                            // history.go(0)
                        } 
                      });
                      props.setInitalOrders([])
                      props.setNumeroDeOrdenes(0)
                }else {
                    props.setInitalOrders(data.data)
                    props.setNumeroDeOrdenes(data.data.length)
                }
              })
              .catch((err) => console.log(err));
        }
    }
    if (isLoading) {
        return <LoadingPage />;
    }else {
        return(
            <>
            <div className= "w-11/12 mx-auto">
                <div class="w-full flex justify-between items-center mb-3 mt-1 pl-3">
                    <div>
                        <div class="m-3">
                            <button class="bg-white text-gray-800 font-semibold rounded border-b-2 hover:border-green-600 hover:bg-green-500 hover:text-white shadow-md py-2 px-6 inline-flex items-center bg-gradient-to-tr "
                            onClick={handleOrderPopup}>
                                <span class="mr-2">Crear</span>
                                <svg class="w-6 h-6  dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fill-rule="evenodd" d="M9 7V2.221a2 2 0 0 0-.5.365L4.586 6.5a2 2 0 0 0-.365.5H9Zm2 0V2h7a2 2 0 0 1 2 2v6.41A7.5 7.5 0 1 0 10.5 22H6a2 2 0 0 1-2-2V9h5a2 2 0 0 0 2-2Z" clip-rule="evenodd"/>
                                <path fill-rule="evenodd" d="M9 16a6 6 0 1 1 12 0 6 6 0 0 1-12 0Zm6-3a1 1 0 0 1 1 1v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 1 1 0-2h1v-1a1 1 0 0 1 1-1Z" clip-rule="evenodd"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="ml-3 w-4/12 ">
                        <div class="w-full flex justify-center items-center gap-2 relative">
                            <div class="grid w-60  gap-2 rounded-xl p-2">
                                <div className="flex gap-8 justify-end">
                                    <div className="relative">
                                        <details className="group [&_summary::-webkit-details-marker]:hidden">
                                        <summary
                                            className="flex cursor-pointer items-center gap-2 border-b border-gray-400 pb-1 text-gray-900 transition hover:border-gray-600"
                                        >
                                            <span className="text-sm font-medium"> Estados </span>
                                            <span className="transition group-open:-rotate-180">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="currentColor"
                                                className="size-4"
                                            >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                            </svg>
                                            </span>
                                        </summary>
                                        <div className="z-50 group-open:absolute group-open:right-0  group-open:top-auto group-open:mt-2">
                                            <div className="w-56 rounded border border-gray-200 bg-white">
                                                <header className="flex items-center justify-between p-4">
                                                    <span className="text-sm text-gray-700">Opciones </span>
                                                    <button type="button" className="text-sm text-gray-900 underline underline-offset-4"
                                                    value="reiniciar"
                                                    onClick={hanldeFetchOrderByStatus}>
                                                    Limpiar
                                                    </button>
                                                </header>
                                                <ul className="space-y-1 border-t border-gray-200 p-4 text-justify">
                                                    <li>
                                                        <label className="inline-flex items-center gap-2"
                                                        >
                                                            <input type="radio" value="pteRevison" name="statusOrder" className="size-5 rounded border-gray-300"
                                                            onClick={hanldeFetchOrderByStatus}
                                                            />
                                                            <span className="text-sm font-medium text-gray-700">Pendiente Revision</span>
                                                        </label>
                                                    </li>
                                                    <li>
                                                        <label className="inline-flex items-center gap-2">
                                                            <input type="radio" value="pteSurtir"  name="statusOrder" className="size-5 rounded border-gray-300"
                                                            onClick={hanldeFetchOrderByStatus}
                                                            />
                                                            <span className="text-sm font-medium text-gray-700">Pendiente Surtir </span>
                                                        </label>
                                                    </li>
                                                    <li>
                                                        <label className="inline-flex items-center gap-2">
                                                            <input
                                                            type="radio"
                                                            name="statusOrder"
                                                            value="surtida" 
                                                            className="size-5 rounded border-gray-300"
                                                            onClick={hanldeFetchOrderByStatus}
                                                            />
                                                            <span className="text-sm font-medium text-gray-700">Surtida </span>
                                                        </label>
                                                    </li>
                                                    <li>
                                                        <label className="inline-flex items-center gap-2">
                                                            <input
                                                            type="radio"
                                                            name="statusOrder"
                                                            value="denegada" 
                                                            className="size-5 rounded border-gray-300"
                                                            onClick={hanldeFetchOrderByStatus}
                                                            />
                                                            <span className="text-sm font-medium text-gray-700">Denegada </span>
                                                        </label>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        </details>
                                    </div>
                                </div>
                            </div>

                            <div class="relative">
                                <input
                                class="bg-white w-full pr-11 h-10 pl-3 py-2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded transition duration-200 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                                placeholder="Busqueda General..."
                                id="inputSearch"
                                onChange={handleChangeSearchInput}
                                />
                                <button
                                class="absolute h-8 w-8 right-1 top-1 my-auto px-2 flex items-center bg-white rounded "
                                type="button"
                                >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-8 h-8 text-slate-600">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
                <table class="w-full text-left table-auto min-w-max">
                    <thead>
                    <tr>
                        <th class="p-4 border-b border-slate-200 bg-slate-50">
                            <p class="text-sm font-normal leading-none text-slate-500">
                                Nombre Cliente
                            </p>
                        </th>
                        <th class="p-4 border-b border-slate-200 bg-slate-50">
                            <p class="text-sm font-normal leading-none text-slate-500">
                                Correo Cliente
                            </p>
                        </th>
                        <th class="p-4 border-b border-slate-200 bg-slate-50">
                            <p class="text-sm font-normal leading-none text-slate-500">
                                Fecha Apertura
                            </p>
                        </th>
                        <th class="p-4 border-b border-slate-200 bg-slate-50">
                            <p class="text-sm font-normal text-center leading-none text-slate-500">
                                Qty Productos
                            </p>
                        </th>
                        <th class="p-4 border-b border-slate-200 bg-slate-50">
                            <p class="text-sm font-normal leading-none text-slate-500">
                                Monto Total
                            </p>
                        </th>
                        <th class="p-4 border-b border-slate-200 bg-slate-50">
                            <p class="text-sm font-normal leading-none text-slate-500">
                                Status
                            </p>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {[...props.initalOrders].map(order => {     
                        return <DashboardElementTable 
                        setOrderSelected={setOrderSelected} order={order} orderSelected={orderSelected}
                        setPopupEditOrder={props.setPopupEditOrder} popupEditOrder={props.popupEditOrder}
                        setOverlay={props.setOverlay} overlay={props.overlay}
                        orderStatus={props.orderStatus}
                        />
                    })}
                    </tbody>
                </table>
                
                <div class="flex justify-between items-center px-4 py-3">
                    <div class="text-sm text-slate-500">
                    Mostrando <b>{props.numeroDeOrdenes}</b> de {indexsOrders.totalOrders} - Pagina <b>{pageIndex}</b>/{numeroDePaginas}
                    </div>
                    <div class="flex space-x-1">
                    <button class="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease"
                    id="Prev"
                    onClick={handleChangePageOrders}>
                        Prev
                    </button>
                    <button class="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease"
                    id="next"
                    onClick={handleChangePageOrders}>
                        Next
                    </button>
                    </div>
                </div>
                </div>
                {orderSelected <= 0 ? "" :  
                <OrderPopupEdit
                rol={props.rol}
                jwt={props.jwt}
                overlayToolTip={props.overlayToolTip} setOverlayToolTip={props.setOverlayToolTip}
                setIsOpenToolTip={props.setIsOpenToolTip} setSuccessMessage={props.setSuccessMessage} setConentMessage={props.setConentMessage}
                orderStatus={props.orderStatus}
                closeAllPopups={props.closeAllPopups} popupEditOrder={props.popupEditOrder} 
                orderSelected={orderSelected}/>}
               
            </div>
            </>
        )
    }
}

export default DashboardTable;