import React from "react";
import DashboardAside from "./DashboardAside";
import HeaderApp from "./HeaderApp";
import PopupClientCreate from "./PopupClientCreate";
import api from "../utilis/api";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useHistory } from 'react-router'

function ClientPage(props) {
    const [clientes,setClientes] = React.useState([])
    
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

    React.useEffect(() => {
        fetchClients()
    },[])

    function fetchClients() {
        fetch(`${api.addressEndpoints}/clients`, {
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
                        history.go(0)
                    } 
                  });
              }else {
                setClientes(data.data)
              }
          })
          .catch((err) => console.log(err));
    }

    console.log(clientes)

    function handleOpenPopup() {
        props.setPopupCreateClient(true)
        props.setOverlay(true)
    }

    function handleSearchClients(e) {
        fetch(`${api.addressEndpoints}/clients/search/all?value=${e.target.value}`, {
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
                        } 
                        });
                }else {
                    setClientes(data.clients)
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
                <HeaderApp
                    page="Clientes"/>
                <div className="dashboard__table mt-10">
                    <div className= "dashboardTable">
                        <div class="dashboardTable__header">
                            <div>
                                <div class="dashboardTable__containerButton">
                                    <button class="dashboardTable__button"
                                    onClick={handleOpenPopup}
                                        >
                                        <span class="dashboardTable__titleButton">Agregar Cliente</span>
                                        <svg class="dashboardTable__svg" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path fill-rule="evenodd" d="M9 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H7Zm8-1a1 1 0 0 1 1-1h1v-1a1 1 0 1 1 2 0v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 0 1-1-1Z" clip-rule="evenodd"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div class="ml-20 w-80">
                                <div class=" w-6/6">
                                    <div class="relative">
                                        <input
                                        class="dashboardTable__input"
                                        placeholder="Busqueda General..."
                                        id="inputSearch"
                                        onChange={handleSearchClients}

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
                                                Dirección
                                            </p>
                                        </th>
                                        <th class="dashboardTable__tr">
                                            <p class="dashboardTable__text">
                                                Telefono
                                            </p>
                                        </th>
                                        <th class="dashboardTable__tr">
                                            <p class="dashboardTable__text">
                                                Correo Electronico
                                            </p>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                {clientes.reverse().map(cliente => {     
                                    return (
                                    <>
                                        <tr class="element">
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
                                    </>
                                    )
                                })}
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
            className={props.overlay ? 'overlay' : 'overlay hidden' }
            onClick={props.closeAllPopups}
            >
        </div>
        </div>
        </>
    )
}

export default ClientPage