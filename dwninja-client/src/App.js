import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import Login from "./pages/Login";
import Main from "./pages/Main";

export default class App extends Component {
    render() {
        return (
            <Switch>
                <Route exact path='/' render={() => <Main/>}/>
                <Route exact path='/login' render={() => <Login/>}/>
            </Switch>
        );
    }
}