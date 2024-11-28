import React from "react";
import logo from '../images/logo.png';
import { Link } from "react-router-dom";
import * as auth from "../utilis/auth";
import { useHistory } from 'react-router'

function Register() {
    const history = useHistory()

    const [values, setValues] = React.useState({
        username:'',
        email:'',
        password:'',
        confirmPassword:''
    })

    function CleanForm() {
        setValues({
            username:'',
            email:'',
            password:'',
            confirmPassword:''
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(values.username && values.email && values.password &&  values.password === values.confirmPassword) {
            auth.register(values)
            CleanForm()
        }
    }

    const handleChange = (event) => {
        const { name,value } = event.target;
        setValues({... values, [name]: value})
    }

    function handleRedirect() {
        history.push('/')
        history.go(0)
    }
    return(
        <>
            <div className="register">
                <div className="register__container">
                    <div className="register__header">
                        <img className="register__logo" src={logo}/>
                    </div>
                    <div className="register__form">
                        <div className="register__form--container">
                            <div className="register__labelForm">
                                <label className="register__label">Nombre</label>
                                <input name="username" value={values.username} onChange={handleChange} type="text" id="email-auth" className="register__input" />
                            </div>
                            <div className="register__labelForm">
                                <label className="register__label">E-mail</label>
                                <input name="email" value={values.email} onChange={handleChange}  type="text" id="password-auth" className="register__input" />
                            </div>
                            <div className="register__labelForm">
                                <label className="register__label">Contraseña</label>
                                <input name="password" value={values.password} onChange={handleChange}  type="password" id="password-auth" className="register__input" />
                            </div>
                            <div className="register__labelForm">
                                <label className="register__label">Confirmar Contraseña</label>
                                <input name="confirmPassword" value={values.confirmPassword} onChange={handleChange}  type="password" id="password-auth" className="register__input" />
                            </div>
                            <button type="button" className="register__button bg-globalcar"
                            onClick={handleSubmit}
                            >
                                <span className="register__tittle ">Registrarse</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="register__svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </button>
                        </div>
                        <div className="py-5">
                            <div className="register__links">
                                <div className="register__link">
                                    <Link onClick={handleRedirect} to="/globalcar/" className="inline-block ml-1">
                                        ¿Ya tienes cuneta? Inicia Sesión
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>         
        </>
    )
}

export default Register;