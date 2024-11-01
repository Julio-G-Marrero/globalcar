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
                if(data.token){
                    Toast.fire({
                        icon: "success",
                        title: "Incio de sesión exitoso"
                      });
                        setTimeout(() => {
                            props.setIsLoggedIn(true)
                            history.push('/globalcar/dashboard')
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
        history.push('/globalcar/register')
        history.go(0)
    }
    const handleChange = (event) => {
        const { name,value } = event.target;
        setValues({... values, [name]: value})
    }
    return(
        <>
            <div className="login">
                <div className="login__container">
                    <div className="login__header">
                        <img className="login__logo" src={logo}/>
                    </div>
                    <div className="login__form">
                    <div className="login__inputs">
                        <div className="label-from">
                            <label className="login__labels">E-mail</label>
                            <input type="text" name="email" value={values.email} onChange={handleChange} id="email-auth" className="login__input" />
                        </div>
                        <div className="label-from">
                            <label className="login__labels">Contraseña</label>
                            <input type="password" name="password" value={values.password} onChange={handleChange}  id="password-auth" className="login__input" />
                        </div>
                        <button type="button" className=" bg-globalcar login__submit"
                        onClick={handleSubmit}
                        >
                            <span className="inline-block mr-2">Inicar Sesión</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="login__svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>
                    </div>
                    <div className="login__links">
                        <div className="login__link">
                            <div className="login__link--comtainer">
                                    <Link onClick={handleRedirect} to="/globalcar/register" className="login__linTitle">
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