import React, {Component} from 'react';
import {connect} from "react-redux";
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import VariableItem from './VariableItem'
import IconButton from "@material-ui/core/IconButton";
import Add from '@material-ui/icons/Add';

import {
    closeAlert,
    closeRunningSplash,
    createVariable,
    openAlert,
    openRunningSplash,
    parsePropertyFileResult
} from "../../redux/actions";
import Paper from "@material-ui/core/Paper";
import {getVariableFullName} from "../../utils/Utils";
import Settings from '@material-ui/icons/Settings';
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import {post} from "../../utils/Api";

class VariableBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            anchorEl: null
        };
    }

    createVariable() {
        this.props.createVariable()
    }

    closeOrOpen(event) {
        this.setState({open: !this.state.open, anchorEl: event.currentTarget});
    }

    loadProperties(event) {
        this.setState({open: false});
        // Check for the various File API support.
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            // Great success! All the File APIs are supported.
            const files = event.target.files; // FileList object
            for (let i = 0, file; file = files[i]; i++) {
                const reader = new FileReader();
                reader.onload = (content) => {
                    if (content.loaded === content.total) {
                        // file ready to be parsed, let's start
                        this.props.openRunningSplash();
                        post('/public/api/parse/property', content.currentTarget.result, (response) => {
                            this.props.closeRunningSplash();
                            const result = JSON.parse(response)
                            if (result.success) {
                                this.props.parsePropertyFileResult(result.body);
                            } else {
                                this.props.openAlert({alertMessage: 'Can not read file', severity: 'error'})
                            }
                        }, this.props.closeRunningSplash, false)
                    }
                };

                reader.readAsText(file);
            }
        } else {
            alert('The File APIs are not fully supported in this browser.');
        }
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
                <Grid item xs={1}>
                    <Paper>
                        <Grid container direction="column" justify={"center"} alignItems={"center"}>
                            <Grid item xs={12}>
                                <input id="files" type="file" ref={(ref) => this.upload = ref} style={{display: 'none'}}
                                       onChange={this.loadProperties.bind(this)}/>
                                <IconButton onClick={this.closeOrOpen.bind(this)}><Settings/></IconButton>
                                <Menu
                                    keepMounted
                                    anchorEl={this.state.anchorEl}
                                    open={this.state.open}
                                    onClose={this.closeOrOpen.bind(this)}>
                                    <MenuItem onClick={() => this.upload.click()}>
                                        Load *.properties file
                                    </MenuItem>
                                </Menu>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                {project.selectedProject.configs.variables
                    .sort((a, b) => {
                        const aName = getVariableFullName(a, project);
                        const bName = getVariableFullName(b, project);

                        if (aName < bName) {
                            return -1;
                        }
                        if (aName > bName) {
                            return 1;
                        }
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

const mapDispatchToProps = {
    createVariable,
    closeAlert,
    closeRunningSplash,
    openAlert,
    openRunningSplash,
    parsePropertyFileResult
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(VariableBar);