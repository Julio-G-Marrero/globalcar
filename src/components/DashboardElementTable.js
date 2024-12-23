import React from "react";
import Moment from 'react-moment';

function DashboardElementTable(props) {
    let precioAutorizado = false;
    if(props.order.monto_autorizado != 0) {
        precioAutorizado = true
    }
    function handleOpenOrder() {
        props.setOrderSelected(props.order)
        props.setPopupEditOrder(!props.popupEditOrder)
        props.setOverlay(!props.overlay)
    }
    return(
        <tr class="element" 
            onClick={handleOpenOrder}
        >
            <td class="element__content max-md:p-2">
                <p class="block font-semibold text-sm text-slate-800 max-md:w-28">{props.order.cliente_nombre}</p>
            </td>
            <td class="element__content max-md:p-2 max-md:hidden">
                <p class="block font-semibold text-sm text-slate-800">{props.order.cliente_email}</p>
            </td>
            <td class="element__content max-md:p-2">
                <p class="text-sm text-slate-500">
                <Moment fromNow>{props.order.fecha_apertura}</Moment>
                </p>
            </td>
            <td class="element__content max-md:p-2">
                <p class="text-sm text-center text-slate-500">{props.order.cantidad_productos}</p>
            </td>
            <td class="element__content max-md:p-2">
                {
                    precioAutorizado ? 
                    <p class="text-sm text-slate-500">${Math.round(props.order.monto_autorizado)}</p>
                    :
                    <p class="text-sm text-slate-500">${Math.round(props.order.precio_pactado)}</p>

                }
            </td>
            <td class="element__content max-md:p-2">
                <p class="text-sm text-slate-500">{props.orderStatus[props.order.id_estatus]}</p>
            </td>
        </tr>
    )
}

export default DashboardElementTable;