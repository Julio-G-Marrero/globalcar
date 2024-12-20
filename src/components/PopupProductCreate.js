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
    const [DESCRIPCION, setDESCRIPCION] = React.useState("")
    const [CODIGO_BARRAS, setCODIGO_BARRAS] = React.useState("")
    const [CODIGO_MAT, setCODIGO_MAT] = React.useState("")
    const [familia, setFamilia] = React.useState("")
    const [sub_familia, setSub_familia] = React.useState("")
    const [precio, setPrecio] = React.useState("")

    function handeOnChange(e) {
        if(e.target.id == "DESCRIPCION") {
            setDESCRIPCION(e.target.value)
        }else if(e.target.id == "CODIGO_BARRAS") {
            setCODIGO_BARRAS(e.target.value)
        }else if(e.target.id == "CODIGO_MAT") {
            setCODIGO_MAT(e.target.value)
        }else if(e.target.id == "familia") {
            setFamilia(e.target.value)
        }else if(e.target.id == "sub_familia") {
            setSub_familia(e.target.value)
        }else if(e.target.id == "precio") {
            setPrecio(e.target.value)
        }
    }

    function handleCleanForm() {
        setDESCRIPCION("")
        setCODIGO_BARRAS("")
        setCODIGO_MAT("")
        setFamilia("")
        setSub_familia("")
        setPrecio("")
    }

    function handleSubmit(e) {
        e.preventDefault()
        if(DESCRIPCION !== "" && CODIGO_BARRAS !== "" && CODIGO_MAT !== "" && familia !== "" && sub_familia !== ""  && precio !== ""){
            console.log('no eya vacio ')
            fetch(`${api.addressEndpoints}/products`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  'Authorization': `Bearer ${props.jwt}`,
                },
                body: JSON.stringify(
                    {
                        CODIGO_BARRAS: CODIGO_BARRAS,
                        CODIGO_MAT: CODIGO_MAT,
                        DESCRIPCION: DESCRIPCION,
                        precio: precio,
                        familia: familia,
                        sub_familia: sub_familia,
                    }
                ),
            })
            .then((response) => response.json())
            .then((data) => {
                if(data.CODIGO_BARRAS) {
                    Toast.fire({
                        icon: "success",
                        title: "Producto Agregado Correctamente"
                      });
                      handleCleanForm()
                      let producto = {
                        CODIGO_BARRAS: CODIGO_BARRAS,
                        CODIGO_MAT: CODIGO_MAT,
                        DESCRIPCION: DESCRIPCION,
                        precio: precio,
                        familia: familia,
                        sub_familia: sub_familia,
                      }
                      props.setProductos([...props.productos,producto])
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
                        <label for="DESCRIPCION" className="popup-create__input-name">DESCRIPCION</label>
                        <input type="text" id="DESCRIPCION" name="DESCRIPCION" className="popup-create__input"
                        value={DESCRIPCION}
                        onChange={handeOnChange}
                        />
                    </div>
                    <div className="clienteInfo popup-create__fieldset">
                        <div className="popup-create__margin">
                            <label for="CODIGO_BARRAS" className="popup-create__input--2">Codigo de barras</label>
                            <input type="text"  id="CODIGO_BARRAS" name="CODIGO_BARRAS" className="popup-create__input"
                            value={CODIGO_BARRAS}
                            onChange={handeOnChange}
                            />
                        </div>
                        <div className="popup-create__margin">
                            <label for="CODIGO_MAT" className="popup-create__input--2">Codigo Interno</label>
                            <input type="text" id="CODIGO_MAT" name="CODIGO_MAT" className="popup-create__input "
                            value={CODIGO_MAT}
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