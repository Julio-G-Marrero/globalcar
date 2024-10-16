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
                            // history.go(0)
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
            <div className={props.popupCreateOrder ?"popup absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50" : "popup absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden"}>
                <div className="max-w-5xl w-full p-10 bg-white rounded-lg shadow-lg m-20 mt-10 mb-10 ">
                <h1 className="items-center text-2xl font-semibold text-gray-500 mt-1 mb-2">Crear Orden</h1>
                <form className="text-left">
                    <div className="mb-4">
                        <label for="nombre-cliente" className="block  mb-2 text-sm text-gray-600">Nombre Cliente</label>
                        <input type="text" id="nombre-cliente" value={nombreCliente} onChange={handleOnChange} name="nombre-cliente" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"/>
                    </div>
                    <div className="clienteInfo grid grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label for="numeroTel" className="block mb-2 text-sm text-gray-600">Tel Cliente</label>
                            <input type="text" value={telefonoCliente} onChange={handleOnChange} id="numeroTel" name="numeroTel" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"/>
                        </div>
                        <div className="mb-4">
                            <label for="emialCliente" className="block mb-2 text-sm text-gray-600">Email Cliente</label>
                            <input type="text" value={emailCliente} onChange={handleOnChange} id="emialCliente" name="emialCliente" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 "/>
                        </div>
                    </div>
                    <div className="fechas grid grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label for="fechaPromesa" className="block mb-2 text-sm text-gray-600">Fecha Promesa</label>
                            <input type="date" value={fechaPromesa} onChange={handleOnChange} id="fechaPromesa" name="fechaPromesa" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" disabled={true}/>
                        </div>
                        <div className="mb-4">
                            <label for="date" className="block mb-2 text-sm text-gray-600">Ubicacion Cliente</label>
                            <input type="text" value={ubicacionCliente} onChange={handleOnChange} id="ubicacion-cliente" name="ubicacion-cliente" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"/>
                        </div>
                    </div>
                    <div className="product-list">
                        <div className="overflow-y-scroll h-52">
          
                            <table className="min-w-full bg-white shadow-md rounded-xl">
                            <thead>
                                <tr className="bg-blue-gray-100 text-gray-600">
                                <th className="py-3 px-4 text-left text-sm text-gray-600">SKU</th>
                                <th className="py-3 px-4 text-left text-sm text-gray-600">Producto</th>
                                <th className="py-3 px-4 text-left text-sm text-gray-600">Precio</th>
                                <th className="py-3 px-4 text-left text-sm text-gray-600">Cantidad</th>
                                <th className="py-3 px-4 text-left text-sm text-gray-600">Total</th>
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
                            <div className="flex border-b justify-around border-blue-gray-200 gap-2" id="new-product">
                                <div>
                                    <input value={skuProducto} onChange={handleOnChange} type="text" id="skuProducto" name="skuProducto" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"/>
                                </div>
                                <div className="flex-1">
                                    <input value={nombreProducto} onChange={handleOnChange} type="text" id="nombreProducto" name="nombreProducto" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"/>
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
                                    className="w-32 px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 "
                                    />
                                </div>
                                <div>
                                </div>
                                <div>
                                    <input type="number" value={cantidadProducto} onChange={handleOnChange} min={1} id="cantidadProducto" name="cantidadProducto" className="w-16 text-center px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 "/>
                                </div>
                            </div>
                    </div>
                    <div className="mb-4 flex items-center justify-between gap-4">
                        <div className="add">
                            <button
                            className="middle none center mr-4 rounded-lg bg-green-500 py-2 px-4 font-sans text-xs font-bold uppercase text-white shadow-md shadow-green-500/20 transition-all hover:shadow-lg hover:shadow-green-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            data-ripple-light="true"
                            onClickCapture={handleAddProduct}
                            >
                                Agregar
                            </button>
                        </div>
                        <div>
                            <label for="nombre" className="block text-sm text-gray-600">Monto Total</label>
                            <h2 className="font-semibold">${Math.round(totalMonto)}</h2>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label for="comentarios" className="block  mb-2 text-sm text-gray-600">Comentarios</label>
                        <textarea type="text" value={comentarios} onChange={handleOnChange} id="comentarios" name="comentarios" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"/>
                    </div>
                    <button type="submit" className="w-32 background-globalcar text-white py-2 rounded-lg mx-auto block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 mb-2 bg-globalcar font-semibold"
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