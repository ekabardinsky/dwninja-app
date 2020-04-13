import React, {Component} from 'react';
import {
    changeValueCurrentVariable,
    closeAlert,
    closeRunningSplash,
    openAlert,
    openRunningSplash,
    changeExpression
} from "../../redux/actions";
import {connect} from "react-redux";
import Settings from '@material-ui/icons/Settings';
import IconButton from "@material-ui/core/IconButton";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {post} from "../../utils/Api";
import Drawer from '@material-ui/core/Drawer';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import FormControl from "@material-ui/core/FormControl";
import Checkbox from "@material-ui/core/Checkbox";
import Button from '@material-ui/core/Button';
import Code from "@material-ui/icons/Code";
import {getVariableFullName} from "../../utils/Utils";


class CodeHelpers extends Component {
    constructor(props) {
        super(props);
        const {selectedEvaluator} = this.props.project;
        this.state = {
            open: false,
            anchorEl: null,
            alertOpen: false,
            alertMessage: '',
            openDwGenerator: false,
            dwGeneratorNamingStyle: 'No changes',
            dwGeneratorOutputMimeType: selectedEvaluator.variableMimeTypes[0],
            dwGeneratorUseOutput: false
        };
    }

    format() {
        const data = this.props.project.selectedVariable.value;
        const mode = this.props.project.selectedVariable.mimeType.match(/\/(.*)/)[1];
        this.setState({open: false});

        if (mode === 'json' || mode === 'xml') {
            this.props.openRunningSplash();
            post('/public/api/formatt/' + mode, data, (response) => {
                this.props.closeRunningSplash();
                const result = JSON.parse(response)
                if (result.success) {
                    this.props.changeValueCurrentVariable(result.body);
                } else {
                    const alertMessage = result
                        .errors
                        .slice(0, 5)
                        .map((alert, index) => `Alert ${index}: ${alert.message}`)
                        .join('\n');

                    this.props.openAlert({alertMessage, severity: 'error'})
                }
            }, this.props.closeRunningSplash, false)
        }

    }

    unescape() {
        this.setState({open: false});
        const data = this.props.project.selectedVariable.value;
        let mode = this.props.project.selectedVariable.mimeType.match(/\/(.*)/)[1];
        if (mode === "java") {
            mode = "json"
        }

        if (mode === 'json' || mode === 'xml') {
            this.props.openRunningSplash();

            post('/public/api/unescape/' + mode, data, (response) => {
                this.props.closeRunningSplash();
                const result = JSON.parse(response)
                if (result.success) {
                    this.props.changeValueCurrentVariable(result.body);
                } else {
                    this.props.openAlert({alertMessage: 'Can not unescape data', severity: 'error'})
                }
            }, this.props.closeRunningSplash, false)
        }
    }

    escape() {
        this.setState({open: false});
        const data = this.props.project.selectedVariable.value;
        let mode = this.props.project.selectedVariable.mimeType.match(/\/(.*)/)[1];
        if (mode === "java") {
            mode = "json"
        }

        if (mode === 'json' || mode === 'xml') {
            this.props.openRunningSplash();

            post('/public/api/escape/' + mode, data, (response) => {
                this.props.closeRunningSplash();
                const result = JSON.parse(response)
                if (result.success) {
                    this.props.changeValueCurrentVariable(result.body);
                } else {
                    this.props.openAlert({alertMessage: 'Can not unescape data', severity: 'error'})
                }
            }, this.props.closeRunningSplash, false)
        }
    }

    closeOrOpen(event) {
        this.setState({open: !this.state.open, anchorEl: event.currentTarget});
    }

    closeOrOpenDwGenerator() {
        this.setState({openDwGenerator: !this.state.openDwGenerator});
    }

    changeDwGeneratorNamingStyle(event) {
        this.setState({dwGeneratorNamingStyle: event.target.value});
    }

    changeDwGeneratorOutputMimeType(event) {
        this.setState({dwGeneratorOutputMimeType: event.target.value});
    }

    changeDwGeneratorUseOutput(event) {
        this.setState({dwGeneratorUseOutput: event.target.checked});
    }

