import React, {Component} from 'react';
import {
    changeValueCurrentVariable,
    closeAlert,
    closeRunningSplash,
    openAlert,
    openRunningSplash
} from "../../redux/actions";
import {connect} from "react-redux";
import Settings from '@material-ui/icons/Settings';
import IconButton from "@material-ui/core/IconButton";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {post} from "../../utils/Api";


class CodeHelpers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            anchorEl: null,
            alertOpen: false,
            alertMessage: ''
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
        if(mode === "java") {
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
        if(mode === "java") {
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

    render() {
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
            </Menu>
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
    closeRunningSplash
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CodeHelpers);