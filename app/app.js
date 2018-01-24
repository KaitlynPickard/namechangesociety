import React from 'react';
import ReactDOM from 'react-dom';

import * as usersService from './services/users-service';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: "Welcome",
            expiringNames: ["Getting user data..."]
        }
        this.getExpiringNames();
    }

    getExpiringNames() {
        usersService.getExpiringNames()
            .then(data => {
                this.setState({
                    expiringNames: data
                });
            });
    }

    render() {
        return (
            <div>
                <h1>{this.state.title}</h1>
                <p>{this.state.expiringNames}</p>
            </div>
        );
    }
};

ReactDOM.render(<App/>, document.getElementById("app"));