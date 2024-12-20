import React from "react";
import CurrencyInput from 'react-currency-input-field';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { format } from "date-fns";

function TemplateProductTable(props){
    const MySwal = withReactContent(Swal)
    const [isCheked, setIsCheked] = React.useState(false)
    const [isEditOn, setIsEditOn] = React.useState(false)
    const [isEditOnActive, setIsEditOnActive] = React.useState(false)
    const [nuevoPrecioProducto, setNuevoPrecioProducto] = React.useState(props.producto.PRECIO_VENTA)
    const [nuevaCantidadProducto, setNuevaCantidadProducto] = React.useState(props.producto.cantidad)
    const [nuevoMontoTotal, setNuevoMontoTotal] = React.useState(parseInt(props.producto.PRECIO_VENTA) * parseInt(nuevaCantidadProducto))
    const [provedoresProducto, setProvedoresProducto] = React.useState(props.producto.provedor)
    const [editQty, setEditQty] = React.useState(props.isCreatePopup || props.rol == 1)
    const [isEditPopup, setIsEditPopup] = React.useState(props.isEditPopup && props.rol == 1)
    const [date, setDate] = React.useState("");
    const today = new Date().toISOString().split("T")[0];
    React.useEffect(() => {
        setProvedoresProducto(props.producto.provedor)
    },[])
    React.useEffect(() => {
        calcularMonto()
    },[nuevaCantidadProducto])
    React.useEffect(() => {
        if(props.isCreatePopup == true) {
            props.sumaDeMonto()
        }
    },[nuevoMontoTotal])
    React.useEffect(() => {
        setIsEditOn(false)
        setIsEditOnActive(false)
        setNuevoPrecioProducto(props.producto.PRECIO_VENTA)
        setNuevaCantidadProducto(props.producto.cantidad)
        setProvedoresProducto(props.producto.provedor)
    },[props.orderSelected])

    function handleChange(e) {
        if(e.target.id == "nuevoPrecioProducto") {
            const { value = "" } = e.target;
            const parsedValue = value.replace(/[^\d.]/gi, "");
            let newValue = parseInt(parsedValue)
            setNuevoPrecioProducto(newValue)
        }else if(e.target.id == "nuevaCantidadProducto") {
            const value = e.target.value
            let newValue = parseInt(value)
            setNuevaCantidadProducto(newValue)
            props.producto.cantidad = nuevaCantidadProducto
        }else if(e.target.id == "provedoresProducto") {
            const value = e.target.value
            setProvedoresProducto(value)
        }else if(e.target.id == "nuevaCantidadProductoResta") {
            if(nuevaCantidadProducto > 1) {
                setNuevaCantidadProducto(nuevaCantidadProducto - 1)
                props.producto.cantidad = nuevaCantidadProducto
            }
        }else if(e.target.id == "nuevaCantidadProductoSuma") {
            const cantidadCambio = (parseInt(nuevaCantidadProducto) + 1)
            setNuevaCantidadProducto(cantidadCambio)
            props.producto.cantidad = nuevaCantidadProducto
        }
    }
     

    const handleDateChange = (e) => {
      const formattedDate = format(new Date(e.target.value), "dd/MM/yyyy");
      setDate(formattedDate);
      props.producto.fecha_promesa_entrega = formattedDate
    };

    function calcularMonto() {
        let montoCalculado = parseInt(props.producto.PRECIO_VENTA) * parseInt(nuevaCantidadProducto)
        setNuevoMontoTotal(montoCalculado)
    }

    function handleDeleteButton(e){
        e.preventDefault()
        props.handleDeleteProducto(props.producto)
    }

    function handleCheckProduct(e) {
        setIsCheked(true)
        if(Object.keys(props.productosAutorizados).length === 0 ) {
            props.setProductosAutorizados([{
                'idProducto':props.producto._id,
                "CODIGO_MAT": props.producto.CODIGO_MAT,
                "DESCRIPCION": props.producto.DESCRIPCION,
                "precio": props.producto.PRECIO_VENTA,
                "cantidad": parseInt(nuevaCantidadProducto),
                "provedor" : provedoresProducto
            }]
            )
        } else {
            console.log('segundo')
            console.log(props.producto._id)
            props.setProductosAutorizados([...props.productosAutorizados, {
                'idProducto':props.producto._id,
                "CODIGO_MAT": props.producto.CODIGO_MAT,
                "DESCRIPCION": props.producto.DESCRIPCION,
                "precio": props.producto.PRECIO_VENTA,
                "cantidad": parseInt(nuevaCantidadProducto),
                "provedor" : provedoresProducto
            }, ]);
        }

    }

    function handleEditProductInfo(e) {
        e.preventDefault()
        setIsEditOn(true)
        setIsEditOnActive(!isEditOnActive)
    }
    function handleSaveProductInfo(e) {
        const idProducto = e.target.id;
        const cleanProducts = props.productosAutorizados.filter(product => product.idProducto != idProducto);
        props.setProductosAutorizados([...cleanProducts,{
            'idProducto':props.producto._id,
            "CODIGO_MAT": props.producto.CODIGO_MAT,
            "DESCRIPCION": props.producto.DESCRIPCION,
            "precio": nuevoPrecioProducto,
            "cantidad": parseInt(nuevaCantidadProducto),
            "provedor" : provedoresProducto

        }])
        calcularMonto()
        setIsEditOnActive(!isEditOnActive)

    }
    function handleDeleteProductList(e){
        setNuevoPrecioProducto(props.producto.PRECIO_VENTA)
        setNuevaCantidadProducto(nuevaCantidadProducto)
        setNuevoMontoTotal(nuevoMontoTotal)
        setIsCheked(false)
        const idProducto = e.target.id;
        const cleanProducts = props.productosAutorizados.filter(product => product.idProducto != idProducto);
        props.setProductosAutorizados(cleanProducts)
    }
    if(props.producto.DESCRIPCION == undefined){
        return("")
    } else {
        return(
            <>
            <tr class="border-b border-blue-gray-200 hover:bg-gray-100">
                <td class="productoTable__space">{props.producto.CODIGO_MAT}</td>
                <td class="productoTable__space">{props.producto.DESCRIPCION}</td>
                <td class="productoTable__value">{props.producto.PRECIO_VENTA}</td>

                {
                    editQty && isEditOnActive || props.isCreatePopup
                        ?
                        <div class="py-2 px-2 bg-white rounded-l">
                            <div class="w-full flex justify-between items-center">
                                <div class="flex items-center">
                                    <button type="button" class="size-6 inline-flex justify-center items-center text-sm font-medium rounded-md border bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-non dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" tabindex="-1" aria-label="Decrease" data-hs-input-number-decrement=""
                                    id="nuevaCantidadProductoResta"
                                    onClick={handleChange}>
                                        <svg 
                                        id="nuevaCantidadProductoResta"
                                        onClick={handleChange}
                                        class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M5 12h14"></path>
                                        </svg>
                                    </button>
                                    <input class="p-0 w-6 bg-transparent border-0 text-gray-800 text-center focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none dark:text-white"  type="number" aria-roledescription="Number field" 
                                    value={nuevaCantidadProducto}
                                    id="nuevaCantidadProducto"
                                    onChange={handleChange}
                                        />
                                    <button type="button" class="size-6 inline-flex justify-center items-center text-sm font-medium rounded-md border bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-non dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" tabindex="-1" aria-label="Increase" data-hs-input-number-increment=""
                                        id="nuevaCantidadProductoSuma"
                                        onClick={handleChange}>
                                        <svg
                                        id="nuevaCantidadProductoSuma"
                                        onClick={handleChange}
                                        class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M5 12h14"></path>
                                        <path d="M12 5v14"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    :
                    <p className="text-center">{props.producto.cantidad}</p>
                }
                {isEditOn ?
                    <td class="productoTable__space precioTotalCantidad">${Math.round(nuevoMontoTotal)}</td>
                :
                    <td class="productoTable__space precioTotalCantidad">${Math.round(nuevoMontoTotal)}</td>
                }
                <td className={props.isCreatePopup ? 'productoTable__delete' : 'hidden'}>
                    <button
                    onClick={ props.isCreatePopup ? handleDeleteButton : ""}
                    >
                        <svg class="productoTable__deleteBtn w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"
                        />
                        </svg>
                    </button>
                </td>
                    {isEditPopup 
                    ? 
                        <td className="text-center">
                        {isEditOn ?
                            <td>
                                <div className="flex justify-center">
                                    {isEditOnActive ?
                                        <input type="text" value={provedoresProducto} 
                                        onChange={handleChange} id="provedoresProducto" name="provedoresProducto" className="w-24 m-auto text-center px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 "/>
                                    :
                                    <td class="productoTable__value">{provedoresProducto}</td>
                                    }
                        
                                </div>
                            </td>
                            
                        :
                            <td class="productoTable__value">{provedoresProducto}</td>
                        }
                        </td>
                    
                    :
                        ""
                    }
                <td class="productoTable__value">{props.producto.fecha_promesa_entrega == "Sin Fecha" && isCheked
                    ?
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={handleDateChange}
                        min={today} // Restringe fechas pasadas
                        className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-32 select-none caret-transparent" // Deshabilitar selección

                    />
                    :
                    <>
                    {isEditOnActive ? 
                        <input
                            type="date"
                            id="date"
                            value={date}
                            onChange={handleDateChange}
                            min={today} // Restringe fechas pasadas
                            className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-32 select-none caret-transparent" // Deshabilitar selección

                        />
                    :
                        <p className=" w-32">{props.producto.fecha_promesa_entrega}</p>
                    }
                    </>
                    
                }</td>
                <td className={isEditPopup ? 'productoTable__delete' : 'hidden'}>
                    <div className="hover:cursor-pointer"
                        >
                            {isCheked 
                            ?
                                <div >
                                    {isEditOnActive ?
                                        <svg 
                                        onClick={handleSaveProductInfo} 
                                        id={props.producto._id}
                                        class="w-5 h-5 mr-2 text-green-700 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 11.917 9.724 16.5 19 7.5"/>
                                        </svg>
                                    :
                                        <svg
                                        onClick={handleEditProductInfo} 
                                        id={props.producto._id}
                                        class="w-4 h-4 mr-2 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.779 17.779 4.36 19.918 6.5 13.5m4.279 4.279 8.364-8.643a3.027 3.027 0 0 0-2.14-5.165 3.03 3.03 0 0 0-2.14.886L6.5 13.5m4.279 4.279L6.499 13.5m2.14 2.14 6.213-6.504M12.75 7.04 17 11.28"/>
                                        </svg>
                                    }
                                </div>
                            :
                                <svg
                                disabled={props.autorizarHabilitado}
                                class="w-4 h-4 mr-2 hover:cursor-auto text-gray-500 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                </svg>
                            }
           
                    </div>


                    <input
                    type="checkbox"
                    disabled={props.autorizarHabilitado}
                    onClick={isCheked ? handleDeleteProductList : handleCheckProduct }
                    className='h-5 w-5 hover:cursor-pointer'
                    id={props.producto._id}
                    />
                </td>

            </tr>
            </>
        )
    }
}
export default TemplateProductTable;