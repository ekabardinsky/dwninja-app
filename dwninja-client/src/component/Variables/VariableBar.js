import React, {Component} from 'react';
import {connect} from "react-redux";
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import VariableItem from './VariableItem'
import IconButton from "@material-ui/core/IconButton";
import Add from '@material-ui/icons/Add';

import {createVariable} from "../../redux/actions";
import Paper from "@material-ui/core/Paper";
import {getVariableFullName} from "../../utils/Utils";

class VariableBar extends Component {

    createVariable() {
        this.props.createVariable()
    }

    render() {
        const project = this.props.project;
        return <AppBar position="sticky">
            <Grid container justify={"flex-start"} alignItems={"center"} spacing={1}>
                <Grid item xs={1}>
                    <Paper>
                        <Grid container direction="column" justify={"center"} alignItems={"center"}>
                            <Grid item xs={12}>
                                <IconButton onClick={this.createVariable.bind(this)}><Add/></IconButton>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                {project.selectedProject.configs.variables
                    .sort((a, b) => {
                        const aName = getVariableFullName(a, project);
                        const bName = getVariableFullName(b, project);

                        if(aName < bName) { return -1; }
                        if(aName > bName) { return 1; }
                        return 0;
                    })
                    .map(variable => {
                    return <Grid key={variable.name} item xs={3}><VariableItem variable={variable}/></Grid>;
                })}
            </Grid>
        </AppBar>
    }
}

const mapStateToProps = state => {
    return {
        project: state.project
    }
};

const mapDispatchToProps = {createVariable};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(VariableBar);