import React from "react";
import logo from '../images/logo.png';
import * as auth from "../utilis/auth";
import { useHistory } from 'react-router'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Link } from "react-router-dom";

function Login(props) {
    const MySwal = withReactContent(Swal)
    const history = useHistory()
    const Toast = MySwal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = MySwal.stopTimer;
          toast.onmouseleave = MySwal.resumeTimer;
        }
    });
    React.useEffect(() => {
        tokenCheck()
      },[])
    function tokenCheck() {
        if (props.jwt) {
            // history.push('/dashboard')
            // history.go(0)
        }
    }

    const [values, setValues] = React.useState({
        email:'',
        password:'',
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        if(values.email && values.password) {
            auth.authorize(values)
            .then((data) => {
                console.log(data)
                if(data.token){
                    Toast.fire({
                        icon: "success",
                        title: "Incio de sesión exitoso"
                      });
                       props.setIsLoggedIn(true)
                        setTimeout(() => {
                            history.push('/globalcar/')
                            // history.go(0)
                        }, "1500");
                }else if(data.error) {
                    Toast.fire({
                        icon: "error",
                        title: data.error
                      });
                }
            }).catch(err => console.log(err));
        }
    }
    function handleRedirect() {
        history.push('/globalcar/register')
        // history.go(0)
    }
    const handleChange = (event) => {
        const { name,value } = event.target;
        setValues({... values, [name]: value})
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
                            <label className="font-semibold text-sm text-gray-600 pb-1 block">E-mail</label>
                            <input type="text" name="email" value={values.email} onChange={handleChange} id="email-auth" className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full" />
                        </div>
                        <div className="label-from">
                            <label className="font-semibold text-sm text-gray-600 pb-1 block">Contraseña</label>
                            <input type="password" name="password" value={values.password} onChange={handleChange}  id="password-auth" className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full" />
                        </div>
                        <button type="button" className="transition duration-200 background-globalcar hover:bg-sky-950 focus:bg-sky-950 focus:shadow-sm bg-globalcar text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
                        onClick={handleSubmit}
                        >
                            <span className="inline-block mr-2">Inicar Sesión</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 inline-block">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>
                    </div>
                    <div className="py-5">
                        <div className="grid justify-center gap-1">
                            <div className="text-center sm:text-left whitespace-nowrap">
                                    <Link onClick={handleRedirect} to="/globalcar/register" lassName="inline-block ml-1">
                                        ¿Aún no tienes una cuneta? Registrate
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

export default Login;