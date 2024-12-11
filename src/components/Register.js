import React from "react";
import logo from '../images/logo.png';
import { Link } from "react-router-dom";
import * as auth from "../utilis/auth";
import { useHistory } from 'react-router';
import bgBodega from '../images/bgBodega.jpg';

function Register() {
    const history = useHistory();
    const [showPassword, setShowPassword] = React.useState(false);

    const [values, setValues] = React.useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    function CleanForm() {
        setValues({
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (values.username && values.email && values.password && values.password === values.confirmPassword) {
            auth.register(values);
            CleanForm();
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues({ ...values, [name]: value });
    };

    function handleRedirect() {
        history.push('/');
        history.go(0);
    }

    return (
        <div className="font-[sans-serif]">
            <div className="min-h-screen flex flex-col items-center justify-center">
                <div className="grid md:grid-cols-2 items-center gap-4 max-md:gap-8 max-w-6xl max-md:max-w-lg w-full m-4 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md">
                    <div className="md:max-w-md w-full px-8 py-8 lg:ml-14 lg:mt-4 lg:mb-4">
                        <form onSubmit={handleSubmit}>
                            <div className="login__header">
                                <img className="login__logo w-16 h-16" src={logo} alt="Logo" />
                            </div>
                            <div className="mb-12">
                                <h3 className="text-gray-800 text-3xl font-extrabold">Regístrate</h3>
                            </div>
                            <div>
                                <label className="text-gray-800 text-xs block mb-2">Nombre</label>
                                <div className="relative flex items-center">
                                    <input
                                        name="username"
                                        type="text"
                                        required
                                        className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                                        placeholder="Ingresa tu Nombre"
                                        value={values.username}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="mt-8">
                                <label className="text-gray-800 text-xs block mb-2">Email</label>
                                <div className="relative flex items-center">
                                    <input
                                        name="email"
                                        value={values.email}
                                        onChange={handleChange}
                                        type="email"
                                        required
                                        className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                                        placeholder="Ingresa tu Email"
                                    />
                                </div>
                            </div>
                            <div className="mt-8">
                                <label className="text-gray-800 text-xs block mb-2">Password</label>
                                <div className="relative flex items-center">
                                    <input
                                        name="password"
                                        required
                                        className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                                        placeholder="Enter password"
                                        value={values.password}
                                        type={showPassword ? 'text' : 'password'}
                                        onChange={handleChange}
                                    />
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
                            <div className="mt-8">
                                <label className="text-gray-800 text-xs block mb-2">Confirmar Password</label>
                                <div className="relative flex items-center">
                                    <input
                                        name="confirmPassword"
                                        required
                                        className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                                        placeholder="Confirm password"
                                        value={values.confirmPassword}
                                        type={showPassword ? 'text' : 'password'}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
                                <div>
                                    <Link onClick={handleRedirect} to="/" className="font-semibold text-blue-600 login__linTitle">
                                        ¿Ya tienes una cuenta? Inicia sesión
                                    </Link>
                                </div>
                            </div>
                            <div className="mt-12">
                                <button
                                    type="submit"
                                    className="w-full shadow-xl py-2.5 px-4 text-sm tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                                >
                                    Regístrate
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="md:h-full rounded-xl">
                        <img src={bgBodega} className="w-full h-full object-cover" alt="login-image" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
