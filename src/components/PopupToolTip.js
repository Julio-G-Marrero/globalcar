import React from "react";
import closeIcon from '../images/Close_Icon.png';
import veridicado from '../images/verificado.png';
import denegado from '../images/deniedImg.png';

function PopupToolTip(props){
    
    return(
        <>
        <div className={props.isOpen ? 'modal-tooltip' : 'modal-tooltip hidden'}>
            <div className="message-verified">
            {props.successMessage ? 
                <img className="message-verified__img" src={veridicado} alt="verificadoIMG" />
            : 
                <img className="message-verified__img" src={denegado} alt="denegadoIMG" />
            }
                <p className="block antialiased tracking-normal font-sans text-lg mt-6 w-56 font-semibold leading-relaxed text-gray-900 ">{props.conentMessage}</p>
            </div>
        <img
            className="modal-tooltip__close modal-tooltip__close-place"
            src={closeIcon}
            onClick={props.closeAllPopupsToolTip}
            alt="close icon"
            />
        </div>
        </>
    )
}

export default PopupToolTip;