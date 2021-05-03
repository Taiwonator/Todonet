import React, { Component } from 'react'

const AppContext = React.createContext('hello')

export class AppProvider extends Component {
    constructor(props) {
        super(props)
    }

    hello() {
        alert('hello');
    }

    render() {
        return ( 
            <AppContext.Provider value='hello'>
                {this.props.children}
            </AppContext.Provider>
        )
    }
}

export const AppConsumer = AppContext.Consumer;