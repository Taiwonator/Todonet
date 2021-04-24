import React from 'react'
import './Input.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'

function Input(props) {

    const inputContainerStyle = {
        borderColor: props.color 
    }

    const inputStyle = {
        color: props.color
    }

    return (
        <div className="input-container" style={inputContainerStyle}>
            <FontAwesomeIcon icon={faCoffee} color={props.color}/>
            <input value={props.value} placeholder={props.placeholder} type={props.type} style={inputStyle} />
        </div>
    )
}

export default Input
