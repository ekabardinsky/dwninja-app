import React, {Component} from 'react';
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";
import {connect} from "react-redux";
import PageSkeleton from "../component/Common/PageSkeleton";
import InputCode from "../component/Code/InputCode";
import EvaluatorCode from "../component/Code/EvaluatorCode";
import OutputCode from "../component/Code/OutputCode";
import VariableBar from "../component/Variables/VariableBar";
import {getEvaluators, loadState, closeAlert} from "../redux/actions";

import {get} from "../utils/Api"
import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class MainPage extends Component {
    constructor(props) {
        super(props);
        const access_token = window.localStorage.getItem('access_token');

        get("/public/api/evaluators", (response) => {
            this.props.getEvaluators(response);
            if (access_token) {
                get('/api/state', this.props.loadState)
            }
        });
    }

    render() {
        const access_token = window.localStorage.getItem('access_token');
        const authorized = !!access_token;
        const stateLoaded = this.props.project.stateLoaded;
        let loading = false;
        if (authorized && !stateLoaded) {
            loading = true;
        } else if (this.props.project.running) {
            loading = true;
        }
        const alertOpen = this.props.project.alert ? this.props.project.alert.open : false;
        const alertMessage = this.props.project.alert ? this.props.project.alert.alertMessage : '';
        const severity = this.props.project.alert ? this.props.project.alert.severity : 'error';
        const page = (
            <PageSkeleton>
                <Grid container direction="row" alignItems={"center"} alignContent={"center"} justify={"center"}>
                    <Grid item xs={4}><InputCode/></Grid>
                    <Grid item xs={4}><EvaluatorCode/></Grid>
                    <Grid item xs={4}><OutputCode/></Grid>
                    <Grid item xs={12}><VariableBar/></Grid>
                </Grid>
            </PageSkeleton>
        );

        return <React.Fragment>
            {page}
            <Backdrop open={loading} style={{zIndex: 1000}}>
                <CircularProgress color="inherit">
                </CircularProgress>
            </Backdrop>
            {
                this.props.project.alert &&
                <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'left'}} open={alertOpen}
                          onClose={this.props.closeAlert}>
                    <Alert severity={severity}>{alertMessage}</Alert>
                </Snackbar>
            }
        </React.Fragment>
    }
}

const mapStateToProps = state => {
    return {
        project: state.project
    }
};

const mapDispatchToProps = {getEvaluators, loadState, closeAlert};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MainPage);