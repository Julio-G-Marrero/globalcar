import React from "react";

function StatusSetterOrder(props) {
    console.log(props.rol)
    React.useEffect(() => {
        comprobarStatus()
    },[props.renderStatusOrder])
    let infoVendedor = "Sin definir"
    let statusEdit = false;
    let autorizada = false;
    let surtida = false;
    let denegada = false;
    function comprobarStatus() {
        if(props.statusId == "1" ) {
            statusEdit = true
            infoVendedor = "Pendiente de Revisión"
        }else if(props.statusId =="2") {
            autorizada = true
            infoVendedor = "Pendiente de Surtir"
        }else if( props.statusId == "3") {
            surtida = true
            infoVendedor = "Surtida"
        }else if( props.statusId == "4") {
            denegada = true
            infoVendedor = "Denegada"
        }
    }
    comprobarStatus()

    function handleStautsAction(e) {
        e.preventDefault()
        if(e.target.id == "denegar") {
            props.handleDenegarOrden()
        }else if(e.target.id == "autorizar") {
            props.handleAutorizarOrden()
        }else if(e.target.id == "surtir") {
            props.handleSurtirOrden()
        }else if(e.target.id == "eliminar") {
            props.handleEliminarOrden()
        }
    }
    if(props.rol == 1){
        return(
            <>
                <div className={statusEdit ? "" : "hidden"}>
                    <button class="text-slate-800 hover:text-yellow-600 text-sm bg-white hover:bg-slate-100 border border-slate-200 rounded-l-lg font-medium px-4 py-2 inline-flex space-x-1 items-center"
                    id="denegar"
                    onClick={handleStautsAction}>
                        <span>
                            <svg class="w-4 h-4 hover:text-yellow-600 mr-1 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M10 12v1h4v-1m4 7H6a1 1 0 0 1-1-1V9h14v9a1 1 0 0 1-1 1ZM4 5h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"/>
                            </svg>
                        </span>
                        Denegar Orden
                    </button>
                    <button class="text-slate-800 hover:text-green-600 text-sm bg-white hover:bg-slate-100 border border-slate-200 rounded-r-lg font-medium px-4 py-2 inline-flex space-x-1 items-center"
                    id="autorizar"
                    onClick={handleStautsAction}>
                        <svg class="w-4 h-4 hover:text-green-600 mr-1 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 11.917 9.724 16.5 19 7.5"/>
                        </svg>
                        Autorizar
                    </button>
                </div>
                <div className={autorizada ? " flex items-center" : "hidden"}>
                    <div className="flex items-center mr-4 text-green-600">
                        <svg class="w-4 h-4  mr-1 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 11.917 9.724 16.5 19 7.5"/>
                        </svg>
                        Autorizada
                    </div>
                    <button class="text-slate-800 hover:text-green-600 text-sm bg-white hover:bg-slate-100 border border-slate-200 rounded-l-lg font-medium px-4 py-2 inline-flex space-x-1 items-center"
                    id="surtir"
                    onClick={handleStautsAction}>
                        <svg class="w-4 h-4 mr-2 hover:text-green-600  dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path fill-rule="evenodd" d="M12 2c-.791 0-1.55.314-2.11.874l-.893.893a.985.985 0 0 1-.696.288H7.04A2.984 2.984 0 0 0 4.055 7.04v1.262a.986.986 0 0 1-.288.696l-.893.893a2.984 2.984 0 0 0 0 4.22l.893.893a.985.985 0 0 1 .288.696v1.262a2.984 2.984 0 0 0 2.984 2.984h1.262c.261 0 .512.104.696.288l.893.893a2.984 2.984 0 0 0 4.22 0l.893-.893a.985.985 0 0 1 .696-.288h1.262a2.984 2.984 0 0 0 2.984-2.984V15.7c0-.261.104-.512.288-.696l.893-.893a2.984 2.984 0 0 0 0-4.22l-.893-.893a.985.985 0 0 1-.288-.696V7.04a2.984 2.984 0 0 0-2.984-2.984h-1.262a.985.985 0 0 1-.696-.288l-.893-.893A2.984 2.984 0 0 0 12 2Zm3.683 7.73a1 1 0 1 0-1.414-1.413l-4.253 4.253-1.277-1.277a1 1 0 0 0-1.415 1.414l1.985 1.984a1 1 0 0 0 1.414 0l4.96-4.96Z" clip-rule="evenodd"/>
                        </svg>

                        Surtir Orden
                    </button>
                </div>
                <div className={surtida ? " flex items-center" : "hidden"}>
                    <div className="flex items-center mr-4 text-green-600">
                        <svg class="w-4 h-4  mr-1 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 11.917 9.724 16.5 19 7.5"/>
                        </svg>
                        Orden Surtida
                    </div>
                </div>
                <div className={denegada ? "font-semibold text-yellow-600 flex items-center" : " hidden"}>
                    <span>
                        <svg class="w-4 h-4 hover:text-yellow-600 mr-1 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M10 12v1h4v-1m4 7H6a1 1 0 0 1-1-1V9h14v9a1 1 0 0 1-1 1ZM4 5h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"/>
                        </svg>
                    </span>
                    <p className="mr-2">Orden Negada</p>
                    <div>
                        <button class="text-slate-800 hover:text-red-600 text-sm bg-white hover:bg-slate-100 border border-slate-200 rounded-e-lg font-medium px-4 py-2 inline-flex space-x-1 items-center"
                        id="eliminar"
                        onClick={handleStautsAction}
                        >
                            <span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path>
                            </svg>
                            </span>
                            Eliminar
                        </button>
                    </div>
                </div>

            </>
        )
    }else if( props.rol == 2){
        return(
            <div className= "font-semibold text-yellow-600 flex items-center">
                <p className="mr-2">{infoVendedor}</p>
            <div>
                <button class="text-slate-800 hover:text-red-600 text-sm bg-white hover:bg-slate-100 border border-slate-200 rounded-e-lg font-medium px-4 py-2 inline-flex space-x-1 items-center"
                id="eliminar"
                onClick={handleStautsAction}
                >

                    
                    <span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path>
                    </svg>
                    </span>
                    Eliminar
                </button>
            </div>
        </div>
        )
    }

}

export default StatusSetterOrder;