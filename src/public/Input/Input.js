import React from 'react'
import './Input.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'

function Input(props) {

    let color;
    if(props.errorEnabled) {
        if(props.error && props.value.length > 0) {
            color = props.colors.error 
        } else  {
            color = (props.empty) ? props.colors.inactive : props.colors.active;
        }
    } else {
        color = (props.empty) ? props.colors.inactive : props.colors.active;
    }

    const inputContainerStyle = {
        borderColor: color
    }

    const inputStyle = {
        color: color
    }

    return (
        <div className="input-container" style={inputContainerStyle}>
            <FontAwesomeIcon icon={faCoffee} color={ color }/>
            <input value={props.value} placeholder={props.placeholder} type={props.type} style={inputStyle} onChange={props.onChange} />
        </div>
    )
}

export default Input
