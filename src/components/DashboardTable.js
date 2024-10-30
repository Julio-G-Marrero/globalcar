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
            history.push('globalcar/')
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
                        localStorage.removeItem('user-id');
                            localStorage.removeItem('user-email');
                            localStorage.removeItem('user-nombre');
                            localStorage.removeItem('user-departament');
                        props.setIsLoggedIn(false)                
                        history.push('globalcar/')
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
                                localStorage.removeItem('user-id');
                            localStorage.removeItem('user-email');
                            localStorage.removeItem('user-nombre');
                            localStorage.removeItem('user-departament');
                                props.setIsLoggedIn(false)                
                                history.push('globalcar/')
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
                                    localStorage.removeItem('user-id');
                            localStorage.removeItem('user-email');
                            localStorage.removeItem('user-nombre');
                            localStorage.removeItem('user-departament');
                                    props.setIsLoggedIn(false)                
                                    history.push('globalcar/')
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
                            localStorage.removeItem('user-id');
                            localStorage.removeItem('user-email');
                            localStorage.removeItem('user-nombre');
                            localStorage.removeItem('user-departament');
                            props.setIsLoggedIn(false)                
                            history.push('globalcar/')
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
                            localStorage.removeItem('user-id');
                            localStorage.removeItem('user-email');
                            localStorage.removeItem('user-nombre');
                            localStorage.removeItem('user-departament');
                            props.setIsLoggedIn(false)                
                            history.push('globalcar/')
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
                            localStorage.removeItem('user-id');
                            localStorage.removeItem('user-email');
                            localStorage.removeItem('user-nombre');
                            localStorage.removeItem('user-departament');
                            props.setIsLoggedIn(false)                
                            history.push('globalcar/')
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
                            localStorage.removeItem('user-id');
                            localStorage.removeItem('user-email');
                            localStorage.removeItem('user-nombre');
                            localStorage.removeItem('user-departament');
                            props.setIsLoggedIn(false)                
                            history.push('globalcar/')
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
                            localStorage.removeItem('user-id');
                            localStorage.removeItem('user-email');
                            localStorage.removeItem('user-nombre');
                            localStorage.removeItem('user-departament');
                            props.setIsLoggedIn(false)                
                            history.push('globalcar/')
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
                            localStorage.removeItem('user-id');
                            localStorage.removeItem('user-email');
                            localStorage.removeItem('user-nombre');
                            localStorage.removeItem('user-departament');
                            props.setIsLoggedIn(false)                
                            history.push('globalcar/')
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
            <div className= "dashboardTable">
                <div class="dashboardTable__header">
                    <div>
                        <div class="dashboardTable__containerButton">
                            <button class="dashboardTable__button"
                            onClick={handleOrderPopup}>
                                <span class="dashboardTable__titleButton">Crear</span>
                                <svg class="dashboardTable__svg" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fill-rule="evenodd" d="M9 7V2.221a2 2 0 0 0-.5.365L4.586 6.5a2 2 0 0 0-.365.5H9Zm2 0V2h7a2 2 0 0 1 2 2v6.41A7.5 7.5 0 1 0 10.5 22H6a2 2 0 0 1-2-2V9h5a2 2 0 0 0 2-2Z" clip-rule="evenodd"/>
                                <path fill-rule="evenodd" d="M9 16a6 6 0 1 1 12 0 6 6 0 0 1-12 0Zm6-3a1 1 0 0 1 1 1v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 1 1 0-2h1v-1a1 1 0 0 1 1-1Z" clip-rule="evenodd"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="dashboardTable__search">
                        <div class="dashboardTable__searchFlex">
                            
                            <div class="dashboardTable__states">
                                <div className="dashboardTable__states--info">
                                    <div className="relative">
                                        <details class="dropdown">
                                            <summary className="dashboardTable__summary">
                                                <p>Estados</p>
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
                                            <ul className="dashboardTable__list">
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
                                        </details>
                                    </div>
                                </div>
                            </div>

                            <div class="relative">
                                <input
                                class="dashboardTable__input"
                                placeholder="Busqueda General..."
                                id="inputSearch"
                                onChange={handleChangeSearchInput}
                                />
                                <button
                                class="dashboardTable__button--stats"
                                type="button"
                                >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="dashboardTable__icon">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                                </button>
                            </div>
                            <button
                                class="dashboardTable__button--statsxl"
                                type="button"
                                value="reiniciar"
                                onClick={hanldeFetchOrderByStatus}>
                                ↻
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="dashboardTable__orders">
                <table class="dashboardTable__table">
                    <thead>
                    <tr>
                        <th class="dashboardTable__tr">
                            <p class="dashboardTable__text">
                                Nombre Cliente
                            </p>
                        </th>
                        <th class="dashboardTable__tr">
                            <p class="dashboardTable__text">
                                Correo Cliente
                            </p>
                        </th>
                        <th class="dashboardTable__tr">
                            <p class="dashboardTable__text">
                                Fecha Apertura
                            </p>
                        </th>
                        <th class="dashboardTable__tr">
                            <p class="dashboardTable__text-qty">
                                Qty Productos
                            </p>
                        </th>
                        <th class="dashboardTable__tr">
                            <p class="dashboardTable__text">
                                Monto Total
                            </p>
                        </th>
                        <th class="dashboardTable__tr">
                            <p class="dashboardTable__text">
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
                
                <div class="dashboardTable__paginator">
                    <div class="dashboardTable__paginator--div">
                    Mostrando <b>{props.numeroDeOrdenes}</b> de {indexsOrders.totalOrders} - Pagina <b>{pageIndex}</b>/{numeroDePaginas}
                    </div>
                    <div class="dashboardTable__buttonsPaginator">
                        <button class="dashboardTable__buttonPaginator"
                        id="Prev"
                        onClick={handleChangePageOrders}>
                            Prev
                        </button>
                        <button class="dashboardTable__buttonPaginator"
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