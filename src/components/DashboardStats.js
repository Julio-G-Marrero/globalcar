import React from "react";
import HeaderApp from "./HeaderApp";
import LoadingPageStats from "./LoadingPageStats.js"

function DashboardStats(props) {
    const solicitudesNegadas = props.stats.productosTotalesSolicitados - props.stats.productosTotalesAutorizados;
    const [isLoading, setIsLoading] = React.useState(true);

    function currencyFormat(num) {
        let numero = parseInt(num)
        return '$' + numero.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    setTimeout(() => {
        setIsLoading(false);
    }, 3000);

    function handleSelectTypeOrder(e){
        console.log(e.target)
    }

    if (isLoading) {
        return(
            <LoadingPageStats/>
        )
    }else {
        return(
            <>
            <HeaderApp
            page="home"/>
            <div className="stats__grid">
                <div className="stats__element  ">
                    <div className="stats__element--flex "
                    >
                        <div className="stats__logo stats__logo--pink">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="stats__svg">
                            <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd"></path>
                            </svg>
                        </div>
                        <div className="stats__textrigt ">
                            <p className="stats__label">Peticiones Totales</p>
                            <h4 className="stats__value">{props.stats.peticionesTotales}</h4>
                        </div>
                        <div className="stats__subinfo">
                            <h4 className="text-rigth">Peticiones Ptes:</h4>
                            <h4 className="text-rigth">{solicitudesNegadas}
                            </h4>
                        </div>
                    </div>
                </div>
                <div className="stats__element ">
                    <div className="stats__element--flex">
                        <div className="stats__logo stats__logo--green">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="stats__svg">
                            <path d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z"></path>
                            </svg>
                        </div>
                        <div className="stats__textrigt">
                            <p className="stats__label">Peticiones Autorizadas</p>
                            <h4 className="stats__value">{props.stats.peticionesAutorizadas}</h4>
                        </div>
                        <div className="stats__subinfo">
                            <h4 className="text-rigth">Más Concurrente:</h4>
                            <h4 className="text-rigth">{props.stats.clienteMasConcurrente}
                            </h4>
                        </div>
                    </div>
                </div>
                <div className="stats__element ">
                    <div className="stats__element--flex" >
                        <div className="stats__logo stats__logo--orange">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="stats__svg">
                            <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z"></path>
                            </svg>
                        </div>
                        <div className="stats__textrigt">
                            <p className="stats__label">Productos Autorizados</p>
                            <h4 className="stats__value">{props.stats.productosTotalesAutorizados}</h4>
                        </div>
                        <div className="stats__subinfo">
                            <h4 className="text-rigth">Productos Solicitados:</h4>
                            <h4 className="text-rigth">{props.stats.productosTotalesSolicitados}
                            </h4>
                        </div>
                    </div>
                </div>
                <div className="stats__element ">
                    <div className="stats__element--flex">
                        <div className="stats__logo stats__logo--blue">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="stats__svg">
                            <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z"></path>
                            <path fill-rule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" clip-rule="evenodd"></path>
                            <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z"></path>
                            </svg>
                        </div>
                        <div className="stats__textrigt">
                            <p className="stats__label">Monto Total Autorizado</p>
                            <h4 className="stats__value">
                                {currencyFormat(props.stats.montoTotalAutorizado)}
                            </h4>
                        </div>
                        <div className="stats__subinfo">
                            <h4 className="text-rigth">Monto Total Solicitudes:</h4>
                            <h4 className="text-rigth">{currencyFormat(props.stats.montoTotalSolicitudes)}
                            </h4>
                        </div>
                    </div>
                </div>
            </div>      
            </>
        )
    }
}

export default DashboardStats;