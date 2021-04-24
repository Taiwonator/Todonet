import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import './LoginPage.scss';
import Illustration from '../../public/Illustration/Illustration';
import Title from '../../public/Title/Title';
import Input from '../../public/Input/Input';
import Button from '../../public/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

class LoginPage extends Component {
    constructor(props) {
        super(props)
    }

    goBack() {
        this.props.history.goBack();
    }

    render() {

        return (
            <div className="login-page-container">
                <button onClick={ () => this.goBack() }><FontAwesomeIcon icon={faArrowLeft} color='#FABA34' size="2x"/></button>
                <Illustration id={1} width={300} height={300}/>
                <header>
                    <Title header="Welcome Back."  
                        headerColor="black"
                        headerFontSize="35px"
                        subheader="The fastest growing site out there" 
                        subheaderColor="#CCCCCC"
                        subheaderFontSize="18px"
                        textAlign="center"
                        />
                </header>
                <form>
                    <Input type="text"
                        placeholder="Email"
                        value="Dummy@gmail.com"
                        color="#9639B3"
                            />
                    <Input type="Password"
                        placeholder="Password"
                        value=""
                        color="#CCCCCC"
                            />
                    <Button text="LOG IN" 
                            bgColor="#FABA34" 
                            textColor="white" 
                            textAlign="center"
                            borderColor="white"
                            />
                </form>
            </div>
        )
    }
}

export default withRouter(LoginPage)
