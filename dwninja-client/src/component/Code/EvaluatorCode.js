import React, {Component} from 'react';
import {
    changeExpression,
    evaluationEnd,
    evaluationStarted,
    updateLastOutput
} from "../../redux/actions";
import {connect} from "react-redux";
import AceEditor from "react-ace";

import "ace-builds/src-min-noconflict/ext-searchbox";
import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-min-noconflict/ext-keybinding_menu";
import {addCompleter} from 'ace-builds/src-noconflict/ext-language_tools';
import {calculateHeight, getVariableFullName} from "../../utils/Utils";

const languages = [
    "javascript",
    "java",
    "xml",
    "json",
];

languages.forEach(lang => {
    require(`ace-builds/src-noconflict/mode-${lang}`);
    require(`ace-builds/src-noconflict/snippets/${lang}`);
});

class InputCode extends Component {

    render() {
        const project = this.props.project;
        const finalOffset = calculateHeight(project);

        const variables = project.selectedProject.configs.variables.map(variable => {
            const name = getVariableFullName(variable, project);
            return {
                name,
                value: name,
                caption: name,
                meta: 'variable',
                score: 1000,
            }
        });

        // variable autocomplition
        addCompleter({
            getCompletions: function (editor, session, pos, prefix, callback) {
                callback(null, variables);
            },
        });

        // ctrl + enter execution
        document.addEventListener('keydown', (event) => {
            const isTrigger = event.ctrlKey && event.code === "Enter" && !this.props.project.isEvaluate;
            if (isTrigger) {
                this.props.evaluationStarted({
                    evaluationEnd: this.props.evaluationEnd,
                    updateLastOutput: this.props.updateLastOutput
                });
            }
        });

        return <AceEditor
            mode={this.props.project.selectedProject.configs.evaluator}
            theme={this.props.project.selectedTheme}
            name="EVALUATOR_CODE"
            width={"100%"}
            wrapEnabled={true}
            debounceChangePeriod={1000}
            height={`calc(100vh - ${finalOffset}px)`}
            enableBasicAutocompletion={true}
            enableLiveAutocompletion={true}
            enableSnippets={true}
            setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true
            }}
            onChange={this.props.changeExpression}
            value={this.props.project.selectedProject.configs.expression}
            editorProps={{$blockScrolling: Infinity}}
        />
    }
}

const mapStateToProps = state => {
    return {
        project: state.project
    }
};

const mapDispatchToProps = {
    changeExpression,
    evaluationEnd,
    evaluationStarted,
    updateLastOutput
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InputCode);