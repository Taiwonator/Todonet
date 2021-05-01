import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import Button from '../../public/Button/Button.js';
import Title from '../../public/Title/Title.js';
import './LandingPage.scss';

class LandingPage extends Component {

    constructor(props) {
      super(props)
    }


    openPage(page) {
      this.props.history.push(page)
    }

    render() {

      return (
        <div className="landing-page-container">
            <header onClick={ () => this.openPage('/app') }>
                <Title header="Todonet."  
                      headerColor="white"
                      headerFontSize="50px"
                      subheader="The social media of the future" 
                      subheaderColor="black"
                      subheaderFontSize="18px"
                      textAlign="center" 
                      />
            </header>
            <div>
                <div className="landing-page-text-container">
                  <p>See what your friends are doing while crafting your own day  </p>
                </div>
                <div className="landing-page-buttons-container">
                  <Button text="Create new account" 
                          bgColor="#9639B3" 
                          textColor="white" 
                          textAlign="center"
                          borderColor="white"
                          onClick={ () => this.openPage('/login') }
                          />
                  <Button text="I already have an account" 
                          bgColor="black" 
                          textColor="white" 
                          textAlign="center"
                          borderColor="white"
                          onClick={ () => this.openPage('/signup') }
                          />
                </div>
            </div>
        </div>
      );
    }
  }
  
  export default withRouter(LandingPage);