import React from "react";
import closeIcon from '../images/Close_Icon.png';
import api from "../utilis/api";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
function PopupProductCreate(props) {
    const MySwal = withReactContent(Swal)
    const Toast = MySwal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = MySwal.stopTimer;
          toast.onmouseleave = MySwal.resumeTimer;
        }
    });
    const [descripcion, setDescripcion] = React.useState("")
    const [codigo_barras, setCodigo_barras] = React.useState("")
    const [codigo_interno, setCodigo_interno] = React.useState("")
    const [familia, setFamilia] = React.useState("")
    const [sub_familia, setSub_familia] = React.useState("")
    const [precio, setPrecio] = React.useState("")

    function handeOnChange(e) {
        if(e.target.id == "descripcion") {
            setDescripcion(e.target.value)
        }else if(e.target.id == "codigo_barras") {
            setCodigo_barras(e.target.value)
        }else if(e.target.id == "codigo_interno") {
            setCodigo_interno(e.target.value)
        }else if(e.target.id == "familia") {
            setFamilia(e.target.value)
        }else if(e.target.id == "sub_familia") {
            setSub_familia(e.target.value)
        }else if(e.target.id == "precio") {
            setPrecio(e.target.value)
        }
    }

    function handleCleanForm() {
        setDescripcion("")
        setCodigo_barras("")
        setCodigo_interno("")
        setFamilia("")
        setSub_familia("")
        setPrecio("")
    }

    function handleSubmit(e) {
        e.preventDefault()
        if(descripcion !== "" && codigo_barras !== "" && codigo_interno !== "" && familia !== "" && sub_familia !== ""  && precio !== ""){
            console.log('no eya vacio ')
            fetch(`${api.addressEndpoints}/products`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  'Authorization': `Bearer ${props.jwt}`,
                },
                body: JSON.stringify(
                    {
                        codigo_barras: codigo_barras,
                        codigo_interno: codigo_interno,
                        descripcion: descripcion,
                        precio: precio,
                        familia: familia,
                        sub_familia: sub_familia,
                    }
                ),
            })
            .then((response) => response.json())
            .then((data) => {
                if(data.codigo_barras) {
                    Toast.fire({
                        icon: "success",
                        title: "Producto Agregado Correctamente"
                      });
                      handleCleanForm()
                      let producto = {
                        codigo_barras: codigo_barras,
                        codigo_interno: codigo_interno,
                        descripcion: descripcion,
                        precio: precio,
                        familia: familia,
                        sub_familia: sub_familia,
                      }
                      props.setProductos([...props.productos,producto])
                      console.log(props.productos)
                }else {
                    Toast.fire({
                        icon: "error",
                        title: "Ocurrio un error, contacte con soporte"
                      });
                }
            })
            .catch((err) => console.log(err));
        }else {
            Toast.fire({
                icon: "error",
                title: "Hay algun campo vacío"
              });
        }
   
    }

    return(
        <>
            <div className={props.isOpenPopup ?"popup-create popup-create-product" : "popup-create popup-create-product hidden"}>
                <div className="popup-create__container">
                <h1 className="items-center text-2xl font-semibold text-gray-500 mt-1 mb-2">Agregar Producto</h1>
                <form className="text-left">
                    <div className="popup-create__margin">
                        <label for="descripcion" className="popup-create__input-name">Descripcion</label>
                        <input type="text" id="descripcion" name="descripcion" className="popup-create__input"
                        value={descripcion}
                        onChange={handeOnChange}
                        />
                    </div>
                    <div className="clienteInfo popup-create__fieldset">
                        <div className="popup-create__margin">
                            <label for="codigo_barras" className="popup-create__input--2">Codigo de barras</label>
                            <input type="text"  id="codigo_barras" name="codigo_barras" className="popup-create__input"
                            value={codigo_barras}
                            onChange={handeOnChange}
                            />
                        </div>
                        <div className="popup-create__margin">
                            <label for="codigo_interno" className="popup-create__input--2">Codigo Interno</label>
                            <input type="text" id="codigo_interno" name="codigo_interno" className="popup-create__input "
                            value={codigo_interno}
                            onChange={handeOnChange}
                            />
                        </div>
                    </div>
                    <div className="clienteInfo popup-create__fieldset">
                        <div className="popup-create__margin">
                            <label for="familia" className="popup-create__input--2">Familia</label>
                            <input type="text"  id="familia" name="familia" className="popup-create__input"
                            value={familia}
                            onChange={handeOnChange}
                            />
                        </div>
                        <div className="popup-create__margin">
                            <label for="sub_familia" className="popup-create__input--2">Sub Familia</label>
                            <input type="text" id="sub_familia" name="sub_familia" className="popup-create__input "
                            value={sub_familia}
                            onChange={handeOnChange}
                            />
                        </div>
                    </div>
                    <div className="clienteInfo popup-create__fieldset">
                        <div className="popup-create__margin">
                            <label for="precio" className="popup-create__input--2">Precio</label>
                            <input type="text"  id="precio" name="precio" className="popup-create__input"
                            value={precio}
                            onChange={handeOnChange}/>
                        </div>
                    </div>
      
                    <button type="submit" className="mt-10 popup-create__buttonCreate bg-globalcar"
                    onClick={handleSubmit}
                    >Agregar</button>
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

export default PopupProductCreate;