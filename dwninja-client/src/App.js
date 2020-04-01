import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import { ThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import Login from "./pages/Login";
import Main from "./pages/Main";
import {red} from "@material-ui/core/colors";

export default class App extends Component {
    render() {
        const theme = createMuiTheme({
            palette: {
                primary: {
                    main: '#686962'
                },
                background: {
                    paper: '#a7a5a0'
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