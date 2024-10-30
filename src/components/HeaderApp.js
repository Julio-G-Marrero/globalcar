import React from "react";

function HeaderApp(props) {
    return( 
        <>
        <nav className="stats__header">
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
                </div>
            </div>
        </nav>
        </>
    )
}

export default HeaderApp;