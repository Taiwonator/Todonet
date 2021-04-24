import React from 'react';
import './Title.scss';

function Title(props) {

    const headerStyle = {
        color: props.headerColor,
        textAlign: props.textAlign,
        fontSize: props.headerFontSize
    }

    const subheaderStyle = {
        color: props.subheaderColor,
        fontSize: props.subheaderFontSize
    }

    return (
      <>
        <h1 className="title-header" style={headerStyle}>{props.header}</h1>
        <h2 className="title-subheader" style={subheaderStyle}>{props.subheader}</h2>
      </>
    );
  }
  
  export default Title;