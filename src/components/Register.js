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
        history.push('globalcar/')
        // history.go(0)
    }
    return(
        <>
            <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
                <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
                    <div className="flex justify-center mb-4">
                        <img className="w-3/12" src={logo}/>
                    </div>
                    <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
                    <div className="px-5 py-7">
                        <div className="label-from">
                            <label className="font-semibold text-sm text-gray-600 pb-1 block">Nombre</label>
                            <input name="username" value={values.username} onChange={handleChange} type="text" id="email-auth" className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full" />
                        </div>
                        <div className="label-from">
                            <label className="font-semibold text-sm text-gray-600 pb-1 block">E-mail</label>
                            <input name="email" value={values.email} onChange={handleChange}  type="text" id="password-auth" className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full" />
                        </div>
                        <div className="label-from">
                            <label className="font-semibold text-sm text-gray-600 pb-1 block">Contraseña</label>
                            <input name="password" value={values.password} onChange={handleChange}  type="password" id="password-auth" className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full" />
                        </div>
                        <div className="label-from">
                            <label className="font-semibold text-sm text-gray-600 pb-1 block">Confirmar Contraseña</label>
                            <input name="confirmPassword" value={values.confirmPassword} onChange={handleChange}  type="password" id="password-auth" className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full" />
                        </div>
                        <button type="button" className="transition duration-200 background-globalcar hover:bg-sky-950 focus:bg-sky-950 focus:shadow-sm bg-globalcar text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
                        onClick={handleSubmit}
                        >
                            <span className="inline-block mr-2">Registrarse</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 inline-block">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>
                    </div>
                    <div className="py-5">
                        <div className="grid justify-center gap-1">
                            <div className="text-center sm:text-left whitespace-nowrap">
                                        <Link onClick={handleRedirect} to="/" lassName="inline-block ml-1">
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