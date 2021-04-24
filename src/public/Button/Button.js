import React from 'react'
import './Button.scss';

function Button(props) {
    console.log(props.onClick);
    const buttonStyle = {
        backgroundColor: props.bgColor, 
        color: props.textColor, 
        borderColor: props.borderColor, 
        textAlign: props.textAlign
    }

    return (
        <button onClick={props.onClick} className="button" style={buttonStyle}>{props.text}</button>
    ) 
}

export default Button
