import React, { Component } from 'react'
import { withRouter, Redirect } from 'react-router-dom';
import './LoginPage.scss';
import Illustration from '../../public/Illustration/Illustration';
import Title from '../../public/Title/Title';
import Input from '../../public/Input/Input';
import Button from '../../public/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { eventCall } from '../../controllers/EventHandler';

class LoginPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '', 
            password: '', 
            colors: {
                active: '#9639B3', 
                inactive: '#CCCCCC',
                error: 'red'
            }
        }
    }
    
    componentDidMount() {
        if(this.props.auth.state.loggedIn) {
            this.openPage('/app')
        }
    }

    openPage(page) {
        this.props.history.push(page)
    }

    handleEmailChange = (e) => {
        const email = e.target.value;
        this.setState(prevState => ({
          ...prevState, email
        }))
    }

    handlePasswordChange = (e) => {
        const password = e.target.value;
        this.setState(prevState => ({
            ...prevState, password
        }))
    }

    goBack() {
        this.props.history.goBack();
    }



    loginUser() {

        this.props.auth.eventHandler({
            type: 'DETAILS', 
            name: 'login_user', 
            email: this.state.email, 
            password: this.state.password, 
            callback: () => console.log('Logged in')
        })
    }

    render() {
        
        const inputsFilled = (this.state.email.length !== 0 && this.state.password.length !== 0)
        
        if(!this.props.auth.state.app.loggedIn) {

        return (
                    <div className="login-page-container">
                    <button onClick={ () => this.goBack() }><FontAwesomeIcon icon={faArrowLeft} color='#FABA34' size="2x"/></button>
                    <Illustration id={1} width={300} height={250}/>
                    <header onClick={ () => this.getUser() }>
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
                            value={this.state.email}
                            onChange={this.handleEmailChange}
                            colors={ this.state.colors }
                            empty={ (this.state.email.length === 0) ? true  : false}
                            icon={'user'}
                                />
                        <Input type="Password"
                            placeholder="Password"
                            value={this.state.password}
                            onChange={this.handlePasswordChange}
                            colors={ this.state.colors }
                            empty={ (this.state.password.length === 0) ? true  : false}
                            icon={'key'}
                                />
                        <Button text="LOG IN" 
                                bgColor="#FABA34" 
                                textColor="white" 
                                textAlign="center"
                                borderColor="white"
                                onClick={ () => this.loginUser()}
                                disabled={ !inputsFilled }
                                />
                    </form>
                </div>
        )
        } else {
            return <Redirect to={'/app'}/>
        }
    }
}

export default withRouter(LoginPage)
