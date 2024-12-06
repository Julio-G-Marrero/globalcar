import React, { useState, useEffect } from "react";
import { format } from "date-fns";

function TemplateProductTable(props) {
  const [isChecked, setIsChecked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [quantity, setQuantity] = useState(props.producto.cantidad);
  const [price, setPrice] = useState(props.producto.precio);
  const [provider, setProvider] = useState(props.producto.provedor || "");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [totalAmount, setTotalAmount] = useState(
    props.producto.precio * props.producto.cantidad
  );
  const today = new Date().toISOString().split("T")[0];

  // Update total amount when price or quantity changes
  useEffect(() => {
    setTotalAmount(price * quantity);
  }, [price, quantity]);

  useEffect(() => {
    // Sincroniza el estado con las props si el valor cambia
    setProvider(props.producto.provedor || "");
  }, [props.producto.provedor]);
  useEffect(() => {
    // Sincroniza el estado con las props si el valor cambia
    setQuantity(props.producto.cantidad || 1);
}, [props.producto.cantidad]);

  // Handle changes in quantity, price, or provider
  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "quantity") {
      setQuantity(parseInt(value) || 0);
    } else if (id === "price") {
      setPrice(parseInt(value) || 0);
    } else if (id === "provider") {
      setProvider(value);
    }
  };

  console.log()

  // Handle delivery date changes with validation
  const handleDateChange = (e) => {
    const rawDate = e.target.value;

    if (!rawDate) {
      console.error("Fecha inválida: ", rawDate);
      return;
    }

    const parsedDate = new Date(rawDate);

    if (isNaN(parsedDate.getTime())) {
      console.error("Fecha inválida después del parseo: ", rawDate);
      return;
    }

    const formattedDate = format(parsedDate, "dd/MM/yyyy");
    setDeliveryDate(formattedDate);
    props.producto.fecha_promesa_entrega = formattedDate;
  };

  // Handle checkbox toggle
  const handleCheckboxToggle = () => {
    setIsChecked(!isChecked);
    if (!isChecked) {
      props.setProductosAutorizados((prev) => [
        ...(Array.isArray(prev) ? prev : []), // Ensure prev is an array
        {
          idProducto: props.producto._id,
          codigo_interno: props.producto.codigo_interno,
          descripcion: props.producto.descripcion,
          precio: price,
          cantidad: quantity,
          provedor: provider,
          fecha_promesa_entrega: deliveryDate,
        },
      ]);
    } else {
      props.setProductosAutorizados((prev) =>
        (Array.isArray(prev) ? prev : []).filter(
          (product) => product.idProducto !== props.producto._id
        )
      );
    }
  };

  // Save edited product info
  const handleSave = () => {
    props.setProductosAutorizados((prev) =>
      (Array.isArray(prev) ? prev : []).map((product) =>
        product.idProducto === props.producto._id
          ? {
              ...product,
              precio: price,
              cantidad: quantity,
              provedor: provider,
              fecha_promesa_entrega: deliveryDate,
            }
          : product
      )
    );
    setIsEditing(false);
  };

  // Handle edit action
  const handleEdit = () => {
    setIsEditing(true);
    if (!isChecked) {
      setIsChecked(true); // Activa el checkbox automáticamente al editar
    }
  };

  return (
    <tr className="border-b border-blue-gray-200 hover:bg-gray-100 h-9">
      <td className="p-2">{props.producto.codigo_interno}</td>
      <td class="whitespace-normal overflow-hidden text-ellipsis line-clamp-2">{props.producto.descripcion}</td>
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
        {props.statusId == undefined
        ? 
        <>
            <button className="mt-2" onClick={() => props.handleDeleteProducto(props.producto)}>
                <svg class="w-4 h-4 text-red-800  dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                </svg>
            </button>
        </>
        :
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
        <td className="text-center">
            {!isChecked ? (
            <p>{props.statusId == 1 ? "Sin fecha" : props.producto.fecha_promesa_entrega}</p>
            ) : isEditing || !deliveryDate ? (
            <input
                type="date"
                value={deliveryDate || today}
                onChange={handleDateChange}
                className="p-2 border rounded-md"
                min={today}
            />
            ) : (
            <p>{deliveryDate}</p>
            )}
        </td>
        <td className={props.statusId == 1 ? "flex items-center h-16" : "hidden"}>
            <input
                type="checkbox"
                className="w-4 h-4"
                checked={isChecked}
                onChange={handleCheckboxToggle}
            />
            <button className="flex w-24 items-center" onClick={isEditing ? handleSave : handleEdit}>
                <svg
                class="w-4 h-4 ml-2 mr-1 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.779 17.779 4.36 19.918 6.5 13.5m4.279 4.279 8.364-8.643a3.027 3.027 0 0 0-2.14-5.165 3.03 3.03 0 0 0-2.14.886L6.5 13.5m4.279 4.279L6.499 13.5m2.14 2.14 6.213-6.504M12.75 7.04 17 11.28"/>
                </svg>
            {isEditing ? "Guardar" : "Editar"}
            </button>
        </td>
        </>
        }
    </tr>
  );
}

export default TemplateProductTable;
