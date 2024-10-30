import React from "react";
import LoadingPage from "./LoadingPage.js"

function ProductsTable(props) {
    console.log(props.producto)
        return(
            <>
                <tr class="element" 
                >
                    <td class="element__content">
                        <p class="block font-semibold text-sm text-slate-800">{props.producto.codigo_barras}</p>
                    </td>
                    <td class="element__content">
                        <p class="block font-semibold text-sm text-slate-800">{props.producto.codigo_interno}</p>
                    </td>
                    <td class="element__content">
                        <p class="text-sm text-slate-500">{props.producto.descripcion}</p>
                    </td>
                    <td class="element__content">
                        <p class="text-sm text-center text-slate-500">${props.producto.precio}</p>
                    </td>
                    <td class="element__content">
                        <p class="text-sm text-center text-slate-500">{props.producto.familia}</p>
                    </td>
                    <td class="element__content">
                        <p class="text-sm text-center text-slate-500">{props.producto.sub_familia}</p>
                    </td>
                </tr>
            </>
        )
}

export default ProductsTable;