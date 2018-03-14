import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware, compose} from 'redux';
import {Switch, Route, BrowserRouter as Router} from 'react-router-dom';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';
import Home from './components/Main/Home/Home';
import App from './App';
import reducer from './redux/index';
import Login from "./components/Main/Login/Login";
import Registration from "./components/Main/Registration/Registration";

// Create redux store
const store = createStore(reducer, compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
));

// Create app
const container = document.getElementById('root');

// Render app
ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path='/' component={App}/>
        <Route path='/registration' component={Registration}/>
        <Route path='/login' component={Login}/>
      </Switch>
    </Router>
  </Provider>
  , container
);