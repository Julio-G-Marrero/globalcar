import React from "react";
import logo from '../images/logo.png';
import { NavLink, useHistory } from 'react-router-dom';

function DashboardAside(props) {
    const history = useHistory();
    function signOut() {
        localStorage.removeItem('jwt');
        localStorage.removeItem('user-id');
        localStorage.removeItem('user-email');
        localStorage.removeItem('user-nombre');
        localStorage.removeItem('user-departament');
        props.setIsLoggedIn(false)
        history.push('/');
        // history.go(0);
    }
    console.log()
    return(
    <>
    <aside className="aside">
        <div className="aside__header">
            <div className="aside__top" >
                <div className="aside__info">
                    <img className="aside__logo" src={logo}/>
                    <h1 className="aside__title">BackOrders App</h1>
                </div>
            </div>
        </div>
        <div className="aside__container">
            <nav className="aside__nav">
                <NavLink activeClassName="globalcar-bg-button " to="/globalcar/dashboard">
                    <button id="dashboard"  className="aside__button--nav" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="aside__icon">
                        <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z"></path>
                        <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z"></path>
                    </svg>
                        <p className="aisde__title--button">dashboard</p>
                    </button>
                </NavLink>
                <NavLink activeClassName="globalcar-bg-button " to="/globalcar/products">
                    <button id="dashboard"  className="aside__button--nav" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="aside__icon">
                        <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z"></path>
                        <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z"></path>
                    </svg>
                        <p className="aisde__title--button">productos</p>
                    </button>
                </NavLink>
            </nav>

            <ul className="aside__list">
                <li>
                    <a className="">
                        <button className="aside__button--nav " type="button"
                        onClick={signOut}
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="aside__icon">
                            <path fill-rule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z" clip-rule="evenodd"></path>
                        </svg>
                        <p className="aisde__title--button">Cerrar Sesión</p>
                        </button>
                    </a>
                </li>
            </ul>
        </div>
    </aside>
    </>
    )
}

export default DashboardAside;