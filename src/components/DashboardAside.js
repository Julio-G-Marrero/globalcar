import React, { useState, useEffect } from "react";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import logo from "../images/logo.png";

function DashboardAside(props) {
    const history = useHistory();
    const location = useLocation();
    const [infoOpen, setInfoOpen] = useState(false);
    const [infoOpenTiendas, setInfoOpenTiendas] = useState(false);
    const [menuMobil, setMenuMobil] = useState(false);

    function signOut() {
        localStorage.removeItem("jwt");
        localStorage.removeItem("user-id");
        localStorage.removeItem("user-email");
        localStorage.removeItem("user-nombre");
        localStorage.removeItem("user-departament");
        props.setIsLoggedIn(false);
        history.push("/");
        history.go(0);
    }

    function handleOpenMenuBar() {
        setMenuMobil(!menuMobil)
    }
  
    useEffect(() => {
        if (location.pathname.startsWith("/products") || location.pathname.startsWith("/clients")) {
            setInfoOpen(true);
        }
        
    }, [location.pathname]);
    return (
        <>
            <div className="absolute left-2 lg:hidden">
                
                <button onClick={handleOpenMenuBar}>
                    {menuMobil 
                    ? 
                    <svg class="w-16 h-16 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
                    </svg>
                    :
                    <svg class="w-16 h-16 text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5 7h14M5 12h14M5 17h14"/>
                    </svg>
                    }
                </button>
            </div>
            <div>
                <div
                    className={`absolute top-10 left-0 text-white font-semibold shadow-lg rounded-md  transition-all duration-300 transform mt-8 globalcar-bg-aside w-11/12 h-full flex flex-col justify-between ${
                        menuMobil ? 'translate-x-0 opacity-100 z-50' : '-translate-x-full opacity-0 z-50'
                    }`}
                >
                    <div>
                        <div className="aside__header">
                            <div className="aside__top">
                                <div className="aside__info flex flex-row ">
                                    <img className="aside__logo w-28 mr-6 h-28" src={logo} alt="Logo" />
                                    <h1 className="aside__title text-2xl">BackOrders App</h1>
                                </div>
                            </div>
                        </div>
                        <ul className="py-2">
                            <NavLink activeClassName="globalcar-bg-button" to="/dashboard">
                                <button className="aside__button--nav" type="button">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        aria-hidden="true"
                                        className="aside__icon"
                                    >
                                        <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z"></path>
                                        <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z"></path>
                                    </svg>
                                    <p className="aisde__title--button text-xl">Dashboard</p>
                                </button>
                            </NavLink>                    
                        
                            <NavLink activeClassName="globalcar-bg-button" to="/informes">
                                <button className="aside__button--nav" type="button">
                                    <svg
                                        className="aside__icon"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M9 7V2.221a2 2 0 0 0-.5.365L4.586 6.5a2 2 0 0 0-.365.5H9Zm2 0V2h7a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9h5a2 2 0 0 0 2-2Zm-1 9a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0v-2Zm2-5a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1Zm4 4a1 1 0 1 0-2 0v3a1 1 0 1 0 2 0v-3Z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <p className="aisde__title--button text-xl">Informes</p>
                                </button>
                            </NavLink>
                            {/* <div>
                                <button
                                    className="aside__button--nav flex justify-between items-center"
                                    type="button"
                                    onClick={() => setInfoOpen(!infoOpen)}
                                >
                                    <div className="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="aside__icon"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path d="M12 4a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h8zm6 0a2 2 0 012 2v12a2 2 0 01-2 2h-2V4h2z"></path>
                                        </svg>
                                        <p className="aisde__title--button ml-4 text-xl">Información</p>
                                    </div>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`transition-transform transform ${infoOpen ? "rotate-180" : ""} w-5 h-5`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                                {infoOpen && (
                                    <div className="ml-4">
                                        <NavLink activeClassName="globalcar-bg-button" to="/products">
                                            <button className="aside__button--nav" type="button">
                                                <svg
                                                    className="aside__icon"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M8 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1h2a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2Zm6 1h-4v2H9a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2h-1V4Zm-3 8a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 1-1Zm-2-1a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H9Zm2 5a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Zm-2-1a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H9Z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                <p className="aisde__title--button text-xl">Productos</p>
                                            </button>
                                        </NavLink>
                                        <NavLink activeClassName="globalcar-bg-button mt-2" to="/clients">
                                            <button className="aside__button--nav" type="button">
                                                <svg
                                                    className="aside__icon"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M12 6a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm-1.5 8a4 4 0 0 0-4 4 2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-3Z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                <p className="aisde__title--button text-xl">Clientes</p>
                                            </button>
                                        </NavLink>
                                    </div>
                                )}
                                <div className="hidden">
                                    <button
                                        className="aside__button--nav flex justify-between items-center"
                                        type="button"
                                        onClick={() => setInfoOpenTiendas(!infoOpenTiendas)}
                                    >
                                        <div className="flex items-center">
                                            <svg class="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                            <path fill-rule="evenodd" d="M8 5a1 1 0 0 1 1-1h11a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-1a1 1 0 1 1 0-2h1V6H9a1 1 0 0 1-1-1Z" clip-rule="evenodd"/>
                                            <path fill-rule="evenodd" d="M4 7a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H4Zm0 11v-5.5h11V18H4Z" clip-rule="evenodd"/>
                                            </svg>

                                            <p className="aisde__title--button ml-4 text-xl">Tiendas Online</p>
                                        </div>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`transition-transform transform ${infoOpenTiendas ? "rotate-180" : ""} w-5 h-5`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                    {infoOpenTiendas && (
                                        <div className="ml-4">
                                            <NavLink activeClassName="globalcar-bg-button" to="/tiendas/ingco">
                                                <button className="aside__button--nav" type="button">
                                                    <svg class="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12c.263 0 .524-.06.767-.175a2 2 0 0 0 .65-.491c.186-.21.333-.46.433-.734.1-.274.15-.568.15-.864a2.4 2.4 0 0 0 .586 1.591c.375.422.884.659 1.414.659.53 0 1.04-.237 1.414-.659A2.4 2.4 0 0 0 12 9.736a2.4 2.4 0 0 0 .586 1.591c.375.422.884.659 1.414.659.53 0 1.04-.237 1.414-.659A2.4 2.4 0 0 0 16 9.736c0 .295.052.588.152.861s.248.521.434.73a2 2 0 0 0 .649.488 1.809 1.809 0 0 0 1.53 0 2.03 2.03 0 0 0 .65-.488c.185-.209.332-.457.433-.73.1-.273.152-.566.152-.861 0-.974-1.108-3.85-1.618-5.121A.983.983 0 0 0 17.466 4H6.456a.986.986 0 0 0-.93.645C5.045 5.962 4 8.905 4 9.736c.023.59.241 1.148.611 1.567.37.418.865.667 1.389.697Zm0 0c.328 0 .651-.091.94-.266A2.1 2.1 0 0 0 7.66 11h.681a2.1 2.1 0 0 0 .718.734c.29.175.613.266.942.266.328 0 .651-.091.94-.266.29-.174.537-.427.719-.734h.681a2.1 2.1 0 0 0 .719.734c.289.175.612.266.94.266.329 0 .652-.091.942-.266.29-.174.536-.427.718-.734h.681c.183.307.43.56.719.734.29.174.613.266.941.266a1.819 1.819 0 0 0 1.06-.351M6 12a1.766 1.766 0 0 1-1.163-.476M5 12v7a1 1 0 0 0 1 1h2v-5h3v5h7a1 1 0 0 0 1-1v-7m-5 3v2h2v-2h-2Z"/>
                                                    </svg>
                                                    <p className="aisde__title--button text-xl">Ingco.lat</p>
                                                </button>
                                            </NavLink>
                                            <NavLink activeClassName="globalcar-bg-button mt-2" to="/clients">
                                                <button className="aside__button--nav" type="button">
                                                    <svg class="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12c.263 0 .524-.06.767-.175a2 2 0 0 0 .65-.491c.186-.21.333-.46.433-.734.1-.274.15-.568.15-.864a2.4 2.4 0 0 0 .586 1.591c.375.422.884.659 1.414.659.53 0 1.04-.237 1.414-.659A2.4 2.4 0 0 0 12 9.736a2.4 2.4 0 0 0 .586 1.591c.375.422.884.659 1.414.659.53 0 1.04-.237 1.414-.659A2.4 2.4 0 0 0 16 9.736c0 .295.052.588.152.861s.248.521.434.73a2 2 0 0 0 .649.488 1.809 1.809 0 0 0 1.53 0 2.03 2.03 0 0 0 .65-.488c.185-.209.332-.457.433-.73.1-.273.152-.566.152-.861 0-.974-1.108-3.85-1.618-5.121A.983.983 0 0 0 17.466 4H6.456a.986.986 0 0 0-.93.645C5.045 5.962 4 8.905 4 9.736c.023.59.241 1.148.611 1.567.37.418.865.667 1.389.697Zm0 0c.328 0 .651-.091.94-.266A2.1 2.1 0 0 0 7.66 11h.681a2.1 2.1 0 0 0 .718.734c.29.175.613.266.942.266.328 0 .651-.091.94-.266.29-.174.537-.427.719-.734h.681a2.1 2.1 0 0 0 .719.734c.289.175.612.266.94.266.329 0 .652-.091.942-.266.29-.174.536-.427.718-.734h.681c.183.307.43.56.719.734.29.174.613.266.941.266a1.819 1.819 0 0 0 1.06-.351M6 12a1.766 1.766 0 0 1-1.163-.476M5 12v7a1 1 0 0 0 1 1h2v-5h3v5h7a1 1 0 0 0 1-1v-7m-5 3v2h2v-2h-2Z"/>
                                                    </svg>
                                                    <p className="aisde__title--button text-xl">Clientes</p>
                                                </button>
                                            </NavLink>
                                        </div>
                                    )}
                                </div>
                            </div> */}
                        </ul>
                    </div>
                    <ul className="aside__list">
                        <li>
                            <a className="">
                                <button
                                    className="aside__button--nav"
                                    type="button"
                                    onClick={signOut}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        aria-hidden="true"
                                        className="aside__icon"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <p className="aisde__title--button">Cerrar Sesión</p>
                                </button>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <aside className="aside max-lg:hidden ">
                <div className="aside__header">
                    <div className="aside__top">
                        <div className="aside__info">
                            <img className="aside__logo" src={logo} alt="Logo" />
                            <h1 className="aside__title">BackOrders App</h1>
                        </div>
                    </div>
                </div>
                <div className="aside__container">
                    <nav className="aside__nav">
                        {/* Dashboard */}
                        <NavLink activeClassName="globalcar-bg-button" to="/dashboard">
                            <button className="aside__button--nav" type="button">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    aria-hidden="true"
                                    className="aside__icon"
                                >
                                    <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z"></path>
                                    <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z"></path>
                                </svg>
                                <p className="aisde__title--button">Dashboard</p>
                            </button>
                        </NavLink>

                        
                        {/* Informes */}
                        <NavLink activeClassName="globalcar-bg-button" to="/informes">
                            <button className="aside__button--nav" type="button">
                                <svg
                                    className="aside__icon"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M9 7V2.221a2 2 0 0 0-.5.365L4.586 6.5a2 2 0 0 0-.365.5H9Zm2 0V2h7a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9h5a2 2 0 0 0 2-2Zm-1 9a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0v-2Zm2-5a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1Zm4 4a1 1 0 1 0-2 0v3a1 1 0 1 0 2 0v-3Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <p className="aisde__title--button">Informes</p>
                            </button>
                        </NavLink>

                        {/* Información Desktop*/}
                        {/* <div>
                            <button
                                className="aside__button--nav flex justify-between items-center"
                                type="button"
                                onClick={() => setInfoOpen(!infoOpen)}
                            >
                                <div className="flex items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="aside__icon"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path d="M12 4a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h8zm6 0a2 2 0 012 2v12a2 2 0 01-2 2h-2V4h2z"></path>
                                    </svg>
                                    <p className="aisde__title--button">Información</p>
                                </div>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`transition-transform transform ${infoOpen ? "rotate-180" : ""} w-5 h-5`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                            {infoOpen && (
                                <div className="ml-4">
                                    <NavLink activeClassName="globalcar-bg-button" to="/products">
                                        <button className="aside__button--nav" type="button">
                                            <svg
                                                className="aside__icon"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M8 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1h2a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2Zm6 1h-4v2H9a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2h-1V4Zm-3 8a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 1-1Zm-2-1a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H9Zm2 5a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Zm-2-1a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H9Z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            <p className="aisde__title--button">Productos</p>
                                        </button>
                                    </NavLink>
                                    <NavLink activeClassName="globalcar-bg-button mt-2" to="/clients">
                                        <button className="aside__button--nav" type="button">
                                            <svg
                                                className="aside__icon"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M12 6a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm-1.5 8a4 4 0 0 0-4 4 2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-3Z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            <p className="aisde__title--button">Clientes</p>
                                        </button>
                                    </NavLink>
                                </div>
                            )}
                        </div> */}
                        <div className="hidden">
                            < button
                                className="aside__button--nav flex justify-between items-center"
                                type="button"
                                onClick={() => setInfoOpenTiendas(!infoOpenTiendas)}
                            >
                                <div className="flex items-center">
                                    <svg class="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path fill-rule="evenodd" d="M8 5a1 1 0 0 1 1-1h11a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-1a1 1 0 1 1 0-2h1V6H9a1 1 0 0 1-1-1Z" clip-rule="evenodd"/>
                                    <path fill-rule="evenodd" d="M4 7a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H4Zm0 11v-5.5h11V18H4Z" clip-rule="evenodd"/>
                                    </svg>

                                    <p className="aisde__title--button">Tiendas Online</p>
                                </div>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`transition-transform transform ${infoOpenTiendas ? "rotate-180" : ""} w-5 h-5`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                            {infoOpenTiendas && (
                                <div className="ml-4">
                                    <NavLink activeClassName="globalcar-bg-button" to="/tiendas/ingco">
                                        <button className="aside__button--nav" type="button">
                                            <svg class="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12c.263 0 .524-.06.767-.175a2 2 0 0 0 .65-.491c.186-.21.333-.46.433-.734.1-.274.15-.568.15-.864a2.4 2.4 0 0 0 .586 1.591c.375.422.884.659 1.414.659.53 0 1.04-.237 1.414-.659A2.4 2.4 0 0 0 12 9.736a2.4 2.4 0 0 0 .586 1.591c.375.422.884.659 1.414.659.53 0 1.04-.237 1.414-.659A2.4 2.4 0 0 0 16 9.736c0 .295.052.588.152.861s.248.521.434.73a2 2 0 0 0 .649.488 1.809 1.809 0 0 0 1.53 0 2.03 2.03 0 0 0 .65-.488c.185-.209.332-.457.433-.73.1-.273.152-.566.152-.861 0-.974-1.108-3.85-1.618-5.121A.983.983 0 0 0 17.466 4H6.456a.986.986 0 0 0-.93.645C5.045 5.962 4 8.905 4 9.736c.023.59.241 1.148.611 1.567.37.418.865.667 1.389.697Zm0 0c.328 0 .651-.091.94-.266A2.1 2.1 0 0 0 7.66 11h.681a2.1 2.1 0 0 0 .718.734c.29.175.613.266.942.266.328 0 .651-.091.94-.266.29-.174.537-.427.719-.734h.681a2.1 2.1 0 0 0 .719.734c.289.175.612.266.94.266.329 0 .652-.091.942-.266.29-.174.536-.427.718-.734h.681c.183.307.43.56.719.734.29.174.613.266.941.266a1.819 1.819 0 0 0 1.06-.351M6 12a1.766 1.766 0 0 1-1.163-.476M5 12v7a1 1 0 0 0 1 1h2v-5h3v5h7a1 1 0 0 0 1-1v-7m-5 3v2h2v-2h-2Z"/>
                                            </svg>
                                            <p className="aisde__title--button">Ingco.lat</p>
                                        </button>
                                    </NavLink>
                                    <NavLink activeClassName="globalcar-bg-button mt-2" to="/almacen/gestion-inventario">
                                        <button className="aside__button--nav" type="button">
                                            <svg class="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12c.263 0 .524-.06.767-.175a2 2 0 0 0 .65-.491c.186-.21.333-.46.433-.734.1-.274.15-.568.15-.864a2.4 2.4 0 0 0 .586 1.591c.375.422.884.659 1.414.659.53 0 1.04-.237 1.414-.659A2.4 2.4 0 0 0 12 9.736a2.4 2.4 0 0 0 .586 1.591c.375.422.884.659 1.414.659.53 0 1.04-.237 1.414-.659A2.4 2.4 0 0 0 16 9.736c0 .295.052.588.152.861s.248.521.434.73a2 2 0 0 0 .649.488 1.809 1.809 0 0 0 1.53 0 2.03 2.03 0 0 0 .65-.488c.185-.209.332-.457.433-.73.1-.273.152-.566.152-.861 0-.974-1.108-3.85-1.618-5.121A.983.983 0 0 0 17.466 4H6.456a.986.986 0 0 0-.93.645C5.045 5.962 4 8.905 4 9.736c.023.59.241 1.148.611 1.567.37.418.865.667 1.389.697Zm0 0c.328 0 .651-.091.94-.266A2.1 2.1 0 0 0 7.66 11h.681a2.1 2.1 0 0 0 .718.734c.29.175.613.266.942.266.328 0 .651-.091.94-.266.29-.174.537-.427.719-.734h.681a2.1 2.1 0 0 0 .719.734c.289.175.612.266.94.266.329 0 .652-.091.942-.266.29-.174.536-.427.718-.734h.681c.183.307.43.56.719.734.29.174.613.266.941.266a1.819 1.819 0 0 0 1.06-.351M6 12a1.766 1.766 0 0 1-1.163-.476M5 12v7a1 1 0 0 0 1 1h2v-5h3v5h7a1 1 0 0 0 1-1v-7m-5 3v2h2v-2h-2Z"/>
                                            </svg>
                                            <p className="aisde__title--button">Global</p>
                                        </button>
                                    </NavLink>
                                </div>
                            )}
                        </div>
                    </nav>

                    <ul className="aside__list">
                        <li>
                            <a className="">
                                <button
                                    className="aside__button--nav"
                                    type="button"
                                    onClick={signOut}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        aria-hidden="true"
                                        className="aside__icon"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <p className="aisde__title--button">Cerrar Sesión</p>
                                </button>
                            </a>
                        </li>
                    </ul>
                </div>
            </aside>
        </>
    );
}

export default DashboardAside;
