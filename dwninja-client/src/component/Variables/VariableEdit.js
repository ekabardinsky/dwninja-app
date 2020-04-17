import React, {Component} from 'react';
import {connect} from "react-redux";
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from "@material-ui/core/MenuItem";
import DialogTitle from '@material-ui/core/DialogTitle';
import {TextField} from "@material-ui/core";
import {updateVariable} from "../../redux/actions";


class VariableEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.variable.name,
            type: this.props.variable.type
        }
    }

    handleTypeChange(event) {
        this.setState({type: event.target.value})
    }

    handleNameChange(event) {
        this.setState({name: event.target.value})
    }

    handleClose() {
        this.props.closeEdit()
    }

    handleSave() {
        const oldVariable = this.props.variable;
        const newVariable = {
            ...oldVariable,
            type: this.state.type,
            name: this.state.name
        };

        this.props.updateVariable({oldVariable, newVariable});

        this.props.closeEdit()
    }

    render() {
        const evaluator = this.props.project.selectedProject.configs.evaluator;
        const variableTypes = this.props.project.evaluators.find(item => item.name === evaluator).variableTypes.filter(type => type.supportNestedNames);
        const selectedVariableType = variableTypes.find(type => type.name === this.state.type);

        return <Dialog open={this.props.open}>
            <DialogTitle id="simple-dialog-title">Edit variable {this.props.variable.name}</DialogTitle>
            <Grid container direction="row" justify={"flex-end"} alignContent={"center"} >
                <Grid item xs={4}>
                    <Select
                        fullWidth
                        variant="standard"
                        value={selectedVariableType.name}
                        onChange={this.handleTypeChange.bind(this)}>
                        {variableTypes.map(type => <MenuItem key={type.name} value={type.name}>{type.name}</MenuItem>)}
                    </Select>
                </Grid>
                <Grid item xs={6}>
                    <TextField fullWidth onChange={this.handleNameChange.bind(this)} value={this.state.name}></TextField>
                </Grid>
                <Grid item xs={1}/>
                <Grid item xs={2}>
                    <Button onClick={this.handleSave.bind(this)}>Save</Button>
                </Grid>
                <Grid item xs={3}>
                    <Button onClick={this.handleClose.bind(this)}>Close</Button>
                </Grid>
            </Grid>
        </Dialog>;
    }
}

const mapStateToProps = state => {
    return {
        project: state.project
    }
};

const mapDispatchToProps = {updateVariable};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(VariableEdit);