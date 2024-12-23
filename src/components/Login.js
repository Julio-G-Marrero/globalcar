import React from "react";
import logo from '../images/logo.png';
import bgBodega from '../images/bgBodega.jpg';
import * as auth from "../utilis/auth";
import { useHistory } from 'react-router'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Link } from "react-router-dom";

function Login(props) {
    const history = useHistory()
    const MySwal = withReactContent(Swal)
    const [showPassword, setShowPassword] = React.useState(false);

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
                if(data.token){
                    Toast.fire({
                        icon: "success",
                        title: "Incio de sesión exitoso"
                      });
                        setTimeout(() => {
                            props.setIsLoggedIn(true)
                            history.push('/dashboard')
                            history.go(0)
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
        history.push('/register')
        history.go(0)
    }
    const handleChange = (event) => {
        const { name,value } = event.target;
        setValues({... values, [name]: value})
    }
    return(
        <>
        <div class="font-[sans-serif]">
            <div class="min-h-screen flex flex-col items-center justify-center">
                <div class="grid md:grid-cols-2 items-center gap-4 max-md:gap-8 max-w-6xl max-md:max-w-lg w-full  m-4 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md">
                <div class="md:max-w-md w-full px-8 py-8 lg:ml-14 lg:mt-4 lg:mb-4">
                    <form onSubmit={handleSubmit}>
                    <div className="login__header">
                        <img className="login__logo w-16 h-16" src={logo}/>
                    </div>
                    <div class="mb-12">
                        <h3 class="text-gray-800 text-3xl font-extrabold">Inicia Sesión</h3>
                    </div>
                    <div>
                        <label class="text-gray-800 text-xs block mb-2">Email</label>
                        <div class="relative flex items-center">
                            <input name="email" type="text" required class="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none bg-color-app" placeholder="Enter email" 
                            value={values.email}
                            onChange={handleChange}
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" class="w-[18px] h-[18px] absolute right-2" viewBox="0 0 682.667 682.667">
                                <defs>
                                <clipPath id="a" clipPathUnits="userSpaceOnUse">
                                    <path d="M0 512h512V0H0Z" data-original="#000000"></path>
                                </clipPath>
                                </defs>
                                <g clip-path="url(#a)" transform="matrix(1.33 0 0 -1.33 0 682.667)">
                                <path fill="none" stroke-miterlimit="10" stroke-width="40" d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z" data-original="#000000"></path>
                                <path d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z" data-original="#000000"></path>
                                </g>
                            </svg>
                        </div>
                    </div>

                    <div class="mt-8">
                        <label class="text-gray-800 text-xs block mb-2">Password</label>
                        <div class="relative flex items-center">
                        <input name="password" required class="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none bg-color-app" placeholder="Enter password" 
                        value={values.password}
                        type={showPassword ? 'text' : 'password'}
                        onChange={handleChange}/>
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                            {showPassword ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 012.869-4.293m1.424-1.52A9.935 9.935 0 0112 5c4.478 0 8.268 2.943 9.542 7-.456 1.455-1.218 2.79-2.176 3.932m-1.426 1.517A9.935 9.935 0 0112 19a9.935 9.935 0 01-4.294-1.293m4.293-5.207a3 3 0 110-6 3 3 0 010 6z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.232 15.232l-6.464-6.464"
                                    />
                                </svg>
                            )}
                        </button>
                        </div>
                    </div>
                    <div class="flex flex-wrap items-center justify-between gap-4 mt-6">
                        <div>
                        <Link onClick={handleRedirect} to="/register" className="font-semibold text-blue-600 login__linTitle">
                            ¿Aún no tienes una cuneta? Registrate
                        </Link>
                        </div>
                    </div>

                    <div class="mt-12">
                        <button  
                        type="submit" class="w-full shadow-xl py-2.5 px-4 text-sm tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                        onClick={handleSubmit}
                        >
                        Iniciar Sesión
                        </button>
                    </div>
                    </form>
                </div>

                <div class="md:h-full  rounded-xl ">
                    <img src={bgBodega} class="w-full h-full object-cover" alt="login-image" />
                </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Login;