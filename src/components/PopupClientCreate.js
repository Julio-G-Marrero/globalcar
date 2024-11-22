import React from "react";
import closeIcon from '../images/Close_Icon.png';
import api from "../utilis/api";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useHistory } from 'react-router'

function PopupClientCreate(props) {
    const [nombreCliente,SetNombreCliente] = React.useState("")
    const [direccionCliente,SetDireccionCliente] = React.useState("")
    const [telefonoCliente,SetTelefonoCliente] = React.useState("")
    const [emailCliente,SetEmailCliente] = React.useState("")

    const history = useHistory()

    const MySwal = withReactContent(Swal)
    const Toast = MySwal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = MySwal.stopTimer;
          toast.onmouseleave = MySwal.resumeTimer;
        }
    });

    function handleChange(e) {
        if(e.target.id === "nombreCliente"){
            SetNombreCliente(e.target.value)
        }else if(e.target.id === "direccionCliente"){
            SetDireccionCliente(e.target.value)
        }else if(e.target.id === "telefonoCliente"){
            SetTelefonoCliente(e.target.value)
        }else if(e.target.id === "emailCliente"){
            SetEmailCliente(e.target.value)
        }
    }

    function handleCleanForm() {
        SetNombreCliente("")
        SetDireccionCliente("")
        SetTelefonoCliente("")
        SetEmailCliente("")
    }

    function handleCreateClient(e) {
        e.preventDefault()
        if(nombreCliente == "" || direccionCliente == ""  || telefonoCliente == ""  || emailCliente == "" ) {
            Toast.fire({
                icon: "error",
                title: "Falta algun campo"
            });
        }else {
            fetch(`${api.addressEndpoints}/clients`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  'Authorization': `Bearer ${props.jwt}`,
                },
                body: JSON.stringify(
                    {
                        nombre: nombreCliente,
                        direccion: direccionCliente,
                        telefono: telefonoCliente,
                        email: emailCliente,
                    }
                ),
            })
            .then((response) => response.json())
            .then((data) => {
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
                            history.go(0)
                        } 
                      });
                }else {
                    console.log(data)
                    handleCleanForm()
                    props.closeAllPopups()
                    Toast.fire({
                        icon: "success",
                        title: "Agregado correctamente"
                    });
                }
            })
            .catch((err) => console.log(err));
        }
    }
    return(
        <>
            <div className={props.isOpenPopup ?"popup-create popup-create-product" : "popup-create popup-create-product hidden"}>
                <div className="popup-create__container">
                <h1 className="items-center text-2xl font-semibold text-gray-500 mt-1 mb-2">Agregar Cliente</h1>
                <form className="text-left">
                    <div className="popup-create__margin">
                        <label for="nombreCliente" className="popup-create__input-name">Nombre</label>
                        <input type="text" id="nombreCliente" name="nombreCliente" className="popup-create__input"
                        value={nombreCliente}
                        onChange={handleChange}
                        />
                    </div>
                    <div className="clienteInfo popup-create__fieldset">
                        <div className="popup-create__margin">
                            <label for="direccionCliente" className="popup-create__input--2">Dirección</label>
                            <input type="text"  id="direccionCliente" name="direccionCliente" className="popup-create__input"
                            value={direccionCliente}
                            onChange={handleChange}
                            />
                        </div>
                        <div className="popup-create__margin">
                            <label for="telefonoCliente" className="popup-create__input--2">Telefono</label>
                            <input type="text" id="telefonoCliente" name="telefonoCliente" className="popup-create__input "
                            value={telefonoCliente}
                            onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="clienteInfo popup-create__fieldset">
                        <div className="popup-create__margin">
                            <label for="emailCliente" className="popup-create__input--2">Email</label>
                            <input type="text"  id="emailCliente" name="emailCliente" className="popup-create__input"
                            value={emailCliente}
                            onChange={handleChange}
                            />
                        </div>
                    </div>
      
                    <button type="submit" className="mt-10 popup-create__buttonCreate bg-globalcar"
                    onClick={handleCreateClient}
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

export default PopupClientCreate