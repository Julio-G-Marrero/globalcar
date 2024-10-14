import React from "react";
import TemplateProductTable from "./TemplateProductTable";
import closeIcon from '../images/Close_Icon.png';
import StatusSetterOrder from "./StatusSetterOrder";
import api from "../utilis/api";
import { useHistory } from 'react-router'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

function OrderPopupEdit(props){
    const MySwal = withReactContent(Swal)

    const history = useHistory()
    const [nombreCliente, setNombreCliente] = React.useState(props.orderSelected.cliente_nombre)
    const [telefonoCliente, setTelefonoCliente] = React.useState(props.orderSelected.cliente_tel)
    const [emailCliente, setEmailCliente] = React.useState(props.orderSelected.cliente_email)
    const [ubicacionCliente, setUbicacionCliente] = React.useState(props.orderSelected.cliente_ubicacion)
    const [fechaPromesa, setFechaPromesa] = React.useState()
    const [comentarios, setComentarios] = React.useState(props.orderSelected.comentarios)
    
    const [renderStatusOrder,setRenderStatusOrder] = React.useState(false)
    const [statusOrder, setStatusOrder] = React.useState(props.orderSelected.id_estatus)

    const [productosPedido, setProductosPedidos] = React.useState(props.orderSelected.productos)
    const [nombreProducto, setNombreProducto] = React.useState("")
    const [skuProducto, setSkuProducto] = React.useState("")
    const [precioProducto, setPrecioProducto] = React.useState(0)
    const [cantidadProducto, setCantidadProducto] = React.useState(1)
    const [totalMonto, setTotalMonto] = React.useState(props.orderSelected.precio_pactado)

    const [productosAutorizados, setProductosAutorizados] = React.useState({})

    function handleAutorizarOrden(){
        if(Object.keys(productosAutorizados).length === 0 || fechaPromesa == undefined) {
            props.setSuccessMessage(false)
            if(fechaPromesa == undefined) {
                props.setConentMessage("No hay fecha promesa cargada.")
            }else {
                props.setConentMessage("No hay productos seleccionados para autorizar.")
            }
            props.setIsOpenToolTip(true)
            props.setSuccessMessage(false)
            props.setOverlayToolTip(true)
        } else{
            let monto_autorizado = 0;
            let cantidad_productos_autorizados = 0;
            let productosDenegados = {}
            productosPedido.forEach((producto) => {
                productosDenegados = productosPedido.filter(product => product.idProducto == producto.idProducto);
            })
            productosAutorizados.forEach((producto) => {
                cantidad_productos_autorizados = cantidad_productos_autorizados + parseInt(producto.cantidad)
                const montoProducto = parseInt(producto.cantidad) * parseInt(producto.precio)
                monto_autorizado = monto_autorizado + parseInt(montoProducto)
                setTotalMonto(monto_autorizado)
            });
            fetch(`${api.addressEndpoints}/orders/${props.orderSelected._id}/authorize`, {
                method: "PATCH",
                headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${props.jwt}`,

                },
                body: JSON.stringify({
                "productos_autorizados": [productosAutorizados],
                "productos_denegados": [productosDenegados],
                "cantidad_productos_autorizados": cantidad_productos_autorizados,
                "monto_autorizado":monto_autorizado,
                "fecha_promesa_autorizada": fechaPromesa,
                }),
            }).then((data) => {
                if(data.message) {
                    MySwal.fire({
                        title: `Ocurrio un error, contacte con soporte`,
                        confirmButtonText: "Ok",
                      }).then((result) => {
                        if (result.isConfirmed) {
                            localStorage.removeItem('jwt');
                            props.setIsLoggedIn(false)                
                            history.push('/back-orders/login')
                            history.go(0)
                        } 
                      })
                }
                if(data.statusText == "OK") {
                    props.setSuccessMessage(true)
                    props.setConentMessage("BackOrder Autorizado Exitosamente!")
                    props.setIsOpenToolTip(true)
                    props.setSuccessMessage(true)
                    props.setOverlayToolTip(true)
                    setRenderStatusOrder(true)
                    setStatusOrder('2')
                    setTimeout(() => {
                        history.go(0)
                    }, 2000);
                }
            }).catch((err) => console.log(err));
        }
    }
    function handleEliminarOrden() {
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
        fetch(`${api.addressEndpoints}/orders/${props.orderSelected._id}/delete`, {
            method: "DELETE",
            headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${props.jwt}`,

            }
        }).then((data) => {
            if(data.statusText == "OK") {
                Toast.fire({
                    icon: "success",
                    title: "Backorder eliminado correctamente"
                  });
                setTimeout(() => {
                    history.go(0)
                }, 3000);
            }
        }).catch((err) => console.log(err));
    }

    function handleSurtirOrden() {
        console.log('surtiendo')
        fetch(`${api.addressEndpoints}/orders/${props.orderSelected._id}/estatus`, {
            method: "PATCH",
            headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${props.jwt}`,

            },
            body: JSON.stringify({
                "id_estatus": "3"
            }),
        }).then((data) => {
            if(data.statusText == "OK") {
                props.setSuccessMessage(true)
                props.setConentMessage("BackOrder Surtido Exitosamente!")
                props.setIsOpenToolTip(true)
                props.setSuccessMessage(true)
                props.setOverlayToolTip(true)
                setRenderStatusOrder(true)
                setStatusOrder('3')
                setTimeout(() => {
                    history.go(0)
                }, 2000);
            }
        }).catch((err) => console.log(err));
    }

    function handleDenegarOrden(){
        fetch(`${api.addressEndpoints}/orders/${props.orderSelected._id}/estatus`, {
            method: "PATCH",
            headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${props.jwt}`,
            },
            body: JSON.stringify({
            id_estatus: 4,
            }),
        }).then((data) => {
            if(data.statusText == "OK") {
                props.setSuccessMessage(true)
                props.setConentMessage("BackOrder Denegada Exitosamente!")
                props.setIsOpenToolTip(true)
                props.setSuccessMessage(true)
                props.setOverlayToolTip(true)
                setRenderStatusOrder(true)
                setStatusOrder('4')

            }
        }).catch((err) => console.log(err));
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
        setNombreCliente(props.orderSelected.cliente_nombre)
        setTelefonoCliente(props.orderSelected.cliente_tel)
        setEmailCliente(props.orderSelected.cliente_email)
        setUbicacionCliente(props.orderSelected.cliente_ubicacion)
        setComentarios(props.orderSelected.comentarios)
        setProductosPedidos(props.orderSelected.productos)
        setTotalMonto(props.orderSelected.precio_pactado)
        setStatusOrder(props.orderSelected.id_estatus)
    }

    let autorizarHabilitado = true;
    let fechaPromesaSwitch = true;
    if(statusOrder == 1) {
        fechaPromesaSwitch = false;
        autorizarHabilitado = false
    }
    React.useEffect(() => {
        handleCleanForm()
        if(props.orderSelected.productos_autorizados[0] != undefined){
            setProductosPedidos(props.orderSelected.productos_autorizados[0])
        }
        if(props.orderSelected.fecha_promesa_autorizada != undefined){
            let formatDate = props.orderSelected.fecha_promesa_autorizada.split("T")
            setFechaPromesa(formatDate[0])
        }
        if(props.orderSelected.monto_autorizado != 0) {
            setTotalMonto(props.orderSelected.monto_autorizado)
        }
    },[props.orderSelected])
    return(
        <>
            <div className={props.popupEditOrder ?"popup absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50" : "popup absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden"}>
                <div className="max-w-5xl w-full p-10 bg-white rounded-lg shadow-lg m-20 mt-10 mb-10 ">
                    <div className="flex justify-between">
                        <h1 className="items-center text-2xl font-semibold text-gray-500 mt-1 mb-2">Editar Orden #{props.orderSelected._id}</h1>
                        <StatusSetterOrder
                        rol={props.rol}
                        productosAutorizados={productosAutorizados}
                        handleDenegarOrden={handleDenegarOrden}
                        handleSurtirOrden={handleSurtirOrden}
                        handleAutorizarOrden={handleAutorizarOrden}
                        handleEliminarOrden={handleEliminarOrden}
                        order={props.orderSelected} statusId={statusOrder} renderStatusOrder={renderStatusOrder}/>
                    </div>
                <form className="text-left">
                    <div className="mb-4">
                        <label for="nombre-cliente" className="block  mb-2 text-sm text-gray-600">Nombre Cliente</label>
                        <input type="text" id="nombre-cliente" value={nombreCliente} name="nombre-cliente" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 " disabled={true}/>
                    </div>
                    <div className="clienteInfo grid grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label for="numeroTel" className="block mb-2 text-sm text-gray-600">Tel Cliente</label>
                            <input type="text" value={telefonoCliente} id="numeroTel" name="numeroTel" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" disabled={true}/>
                        </div>
                        <div className="mb-4">
                            <label for="emialCliente" className="block mb-2 text-sm text-gray-600">Email Cliente</label>
                            <input type="text" value={emailCliente} id="emialCliente" name="emialCliente" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 " disabled={true}/>
                        </div>
                    </div>
                    <div className="fechas grid grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label for="fechaPromesa" className="block mb-2 text-sm text-gray-600">Fecha Promesa</label>
                            <input type="date" value={fechaPromesa} disabled={fechaPromesaSwitch} onChange={handleOnChange} id="fechaPromesa" name="fechaPromesa" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"/>
                        </div>
                        <div className="mb-4">
                            <label for="date" className="block mb-2 text-sm text-gray-600">Ubicacion Cliente</label>
                            <input type="text" value={ubicacionCliente} id="ubicacion-cliente" name="ubicacion-cliente" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" disabled={true}/>
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
                                <th className="py-3 px-4 text-center text-sm text-gray-600">Total</th>
                                <th className="py-3 px-4 text-center text-sm text-gray-600">Provedor</th>
                                </tr>
                            </thead>
                            <tbody className="text-blue-gray-900">
                                { Object.values(productosPedido).map(producto =>  {
                                        return <TemplateProductTable
                                        autorizarHabilitado={autorizarHabilitado}
                                        statusId={statusOrder}
                                        producto={producto} isCreatePopup={false}
                                        orderSelected={props.orderSelected}
                                        isEditPopup={true}
                                        setProductosAutorizados={setProductosAutorizados}
                                        productosAutorizados={productosAutorizados}
                                        setTotalMonto={setTotalMonto}/>
                                    })}
                            </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="mb-4 flex items-center justify-between gap-4">
                        <div className="add">
                                        
                        </div>
                        <div>
                            <label for="nombre" className="block text-sm text-gray-600">Monto Total</label>
                            <h2 className="font-semibold">${Math.round(totalMonto)}</h2>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label for="nombre-cliente" className="block  mb-2 text-sm text-gray-600" >Comentarios</label>
                        <textarea type="text" disabled={true} value={comentarios} onChange={handleOnChange} id="comentarios" name="comentarios" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"/>
                    </div>
                    {/* <button type="submit" className="w-32 background-globalcar text-white py-2 rounded-lg mx-auto block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 mb-2 bg-globalcar font-semibold"
                    >Guardar</button> */}
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

export default OrderPopupEdit