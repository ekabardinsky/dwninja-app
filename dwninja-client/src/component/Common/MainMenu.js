import React, {Component} from 'react';
import {connect} from "react-redux";
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from "@material-ui/core/IconButton";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import CollectionsEditor from "./CollectionsEditor";
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import {saveCollection} from "../../redux/actions";


class MainMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            anchorEl: null,
            openCollectionEditor: false
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
                <MenuItem disabled={!authorized} onClick={this.closeOrOpenCollectionsEditor.bind(this)}>My collections</MenuItem>
                {authorized && <MenuItem onClick={this.logout.bind(this)}>Log out</MenuItem>}
                {!authorized && !isLoginPage && <MenuItem onClick={this.logout.bind(this)}>Log in</MenuItem>}
            </Menu>
            <Dialog onClose={this.closeOrOpenCollectionsEditor.bind(this)} open={this.state.openCollectionEditor}>
                <DialogTitle>Collections Editor</DialogTitle>
                <CollectionsEditor/>
            </Dialog>
        </React.Fragment>
    }
}


const mapStateToProps = state => {
    return {
        project: state.project
    }
};

const mapDispatchToProps = {saveCollection};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MainMenu);