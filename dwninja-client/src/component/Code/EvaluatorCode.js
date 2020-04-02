import React, {Component} from 'react';
import {
    changeExpression,
    evaluationEnd,
    evaluationStarted,
    updateLastOutput
} from "../../redux/actions";
import {connect} from "react-redux";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-min-noconflict/ext-searchbox";
import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-min-noconflict/ext-keybinding_menu";
import {addCompleter} from 'ace-builds/src-noconflict/ext-language_tools';

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
        const bottomElementsCount = this.props.project.selectedProject.configs.variables.length + 1;
        const bottomLines = Math.min(Math.ceil(bottomElementsCount / 4), 3);
        const offset = 10;
        const topBarOffset = 58;
        const bottomBarSize = 56;
        const finalOffset = topBarOffset + offset + bottomBarSize * bottomLines;

        const variables = this.props.project.selectedProject.configs.variables.map(variable => ({
            name: `${variable.type}.${variable.name}`,
            value: `${variable.type}.${variable.name}`,
            caption: `${variable.type}.${variable.name}`,
            meta: 'variable',
            score: 1000,
        }));

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
            theme="monokai"
            name="EVALUATOR_CODE"
            width={"100%"}
            wrapEnabled={true}
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