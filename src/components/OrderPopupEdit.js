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
                            localStorage.removeItem('user-id');
                            localStorage.removeItem('user-email');
                            localStorage.removeItem('user-nombre');
                            localStorage.removeItem('user-departament');
                            props.setIsLoggedIn(false)                
                            history.push('globalcar/')
                            // history.go(0)
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
            <div className={props.popupEditOrder ?"popupEdit" : "popupEdit hidden"}>
                <div className="popupEdit__header">
                    <div className="popupEdit__elements">
                        <h1 className="popupEdit__titile">Editar Orden #{props.orderSelected._id}</h1>
                        <StatusSetterOrder
                        rol={props.rol}
                        productosAutorizados={productosAutorizados}
                        handleDenegarOrden={handleDenegarOrden}
                        handleSurtirOrden={handleSurtirOrden}
                        handleAutorizarOrden={handleAutorizarOrden}
                        handleEliminarOrden={handleEliminarOrden}
                        order={props.orderSelected} statusId={statusOrder} renderStatusOrder={renderStatusOrder}/>
                    </div>
                <form className="popupEdit__form">
                    <div className="popupEdit__margin">
                        <label for="nombre-cliente" className="popupEdit__label--nombre">Nombre Cliente</label>
                        <input type="text" id="nombre-cliente" value={nombreCliente} name="nombre-cliente" className="popupEdit__input" disabled={true}/>
                    </div>
                    <div className="clienteInfo popupEdit__elemntForm">
                        <div className="popupEdit__margin">
                            <label for="numeroTel" className="popupEdit__label">Tel Cliente</label>
                            <input type="text" value={telefonoCliente} id="numeroTel" name="numeroTel" className="popupEdit__input" disabled={true}/>
                        </div>
                        <div className="popupEdit__margin">
                            <label for="emialCliente" className="popupEdit__label">Email Cliente</label>
                            <input type="text" value={emailCliente} id="emialCliente" name="emialCliente" className="popupEdit__input" disabled={true}/>
                        </div>
                    </div>
                    <div className="fechas popupEdit__elemntForm">
                        <div className="popupEdit__margin">
                            <label for="fechaPromesa" className="popupEdit__label">Fecha Promesa</label>
                            <input type="date" value={fechaPromesa} disabled={fechaPromesaSwitch} onChange={handleOnChange} id="fechaPromesa" name="fechaPromesa" className="popupEdit__input"/>
                        </div>
                        <div className="popupEdit__margin">
                            <label for="date" className="popupEdit__label">Ubicacion Cliente</label>
                            <input type="text" value={ubicacionCliente} id="ubicacion-cliente" name="ubicacion-cliente" className="popupEdit__input" disabled={true}/>
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
                                <th className="product-list__th">Provedor</th>
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
                    <div className="popupEdit__margin popup-create__form">
                        <div className="add">
                                        
                        </div>
                        <div>
                            <label for="nombre" className="popupEdit__montoTotal">Monto Total</label>
                            <h2 className="font-semibold">${Math.round(totalMonto)}</h2>
                        </div>
                    </div>
                    <div className="popupEdit__margin">
                        <label for="nombre-cliente" className="popupEdit__label--nombre" >Comentarios</label>
                        <textarea type="text" disabled={true} value={comentarios} onChange={handleOnChange} id="comentarios" name="comentarios" className="popupEdit__input"/>
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