import React from 'react';
import axios from 'axios';
import Registration from './Registration/Registration';
import Login from './Login/Login';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            registration: '',
            login: ''
        }
    }

    handleOptionReg() {
        this.setState({
            registration: 'Registration',
            login: ''
        })
    }

    handleOptionLog() {
        this.setState({
            registration: '',
            login: 'Login'
        })
    }

    render() {

        return (
            <div>
                <button onClick={e => this.handleOptionReg()}>Sign Up</button>
                <button onClick={e => this.handleOptionLog()}>Sign In</button>
                {this.state.registration === 'Registration' &&
                    <Registration />
                }
                {this.state.login === 'Login' &&
                    <Login />
                }
            </div>
        );
    }
}

export default Main;