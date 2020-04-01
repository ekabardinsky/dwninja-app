import React, {Component} from 'react';
import {connect} from "react-redux";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import {withStyles} from '@material-ui/core/styles';
import VariableEdit from './VariableEdit'

import {createVariable, removeVariable, selectVariable, updateVariable} from "../../redux/actions";

const BootstrapButton = withStyles({
    root: {
        textTransform: 'none',
    },
})(Button);

class VariableItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.variable.name,
            edit: false
        }
    }

    closeEdit() {
        this.setState({edit: false});
    }

    openEdit() {
        this.setState({edit: true});
    }

    removeVariable() {
        this.props.removeVariable(this.props.variable)
    }

    selectVariable() {
        this.props.selectVariable(this.props.variable)
    }

    render() {
        const selectedVariable = this.props.project.selectedVariable;
        const evaluator = this.props.project.selectedProject.configs.evaluator;
        const variableTypes = this.props.project.evaluators.find(item => item.name === evaluator).variableTypes;
        const selectedVariableType = variableTypes.find(type => type.name === this.props.variable.type);
        const isSelected = selectedVariable.type === this.props.variable.type && selectedVariable.name === this.props.variable.name;

        return <Paper>
            <Grid container direction="column" justify={"center"} alignContent={"center"}>
                <Grid item xs={12}>
                    <Grid container direction="row" justify={"flex-start"} alignItems={"center"} spacing={1}>
                        <Grid item xs={8}>
                            <BootstrapButton disabled={isSelected} onClick={this.selectVariable.bind((this))}>
                                {selectedVariableType.required ? this.props.variable.type : `${this.props.variable.type}.${this.props.variable.name}`}
                            </BootstrapButton>
                        </Grid>
                        <Grid item xs={2}>
                            <IconButton onClick={this.openEdit.bind(this)} disabled={!selectedVariableType.supportNestedNames}><Edit/></IconButton>
                        </Grid>
                        <Grid item xs={2}>
                            <IconButton disabled={selectedVariableType.required}
                                        onClick={this.removeVariable.bind(this)}><Delete/></IconButton>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            {this.state.edit && <VariableEdit open={this.state.edit} closeEdit={this.closeEdit.bind(this)} variable={this.props.variable}/>}
        </Paper>;
    }
}

const mapStateToProps = state => {
    return {
        project: state.project
    }
};

const mapDispatchToProps = {removeVariable, createVariable, selectVariable, updateVariable};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(VariableItem);