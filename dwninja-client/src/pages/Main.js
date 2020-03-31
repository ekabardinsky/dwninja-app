import React, {Component} from 'react';
import Grid from "@material-ui/core/Grid";
import {connect} from "react-redux";
import PageSkeleton from "../component/Common/PageSkeleton";
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
                <Grid container direction="column" alignItems={"center"} alignContent={"center"} justify={"center"}
                      spacing={3}>
                    <Grid item xs={12}><h1>Hello world</h1></Grid>
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