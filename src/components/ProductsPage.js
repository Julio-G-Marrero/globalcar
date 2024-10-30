import React from "react";
import DashboardAside from "./DashboardAside";
import HeaderApp from "./HeaderApp";
import ProductsTable from "./ProductsTable";
import PopupProductCreate from "./PopupProductCreate";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useHistory } from 'react-router-dom';
import api from "../utilis/api";
function ProductPage(props) {
    const MySwal = withReactContent(Swal)
    const [productos,setProductos] = React.useState([])
    const history = useHistory();
    console.log(productos)
    React.useEffect(() => {
        fetchProductos()
    },[])

    function fetchProductos() {
        fetch(`${api.addressEndpoints}/products`, {
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
                        } 
                        });
                }else {
                    setProductos(data.products)
                }
            })
            .catch((err) => console.log(err));
    }
    
    function handleSearchProducts(e) {
        console.log(e.target.value)
        fetch(`${api.addressEndpoints}/products/search/all?value=${e.target.value}`, {
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
                        } 
                        });
                }else {
                    setProductos(data.products)
                }
            })
            .catch((err) => console.log(err));
    }

    function handleOpenPopup() {
        props.setPopupCreateProduct(true)
            props.setOverlay(true)
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
                    page="Productos"/>
                <div className="dashboard__table mt-10">
                    <div className= "dashboardTable">
                        <div class="dashboardTable__header">
                        <div>
                            <div class="dashboardTable__containerButton">
                                <button class="dashboardTable__button"
                                onClick={handleOpenPopup}
                                    >
                                    <span class="dashboardTable__titleButton">Agregar Producto</span>
                                    <svg class="dashboardTable__svg" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path fill-rule="evenodd" d="M9 7V2.221a2 2 0 0 0-.5.365L4.586 6.5a2 2 0 0 0-.365.5H9Zm2 0V2h7a2 2 0 0 1 2 2v6.41A7.5 7.5 0 1 0 10.5 22H6a2 2 0 0 1-2-2V9h5a2 2 0 0 0 2-2Z" clip-rule="evenodd"/>
                                    <path fill-rule="evenodd" d="M9 16a6 6 0 1 1 12 0 6 6 0 0 1-12 0Zm6-3a1 1 0 0 1 1 1v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 1 1 0-2h1v-1a1 1 0 0 1 1-1Z" clip-rule="evenodd"/>
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
                                    onChange={handleSearchProducts}
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
                                            Codigo de Barras
                                        </p>
                                    </th>
                                    <th class="dashboardTable__tr">
                                        <p class="dashboardTable__text">
                                            Codigo Interno
                                        </p>
                                    </th>
                                    <th class="dashboardTable__tr">
                                        <p class="dashboardTable__text">
                                            Descripcion
                                        </p>
                                    </th>
                                    <th class="dashboardTable__tr text-center">
                                        <p class="dashboardTable__text-qty">
                                            Precio
                                        </p>
                                    </th>
                                    <th class="dashboardTable__tr text-center">
                                        <p class="dashboardTable__text">
                                            Sub Familia
                                        </p>
                                    </th>
                                    <th class="dashboardTable__tr text-center">
                                        <p class="dashboardTable__text">
                                            Familia
                                        </p>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                            {productos.reverse().map(producto => {     
                                return <ProductsTable
                                producto={producto}
                                />
                            })}
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <PopupProductCreate
        isOpenPopup={props.popupCreatProduct}
        overlay={props.overlay}
        closeAllPopups={props.closeAllPopups}
        jwt={props.jwt}
        setProductos={setProductos}
        productos={productos}
        />
        <div 
            className={props.overlay ? 'overlay' : 'overlay hidden' }
            onClick={props.closeAllPopups}
            >
        </div>
        </>
    )
}

export default ProductPage