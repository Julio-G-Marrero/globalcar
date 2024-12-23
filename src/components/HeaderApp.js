import React from "react";

function HeaderApp(props) {
    console.log(localStorage['user-nombre'])
    return( 
        <>
        <nav className="stats__header max-md:ml-20 max-md:mt-3 max-md:mb-16 w-20">
            <div className="stats__header--container">
                <div className="capitalize">
                    <nav aria-label="breadcrumb" className="w-max">
                        <ol className="stats__router">
                            <li className="stats__router--home">
                                <a href="#">
                                    <p className="stats__router--element">dashboard</p>
                                </a>
                                <span className="stats__router--element">/</span>
                            </li>
                            <li>
                                <p className="stats__router--element">{props.page}</p>
                            </li>
                        </ol>
                    </nav>
                    <p className="stats__router--element">{localStorage['user-nombre'] ?  localStorage['user-nombre'] : "Usuario"}</p>
                </div>
            </div>
        </nav>
        </>
    )
}

export default HeaderApp;