    generateDw() {
        const {selectedEvaluator} = this.props.project;
        this.setState({openDwGenerator: false, open: false})
        this.props.openRunningSplash();

        post('/public/api/generate/dw', {
            input: this.props.project.selectedVariable.value,
            inputMimetype: this.props.project.selectedVariable.mimeType,
            output: this.state.dwGeneratorUseOutput ? this.props.project.lastOutput.result : "",
            outputMimetype: this.state.dwGeneratorOutputMimeType,
            outputNamingStyle: this.state.dwGeneratorNamingStyle,
            variableName: getVariableFullName(this.props.project.selectedVariable, this.props.project),
            dwVersion: selectedEvaluator.name
        }, (response) => {
            this.props.closeRunningSplash();
            if (response.success) {
                this.props.changeExpression(response.body);
            } else {
                this.props.openAlert({
                    alertMessage: 'Can not generate dw script. Please check parameters:\n' + response.error,
                    severity: 'error'
                })
            }
        }, this.props.closeRunningSplash, true)
    }

    render() {
        const {selectedEvaluator} = this.props.project;
        return <React.Fragment>
            <IconButton onClick={this.closeOrOpen.bind(this)}><Settings/></IconButton>
            <Menu
                keepMounted
                anchorEl={this.state.anchorEl}
                open={this.state.open}
                onClose={this.closeOrOpen.bind(this)}>
                <MenuItem onClick={this.format.bind(this)}>
                    Format Code
                </MenuItem>
                <MenuItem onClick={this.unescape.bind(this)}>
                    Unescape
                </MenuItem>
                <MenuItem onClick={this.escape.bind(this)}>
                    Escape
                </MenuItem>
                <MenuItem onClick={this.closeOrOpenDwGenerator.bind(this)}>
                    Generate DW script
                </MenuItem>
            </Menu>
            <Drawer anchor={"bottom"} open={this.state.openDwGenerator}
                    onClose={this.closeOrOpenDwGenerator.bind(this)}>
                <Grid container justify={"flex-start"} alignItems={"flex-start"}>
                    <Grid item xs={1}/>
                    <Grid item xs={11}>
                        <Typography variant="h3" gutterBottom>
                            DataWeave script generator
                        </Typography>
                    </Grid>
                    <Grid item xs={1}/>
                    <Grid item xs={3}>
                        <Typography variant="h6" gutterBottom>
                            Choose output mime type
                        </Typography>
                        <FormControl>
                            <RadioGroup aria-label="Output mime type"
                                        name="Output mime type"
                                        value={this.state.dwGeneratorOutputMimeType}
                                        onChange={this.changeDwGeneratorOutputMimeType.bind(this)}>
                                {selectedEvaluator.variableMimeTypes.map(type => <FormControlLabel
                                    key={type}
                                    value={type}
                                    control={<Radio/>}
                                    label={type}/>
                                )}
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant="h6" gutterBottom>
                            Choose naming convention
                        </Typography>
                        <FormControl>
                            <RadioGroup aria-label="Naming convention"
                                        name="Naming convention"
                                        value={this.state.dwGeneratorNamingStyle}
                                        onChange={this.changeDwGeneratorNamingStyle.bind(this)}>
                                <FormControlLabel value="No changes" control={<Radio/>} label="No changes"/>
                                <FormControlLabel value="lowerCamelCase" control={<Radio/>} label="lowerCamelCase"/>
                                <FormControlLabel value="UpperCamelCase" control={<Radio/>} label="UpperCamelCase"/>
                                <FormControlLabel value="snake_case" control={<Radio/>} label="snake_case"/>
                                <FormControlLabel value="dash-snake-case" control={<Radio/>} label="dash-snake-case"/>
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                        <FormControlLabel
                            control={<Checkbox
                                checked={this.state.dwGeneratorUseOutput}
                                onChange={this.changeDwGeneratorUseOutput.bind(this)}
                                inputProps={{'aria-label': 'primary checkbox'}}
                            />}
                            label="Use output data as a reference"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            fullWidth={true}
                            size={"large"}
                            variant="text"
                            color="secondary"
                            onClick={this.generateDw.bind(this)}
                            startIcon={<Code/>}>Generate</Button>
                    </Grid>
                </Grid>
            </Drawer>
        </React.Fragment>
    }
}

const mapStateToProps = state => {
    return {
        project: state.project
    }
};

const mapDispatchToProps = {
    changeValueCurrentVariable,
    openAlert,
    closeAlert,
    openRunningSplash,
    closeRunningSplash,
    changeExpression
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CodeHelpers);