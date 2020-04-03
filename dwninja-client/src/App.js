import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import Login from "./pages/Login";
import Main from "./pages/Main";
import {connect} from "react-redux";
import {getTheme} from "./utils/Utils";

class App extends Component {
    render() {
        const customTheme = getTheme(this.props.project.selectedTheme);

        document.getElementById("body").style.background = customTheme.palette.primary.main

        const theme = createMuiTheme(customTheme);

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

const mapStateToProps = state => {
    return {
        project: state.project
    }
};

const mapDispatchToProps = {};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);