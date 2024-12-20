import React from "react";
import LoadingPage from "./LoadingPage.js"

function ProductsTable(props) {
        return(
            <>
                <tr class="element" 
                >
                    <td class="element__content">
                        <p class="block font-semibold text-sm text-slate-800">{props.producto.CODIGO_BARRAS}</p>
                    </td>
                    <td class="element__content">
                        <p class="block font-semibold text-sm text-slate-800">{props.producto.CODIGO_MAT}</p>
                    </td>
                    <td class="element__content">
                        <p class="text-sm text-slate-500">{props.producto.DESCRIPCION}</p>
                    </td>
                    <td class="element__content">
                        <p class="text-sm text-center text-slate-500">${props.producto.PRECIO_VENTA}</p>
                    </td>
                    <td class="element__content">
                        <p class="text-sm text-center text-slate-500">{props.producto.FAMILIA}</p>
                    </td>
                    <td class="element__content">
                        <p class="text-sm text-center text-slate-500">{props.producto.sub_familia}</p>
                    </td>
                </tr>
            </>
        )
}

export default ProductsTable;