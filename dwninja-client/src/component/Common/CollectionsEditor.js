import React, {Component} from 'react';
import {connect} from "react-redux";
import {makeStyles} from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

import List from '@material-ui/icons/List';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import Delete from '@material-ui/icons/Delete';
import Save from '@material-ui/icons/Save';
import IconButton from "@material-ui/core/IconButton";
import {
    deleteCollection,
    deleteLab,
    selectLab,
    createCollection,
    createLab,
    renameCollection,
    renameLab
} from "../../redux/actions";
import Grid from "@material-ui/core/Grid";
import {TextField} from "@material-ui/core";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InputLabel from '@material-ui/core/InputLabel';

const useTreeItemStyles = makeStyles((theme) => ({
    root: {
        color: theme.palette.text.secondary,
        '&:hover > $content': {
            backgroundColor: theme.palette.action.hover,
        },
        '&:focus > $content, &$selected > $content': {
            backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
            color: 'var(--tree-view-color)',
        },
        '&:focus > $content $label, &:hover > $content $label, &$selected > $content $label': {
            backgroundColor: 'transparent',
        },
    },
    content: {
        color: theme.palette.text.secondary,
        borderTopRightRadius: theme.spacing(2),
        borderBottomRightRadius: theme.spacing(2),
        paddingRight: theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium,
        '$expanded > &': {
            fontWeight: theme.typography.fontWeightRegular,
        },
    },
    group: {
        marginLeft: 0,
        '& $content': {
            paddingLeft: theme.spacing(2),
        },
    },
    expanded: {},
    selected: {},
    label: {
        fontWeight: 'inherit',
        color: 'inherit',
    },
    labelRoot: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0.5, 0),
    },
    labelIcon: {
        marginRight: theme.spacing(1),
    },
    labelText: {
        fontWeight: 'inherit',
        flexGrow: 1,
    },
}));

function StyledTreeItem(props) {
    const classes = useTreeItemStyles();
    const {labelText, labelIcon: LabelIcon, labelInfo, deleteHandler, ...other} = props;

    return (
        <TreeItem
            label={
                <div className={classes.labelRoot}>
                    <LabelIcon color="inherit" className={classes.labelIcon}/>
                    <Typography variant="body1" className={classes.labelText}>
                        {labelText}
                    </Typography>
                    <Typography variant="caption" color="inherit">
                        {labelInfo}
                    </Typography>
                    <IconButton onClick={deleteHandler}><Delete/></IconButton>
                </div>
            }
            {...other}
        />
    );
}

class CollectionsEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newCollectionName: "",
            newLabSelectedCollection: "",
            newLabSelectedTemplate: "",
            newLabName: "",
            renameCollectionName: "",
            renameCollectionNewName: "",
            renameLabName: "",
            renameLabCollectionName: "",
            renameLabNewName: ""
        }
    }

    handleNewCollectionNameChange(event) {
        this.setState({newCollectionName: event.target.value});
    }

    createNewCollection() {
        if (!this.state.newCollectionName) return;

        this.props.createCollection(this.state.newCollectionName.toString());
        this.setState({newCollectionName: ""});
    }

    handleNewLabNameChange(event) {
        this.setState({newLabName: event.target.value});
    }

    handleNewLabTemplateChange(event) {
        this.setState({newLabSelectedTemplate: event.target.value});
    }

    handleNewLabCollectionChange(event) {
        this.setState({newLabSelectedCollection: event.target.value});
    }

    createNewLab() {
        if (!this.state.newLabSelectedCollection || !this.state.newLabSelectedTemplate || !this.state.newLabName) return;

        this.props.createLab({
            collectionName: this.state.newLabSelectedCollection,
            evaluatorName: this.state.newLabSelectedTemplate,
            name: this.state.newLabName,
        });
        this.setState({
            newLabSelectedCollection: "",
            newLabSelectedTemplate: "",
            newLabName: ""
        });
    }

    handleRenameCollectionName(event) {
        this.setState({renameCollectionName: event.target.value});
    }

    handleRenameCollectionNewName(event) {
        this.setState({renameCollectionNewName: event.target.value});
    }

    renameCollection() {
        if (!this.state.renameCollectionName || !this.state.renameCollectionNewName) return;

        this.props.renameCollection({
            name: this.state.renameCollectionName,
            newName: this.state.renameCollectionNewName
        });
        this.setState({renameCollectionName: "", renameCollectionNewName: ""})
    }

    handleRenameLabCollectionChange(event) {
        this.setState({renameLabCollectionName: event.target.value});
    }

    handleRenameLabChange(event) {
        this.setState({renameLabName: event.target.value});
    }

    handleRenameLabNewNameChange(event) {
        this.setState({renameLabNewName: event.target.value});
    }

    renameLab() {
        const {renameLabCollectionName, renameLabName, renameLabNewName} = this.state;
        if (!renameLabCollectionName || !renameLabName || !renameLabNewName) return;

        this.props.renameLab({name: renameLabName, collectionName: renameLabCollectionName, newName: renameLabNewName});
        this.setState({renameLabName: "", renameLabCollectionName: "", renameLabNewName: ""});
    }

    handleDeleteCollection(name) {
        return () => {
            this.props.deleteCollection(name);
        }
    }

    handleDeleteLab(name, collectionName) {
        return () => {
            this.props.deleteLab({name, collectionName});
        }
    }

    handleSelectLab(name, collectionName) {
        return () => {
            this.props.selectLab({name, collectionName})
        };
    }

    render() {
        const {collections, evaluators} = this.props.project;

        return <Paper>
            <Grid container justify={"center"} alignItems={"center"}>
                <Grid item xs={12}>
                    <ExpansionPanel defaultExpanded>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                            <Typography variant="subtitle1">Collections</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Grid item xs={12}>
                                <TreeView
                                    defaultCollapseIcon={<ArrowDropDownIcon/>}
                                    defaultExpandIcon={<ArrowRightIcon/>}
                                    multiSelect={false}
                                    defaultEndIcon={<div style={{width: 24}}/>}>
                                    {
                                        collections.map((collection, collectionIndex) => {
                                            return <StyledTreeItem key={collection.name} nodeId={`${collectionIndex}`}
                                                                   labelText={collection.name} labelIcon={List}
                                                                   deleteHandler={this.handleDeleteCollection(collection.name).bind(this)}>
                                                {
                                                    collection.labs.map((lab, labIndex) => {
                                                        return <StyledTreeItem key={lab.name} labelText={lab.name}
                                                                               nodeId={`${collectionIndex}.${labIndex}`}
                                                                               labelIcon={LibraryBooks}
                                                                               onClick={this.handleSelectLab(lab.name, collection.name).bind(this)}
                                                                               deleteHandler={this.handleDeleteLab(lab.name, collection.name).bind(this)}/>
                                                    })
                                                }
                                            </StyledTreeItem>
                                        })
                                    }
                                </TreeView>
                            </Grid>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                </Grid>

                <Grid item xs={12}>
                    <ExpansionPanel>
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon/>}>
                            <Typography variant="subtitle1">Create collection</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <TextField fullWidth onChange={this.handleNewCollectionNameChange.bind(this)}
                                       label="Name"
                                       value={this.state.newCollectionName}></TextField>
                            <IconButton onClick={this.createNewCollection.bind(this)}><Save/></IconButton>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                </Grid>

                <Grid item xs={12}>
                    <ExpansionPanel>
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon/>}>
                            <Typography variant="subtitle1">Create Lab</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Grid container spacing={2} direction={"row"} justify={"center"} alignItems={"center"}>
                                <Grid item xs={12}>
                                    <TextField fullWidth onChange={this.handleNewLabNameChange.bind(this)}
                                               label="Name"
                                               value={this.state.newLabName}></TextField>
                                </Grid>
                                <Grid item xs={5}>
                                    <InputLabel id="collection-label">Collection</InputLabel>
                                    <Select
                                        labelId="collection-label"
                                        variant="standard"
                                        value={this.state.newLabSelectedCollection}
                                        fullWidth
                                        placeholder={"Collection"}
                                        onChange={this.handleNewLabCollectionChange.bind(this)}>
                                        {collections.map(collection => <MenuItem key={collection.name}
                                                                                 value={collection.name}>{collection.name}</MenuItem>)}
                                    </Select>
                                </Grid>
                                <Grid item xs={5}>
                                    <InputLabel id="template-label">Template</InputLabel>
                                    <Select
                                        labelId="template-label"
                                        variant="standard"
                                        value={this.state.newLabSelectedTemplate}
                                        fullWidth
                                        placeholder={"Template"}
                                        onChange={this.handleNewLabTemplateChange.bind(this)}>
                                        {evaluators.map(evaluator => <MenuItem key={evaluator.name}
                                                                               value={evaluator.name}>{evaluator.displayName}</MenuItem>)}
                                    </Select>
                                </Grid>
                                <Grid item xs={2}>
                                    <IconButton onClick={this.createNewLab.bind(this)}><Save/></IconButton>
                                </Grid>
                            </Grid>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                </Grid>

                <Grid item xs={12}>
                    <ExpansionPanel>
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon/>}>
                            <Typography variant="subtitle1">Rename collection</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Grid container spacing={2} direction={"row"} justify={"center"} alignItems={"center"}>
                                <Grid item xs={12}>
                                    <InputLabel id="rename-collection-label">Collection</InputLabel>
                                    <Select
                                        labelId="rename-collection-label"
                                        variant="standard"
                                        value={this.state.renameCollectionName}
                                        fullWidth
                                        onChange={this.handleRenameCollectionName.bind(this)}>
                                        {collections.map(collection => <MenuItem key={collection.name}
                                                                                 value={collection.name}>{collection.name}</MenuItem>)}
                                    </Select>
                                </Grid>
                                <Grid item xs={10}>
                                    <TextField fullWidth onChange={this.handleRenameCollectionNewName.bind(this)}
                                               label="Name"
                                               value={this.state.renameCollectionNewName}></TextField>
                                </Grid>
                                <Grid item xs={2}>
                                    <IconButton onClick={this.renameCollection.bind(this)}><Save/></IconButton>
                                </Grid>
                            </Grid>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                </Grid>

                <Grid item xs={12}>
                    <ExpansionPanel>
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon/>}>
                            <Typography variant="subtitle1">Rename Lab</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Grid container spacing={2} direction={"row"} justify={"center"} alignItems={"center"}>
                                <Grid item xs={12}>
                                    <InputLabel id="rename-collection-label">Collection</InputLabel>
                                    <Select
                                        labelId="rename-collection-label"
                                        variant="standard"
                                        value={this.state.renameLabCollectionName}
                                        fullWidth
                                        onChange={this.handleRenameLabCollectionChange.bind(this)}>
                                        {collections.map(collection => <MenuItem key={collection.name}
                                                                                 value={collection.name}>{collection.name}</MenuItem>)}
                                    </Select>
                                </Grid>
                                <Grid item xs={12}>
                                    <InputLabel id="rename-collection-labs-label">Lab</InputLabel>
                                    <Select
                                        labelId="rename-collection-labs-label"
                                        variant="standard"
                                        value={this.state.renameLabName}
                                        fullWidth
                                        onChange={this.handleRenameLabChange.bind(this)}>
                                        {
                                            (collections
                                                .find(collection => collection.name === this.state.renameLabCollectionName) || {labs: []})
                                                .labs
                                                .map(lab => <MenuItem key={lab.name}
                                                                      value={lab.name}>{lab.name}</MenuItem>)
                                        }
                                    </Select>
                                </Grid>
                                <Grid item xs={10}>
                                    <TextField fullWidth onChange={this.handleRenameLabNewNameChange.bind(this)}
                                               label="Name"
                                               value={this.state.renameLabNewName}></TextField>
                                </Grid>
                                <Grid item xs={2}>
                                    <IconButton onClick={this.renameLab.bind(this)}><Save/></IconButton>
                                </Grid>
                            </Grid>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                </Grid>
            </Grid>
        </Paper>
    }
}

const mapStateToProps = state => {
    return {
        project: state.project
    }
};

const mapDispatchToProps = {
    deleteCollection,
    deleteLab,
    selectLab,
    createCollection,
    createLab,
    renameCollection,
    renameLab
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CollectionsEditor);