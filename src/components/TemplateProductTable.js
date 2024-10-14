import React from "react";
import CurrencyInput from 'react-currency-input-field';

function TemplateProductTable(props){
    const montoTotal = props.producto.precio * props.producto.cantidad;
    const [isCheked, setIsCheked] = React.useState(false)
    const [isEditOn, setIsEditOn] = React.useState(false)
    const [isEditOnActive, setIsEditOnActive] = React.useState(false)

    const [nuevoPrecioProducto, setNuevoPrecioProducto] = React.useState(props.producto.precio)
    const [nuevaCantidadProducto, setNuevaCantidadProducto] = React.useState(props.producto.cantidad)
    const [nuevoMontoTotal, setNuevoMontoTotal] = React.useState(props.producto.precio * props.producto.cantidad)
    const [provedoresProducto, setProvedoresProducto] = React.useState(props.producto.provedor)
    React.useEffect(() => {
        if(props.producto.provedor) {
            setProvedoresProducto(props.producto.provedor)
        }
    },[])
    React.useEffect(() => {
        setIsEditOn(false)
        setIsEditOnActive(false)
        setNuevoPrecioProducto(props.producto.precio)
        setNuevaCantidadProducto(props.producto.cantidad)
        setNuevoMontoTotal(montoTotal)
        setProvedoresProducto("Diverso")

        if(props.producto.provedor) {
            setProvedoresProducto(props.producto.provedor)
        }

    },[props.orderSelected])
    const prefix = "$ ";
    const handleOnBlur = () => setNuevoPrecioProducto(Number(nuevoPrecioProducto).toFixed(2));

    function handleChange(e) {
        if(e.target.id == "nuevoPrecioProducto") {
            const { value = "" } = e.target;
            const parsedValue = value.replace(/[^\d.]/gi, "");
            let newValue = parseInt(parsedValue)
            setNuevoPrecioProducto(newValue)
        } else if(e.target.id == "nuevaCantidadProducto") {
            const value = e.target.value
            let newValue = parseInt(value)

            setNuevaCantidadProducto(newValue)
        }else if(e.target.id == "provedoresProducto") {
            const value = e.target.value
            setProvedoresProducto(value)
        }
    }
     
    function calcularMonto() {
        let montoCalculado = nuevoPrecioProducto * nuevaCantidadProducto
        setNuevoMontoTotal(montoCalculado)
    }

    function handleDeleteButton(e){
        props.handleDeleteProducto(props.producto)
    }
    function handleCheckProduct(e) {
        setIsCheked(true)
        if(Object.keys(props.productosAutorizados).length === 0 ) {
            props.setProductosAutorizados(
            [{
                'idProducto':props.producto.idProducto,
                "sku": props.producto.sku,
                "nombre": props.producto.nombre,
                "precio": props.producto.precio,
                "cantidad": props.producto.cantidad,
                "provedor" : provedoresProducto
            }]
            )
        } else {
            props.setProductosAutorizados([...props.productosAutorizados, {
                'idProducto':props.producto.idProducto,
                "sku": props.producto.sku,
                "nombre": props.producto.nombre,
                "precio": props.producto.precio,
                "cantidad": props.producto.cantidad,
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
            'idProducto':props.producto.idProducto,
            "sku": props.producto.sku,
            "nombre": props.producto.nombre,
            "precio": nuevoPrecioProducto,
            "cantidad": nuevaCantidadProducto,
            "provedor" : provedoresProducto

        }])
        calcularMonto()
        setIsEditOnActive(!isEditOnActive)

    }
    function handleDeleteProductList(e){
        setNuevoPrecioProducto(props.producto.precio)
        setNuevaCantidadProducto(props.producto.cantidad)
        setProvedoresProducto("Diverso")
        setNuevoMontoTotal(montoTotal)
        setIsCheked(false)
        const idProducto = e.target.id;
        const cleanProducts = props.productosAutorizados.filter(product => product.idProducto != idProducto);
        props.setProductosAutorizados(cleanProducts)
    }
    if(props.producto.nombre == undefined){
        return("")
    } else {
        return(
            <>
            <tr class="border-b border-blue-gray-200">
                <td class="py-3 px-4">{props.producto.sku}</td>
                <td class="py-3 px-4">{props.producto.nombre}</td>
                {isEditOn ?
                    <div>
                        {isEditOnActive ?
                            <div className="flex justify-center">
                                <CurrencyInput
                                prefix={prefix}
                                name="nuevoPrecioProducto"
                                id="nuevoPrecioProducto"
                                data-number-to-fixed="2"
                                data-number-stepfactor="100"
                                value={nuevoPrecioProducto}
                                onChange={handleChange}
                                onBlur={handleOnBlur}
                                allowDecimals
                                decimalsLimit="2"
                                disableAbbreviations
                                decimalSeparator="." 
                                groupSeparator=","
                                className="w-32 px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 "
                                />
                            </div>
                        :
                            <td class="py-3 px-4 text-center">{nuevoPrecioProducto}</td>
                        }
         
                    </div>
                :
                    <td class="py-3 px-4 text-center">{props.producto.precio}</td>
                }
                {isEditOn ?
                    <td>
                        <div className="flex justify-center">
                            {isEditOnActive ?
                                <input type="number" value={nuevaCantidadProducto} onChange={handleChange} min={1} id="nuevaCantidadProducto" name="nuevaCantidadProducto" className="w-24 m-auto text-center px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 "/>
                            :
                            <td class="py-3 px-4 text-center">{nuevaCantidadProducto}</td>
                            }
                 
                        </div>
                    </td>
                    
                :
                    <td class="py-3 px-4 text-center">{props.producto.cantidad}</td>
                }
                {isEditOn ?
                    <td class="py-3 px-4">${Math.round(nuevoMontoTotal)}</td>
                :
                    <td class="py-3 px-4">${Math.round(montoTotal)}</td>
                }
                <td className={props.isCreatePopup ? 'flex h-10 items-center' : 'hidden'}
                onClick={ props.isCreatePopup ? handleDeleteButton : ""}>
                    <svg class="w-3 h-3 text-red-900 hover:cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"
                    />
                    </svg>
                </td>
                    {props.isEditPopup ? 
                        <td className="text-center">
                        {isEditOn ?
                            <td>
                                <div className="flex justify-center">
                                    {isEditOnActive ?
                                        <input type="text" value={provedoresProducto} 
                                        onChange={handleChange} id="provedoresProducto" name="provedoresProducto" className="w-24 m-auto text-center px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 "/>
                                    :
                                    <td class="py-3 px-4 text-center">{provedoresProducto}</td>
                                    }
                        
                                </div>
                            </td>
                            
                        :
                            <td class="py-3 px-4 text-center">{props.producto.provedor}</td>
                        }
                        </td>
                    
                    :
                    ""
                    }
                <td className={props.isEditPopup ? 'flex h-10 items-center' : 'hidden'}>
                    <div className="hover:cursor-pointer"
                        >
                            {isCheked 
                            ?
                                <div >
                                    {isEditOnActive ?
                                        <svg 
                                        onClick={handleSaveProductInfo} 
                                        id={props.producto.idProducto}
                                        class="w-5 h-5 mr-2 text-green-700 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 11.917 9.724 16.5 19 7.5"/>
                                        </svg>
                                    :
                                        <svg
                                        onClick={handleEditProductInfo} 
                                        id={props.producto.idProducto}
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
                    className='h-5 w-5 ss'
                    id={props.producto.idProducto}
                    />
                </td>
            </tr>
            </>
        )
    }
}
export default TemplateProductTable;