import React from 'react'
import './Button.scss';

function Button(props) {
    const disabled = (props.disabled != null) ? (props.disabled) : false;

    const buttonStyle = {
        backgroundColor: (disabled) ? '#CCCCCC' : props.bgColor, 
        color: props.textColor, 
        borderColor: props.borderColor, 
        textAlign: props.textAlign
    }

    return (
        <button onClick={(e) => {
            e.preventDefault()
            props.onClick()
        }} className="button" style={buttonStyle} disabled={ disabled }>{props.text}</button>
    ) 
}

export default Button
