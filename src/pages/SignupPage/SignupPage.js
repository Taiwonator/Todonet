import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import './SignupPage.scss';
import Illustration from '../../public/Illustration/Illustration';
import Title from '../../public/Title/Title';
import Input from '../../public/Input/Input';
import Button from '../../public/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

class SignupPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fullname: '',
            email: '', 
            password: '', 
            password2: '',
            colors: {
                active: '#9639B3', 
                inactive: '#CCCCCC', 
                error: 'red'
            }
        }
    }

    openPage(page) {
        this.props.history.push(page)
    }

    handleNameChange = (e) => {
        const fullname = e.target.value;
        this.setState(prevState => ({
          ...prevState, fullname
        }))
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

    handlePassword2Change = (e) => {
        const password2 = e.target.value;
        this.setState(prevState => ({
            ...prevState, password2
        }))
    }

    goBack() {
        this.props.history.goBack();
    }

    createUser() {
        this.props.auth.eventHandler({
            type: 'DETAILS', 
            name: 'create_user', 
            email: this.state.email, 
            password: this.state.password, 
            fullname: this.state.fullname, 
            callback: () => setTimeout(() => this.openPage('/app'), 1000 )
        })
    }

    render() {
        const passwordsMatch = (this.state.password === this.state.password2);

        const inputsFilled = (this.state.fullname.length !== 0 &&
                              this.state.email.length !== 0 && 
                              this.state.password.length !== 0 &&
                              this.state.password2.length !== 0 && 
                              passwordsMatch)

        return (
            <div className="signup-page-container">
                <button onClick={ () => this.goBack() }><FontAwesomeIcon icon={faArrowLeft} color='#FABA34' size="2x"/></button>
                <Illustration id={1} width={300} height={250}/>
                <header>
                    <Title header="Welcome to Todonet."  
                        headerColor="black"
                        headerFontSize="25px"
                        subheader="The fastest growing site out there" 
                        subheaderColor="#CCCCCC"
                        subheaderFontSize="16px"
                        textAlign="center"
                        />
                </header>
                <form>
                    <Input type="text"
                        placeholder="Full Name"
                        value={ this.state.fullname }
                        onChange={this.handleNameChange}
                        colors={ this.state.colors }
                        empty={ (this.state.fullname.length === 0) ? true  : false}
                            />
                    <Input type="text"
                        placeholder="Email"
                        value={ this.state.email }
                        onChange={this.handleEmailChange}
                        colors={ this.state.colors }
                        empty={ (this.state.email.length === 0) ? true  : false}
                            />
                    <Input type="Password"
                        placeholder="Password"
                        value={ this.state.password }
                        onChange={this.handlePasswordChange}
                        colors={ this.state.colors }
                        empty={ (this.state.password.length === 0) ? true  : false}
                        error={ !passwordsMatch }
                            />
                    <Input type="Password"
                        placeholder="Confirm Password"
                        value={ this.state.password2 }
                        onChange={this.handlePassword2Change}
                        colors={ this.state.colors }
                        empty={ (this.state.password2.length === 0) ? true  : false}
                        error={ !passwordsMatch }
                        errorEnabled={true}
                            />
                    <Button text="LOG IN" 
                            bgColor="#FABA34" 
                            textColor="white" 
                            textAlign="center"
                            borderColor="white"
                            onClick={ () => this.createUser() }
                            disabled={ !inputsFilled }
                            />
                </form>
            </div>
        )
    }
}

export default withRouter(SignupPage)

