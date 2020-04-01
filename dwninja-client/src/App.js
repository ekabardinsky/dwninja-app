import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import { ThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import Login from "./pages/Login";
import Main from "./pages/Main";

export default class App extends Component {
    render() {
        // https://material.io/inline-tools/color/
        const theme = createMuiTheme({
            palette: {
                primary: {
                    main: '#bec6bf'
                },
                background: {
                    paper: '#a0a7a1'
                }
            }
        });

        return (
            <ThemeProvider theme={theme}>
                <Switch>
                    <Route exact path='/' render={() => <Main/>}/>
                    <Route exact path='/login' render={() => <Login/>}/>
                </Switch>
            </ThemeProvider>
        );
    }
}