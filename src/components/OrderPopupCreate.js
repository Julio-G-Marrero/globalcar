import React from "react";
import TemplateProductTable from "./TemplateProductTable";
import CurrencyInput from 'react-currency-input-field';
import closeIcon from '../images/Close_Icon.png';
import api from "../utilis/api";
import { useHistory } from 'react-router'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

function OrderPopupCreate(props) {
    const MySwal = withReactContent(Swal)

    const history = useHistory()
    const [nombreCliente, setNombreCliente] = React.useState("")
    const [telefonoCliente, setTelefonoCliente] = React.useState("")
    const [emailCliente, setEmailCliente] = React.useState("")
    const [ubicacionCliente, setUbicacionCliente] = React.useState("")
    const [fechaPromesa, setFechaPromesa] = React.useState()
    const [comentarios, setComentarios] = React.useState()

    const [newProductForm,setNewProductForm] = React.useState(false)
    const [searchedProducts,setSearchedProducts] = React.useState([])
    const [selectedSearchedProducts,setSelectedSearchedProducts] = React.useState([])
    const [productosPedido, setProductosPedidos] = React.useState([])
    const [nombreProducto, setNombreProducto] = React.useState("")
    const [skuProducto, setSkuProducto] = React.useState("")
    const [precioProducto, setPrecioProducto] = React.useState(0)
    const [cantidadProducto, setCantidadProducto] = React.useState(1)
    const [totalMonto, setTotalMonto] = React.useState(0)

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
                'idProducto':Math.floor(Math.random() * 1000000),
                "sku":skuProducto,
                "nombre": nombreProducto,
                "precio": precioProducto,
                "cantidad":cantidadProducto,
                "proovedor": "Diverso"
                }, ]);
                setNombreProducto("")
                setPrecioProducto(0)
                setCantidadProducto(0)
                setSkuProducto("")
        }else{
            alert('Hace falta un campo')
        }
    }
    function handleDeleteProducto(productElement){
        const idProducto = productElement.idProducto;
        const cleanProducts = productosPedido.filter(item => item.idProducto !== idProducto);
        setProductosPedidos(cleanProducts)
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
    function handleSearchProducts(e) {
        if(e.target.value == "") {
            setSearchedProducts([])
        }else{
            fetch(`${api.addressEndpoints}/products/search/all?value=${e.target.value}&limit=4`, {
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
                        setSearchedProducts(data.products)
                    }
                })
                .catch((err) => console.log(err));
        }
    }

    function handleCreateNewProduct() {
        setNewProductForm(true)
    }
 
    function handleCleanForm(){
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
    }
    function countQtyProducts(){
        let totalProductos = 0
        Object.values(productosPedido).map(producto => 
            totalProductos = totalProductos + parseInt(producto.cantidad)
        )
        return totalProductos
    }
    React.useEffect(() => {
        let totalMonto = 0
        Object.values(productosPedido).map(producto => 
            totalMonto = totalMonto + (parseFloat(producto.precio) * parseFloat(producto.cantidad))
        )
        setTotalMonto(totalMonto)
    },[productosPedido])
    function handleOrderCreate(e){
        e.preventDefault()
        if(productosPedido.length <= 0){
            alert('Es necesario agregar por lo menos un producto.')
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
    return(
        <>
            <div className={props.popupCreateOrder ?"popup-create" : "popup-create hidden"}>
                <div className="popup-create__container">
                <h1 className="items-center text-2xl font-semibold text-gray-500 mt-1 mb-2">Crear Orden</h1>
                <form className="text-left">
                    <div className="popup-create__margin">
                        <label for="nombre-cliente" className="popup-create__input-name">Nombre Cliente</label>
                        <input type="text" id="nombre-cliente" value={nombreCliente} onChange={handleOnChange} name="nombre-cliente" className="popup-create__input"/>
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
                    <div className="fechas popup-create__fieldset">
                        <div className="popup-create__margin">
                            <label for="fechaPromesa" className="popup-create__input--2">Fecha Promesa</label>
                            <input type="date" value={fechaPromesa} onChange={handleOnChange} id="fechaPromesa" name="fechaPromesa" className="popup-create__input" disabled={true}/>
                        </div>
                        <div className="popup-create__margin">
                            <label for="date" className="popup-create__input--2">Ubicacion Cliente</label>
                            <input type="text" value={ubicacionCliente} onChange={handleOnChange} id="ubicacion-cliente" name="ubicacion-cliente" className="popup-create__input"/>
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
                                    return <TemplateProductTable producto={producto} handleDeleteProducto={handleDeleteProducto} isCreatePopup={true}/>
                                })
                            }  
                            </tbody>
                            </table>
                        </div>
                            {/* Formulario Nuevo Producto */}
                            <div className={newProductForm ? "popup-create__form" : "hidden"}>
                                <div>
                                    <input value={skuProducto} onChange={handleOnChange} type="text" id="skuProducto" name="skuProducto" className="popup-create__input"/>
                                </div>
                                <div className="flex-1">
                                    <input value={nombreProducto} onChange={handleOnChange} type="text" id="nombreProducto" name="nombreProducto" className="popup-create__input"/>
                                </div>
                                <div>
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
                                    className="popup-create__currency"
                                    />
                                </div>
                                <div>
                                </div>
                                <div>
                                    <input type="number" value={cantidadProducto} onChange={handleOnChange} min={1} id="cantidadProducto" name="cantidadProducto" className="popup-create__number"/>
                                </div>
                                <div className="add">
                                    <button
                                    className="popup-create__buttonAdd"
                                    data-ripple-light="true"
                                    onClickCapture={handleAddProduct}
                                    >
                                        Agregar
                                    </button>
                                </div>
                            </div>
                            {/* Formulario Buscar Producto */}
                            <div className="relative top-10">
                                <div className="mb-2">
                                    <h1>Buscar Productos</h1>
                                </div>
                                <div className="popup-create__form--add ">
                                    <div className="w-72">
                                        <div class="w-full">
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
                                    <div>
                                        <h2>Agregar</h2>
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
                                                    <div className="flex items-center underline text-green-700" 
                                                    onClick={handleCreateNewProduct}>
                                                        <p className="p-2">Crear Produto Personalizado</p>
                                                        <div>
                                                            <svg class="w-4 h-4 text-green-700 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
                                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5"/>
                                                            </svg>
                                                        </div>
                                                    </div>

                                                    </>
                                                }
                                                {searchedProducts.reverse().map(producto => {     
                                                    function handleSelectSearchProduct(){
                                                        const filtrados = selectedSearchedProducts.filter(item => item._id !== producto._id)
                                                        setSelectedSearchedProducts([...filtrados,producto])
                                                        setProductosPedidos(filtrados)
                                                    }
                                                    return(
                                                        <>
                                                            <tr className=" hover:cursor-pointer hover:bg-gray-100"
                                                                onClick={handleSelectSearchProduct}
                                                            >
                                                                <td className="p-2">{producto.codigo_interno}</td>
                                                                <td className="p-2">{producto.descripcion}</td>
                                                                <td className="text-center p-2">{producto.precio}</td>
                                                            </tr>
                                                        </>
                                                    )
                                                })}
                                            </tbody>
                                        </table>

                                    </div>
                            </div>
                        </div>
                    <div className="popup-create__form--add justify-end">
                        <div>
                            <label for="nombre" className="popup-create__montoTotal">Monto Total</label>
                            <h2 className="font-semibold">${Math.round(totalMonto)}</h2>
                        </div>
                    </div>
                    <div className="popup-create__margin">
                        <label for="comentarios" className="popup-create__input-name">Comentarios</label>
                        <textarea type="text" value={comentarios} onChange={handleOnChange} id="comentarios" name="comentarios" className="popup-create__input h-10" />
                    </div>
                    <button type="submit" className="popup-create__buttonCreate bg-globalcar"
                    onClick={handleOrderCreate}
                    >Crear</button>
                </form>
                </div>
                <img
                    className="modal__close "
                    src={closeIcon}
                    onClick={props.closeAllPopups}
                    alt="close icon"
                />
            </div>
        </>
    )
}

export default OrderPopupCreate