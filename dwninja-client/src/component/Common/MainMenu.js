import React, {Component} from 'react';
import {connect} from "react-redux";
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import CollectionsEditor from "./CollectionsEditor";
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import {saveCollection, changeTheme} from "../../redux/actions";
import Drawer from '@material-ui/core/Drawer';

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
        this.setState({openThemes: !this.state.openThemes});
    }

    chooseTheme(event) {
        this.setState({open: false, openThemes: false});
        this.props.changeTheme(event.currentTarget.value)
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
                <MenuItem onClick={this.closeOrOpenThemes.bind(this)}>
                    Themes
                </MenuItem>
                {!isLoginPage && <MenuItem
                    disabled={!authorized}
                    onClick={this.closeOrOpenCollectionsEditor.bind(this)}>My collections</MenuItem>}
                {authorized && <MenuItem onClick={this.logout.bind(this)}>Log out</MenuItem>}
                {!authorized && !isLoginPage && <MenuItem onClick={this.logout.bind(this)}>Log in</MenuItem>}
            </Menu>
            <Dialog onClose={this.closeOrOpenCollectionsEditor.bind(this)} open={this.state.openCollectionEditor}>
                <DialogTitle>Collections Editor</DialogTitle>
                <CollectionsEditor/>
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

const mapDispatchToProps = {saveCollection, changeTheme};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MainMenu);