import React, {Component} from 'react';
import {connect} from "react-redux";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {post} from "../../utils/Api";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            open: false,
            message: '',
            waiting: false
        }
    }

    handlingUsernameChange(username) {
        this.setState({username: username.target.value, isNeedToSave: true})
    }

    handlingPasswordChange(password) {
        this.setState({password: password.target.value, isNeedToSave: true})
    }

    handlingLogin() {
        this.setState({waiting: true});
        const handler = (result) => {
            if (result.token) {
                window.localStorage.setItem('access_token', result.token);
                window.location.href = '/';
            } else {
                this.setState({open: true, message: 'Can not log in. Maybe you pass the wrong username/password?', waiting: false});
            }
        }

        post('/public/api/login', {
            email: this.state.username,
            password: this.state.password
        }, handler, handler)
    }

    handleCloseSnackbar() {
        this.setState({open: false})
    }

    handlingRegister() {
        this.setState({waiting: true});
        post('/public/api/register', {
            email: this.state.username,
            password: this.state.password
        }, (result) => {
            if (!result.success) {
                this.setState({open: true, message: 'Can not create a user. Maybe it already taken?', waiting: false});
            } else {
                this.handlingLogin();
            }
        })
    }

    render() {
        const {username, password} = this.state;

        return <Grid container spacing={3}>
            <Grid item></Grid>
            <Grid item xs={12}>
                <TextField
                    label="Username"
                    onChange={this.handlingUsernameChange.bind(this)}
                    fullWidth={true}
                    value={username}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Password"
                    onChange={this.handlingPasswordChange.bind(this)}
                    type="password"
                    autoComplete="current-password"
                    fullWidth={true}
                    value={password}
                />
            </Grid>
            <Grid item xs={8}>
                <Snackbar open={this.state.open}
                          onClose={this.handleCloseSnackbar.bind(this)}><Alert severity="error">{this.state.message}</Alert></Snackbar>
            </Grid>
            <Grid item xs={2}>
                <Button size="small" onClick={this.handlingLogin.bind(this)}>Login</Button>
            </Grid>
            <Grid item xs={2}>
                <Button size="small" onClick={this.handlingRegister.bind(this)}>Register</Button>
            </Grid>
            <Backdrop open={this.state.waiting} style={{zIndex: 1000}}>
                <CircularProgress color="inherit">
                </CircularProgress>
            </Backdrop>
        </Grid>
    }
}

const mapStateToProps = state => {
    return {}
};

const mapDispatchToProps = {};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);