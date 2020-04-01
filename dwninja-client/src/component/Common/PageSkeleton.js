import React, {Component} from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import Code from '@material-ui/icons/Code';
import {
    selectEvaluator,
    selectInputMimeType,
    updateSelectedProject,
    updateLastOutput,
    evaluationStarted,
    evaluationEnd
} from "../../redux/actions";
import {connect} from "react-redux";
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import VariableBar from "../Variables/VariableBar";

class PageSkeleton extends Component {

    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
        };
    }

    logout() {
        window.localStorage.removeItem('access_token');
        window.location.href = '/login';
    }

    handleEvaluatorChange(first) {
        this.props.selectEvaluator(this.props.project.evaluators.find(evaluator => evaluator.name === first.target.value));
    }

    handleInputMimeTypeChange(first) {
        this.props.selectInputMimeType(first.target.value);
    }

    handleHiyah() {
        this.props.evaluationStarted({evaluationEnd: this.props.evaluationEnd, updateLastOutput: this.props.updateLastOutput});
    }

    render() {
        const access_token = window.localStorage.getItem('access_token');
        let isLoginPage = window.location.href.includes("/login");
        let authorized = !!access_token;
        const {evaluators, selectedEvaluator, selectedVariable, isEvaluate} = this.props.project;

        return (
            <div>
                { isEvaluate && <LinearProgress color={"secondary"}/>}
                <AppBar position="static">
                    <Toolbar>
                        <Grid container spacing={2} justify={"flex-end"} alignItems={"center"}>
                            {evaluators.length > 0 && <Grid item xs={4}>
                                <Select
                                    variant="standard"
                                    value={selectedVariable.mimeType}
                                    onChange={this.handleInputMimeTypeChange.bind(this)}>
                                    {selectedEvaluator.variableMimeTypes.map(type => <MenuItem key={type}
                                                                                               value={type}>{type}</MenuItem>)}
                                </Select>
                            </Grid>}
                            {evaluators.length > 0 && <Grid item xs={2}>
                                <Select
                                    variant="standard"
                                    value={selectedEvaluator.name}
                                    onChange={this.handleEvaluatorChange.bind(this)}>
                                    {evaluators.map(evaluator => {
                                        return (<MenuItem key={evaluator.name}
                                                          value={evaluator.name}>{evaluator.displayName}</MenuItem>);
                                    })}
                                </Select>
                            </Grid>}
                            {!isLoginPage && <Grid item xs={2}>
                                <Button
                                    variant="text"
                                    color="default"
                                    onClick={this.handleHiyah.bind(this)}
                                    startIcon={<Code/>}>Hiyah</Button>
                            </Grid>}
                            <Grid item xs={2}></Grid>
                            {authorized && <Grid item xs={2}>
                                <Button
                                    variant="text"
                                    color="default"
                                    onClick={this.logout}
                                    startIcon={<MenuIcon/>}>Log out</Button>
                            </Grid>}
                            {!authorized && !isLoginPage && <Grid item xs={2}>
                                <Button
                                    variant="contained"
                                    color="default"
                                    onClick={this.logout}
                                    startIcon={<MenuIcon/>}>Log in</Button>
                            </Grid>}
                        </Grid>
                    </Toolbar>
                </AppBar>
                <div className={"container"}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        project: state.project
    }
};

const mapDispatchToProps = {
    selectEvaluator,
    selectInputMimeType,
    updateSelectedProject,
    updateLastOutput,
    evaluationStarted,
    evaluationEnd
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PageSkeleton);