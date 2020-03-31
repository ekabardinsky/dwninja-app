import React, {Component} from 'react';
import {connect} from "react-redux";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {post} from "../../utils/Api";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        }
    }

    handlingUsernameChange(username) {
        this.setState({username: username.target.value, isNeedToSave: true})
    }

    handlingPasswordChange(password) {
        this.setState({password: password.target.value, isNeedToSave: true})
    }

    handlingLogin() {
        post('/public/api/login', {
            email: this.state.username,
            password: this.state.password
        }, (result) => {
            if (result.token) {
                window.localStorage.setItem('access_token', result.token);
                window.location.href = '/';
            } else {
                console.log(result)
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
            <Grid item xs={12}>
                <Button size="small" onClick={this.handlingLogin.bind(this)}>Login</Button>
            </Grid>
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