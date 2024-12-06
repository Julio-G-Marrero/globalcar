import React, { useState } from "react";
import TemplateProductTable from "./TemplateProductTable";
import CurrencyInput from 'react-currency-input-field';
import closeIcon from '../images/Close_Icon.png';
import api from "../utilis/api";
import { useHistory } from 'react-router'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

function OrderPopupCreate(props) {
    const MySwal = withReactContent(Swal)
    const history = useHistory();
    
    const [inputSearchProduct,setInputSearchProduct] = React.useState("")
    const [newProductForm,setNewProductForm] = React.useState(false)
    const [searchedProducts,setSearchedProducts] = React.useState([])
    const [selectedSearchedProducts,setSelectedSearchedProducts] = React.useState([])
    const [productosPedido, setProductosPedidos] = React.useState([])
    const [nombreProducto, setNombreProducto] = React.useState("")
    const [skuProducto, setSkuProducto] = React.useState("")
    const [precioProducto, setPrecioProducto] = React.useState(0)
    const [cantidadProducto, setCantidadProducto] = React.useState(1)
    const [totalMonto, setTotalMonto] = React.useState(0)
    const [nombreCliente, setNombreCliente] = useState("");
    const [telefonoCliente, setTelefonoCliente] = useState("");
    const [emailCliente, setEmailCliente] = useState("");
    const [ubicacionCliente, setUbicacionCliente] = useState("");
    const [fechaPromesa, setFechaPromesa] = useState();
    const [comentarios, setComentarios] = useState();
    const [newClientForm, setNewClientForm] = useState(false);
    const [searchedClients, setSearchedClients] = useState([]);
    const [inputSearchClient, setInputSearchClient] = useState("");
    const [clienteSeleccionado, setClienteSeleccionado] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    const Toast = MySwal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = MySwal.stopTimer;
          toast.onmouseleave = MySwal.resumeTimer;
        }
    });

    const prefix = "$ ";
    const handleOnBlur = () => setPrecioProducto(Number(precioProducto).toFixed(2));

    const to_day = new Date();
    const day = to_day.getDate();
    const month = to_day.getMonth()+1;
    let  actual_date = "";
    const year =  to_day.getFullYear();
    if(month <= 9) {
        actual_date = String(year +'-0'+month+'-'+day);
    }else {
        actual_date = String(year +'-'+month+'-'+day);
    }

    function handleAddProduct(e) {
        e.preventDefault()
        if(nombreProducto !== "" && precioProducto !== 0 && cantidadProducto !== 0) {
            setProductosPedidos([...productosPedido, {
                '_id':Math.floor(Math.random() * 1000000),
                "codigo_barras":skuProducto,
                "codigo_interno":skuProducto,
                "descripcion": nombreProducto,
                "familia": "Diversa",
                "precio": precioProducto,
                "sub_familia": "Diversa",
                "cantidad":cantidadProducto,
                "provedor": "Diverso"
                }, ]);
                setNombreProducto("")
                setPrecioProducto(0)
                setCantidadProducto(0)
                setSkuProducto("")
                setNewProductForm(false)
                Toast.fire({
                    icon: "success",
                    title: "Producto agregado correctamente"
                  });
        }else{
            alert('Hace falta un campo')
        }
    }

    function handleDeleteProducto(productElement) {
        const idProducto = productElement._id;
        const cleanProducts = productosPedido.filter(
            (item) => item._id !== idProducto
        );
        setProductosPedidos(cleanProducts); // Actualiza el array de productos
        console.log(idProducto)
        setSelectedSearchedProducts([]); // Limpia la búsqueda, si es necesario
        setTimeout(() => {
          sumaDeMonto(); // Recalcula el monto total
        }, 100);
      }
      

    function handleOnChange(e) {
        if(e.target.id === "nombreProducto"){
            setNombreProducto(e.target.value)
        }else if(e.target.id === "precioProducto"){
            const { value = "" } = e.target;
            const parsedValue = value.replace(/[^\d.]/gi, "");
            setPrecioProducto(parsedValue)
        }else if(e.target.id === "cantidadProducto"){
            setCantidadProducto(e.target.value)
        }else if(e.target.id === "nombre-cliente"){
            setNombreCliente(e.target.value)
        }else if(e.target.id === "emialCliente"){
            setEmailCliente(e.target.value)
        }else if(e.target.id === "numeroTel"){
            setTelefonoCliente(e.target.value)
        }else if(e.target.id === "ubicacion-cliente"){
            setUbicacionCliente(e.target.value)
        }else if(e.target.id === "fechaPromesa"){
            setFechaPromesa(e.target.value)
        }else if(e.target.id === "skuProducto"){
            setSkuProducto(e.target.value)
        }else if(e.target.id === "comentarios"){
            setComentarios(e.target.value)
        }
        
    }
    
    function handleChangeSearchProducts(e) {
        if(e.target.id == "inputSearchProduct"){
            setInputSearchProduct(e.target.value)
        }
    }

    function handleSearchProducts(e) {
        handleChangeSearchProducts(e)
        if(inputSearchProduct == "") {
            setSearchedProducts([])
        }else{
            fetch(`${api.addressEndpoints}/products/search/all?value=${inputSearchProduct}`, {
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
                        if(data.error) {
                            alert(data.err)
                        }else {
                            setSearchedProducts(data.products)
                        }
                    }
                })
                .catch((err) => console.log(err));
        }
    }


    function handleChangeSearchClients(e) {
        if(e.target.id == "inputSearchClient") {
            setInputSearchClient(e.target.value)
        }
        console.log(inputSearchClient)

    }
    function handleSearchClients(e) {
        handleChangeSearchClients(e)
        if(inputSearchClient == "") {
            setSearchedClients([])
        }else{
            fetch(`${api.addressEndpoints}/clients/search/all?value=${inputSearchClient}`, {
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
                        setSearchedClients(data.clients)
                    }
                })
                .catch((err) => console.log(err));
        }
    }

    function handleResetSearchProduct() {
        setInputSearchProduct("")
        setSearchedProducts([])
    }

    function handleResetSearchClient() {
        setInputSearchClient("")
        setSearchedClients([])
    }

    function handleCreateNewProduct() {
        setNewProductForm(!newProductForm)
    }
    
    function handleCleanForm(){
        setClienteSeleccionado("")
        setNombreCliente("")
        setPrecioProducto(0)
        setCantidadProducto(1)
        setTelefonoCliente("")
        setEmailCliente("")
        setUbicacionCliente("")
        setFechaPromesa("")
        setProductosPedidos([])
        setTotalMonto(0)
        setSkuProducto("")
        setComentarios("")
        setSearchedProducts([])
        setSearchedClients([])
        setSelectedSearchedProducts([])
        setNombreProducto("")
    }
    function countQtyProducts(){
        let totalProductos = 0
        Object.values(productosPedido).map(producto => 
            totalProductos = totalProductos + parseInt(producto.cantidad)
        )
        return totalProductos
    }


    function sumaDeMonto() {
        let suma = 0
        let cantidadesPrecios = document.querySelectorAll('.precioTotalCantidad')
        cantidadesPrecios.forEach((element) =>  {
            let precioMonto = element.innerHTML.split("$"); 
            precioMonto = parseInt(precioMonto[1])
            suma = suma + precioMonto
        }
        );
        setTotalMonto(suma)
    }

    function handleOrderCreate(e){
        e.preventDefault()
        if(productosPedido.length <= 0  || nombreCliente == ""){
            Toast.fire({
                icon: "error",
                title: "Es necesario añadir un producto y cliente"
              });
        }else 
        if(nombreCliente !== "" && telefonoCliente !== 0 && emailCliente !== 0 && ubicacionCliente !== 0){
            fetch(`${api.addressEndpoints}/orders`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  'Authorization': `Bearer ${props.jwt}`,

                },
                body: JSON.stringify(
                    {
                        email_vendedor: props.user.email,
                        nombre_vendedor: props.user.nombre,
                        productos: productosPedido,
                        cliente_nombre: nombreCliente,
                        cliente_email: emailCliente,
                        cliente_tel: telefonoCliente,
                        cliente_ubicacion: ubicacionCliente,
                        cantidad_productos: countQtyProducts(),
                        id_estatus: "1",
                        fecha_promesa: fechaPromesa,
                        precio_pactado: totalMonto,
                        comentarios: comentarios,
                        user_id: props.user.id
                    }
                ),
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
                    handleCleanForm()
                    props.setSuccessMessage(true)
                    props.setConentMessage("BackOrder Registrado Exitosamente!")
                    props.setIsOpenToolTip(true)
                    props.setSuccessMessage(true)
                    props.setOverlayToolTip(true)
                    props.fetchOrders()
                }
            })
            .catch((err) => console.log(err));
           
        }
    }

    function handleCreateClient() {
        setNewClientForm(!newClientForm)
    }

    function handleSelectSearchProduct(producto) {
        setProductosPedidos((prevProductos) => {
          const existe = prevProductos.some(item => item._id === producto._id);
          
          if (!existe) {
            producto.cantidad = 1;
            return [...prevProductos, producto];
          } else {
            return prevProductos;
          }
        });
      
        setSelectedSearchedProducts((prevSelected) => {
          const existe = prevSelected.some(item => item._id === producto._id);
          if (!existe) {
            return [...prevSelected, producto];
          }
          return prevSelected;
        });
      }

    function handleChangeSearchClients(e) {
        setInputSearchClient(e.target.value);
        if (e.target.value === "") {
            setSearchedClients([]);
        } else {
            fetch(`${api.addressEndpoints}/clients/search/all?value=${e.target.value}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${props.jwt}`,
                }
            })
            .then((response) => response.json())
            .then((data) => {
                if (data.clients) {
                    setSearchedClients(data.clients);
                } else {
                    setSearchedClients([]);
                }
            })
            .catch((err) => console.log(err));
        }
    }

    function handleKeyDown(e) {
        if (searchedClients.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIndex((prevIndex) =>
                prevIndex === searchedClients.length - 1 ? 0 : prevIndex + 1
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex((prevIndex) =>
                prevIndex <= 0 ? searchedClients.length - 1 : prevIndex - 1
            );
        } else if (e.key === 'Enter' && highlightedIndex !== -1) {
            e.preventDefault();
            handleSelectSearchClient(searchedClients[highlightedIndex]);
        }
    }

    function handleSelectSearchClient(cliente) {
        setClienteSeleccionado(cliente.nombre);
        setNombreCliente(cliente.nombre);
        setTelefonoCliente(cliente.telefono);
        setEmailCliente(cliente.email);
        setUbicacionCliente(cliente.direccion);
        setSearchedClients([]);
        setHighlightedIndex(-1);
        setNewClientForm(false);
    }

    function handleResetSearchClient() {
        setInputSearchClient("");
        setSearchedClients([]);
        setHighlightedIndex(-1);
    }

    return (
        <>
            <div className={props.popupCreateOrder ? "popup-create" : "popup-create hidden"}>
                <div className="popup-create__container">
                    <h1 className="items-center text-2xl font-semibold text-gray-500 mt-1 mb-2">Crear Orden</h1>
                    <div className="text-left mb-16">
                        <div className="relative top-10">
                            <div className="mb-2">
                                <h1 className="text-lg">Seleccionar Cliente</h1>
                            </div>
                            <div className="flex gap-4 items-center">
                                <div className="popup-create__form--add ">
                                    <div className="w-80">
                                        <div className="w-full">
                                            <div className=" w-6/6">
                                                <div className="relative">
                                                    <input
                                                        className="dashboardTable__input"
                                                        placeholder="Busqueda General..."
                                                        id="inputSearchClient"
                                                        onChange={handleChangeSearchClients}
                                                        onKeyDown={handleKeyDown}
                                                        value={inputSearchClient}
                                                    />
                                                    <button
                                                        className="dashboardTable__button--stats"
                                                        type="button"
                                                        onClick={handleResetSearchClient}
                                                    >
                                                        <svg className="w-5 h-5 text-gray-700 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"/>
                                                        </svg>
                                                    </button>
                                                    {searchedClients.length > 0 && (
                                                        <div className="absolute left-0 right-0 mt-2 w-full border border-gray-300 bg-white shadow-lg rounded-md z-50" role="menu">
                                                            {searchedClients.map((cliente, index) => (
                                                                <div
                                                                    key={cliente._id}
                                                                    className={`p-2 hover:bg-gray-100 cursor-pointer ${
                                                                        index === highlightedIndex ? 'bg-gray-200' : ''
                                                                    }`}
                                                                    onClick={() => handleSelectSearchClient(cliente)}
                                                                    onMouseEnter={() => setHighlightedIndex(index)}
                                                                >
                                                                    {cliente.nombre}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h1>Cliente Seleccionado: <span className="font-semibold">{clienteSeleccionado}</span></h1>
                                </div>
                            </div>
                            {clienteSeleccionado == "" 
                        ?
                            <div className="flex items-center hover:cursor-pointer"
                                onClick={handleCreateClient}
                            >
                                {newClientForm ? 
                                    <>
                                        <p className="p-2 text-yellow-700">Cerrar Formulario</p>
                                        <div>
                                            <svg class="w-6 h-6 text-yellow-700 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
                                            </svg>
                                        </div>
                                    </>
                                    
                                : 
                                    <>
                                        <p className="p-2 text-green-700">Crear cliente personalizado</p>
                                        <div>
                                            <svg className="w-4 h-4 text-green-700 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5"/>
                                                </svg>
                                        </div>
                                </>                                
                                }
                            </div>
                        :
                            ""
                        }
                        </div>
                    </div>
                    <form className="text-left">
                    <div className={newClientForm ? "text-left" : "hidden"}>
                        <div className="popup-create__margin">
                            <label for="nombre-cliente" className="popup-create__input-name">Nombre Cliente</label>
                            <input type="text" id="nombre-cliente" value={nombreCliente} onChange={handleOnChange} name="nombre-cliente" className="popup-create__input"/>
                        </div>
                        <div className="popup-create__margin">
                            <label for="date" className="popup-create__input--2">Ubicacion Cliente</label>
                            <input type="text" value={ubicacionCliente} onChange={handleOnChange} id="ubicacion-cliente" name="ubicacion-cliente" className="popup-create__input"/>
                        </div>
                        <div className="clienteInfo popup-create__fieldset">
                            <div className="popup-create__margin">
                                <label for="numeroTel" className="popup-create__input--2">Tel Cliente</label>
                                <input type="text" value={telefonoCliente} onChange={handleOnChange} id="numeroTel" name="numeroTel" className="popup-create__input"/>
                            </div>
                            <div className="popup-create__margin">
                                <label for="emialCliente" className="popup-create__input--2">Email Cliente</label>
                                <input type="text" value={emailCliente} onChange={handleOnChange} id="emialCliente" name="emialCliente" className="popup-create__input "/>
                            </div>
                        </div>
                    </div>
                    <div className="product-list">
                        <div className="product-list__container">
          
                            <table className="product-list__table">
                            <thead>
                                <tr className="product-list__tr">
                                <th className="product-list__th">SKU</th>
                                <th className="product-list__th">Producto</th>
                                <th className="product-list__th">Precio</th>
                                <th className="product-list__th">Cantidad</th>
                                <th className="product-list__th">Total</th>
                                </tr>
                            </thead>
                            <tbody className="text-blue-gray-900">
                            {
                                Object.values(productosPedido).map(producto =>  {
                                    return <TemplateProductTable
                                    rol={props.rol}
                                    sumaDeMonto={sumaDeMonto}
                                    producto={producto} handleDeleteProducto={handleDeleteProducto} isCreatePopup={true}/>
                                })
                            }  
                            </tbody>
                            </table>
                        </div>
                        <div className="popup-create__form--add justify-end">
                            <div>
                                <label for="nombre" className="popup-create__montoTotal">Monto Total</label>
                                <h2 className="font-semibold">${Math.round(totalMonto)}</h2>
                            </div>
                        </div>
                            {/* Formulario Nuevo Producto */}
                            <div className={newProductForm ? "flex" : "hidden"}>
                                <div className="flex-grow w-1/12 pr-2">
                                    <input placeholder="SKU" 
                                    id="skuProducto" name="skuProducto"
                                    value={skuProducto} onChange={handleOnChange}
                                    className="text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg border-gray-950 border-b-2  dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline " />
                                </div>
                                <div className="flex-grow w-3/12 pr-2">
                                    <input placeholder="Descripción" 
                                    value={nombreProducto} onChange={handleOnChange}
                                    id="nombreProducto" name="nombreProducto"
                                    className="text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg border-gray-950 border-b-2  dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline " />
                                </div>
                                <div className="flex-grow w-1/12 pr-2">
                                    <CurrencyInput
                                        prefix={prefix}
                                        name="precioProducto"
                                        id="precioProducto"
                                        data-number-to-fixed="2"
                                        data-number-stepfactor="100"
                                        value={precioProducto}
                                        placeholder=""
                                        onChange={handleOnChange}
                                        onBlur={handleOnBlur}
                                        allowDecimals
                                        decimalsLimit="2"
                                        disableAbbreviations
                                        decimalSeparator="." 
                                        groupSeparator=","
                                    className="text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg border-gray-950 border-b-2  dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline "
                                    />
                                </div>
                                <div className="flex-grow w-1/12">
                                    <input placeholder="Cantidad" className="text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg border-gray-950 border-b-2  dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline "
                                    type="number"
                                    value={cantidadProducto} onChange={handleOnChange}
                                    min={1} id="cantidadProducto" name="cantidadProducto" 
                                    />
                                </div>
                                <button
                                className="popup-create__buttonAdd w-28 m-2 mb-2"
                                data-ripple-light="true"
                                onClickCapture={handleAddProduct}
                                >
                                    Agregar
                                </button>
                            </div>
                            <div className="flex items-center underline  hover:cursor-pointer" 
                                onClick={handleCreateNewProduct}>
                                    {newProductForm 
                                    ?
                                    <>
                                        <p className="p-2 text-yellow-800">Cerrar Formulario</p>
                                        <div>
                                            <svg class="w-4 h-4 text-yellow-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
                                        </svg>
                                        </div>
                                    </>
                                    :   
                                        <>
                                            <p className="p-2 text-green-700">Crear Produto Personalizado</p>
                                            <div>
                                                <svg className="w-4 h-4 text-green-700 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5"/>
                                                </svg>
                                            </div>
                                        </>
                                        
                                    }
                            </div>
                            {/* Formulario Buscar Producto */}
                            <div className="">
                                <label for="comentarios" className="popup-create__input-name">Comentarios</label>
                                <textarea type="text" value={comentarios} onChange={handleOnChange} id="comentarios" name="comentarios" className="popup-create__input h-10" />
                            </div> 
                            <div className="relative">
                                <div className="mb-2">
                                    <h1 className="text-lg">Buscar Productos</h1>
                                </div>
                                <div className="popup-create__form--add flex justify-start">
                                    <div className="w-80">
                                        <div className="w-full">
                                            <div className=" w-6/6">
                                                <div className="relative">
                                                    <input
                                                    className="dashboardTable__input"
                                                    placeholder="Busqueda General..."
                                                    id="inputSearchProduct"
                                                    onChange={handleSearchProducts}
                                                    value={inputSearchProduct}
                                                    />
                                                    <button
                                                    className="dashboardTable__button--stats"
                                                    type="button"
                                                    onClick={handleResetSearchProduct}
                                                    >
                                                        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"/>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                             
                                </div>
                                    <div>
                                        <table className="product-list__table">
                                            <thead>
                                                <tr className="product-list__tr">
                                                    <th className="product-list__th">SKU</th>
                                                    <th className="product-list__th">Producto</th>
                                                    <th className="product-list__th">Precio</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {searchedProducts.length > 0 ?
                                                    ""
                                                    :
                                                    <>
                                                        <p className="p-2 text-gray-400">No hay productos</p>
                                                    </>
                                                }
                                                {searchedProducts.reverse().map(producto => (
                                                    <tr 
                                                        key={producto._id} 
                                                        className="hover:cursor-pointer hover:bg-gray-100"
                                                        onClick={() => handleSelectSearchProduct(producto)}
                                                    >
                                                        <td className="p-2">{producto.codigo_barras}</td>
                                                        <td className="p-2">{producto.descripcion}</td>
                                                        <td className="text-center p-2">{producto.precio}</td>
                                                    </tr>
                                                    ))}
                                            </tbody>
                                        </table>

                                    </div>
                            </div>
                        </div>

                    <button type="submit" className=" mt-16 popup-create__buttonCreate bg-globalcar"
                    onClick={handleOrderCreate}
                    >Crear</button>
                </form>
                </div>
                <img
                    className="modal__close"
                    src={closeIcon}
                    onClick={props.closeAllPopups}
                    alt="close icon"
                />
            </div>
        </>
    )
}

export default OrderPopupCreate;
