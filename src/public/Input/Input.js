import React from 'react'
import './Input.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee, faSearch, faUser, faKey } from '@fortawesome/free-solid-svg-icons'

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

    let icon;
    switch(props.icon) {
        case 'mug': 
            icon = <FontAwesomeIcon icon={faCoffee} color={ color }/>
            break;
        case 'search': 
            icon = <FontAwesomeIcon icon={faSearch} color={ color }/>
            break;
        case 'key': 
            icon = <FontAwesomeIcon icon={faKey} color={ color }/>
            break;
        case 'user':
            icon = <FontAwesomeIcon icon={faUser} color={ color }/>
            break;
        default:
            icon = <FontAwesomeIcon icon={faCoffee} color={ color }/>
            break;
    }

    return (
        <div className="input-container" style={inputContainerStyle}>
            {icon}
            <input value={props.value} placeholder={props.placeholder} type={props.type} style={inputStyle} onChange={props.onChange} />
        </div>
    )
}

export default Input
