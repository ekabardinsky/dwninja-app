import React, {Component} from 'react';
import {connect} from "react-redux";
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import CollectionsEditor from "./CollectionsEditor";
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import {changeTheme,
    saveCollection,
    closeRunningSplash,
    openRunningSplash,
} from "../../redux/actions";
import Drawer from '@material-ui/core/Drawer';
import {post} from "../../utils/Api";
import GitHubButton from 'react-github-btn';
import Grid from "@material-ui/core/Grid";

const themes = [
    "clouds",
    "chrome",
    "crimson_editor",
    "dawn",
    "dreamweaver",
    "eclipse",
    "github",
    "iplastic",
    "solarized_light",
    "textmate",
    "tomorrow",
    "xcode",
    "kuroir",
    "katzenmilch",
    "sqlserver",
    "ambiance",
    "chaos",
    "clouds_midnight",
    "dracula",
    "cobalt",
    "gruvbox",
    "gob",
    "idle_fingers",
    "kr_theme",
    "merbivore",
    "merbivore_soft",
    "mono_industrial",
    "monokai",
    "pastel_on_dark",
    "solarized_dark",
    "terminal",
    "tomorrow_night",
    "tomorrow_night_blue",
    "tomorrow_night_bright",
    "tomorrow_night_eighties",
    "twilight",
    "vibrant_ink"
];

class MainMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            anchorEl: null,
            themesAnchorEl: null,
            openCollectionEditor: false,
            openThemes: false,
            openSayThanks: false
        };
    }

    logout() {
        window.localStorage.removeItem('access_token');
        window.location.href = '/login';
    }

    closeOrOpen(event) {
        if (!this.state.open) {
            this.props.saveCollection();
        }

        this.setState({open: !this.state.open, anchorEl: event.currentTarget});
    }

    closeOrOpenCollectionsEditor(event) {
        this.setState({open: false, openCollectionEditor: !this.state.openCollectionEditor});
    }

    closeOrOpenThemes(event) {
        this.setState({open: false, openThemes: !this.state.openThemes});
    }

    chooseTheme(event) {
        this.setState({open: false, openThemes: false});
        this.props.changeTheme(event.currentTarget.value)
    }

    saveChanges() {
        this.props.openRunningSplash();
        this.setState({open: false});
        const state = {
            ...this.props.project,
            evaluators: null
        };
        post('/api/state', state, this.props.closeRunningSplash)
    }

    closeOrOpenSayThanks(event) {
        this.setState({openSayThanks: !this.state.openSayThanks, open: false});
    }

    render() {
        const access_token = window.localStorage.getItem('access_token');
        let isLoginPage = window.location.href.includes("/login");
        let authorized = !!access_token;

        return <React.Fragment>
            <IconButton onClick={this.closeOrOpen.bind(this)}><MenuIcon/></IconButton>
            <Menu
                keepMounted
                anchorEl={this.state.anchorEl}
                open={this.state.open}
                onClose={this.closeOrOpen.bind(this)}>
                {!isLoginPage && <MenuItem disabled={!authorized} onClick={this.saveChanges.bind(this)}>
                    Save changes
                </MenuItem>}
                {!isLoginPage && <MenuItem
                    disabled={!authorized}
                    onClick={this.closeOrOpenCollectionsEditor.bind(this)}>My collections</MenuItem>}
                <MenuItem onClick={this.closeOrOpenThemes.bind(this)}>
                    Themes
                </MenuItem>
                <MenuItem onClick={this.closeOrOpenSayThanks.bind(this)}>
                    Say thanks
                </MenuItem>
                {authorized && <MenuItem onClick={this.logout.bind(this)}>Log out</MenuItem>}
                {!authorized && !isLoginPage && <MenuItem onClick={this.logout.bind(this)}>Log in</MenuItem>}
            </Menu>
            <Dialog onClose={this.closeOrOpenCollectionsEditor.bind(this)} open={this.state.openCollectionEditor}>
                <DialogTitle>Collections Editor</DialogTitle>
                <CollectionsEditor/>
            </Dialog>
            <Dialog onClose={this.closeOrOpenSayThanks.bind(this)} open={this.state.openSayThanks}>
                <DialogTitle>Say thanks</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} justify={"flex-start"} alignItems={"center"}>
                        <Grid item xs={12}>
                            <Typography>DW Ninja is completely free to use, the code is open source, and I provide
                                hosting for
                                this application.
                                Donations from users help pay bills and allow me dedicate time to the continued
                                development and
                                support of this project.
                                However, money is not the only way to support the project. If you‘ve found DW Ninja
                                useful, feel
                                free to contribute it.</Typography>
                        </Grid>

                        <Grid item xs={3}>
                            <GitHubButton
                                aria-label={"Star ekabardinsky/dwninja-app on GitHub"}
                                title={"Star ekabardinsky/dwninja-app on GitHub"}
                                data-size="large"
                                data-icon="octicon-star"
                                data-show-count="true"
                                href="https://github.com/ekabardinsky/dwninja-app">Star</GitHubButton>
                        </Grid>
                        <Grid item xs={3}>
                            <GitHubButton
                                aria-label={"Issue ekabardinsky/dwninja-app on GitHub"}
                                title={"Issue ekabardinsky/dwninja-app on GitHub"}
                                data-size="large"
                                data-icon="octicon-issue-opened"
                                data-show-count="true"
                                href="https://github.com/ekabardinsky/dwninja-app/issues">Issue</GitHubButton>
                        </Grid>
                        <Grid item xs={3}>
                            <GitHubButton
                                aria-label={"Follow @ekabardinsky on GitHub"}
                                title={"Follow @ekabardinsky on GitHub"}
                                data-size="large"
                                data-show-count="true"
                                href="https://github.com/ekabardinsky">Follow</GitHubButton>
                        </Grid>
                        <Grid item xs={3}>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
            <Drawer anchor={"right"} open={this.state.openThemes} onClose={this.closeOrOpenThemes.bind(this)}>
                {
                    themes.map(theme => <Button onClick={this.chooseTheme.bind(this)} value={theme}
                                                key={theme}>{theme}</Button>)
                }
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
    saveCollection,
    changeTheme,
    closeRunningSplash,
    openRunningSplash,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MainMenu);