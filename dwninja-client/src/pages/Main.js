import React, {Component} from 'react';
import Grid from "@material-ui/core/Grid";
import {connect} from "react-redux";
import PageSkeleton from "../component/Common/PageSkeleton";
import InputCode from "../component/Code/InputCode";
import EvaluatorCode from "../component/Code/EvaluatorCode";
import OutputCode from "../component/Code/OutputCode";
import VariableBar from "../component/Variables/VariableBar";
import {getEvaluators} from "../redux/actions";

import {get} from "../utils/Api"

class MainPage extends Component {
    constructor(props) {
        super(props);
        get("/public/api/evaluators", this.props.getEvaluators);
    }

    render() {
        return (
                <PageSkeleton>
                    <Grid container direction="row" alignItems={"center"} alignContent={"center"} justify={"center"}>
                        <Grid item xs={4}><InputCode/></Grid>
                        <Grid item xs={4}><EvaluatorCode/></Grid>
                        <Grid item xs={4}><OutputCode/></Grid>
                        <Grid item xs={12}><VariableBar/></Grid>
                    </Grid>
                </PageSkeleton>
        );
    }
}

const mapStateToProps = state => {
    return {}
};

const mapDispatchToProps = {getEvaluators};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MainPage);