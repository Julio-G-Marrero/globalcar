import React, { useState, useEffect } from "react";
import { format } from "date-fns";

function TemplateProductTable({ producto, setProductosAutorizados, handleDeleteProducto, statusId }) {
  console.log(producto)
  const [isChecked, setIsChecked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [quantity, setQuantity] = useState(producto.cantidad || 1);
  const [price, setPrice] = useState(producto.PRECIO_VENTA);
  const [provider, setProvider] = useState(producto.provedor || "");
  const [deliveryDate, setDeliveryDate] = useState(producto.fecha_promesa_entrega || "");
  const [totalAmount, setTotalAmount] = useState(price * quantity);
  const today = new Date().toISOString().split("T")[0];

  // Actualiza el total cuando cambian el precio o la cantidad
  useEffect(() => {
    setTotalAmount(price * quantity);
  }, [price, quantity]);

  // Sincroniza el estado inicial con las props si el producto cambia
  useEffect(() => {
    setQuantity(producto.cantidad || 1);
    setPrice(producto.PRECIO_VENTA);
    setProvider(producto.provedor || "");
    setDeliveryDate(producto.fecha_promesa_entrega || "");
  }, [producto]);

  // Agrega o elimina el producto de la lista de productos autorizados
  const handleCheckboxToggle = () => {
    setIsChecked((prev) => {
      const newState = !prev;
  
      setProductosAutorizados((prevProductos) => {
        // Asegúrate de que prevProductos siempre sea un arreglo
        const productos = Array.isArray(prevProductos) ? prevProductos : [];
  
        if (newState) {
          // Verifica si el producto ya existe en el listado
          const exists = productos.some((item) => item.CODIGO_MAT === producto.CODIGO_MAT);
          if (exists) return productos; // No agregar duplicados
  
          // Agregar el producto nuevo
          return [
            ...productos,
            {
              CODIGO_MAT: producto.CODIGO_MAT,
              CODIGO_MAT: producto.CODIGO_MAT,
              DESCRIPCION: producto.DESCRIPCION,
              PRECIO_VENTA: price,
              cantidad: quantity,
              provedor: provider,
              fecha_promesa_entrega: deliveryDate,
            },
          ];
        } else {
          // Eliminar producto del listado
          return productos.filter((item) => item.CODIGO_MAT !== producto.CODIGO_MAT);
        }
      });
  
      return newState;
    });
  };
  

  // Manejo de cambios en los inputs
  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "quantity") {
      const parsedQuantity = Math.max(1, parseInt(value, 10) || 0); // Asegura que sea al menos 1
      setQuantity(parsedQuantity);
    } else if (id === "price") {
      setPrice(parseFloat(value) || 0); // Asegura que sea un número
    } else if (id === "provider") {
      setProvider(value);
    }
  };

  const handleDateChange = (e) => {
    const rawDate = e.target.value;
    const parsedDate = new Date(rawDate);
    if (!isNaN(parsedDate)) {
      const formattedDate = format(parsedDate, "dd/MM/yyyy");
      setDeliveryDate(formattedDate);
    }
  };

  const handleSave = (e) => {
    e.preventDefault()
    setProductosAutorizados((prevProductos) => {
      // Asegúrate de que prevProductos siempre sea un arreglo
      const productos = Array.isArray(prevProductos) ? prevProductos : [];
  
      return productos.map((item) =>
        item.CODIGO_MAT === producto.CODIGO_MAT
          ? {
              ...item,
              precio: price,
              cantidad: quantity,
              provedor: provider,
              fecha_promesa_entrega: deliveryDate,
            }
          : item
      );
    });
    setIsEditing(false);
  };
  

  const handleEdit = (e) => {
    e.preventDefault()
    setIsEditing(true);
    if (!isChecked) setIsChecked(true); // Asegura que el producto esté seleccionado al editar
  };
  console.log(producto)
  return (
    <tr className="border-b border-blue-gray-200 hover:bg-gray-100 h-9">
      <td className="p-2">{producto.CODIGO_MAT}</td>
      <td className="whitespace-normal overflow-hidden text-ellipsis line-clamp-2">{producto.DESCRIPCION}</td>
      <td>
        {isEditing ? (
          <input
            type="number"
            id="price"
            value={price}
            onChange={handleChange}
            className="p-2 border rounded-md w-20"
          />
        ) : (
          `$${price}`
        )}
      </td>
      <td className="text-center">
        {isEditing ? (
          <div className="flex items-center">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 border rounded-md"
            >
              -
            </button>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={handleChange}
              className="p-2 border rounded-md w-12 text-center mx-1"
            />
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 border rounded-md"
            >
              +
            </button>
          </div>
        ) : (
          quantity
        )}
      </td>
      <td>${totalAmount.toFixed(2)}</td>
      {statusId === undefined ? (
        <td>
          <button onClick={() => handleDeleteProducto(producto)}>
            <svg class="w-4 h-4 text-red-800 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd" d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z" clip-rule="evenodd"/>
            </svg>
          </button>
        </td>
      ) : (
        <>
          <td className="text-center">
            {isEditing ? (
              <input
                type="text"
                id="provider"
                value={provider}
                onChange={handleChange}
                className="p-2 border rounded-md w-32 text-center"
              />
            ) : (
              provider
            )}
          </td>
          {statusId == 1
          ?
            <td className="text-center">
              {isEditing || !deliveryDate ? (
                <input
                  type="date"
                  value={deliveryDate || today}
                  onChange={handleDateChange}
                  className="p-2 border rounded-md"
                  min={today}
                />
              ) : (
                deliveryDate
              )}
            </td>
          :
           <p className="text-center">{deliveryDate ? deliveryDate : "Sin Fecha"}</p>
          }
       

          {statusId == 1 
          ?
            <td className="flex flex-col items-center mt-2">
              <input
                type="checkbox"
                className="w-4 h-4"
                checked={isChecked}
                onChange={handleCheckboxToggle}
              />
              <button className="ml-2 text-green-700" onClick={isEditing ? handleSave : handleEdit}>
                {isEditing ? "Guardar" : "Editar"}
              </button>
            </td>
          :
           ""
          }
        </>
      )}
    </tr>
  );
}

export default TemplateProductTable;
