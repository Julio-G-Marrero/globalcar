import React from "react";
import DashboardAside from "./DashboardAside";
import DashboardStats from "./DashboardStats";
import DashboardTable from "./DashboardTable";
import OrderPopupCreate from "./OrderPopupCreate";
import PopupToolTip from "./PopupToolTip";
import api from "../utilis/api";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import * as auth from "../utilis/auth";
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

function Dashboard(props) {
    const MySwal = withReactContent(Swal)

    const history = useHistory();
    const [successMessage,setSuccessMessage] = React.useState(false)
    const [conentMessage, setConentMessage] = React.useState("Cargando")
    const [initalOrders, setInitalOrders] = React.useState([])
    const [numeroDeOrdenes,setNumeroDeOrdenes] = React.useState(0)
    const [stats,setStats] = React.useState({})

    React.useEffect(() => {
        tokenCheck()
    },[])
    
    function tokenCheck() {
        if (!props.jwt) {
            history.push('globalcar/')
            // history.go(0)
        }
      }
    function fetchOrders() {
        fetch(`${api.addressEndpoints}/orders?id=${props.user.id}&departament=${props.rol}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${props.jwt}`,
            }
          })
          .then((response) => response.json())
          .then((data) => {
            console.log(data)
            console.log(props.jwt)
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
                  setInitalOrders([])
                  setNumeroDeOrdenes(0)
              }else {
                  setInitalOrders(data.data)
                  setNumeroDeOrdenes(data.data.length)
              }
          })
          .catch((err) => console.log(err));
    }
    
    function fetchStats() {
        fetch(`${api.addressEndpoints}/orders/stats`, {
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
            }else {
                let dataStats = data.data
                let montoTotalAutorizado = 0
                let peticionesAutorizadas = 0
                let productosTotalesSolicitados = 0
                let productosTotalesAutorizados = 0
                let montoTotalSolicitudes = 0
                let clientes = []
                for (var i = 0; i < dataStats.length; i++) {
                    clientes.push(dataStats[i].cliente_nombre)
                    if(dataStats[i].id_estatus == "2"|| dataStats[i].id_estatus == "3" ){
                        peticionesAutorizadas = peticionesAutorizadas + 1
                    }
                    montoTotalSolicitudes = montoTotalSolicitudes + parseInt(dataStats[i].precio_pactado)
                    productosTotalesSolicitados = productosTotalesSolicitados + parseInt(dataStats[i].productos.length)
                    productosTotalesAutorizados = productosTotalesAutorizados + parseInt(dataStats[i].productos_autorizados.length)
                    montoTotalAutorizado = montoTotalAutorizado + parseFloat(dataStats[i].monto_autorizado)
                }
                const resultado = {}
                clientes.forEach(el => (resultado[el] = resultado[el] + 1 || 1))
                let clienteMasConcurrente = Object.keys(resultado)[0]
                setStats({
                    'montoTotalAutorizado' : montoTotalAutorizado,
                    'peticionesTotales' : dataStats.length,
                    'peticionesAutorizadas' : peticionesAutorizadas,
                    'productosTotalesSolicitados' : productosTotalesSolicitados,
                    'productosTotalesAutorizados' : productosTotalesAutorizados,
                    'montoTotalSolicitudes' : montoTotalSolicitudes,
                    'clienteMasConcurrente' : clienteMasConcurrente
                })
            }
        })
        .catch((err) => console.log(err));
    }
    return(
        <>
            <div className="dashboard">
                <div className="dashboard__aside">
                    <DashboardAside
                    setIsLoggedIn={props.setIsLoggedIn}/>
                </div>
                <div className="dashboard__component">
                    <DashboardStats
                        stats={stats}
                    />
                    <div className="dashboard__table">
                        <DashboardTable
                         isLoggedIn={props.isLoggedIn}
                         jwt={props.jwt}
                         fetchOrders={fetchOrders}
                         fetchStats={fetchStats}
                         user={props.user}
                         rol={props.rol}
                         initalOrders={initalOrders} setInitalOrders={setInitalOrders}
                         numeroDeOrdenes={numeroDeOrdenes} setNumeroDeOrdenes={setNumeroDeOrdenes}
                         setOrders={props.setOrders} setPopupCreateOrder={props.setPopupCreateOrder} popupCreateOrder={props.popupCreateOrder} 
                         setOverlay={props.setOverlay} overlay={props.overlay}
                         setPopupEditOrder={props.setPopupEditOrder} popupEditOrder={props.popupEditOrder}
                         closeAllPopups={props.closeAllPopups}
                         orderStatus={props.orderStatus}
                         overlayToolTip={props.overlayToolTip} setOverlayToolTip={props.setOverlayToolTip}
                         setIsOpenToolTip={props.setIsOpenToolTip} setSuccessMessage={setSuccessMessage} setConentMessage={setConentMessage}
                         />
                    </div>
                </div>
                <OrderPopupCreate
                 jwt={props.jwt}
                 user={props.user}
                 setIsLoggedIn={props.setIsLoggedIn}
                 fetchOrders={fetchOrders}
                 setPopupCreateOrder={props.setPopupCreateOrder}
                 popupCreateOrder={props.popupCreateOrder} 
                 closeAllPopups={props.closeAllPopups}
                 overlayToolTip={props.overlayToolTip} setOverlayToolTip={props.setOverlayToolTip}
                 setIsOpenToolTip={props.setIsOpenToolTip} setSuccessMessage={setSuccessMessage} setConentMessage={setConentMessage}
                 />
                <PopupToolTip 
                successMessage={successMessage} isOpen={props.isOpenToolTip} conentMessage={conentMessage}
                closeAllPopupsToolTip={props.closeAllPopupsToolTip}/>

            </div>
            <div 
                className={props.overlay ? 'overlay' : 'overlay hidden' }
                onClick={props.closeAllPopups}
            >
            </div>
            <div 
                className={props.overlayToolTip ? 'overlay-tooltip' : 'overlay-tooltip hidden' }
                onClick={props.closeAllPopupsToolTip}
            >
            </div>
        </>
    )
}

export default Dashboard;