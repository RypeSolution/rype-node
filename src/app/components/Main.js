import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import Registration from './Main/Registration/Registration';
import Login from './Main/Login/Login';
import { Router } from 'react-router';

// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"


class Main extends React.Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route path='/registration' component={Registration} />
                    <Route path='/login' component={Login} />
                </Switch>
            </div>
        )
    }
}

export default Main;
