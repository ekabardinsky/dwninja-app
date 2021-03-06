import React, {Component} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Code from '@material-ui/icons/Code';
import {
    evaluationEnd,
    evaluationStarted,
    selectEvaluator,
    selectInputMimeType,
    updateLastOutput,
    updateSelectedProject
} from "../../redux/actions";
import {connect} from "react-redux";
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import MainMenu from "./MainMenu";
import CodeHelpers from "../Code/CodeHelpers"

class PageSkeleton extends Component {
    handleEvaluatorChange(first) {
        this.props.selectEvaluator(this.props.project.evaluators.find(evaluator => evaluator.name === first.target.value));
    }

    handleInputMimeTypeChange(first) {
        this.props.selectInputMimeType(first.target.value);
    }

    handleHiyah() {
        this.props.evaluationStarted({
            evaluationEnd: this.props.evaluationEnd,
            updateLastOutput: this.props.updateLastOutput
        });
    }

    render() {
        let isLoginPage = window.location.href.includes("/login");
        const {evaluators, selectedEvaluator, selectedVariable} = this.props.project;

        return (
            <div>
                <AppBar position="static">
                    <Grid container spacing={2} justify={"flex-end"} alignItems={"center"}>
                        {!isLoginPage && <Grid item xs={1}>
                            <CodeHelpers/>
                        </Grid>}
                        {!isLoginPage && evaluators.length > 0 && <Grid item xs={4}>
                            <Select
                                size={"large"}
                                variant="standard"
                                value={selectedVariable.mimeType}
                                onChange={this.handleInputMimeTypeChange.bind(this)}>
                                {selectedEvaluator.variableMimeTypes.map(type => <MenuItem key={type}
                                                                                           value={type}>{type}</MenuItem>)}
                            </Select>
                        </Grid>}
                        {!isLoginPage && evaluators.length > 0 && <Grid item xs={1}>
                            <Select
                                size={"large"}
                                variant="standard"
                                value={selectedEvaluator.name}
                                onChange={this.handleEvaluatorChange.bind(this)}>
                                {evaluators.map(evaluator => {
                                    return (<MenuItem key={evaluator.name}
                                                      value={evaluator.name}>{evaluator.displayName}</MenuItem>);
                                })}
                            </Select>
                        </Grid>}
                        {!isLoginPage && <Grid item xs={1}>
                            <Button
                                size={"large"}
                                variant="text"
                                color="default"
                                onClick={this.handleHiyah.bind(this)}
                                startIcon={<Code/>}>Hiyah</Button>
                        </Grid>}
                        <Grid item xs={4}></Grid>
                        <Grid item xs={1}>
                            <Grid container justify={"flex-end"}>
                                <Grid item xs={6}>
                                    {/*trick to align button to end*/}
                                    <MainMenu/>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
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